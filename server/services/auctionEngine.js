import { DEFAULT_PLAYER_POOL } from '../data/players.js';
import { Room } from '../models/Room.js';
import { Team } from '../models/Team.js';
import { BidHistory } from '../models/BidHistory.js';

// In-memory active rooms store for zero-latency real-time socket events
class AuctionEngine {
  constructor() {
    this.rooms = new Map(); // roomId -> RoomState
    this.socketToUser = new Map(); // socketId -> { roomId, teamId, role }
    this.timers = new Map(); // roomId -> intervalId
  }

  // Calculate dynamic IPL bid increment based on current bid
  calculateIncrement(currentBidLakhs) {
    if (currentBidLakhs < 100) return 10;      // +10 Lakhs under 1 Cr
    if (currentBidLakhs < 200) return 20;      // +20 Lakhs between 1 Cr - 2 Cr
    if (currentBidLakhs < 500) return 25;      // +25 Lakhs between 2 Cr - 5 Cr
    return 50;                                 // +50 Lakhs above 5 Cr
  }

  calculateNextMinBid(currentBidLakhs, basePriceLakhs) {
    if (!currentBidLakhs || currentBidLakhs === 0) {
      return basePriceLakhs;
    }
    return currentBidLakhs + this.calculateIncrement(currentBidLakhs);
  }

  // Calculate squad milestone indicators
  getSquadMilestones(squadSize, maxSquadSize = 35) {
    return {
      current: squadSize,
      minRequired: 7,
      playingXI: 11,
      standardRoster: 18,
      maxLimit: maxSquadSize,
      isMinMet: squadSize >= 7,
      isPlayingXIMet: squadSize >= 11,
      isStandardMet: squadSize >= 18,
      isMaxReached: squadSize >= maxSquadSize,
      slotsLeftToMin: Math.max(0, 7 - squadSize),
      slotsLeftToXI: Math.max(0, 11 - squadSize),
      slotsLeftToMax: Math.max(0, maxSquadSize - squadSize)
    };
  }

  calculateTeamScores(team, room) {
    const players = team.playersBought || [];
    const squadSize = players.length;
    const indianCount = players.filter(player => !player.isOverseas && player.nationality !== 'Overseas').length;
    const roleCount = new Set(players.map(player => player.role).filter(Boolean)).size;
    const squadBalanceScore = Math.min(70, Math.round(
      Math.min(squadSize / room.settings.minSquadSize, 1) * 45 +
      Math.min(indianCount, 1) * 10 +
      Math.min(roleCount / 4, 1) * 15
    ));
    const moneyManagementScore = Math.min(10, Math.max(0, Math.round((team.remainingPurse / team.totalPurse) * 10)));
    const strategyScore = Math.min(10, Math.round(
      Math.min(roleCount / 4, 1) * 5 + Math.min(indianCount / Math.max(squadSize, 1), 1) * 5
    ));
    const timeManagementScore = Math.min(10, Math.round(
      Math.min((team.bidCount || 0) / Math.max(squadSize, 1), 1) * 10
    ));
    return {
      squadBalanceScore,
      moneyManagementScore,
      strategyScore,
      timeManagementScore,
      totalScore: squadBalanceScore + moneyManagementScore + strategyScore + timeManagementScore,
      isEligible: squadSize >= room.settings.minSquadSize && indianCount >= 1
    };
  }

