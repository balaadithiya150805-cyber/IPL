import express from 'express';
import { auctionEngine } from '../services/auctionEngine.js';
import { DEFAULT_PLAYER_POOL } from '../data/players.js';

const router = express.Router();

// 1. Create a new Auction Room
router.post('/rooms/create', (req, res) => {
  try {
    const { 
      roomId, 
      adminName, 
      startingPurse, 
      maxSquadSize, 
      minSquadSize, 
      maxOverseas, 
      timerDuration,
      customPlayers 
    } = req.body;

    const room = auctionEngine.createRoom({
      roomId,
      adminName,
      startingPurse,
      maxSquadSize,
      minSquadSize,
      maxOverseas,
      timerDuration,
      customPlayers
    });

    return res.status(201).json({
      success: true,
      roomId: room.roomId,
      room: auctionEngine.getRoomState(room.roomId)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get Room State / Details
router.get('/rooms/:roomId', (req, res) => {
  const roomId = (req.params.roomId || '').toUpperCase().trim();
  const roomState = auctionEngine.getRoomState(roomId);

  if (!roomState) {
    return res.status(404).json({ success: false, error: 'Auction Room not found.' });
  }

  return res.json({ success: true, room: roomState });
});

// 3. Get Full Player Pool
router.get('/players', (req, res) => {
  return res.json({
    success: true,
    total: DEFAULT_PLAYER_POOL.length,
    players: DEFAULT_PLAYER_POOL
  });
});

// 4. Export Auction Report / Summary (JSON & CSV friendly)
router.get('/rooms/:roomId/summary', (req, res) => {
  const roomId = (req.params.roomId || '').toUpperCase().trim();
  const roomState = auctionEngine.getRoomState(roomId);

  if (!roomState) {
    return res.status(404).json({ success: false, error: 'Auction Room not found.' });
  }

  const teamRosters = roomState.teams.map(team => ({
    teamName: team.teamName,
    ownerName: team.ownerName,
    totalPurse: (team.totalPurse / 100).toFixed(2) + ' Cr',
    remainingPurse: (team.remainingPurse / 100).toFixed(2) + ' Cr',
    spentPurse: (team.spentPurse / 100).toFixed(2) + ' Cr',
    squadCount: team.squadCount,
    overseasCount: team.overseasCount,
    players: (team.playersBought || []).map(p => ({
      name: p.name,
      role: p.role,
      price: (p.soldPrice / 100).toFixed(2) + ' Cr',
      nationality: p.nationality
    }))
  }));

  const topBuys = [...roomState.completedPlayers]
    .sort((a, b) => b.soldPrice - a.soldPrice)
    .slice(0, 10)
    .map(p => ({
      name: p.name,
      role: p.role,
      soldTo: p.soldToTeamName,
      soldPrice: (p.soldPrice / 100).toFixed(2) + ' Cr'
    }));

  return res.json({
    success: true,
    roomId,
    status: roomState.status,
    totalSold: roomState.soldCount,
    totalUnsold: roomState.unsoldCount,
    teams: teamRosters,
    topBuys,
    unsoldPlayers: roomState.unsoldPlayers
  });
});

export default router;