  // Create a new auction room
  createRoom({ roomId, adminName = 'Auctioneer', startingPurse = 5000, maxSquadSize = 35, minSquadSize = 7, maxOverseas = 8, timerDuration = 4, customPlayers = null }) {
    const code = (roomId || Math.random().toString(36).substring(2, 8).toUpperCase());
    
    // Deep clone default players
    const pool = (customPlayers && customPlayers.length > 0)
      ? JSON.parse(JSON.stringify(customPlayers))
      : JSON.parse(JSON.stringify(DEFAULT_PLAYER_POOL));

    const roomState = {
      roomId: code,
      adminId: null,
      isActive: false,
      adminName: adminName || 'Auctioneer',
      adminSocketId: null,
      status: 'lobby', // 'lobby' | 'active' | 'paused' | 'completed'
      settings: {
        startingPurse: Number(startingPurse) || 5000, // In Lakhs (5000 = 50 Cr)
        maxSquadSize: Number(maxSquadSize) || 35,
        minSquadSize: Number(minSquadSize) || 7, // 7 minimum players per squad
        playingXISize: 11,
        standardSquadSize: 18,
        maxOverseas: Number(maxOverseas) || 8,
        timerDuration: Number(timerDuration) || 4,
        minReservePerSlot: 20 // 20 Lakhs per remaining minimum slot
      },
      teams: new Map(), // teamId -> TeamObject
      playerPool: pool,
      playerQueueIndex: 0,
      currentActivePlayer: null,
      currentBid: 0,
      highestBidder: null, // { teamId, teamName, shortCode, color }
      bidHistory: [],
      timer: {
        timeLeft: Number(timerDuration) || 4,
        isActive: false
      },
      completedPlayers: [], // sold players
      unsoldPlayers: [],    // unsold players
      chatFeed: []          // messages and announcements
    };

    this.rooms.set(code, roomState);
    this.syncRoomToDB(roomState).catch(() => {});
    return roomState;
  }

  // Get sanitized room state for clients
  getRoomState(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const teamsArray = Array.from(room.teams.values()).map(t => {
      const currentSquadSize = (t.playersBought || []).length;
      return {
        teamId: t.teamId,
        teamName: t.teamName,
        ownerName: t.ownerName,
        shortCode: t.shortCode,
        color: t.color,
        logoBadge: t.logoBadge,
        isReady: t.isReady,
        isConnected: Boolean(t.socketId),
        totalPurse: t.totalPurse,
        remainingPurse: t.remainingPurse,
        spentPurse: t.spentPurse,
        playersBought: t.playersBought || [],
        squadSize: currentSquadSize,
        squadCount: currentSquadSize,
        overseasCount: (t.playersBought || []).filter(p => p.isOverseas).length,
        milestones: this.getSquadMilestones(currentSquadSize, room.settings.maxSquadSize),
        scores: this.calculateTeamScores(t, room)
      };
    });

    const rankedTeams = [...teamsArray]
      .sort((a, b) => b.scores.totalScore - a.scores.totalScore)
      .map((team, index) => ({ ...team, rank: index + 1 }));
    const rankByTeamId = new Map(rankedTeams.map(team => [team.teamId, team.rank]));

    const nextMinBid = room.currentActivePlayer
      ? this.calculateNextMinBid(room.currentBid, room.currentActivePlayer.basePrice)
      : 0;

    const nextIncrement = room.currentActivePlayer
      ? this.calculateIncrement(room.currentBid || room.currentActivePlayer.basePrice)
      : 20;

    return {
      roomId: room.roomId,
      adminId: room.adminId,
      isActive: room.isActive,
      adminName: room.adminName,
      status: room.status,
      settings: room.settings,
      teams: teamsArray.map(team => ({ ...team, rank: rankByTeamId.get(team.teamId) })),
      currentActivePlayer: room.currentActivePlayer,
      currentActivePlayerId: room.currentActivePlayer?.id || null,
      currentBid: room.currentBid,
      highestBidder: room.highestBidder,
      bidHistory: room.bidHistory,
      nextMinBid,
      nextIncrement,
      timer: room.timer,
      remainingPlayersCount: room.playerPool.length - room.playerQueueIndex,
      totalPlayersCount: room.playerPool.length,
      soldCount: room.completedPlayers.length,
      unsoldCount: room.unsoldPlayers.length,
      completedPlayers: room.completedPlayers,
      unsoldPlayers: room.unsoldPlayers,
      chatFeed: room.chatFeed.slice(-30)
    };
  }

  // Join Room as Admin or Franchise Team
  joinRoom({ roomId, socketId, role = 'team', teamName, ownerName, shortCode, color, logoBadge, teamId }) {
    let room = this.rooms.get(roomId);
    if (!room) {
      return { error: 'Room not found. Check the 6-character code.' };
    }

    if (role === 'admin') {
      room.adminSocketId = socketId;
      room.adminId = socketId;
      this.socketToUser.set(socketId, { roomId, role: 'admin', teamId: null });
      this.addChatMessage(roomId, {
        sender: 'System',
        text: `Auctioneer (${room.adminName}) has connected.`,
        type: 'announcement'
      });
      return { success: true, role: 'admin', room: this.getRoomState(roomId) };
    }

    // Franchise Team Joining
    const finalTeamId = teamId || (teamName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 5));
    
    let existingTeam = room.teams.get(finalTeamId);
    if (existingTeam) {
      existingTeam.socketId = socketId;
      existingTeam.ownerName = ownerName || existingTeam.ownerName;
    } else {
      // Check if teamName already exists under different id
      const nameTaken = Array.from(room.teams.values()).some(t => t.teamName.toLowerCase() === (teamName || '').toLowerCase() && t.socketId && t.socketId !== socketId);
      if (nameTaken) {
        return { error: `Team "${teamName}" is already taken in this room.` };
      }

      existingTeam = {
        teamId: finalTeamId,
        teamName: teamName || 'Franchise ' + (room.teams.size + 1),
        ownerName: ownerName || 'Manager',
        shortCode: shortCode || (teamName ? teamName.substring(0, 4).toUpperCase() : 'TEAM'),
        color: color || '#F59E0B',
        logoBadge: logoBadge || 'shield',
        socketId: socketId,
        isReady: false,
        totalPurse: room.settings.startingPurse,
        remainingPurse: room.settings.startingPurse,
        spentPurse: 0,
        playersBought: [],
        bidCount: 0,
        squadSize: 0,
        squadCount: 0,
        overseasCount: 0
      };
      room.teams.set(finalTeamId, existingTeam);
    }

    this.socketToUser.set(socketId, { roomId, role: 'team', teamId: finalTeamId });
    this.addChatMessage(roomId, {
      sender: 'System',
      text: `${existingTeam.teamName} (${existingTeam.ownerName}) entered the auction room.`,
      type: 'announcement'
    });

    return { 
      success: true, 
      role: 'team', 
      teamId: finalTeamId, 
      team: existingTeam,
      room: this.getRoomState(roomId) 
    };
  }

  // Start Auction
  startAuction(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    room.status = 'active';
    room.isActive = true;
    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: '🔨 THE AUCTION HAS OFFICIALLY BEGUN! Get ready for Set 1.',
      type: 'hammer'
    });

    if (!room.currentActivePlayer) {
      this.bringNextPlayer(roomId);
    }

    return { success: true, room: this.getRoomState(roomId) };
  }

  // Bring Next Player
  bringNextPlayer(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    if (room.playerQueueIndex >= room.playerPool.length) {
      room.status = 'completed';
      room.isActive = false;
      room.currentActivePlayer = null;
      room.currentBid = 0;
      room.highestBidder = null;
      this.stopTimer(roomId);
      this.addChatMessage(roomId, {
        sender: 'Auctioneer',
        text: '🏆 ALL PLAYERS AUCTIONED! The IPL Mock Auction is complete.',
        type: 'hammer'
      });
      return { success: true, completed: true, room: this.getRoomState(roomId) };
    }

    const player = room.playerPool[room.playerQueueIndex];
    room.playerQueueIndex += 1;
    player.status = 'in_auction';
    room.currentActivePlayer = player;
    room.currentBid = 0;
    room.highestBidder = null;
    room.bidHistory = [];
    room.status = 'active';
    room.isActive = true;

    this.resetTimer(roomId);

    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: `Now on the block: ${player.name} (${player.role} | Base: ₹${(player.basePrice / 100).toFixed(2)} Cr)`,
      type: 'player_call'
    });

    return { success: true, player, room: this.getRoomState(roomId) };
  }

  // Place a Bid
  placeBid({ roomId, teamId, amount }) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.status !== 'active') return { error: 'Auction is currently paused or inactive' };
    if (!room.currentActivePlayer) return { error: 'No player currently on the auction block' };

    const team = room.teams.get(teamId);
    if (!team) return { error: 'Franchise not found' };

    // Self bidding check
    if (room.highestBidder && room.highestBidder.teamId === teamId) {
      return { error: 'You are already the highest bidder!' };
    }

    // Maximum squad size limit check
    const currentSquadSize = team.playersBought.length;
    if (currentSquadSize >= room.settings.maxSquadSize) {
      return { error: `Squad full! Maximum ${room.settings.maxSquadSize} players limit reached.` };
    }

    // Overseas slot limit check (Max 8)
    if (room.currentActivePlayer.isOverseas) {
      const currentOverseas = team.playersBought.filter(p => p.isOverseas).length;
      if (currentOverseas >= room.settings.maxOverseas) {
        return { error: `Overseas quota full! Max ${room.settings.maxOverseas} overseas players allowed.` };
      }
    }

    const nextMin = this.calculateNextMinBid(room.currentBid, room.currentActivePlayer.basePrice);
    const bidAmount = Number(amount) || nextMin;

    if (bidAmount < nextMin) {
      return { error: `Minimum required bid is ₹${(nextMin / 100).toFixed(2)} Cr` };
    }

    // Minimum Reserve Validation to ensure franchise can meet minimum 7 players requirement
    const prospectiveSquadCount = currentSquadSize + 1; // including this prospective player
    const remainingSlotsToMin = Math.max(0, room.settings.minSquadSize - prospectiveSquadCount);
    const requiredReserve = remainingSlotsToMin * room.settings.minReservePerSlot;

    if (team.remainingPurse - bidAmount < requiredReserve) {
      return { 
        error: `Insufficient purse! You must maintain a reserve of ₹${(requiredReserve / 100).toFixed(2)} Cr to complete the minimum 7-player squad.` 
      };
    }

    if (bidAmount > team.remainingPurse) {
      return { error: `Purse exceeded! You only have ₹${(team.remainingPurse / 100).toFixed(2)} Cr remaining.` };
    }

    // Accept bid
    team.bidCount = (team.bidCount || 0) + 1;
    room.currentBid = bidAmount;
    room.highestBidder = {
      teamId: team.teamId,
      teamName: team.teamName,
      shortCode: team.shortCode,
      color: team.color
    };

    const bidEntry = {
      teamId: team.teamId,
      teamName: team.teamName,
      amount: bidAmount,
      timestamp: new Date()
    };
    room.bidHistory.unshift(bidEntry);

    // Reset countdown timer on bid
    this.resetTimer(roomId);

    this.addChatMessage(roomId, {
      sender: team.teamName,
      text: `Bid placed: ₹${(bidAmount / 100).toFixed(2)} Cr`,
      type: 'bid'
    });

    return { 
      success: true, 
      currentBid: bidAmount, 
      highestBidder: room.highestBidder,
      bidHistory: room.bidHistory,
      room: this.getRoomState(roomId) 
    };
  }

  // Mark Current Player SOLD
  sellPlayer(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (!room.currentActivePlayer) return { error: 'No active player to sell' };
    if (!room.highestBidder || room.currentBid <= 0) {
      return { error: 'No bids placed yet! Mark as Unsold or wait for bids.' };
    }

    const winningTeam = room.teams.get(room.highestBidder.teamId);
    if (!winningTeam) return { error: 'Winning team not found' };

    const player = { ...room.currentActivePlayer };
    const soldPrice = room.currentBid;

    // Deduct purse & add player to team squad
    winningTeam.remainingPurse -= soldPrice;
    winningTeam.spentPurse += soldPrice;
    player.status = 'sold';
    player.soldPrice = soldPrice;
    player.soldTo = winningTeam.teamId;
    player.soldToTeamName = winningTeam.teamName;

    winningTeam.playersBought.push({
      id: player.id,
      name: player.name,
      role: player.role,
      basePrice: player.basePrice,
      soldPrice: soldPrice,
      imageURL: player.imageURL,
      isOverseas: player.isOverseas,
      nationality: player.nationality
    });

    winningTeam.squadSize = winningTeam.playersBought.length;
    winningTeam.squadCount = winningTeam.playersBought.length;
    winningTeam.overseasCount = winningTeam.playersBought.filter(p => p.isOverseas).length;

    room.completedPlayers.push(player);
    this.stopTimer(roomId);

    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: `🔨 SOLD! ${player.name} goes to ${winningTeam.teamName} for ₹${(soldPrice / 100).toFixed(2)} Cr! (Squad: ${winningTeam.squadSize}/${room.settings.maxSquadSize})`,
      type: 'sold'
    });

    const soldRecord = {
      player,
      winningTeam: {
        teamId: winningTeam.teamId,
        teamName: winningTeam.teamName,
        remainingPurse: winningTeam.remainingPurse,
        spentPurse: winningTeam.spentPurse,
        squadSize: winningTeam.squadSize,
        squadCount: winningTeam.squadSize,
        milestones: this.getSquadMilestones(winningTeam.squadSize, room.settings.maxSquadSize),
        scores: this.calculateTeamScores(winningTeam, room)
      },
      soldPrice
    };

    // Prepare room for next action
    room.currentActivePlayer = null;
    room.currentBid = 0;
    room.highestBidder = null;
    room.bidHistory = [];

    this.syncRoomToDB(room).catch(() => {});

    return { 
      success: true, 
      soldRecord, 
      room: this.getRoomState(roomId) 
    };
  }

  // Mark Current Player UNSOLD
  unsoldPlayer(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (!room.currentActivePlayer) return { error: 'No active player' };

    const player = { ...room.currentActivePlayer };
    player.status = 'unsold';
    player.soldPrice = 0;
    player.soldTo = null;

    room.unsoldPlayers.push(player);
    this.stopTimer(roomId);

    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: `❌ UNSOLD! ${player.name} remains unsold and moves to the backup pool.`,
      type: 'unsold'
    });

    const unsoldRecord = { player };

    room.currentActivePlayer = null;
    room.currentBid = 0;
    room.highestBidder = null;
    room.bidHistory = [];

    this.syncRoomToDB(room).catch(() => {});

    return { 
      success: true, 
      unsoldRecord, 
      room: this.getRoomState(roomId) 
    };
  }

  // Pause or Resume Auction
  togglePause(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    if (room.status === 'active') {
      room.status = 'paused';
      this.stopTimer(roomId);
      this.addChatMessage(roomId, {
        sender: 'Auctioneer',
        text: '⏸️ The Auction has been paused by the Auctioneer.',
        type: 'announcement'
      });
    } else if (room.status === 'paused') {
      room.status = 'active';
      this.startTimer(roomId);
      this.addChatMessage(roomId, {
        sender: 'Auctioneer',
        text: '▶️ The Auction has resumed.',
        type: 'announcement'
      });
    }

    return { success: true, status: room.status, room: this.getRoomState(roomId) };
  }

  // Reset or Undo Last Bid (Admin power)
  resetCurrentPlayerBids(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    room.currentBid = 0;
    room.highestBidder = null;
    room.bidHistory = [];
    this.resetTimer(roomId);

    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: '🔄 Current bids have been reset by the Auctioneer.',
      type: 'announcement'
    });

    return { success: true, room: this.getRoomState(roomId) };
  }

  // Timer Handlers
  startTimer(roomId, io = null) {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'active') return;

    room.timer.isActive = true;
    if (this.timers.has(roomId)) {
      clearInterval(this.timers.get(roomId));
    }

    const interval = setInterval(() => {
      if (!room || room.status !== 'active' || !room.timer.isActive) {
        clearInterval(interval);
        return;
      }

      if (room.timer.timeLeft > 0) {
        room.timer.timeLeft -= 1;
        if (io) {
          io.to(roomId).emit('timer_tick', {
            timeLeft: room.timer.timeLeft,
            isActive: room.timer.isActive
          });
        }
      } else {
        // Timer reached 0; finalize the current player on the server.
        this.stopTimer(roomId);
        const result = room.highestBidder
          ? this.sellPlayer(roomId)
          : this.unsoldPlayer(roomId);
        if (io) {
          io.to(roomId).emit('timer_expired', { currentBid: room.currentBid, highestBidder: room.highestBidder });
          if (result?.soldRecord) io.to(roomId).emit('player_sold', { soldRecord: result.soldRecord, room: result.room, automatic: true });
          if (result?.unsoldRecord) io.to(roomId).emit('player_unsold', { unsoldRecord: result.unsoldRecord, room: result.room, automatic: true });
        }
      }
    }, 1000);

    this.timers.set(roomId, interval);
  }

  resetTimer(roomId, io = null) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.timer.timeLeft = room.settings.timerDuration;
    this.startTimer(roomId, io);
  }

  stopTimer(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.timer.isActive = false;
    }
    if (this.timers.has(roomId)) {
      clearInterval(this.timers.get(roomId));
      this.timers.delete(roomId);
    }
  }

  addChatMessage(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const msg = {
      id: Math.random().toString(36).substring(2, 9),
      ...message,
      timestamp: new Date()
    };
    room.chatFeed.push(msg);
    if (room.chatFeed.length > 50) room.chatFeed.shift();
    return msg;
  }

  // Add custom player to room pool dynamically
  addPlayerToRoomPool(roomId, playerData) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };

    const newPlayer = {
      id: playerData.id || 'custom_' + Math.random().toString(36).substring(2, 9),
      name: playerData.name || 'Custom Player',
      role: playerData.role || 'Batter',
      nationality: playerData.nationality || 'India',
      isOverseas: Boolean(playerData.isOverseas),
      basePrice: Number(playerData.basePrice) || 100, // Lakhs
      imageURL: playerData.imageURL || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80',
      stats: playerData.stats || {
        matches: Number(playerData.matches) || 0,
        runs: Number(playerData.runs) || 0,
        strikeRate: Number(playerData.strikeRate) || 0,
        wickets: Number(playerData.wickets) || 0,
        economy: Number(playerData.economy) || 0,
        specialty: playerData.specialty || `${playerData.role || 'Player'} | Added by Auctioneer`
      },
      status: 'available',
      soldPrice: 0,
      soldTo: null
    };

    room.playerPool.push(newPlayer);

    this.addChatMessage(roomId, {
      sender: 'Auctioneer',
      text: `➕ Added new player to queue: ${newPlayer.name} (${newPlayer.role} | Base: ₹${(newPlayer.basePrice/100).toFixed(2)} Cr)`,
      type: 'announcement'
    });

    return { success: true, player: newPlayer, room: this.getRoomState(roomId) };
  }

  // Handle socket disconnect
  handleDisconnect(socketId) {
    const user = this.socketToUser.get(socketId);
    if (!user) return null;

    const { roomId, role, teamId } = user;
    const room = this.rooms.get(roomId);
    this.socketToUser.delete(socketId);

    if (!room) return null;

    if (role === 'admin') {
      room.adminSocketId = null;
    } else if (teamId && room.teams.has(teamId)) {
      const team = room.teams.get(teamId);
      team.socketId = null;
    }

    return { roomId, role, teamId };
  }

  // MongoDB async background persistence helper
  async syncRoomToDB(roomState) {
    try {
      await Room.findOneAndUpdate(
        { roomId: roomState.roomId },
        {
          roomId: roomState.roomId,
          adminId: roomState.adminSocketId || roomState.adminId,
          isActive: roomState.status === 'active',
          status: roomState.status,
          settings: roomState.settings,
          currentBid: roomState.currentBid,
          highestBidderTeamId: roomState.highestBidder?.teamId || null,
          highestBidderTeamName: roomState.highestBidder?.teamName || null,
          currentActivePlayerId: roomState.currentActivePlayer?.id || null
        },
        { upsert: true }
      );
    } catch {
      // Ignored for fast in-memory execution
    }
  }
}

export const auctionEngine = new AuctionEngine();
