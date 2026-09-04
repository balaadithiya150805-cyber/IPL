import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useSound } from './SoundContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomState, setRoomState] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' | 'team'
  const [myTeamId, setMyTeamId] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [lastSoldEvent, setLastSoldEvent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [timerTick, setTimerTick] = useState({ timeLeft: 15, isActive: false });

  const sound = useSound();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // Add toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL
      || (import.meta.env.DEV ? window.location.origin : 'http://localhost:5000');

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Auction Socket Server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.warn('❌ Disconnected from Auction Socket Server');
      setIsConnected(false);
    });

    // Room State Update (Full sync)
    newSocket.on('room_state_update', (state) => {
      setRoomState(state);
    });

    // Auction Started
    newSocket.on('auction_started', (state) => {
      setRoomState(state);
      addToast('🏏 THE AUCTION HAS STARTED!', 'success');
      soundRef.current.playGavel();
    });

    // New Bid Placed
    newSocket.on('bid_placed', (data) => {
      setRoomState(data.room);
      soundRef.current.playBidPing();
      addToast(`💰 New Bid: ₹${(data.currentBid / 100).toFixed(2)} Cr by ${data.highestBidder?.teamName}`, 'bid');
    });

    // Player on Block (Next Player)
    newSocket.on('player_on_block', (data) => {
      setRoomState(data.room);
      if (data.completed) {
        addToast('🏆 AUCTION COMPLETED! All players presented.', 'success');
        soundRef.current.playSoldFanfare();
      } else if (data.player) {
        addToast(`👤 Up next: ${data.player.name} (${data.player.role})`, 'info');
      }
    });

    // Player SOLD
    newSocket.on('player_sold', (data) => {
      setRoomState(data.room);
      setLastSoldEvent(data.soldRecord);
      soundRef.current.playGavel();
      soundRef.current.playSoldFanfare();
      addToast(`🔨 SOLD! ${data.soldRecord.player.name} to ${data.soldRecord.winningTeam.teamName} for ₹${(data.soldRecord.soldPrice / 100).toFixed(2)} Cr!`, 'sold');
    });

    // Player UNSOLD
    newSocket.on('player_unsold', (data) => {
      setRoomState(data.room);
      soundRef.current.playUnsoldBuzzer();
      addToast(`❌ UNSOLD: ${data.unsoldRecord.player.name}`, 'warning');
    });

    // Pause/Resume
    newSocket.on('auction_pause_toggled', (data) => {
      setRoomState(data.room);
      addToast(`Auction is now ${data.status.toUpperCase()}`, 'info');
    });

    // Timer Tick
    newSocket.on('timer_tick', (tick) => {
      setTimerTick(tick);
      if (tick.timeLeft <= 5 && tick.timeLeft > 0) {
        soundRef.current.playCountdownTick(tick.timeLeft <= 3);
      }
    });

    // Bid Reset
    newSocket.on('bid_reset', (state) => {
      setRoomState(state);
      addToast('Current bids reset by Auctioneer', 'info');
    });

    // Live Chat Message
    newSocket.on('new_chat_message', (msg) => {
      setRoomState(prev => {
        if (!prev) return prev;
        const exists = prev.chatFeed?.some(m => m.id === msg.id);
        if (exists) return prev;
        return {
          ...prev,
          chatFeed: [...(prev.chatFeed || []).slice(-40), msg]
        };
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [addToast]);

  // Keep myTeam in sync with room state updates
  useEffect(() => {
    if (roomState && myTeamId) {
      const found = roomState.teams?.find(t => t.teamId === myTeamId);
      if (found) {
        setMyTeam(found);
      }
    }
  }, [roomState, myTeamId]);

  // Actions
  const joinRoom = useCallback(({ roomId, role, teamName, ownerName, shortCode, color, logoBadge, teamId }) => {
    return new Promise((resolve) => {
      if (!socket) return resolve({ error: 'Socket not connected' });

      socket.emit('join_room', {
        roomId,
        role,
        teamName,
        ownerName,
        shortCode,
        color,
        logoBadge,
        teamId
      }, (response) => {
        if (response.success) {
          setUserRole(response.role);
          setMyTeamId(response.teamId || null);
          setMyTeam(response.team || null);
          setRoomState(response.room);
        }
        resolve(response);
      });
    });
  }, [socket]);

  const placeBid = useCallback((amount) => {
    return new Promise((resolve) => {
      if (!socket || !roomState || !myTeamId) return resolve({ error: 'Not ready to bid' });

      socket.emit('place_bid', {
        roomId: roomState.roomId,
        teamId: myTeamId,
        amount
      }, (response) => {
        if (response?.error) {
          addToast(response.error, 'error');
        }
        resolve(response);
      });
    });
  }, [socket, roomState, myTeamId, addToast]);

  const startAuction = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_start_auction', { roomId: roomState.roomId }, resolve);
    });
  }, [socket, roomState]);

  const nextPlayer = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_next_player', { roomId: roomState.roomId }, resolve);
    });
  }, [socket, roomState]);

  const sellPlayer = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_sold', { roomId: roomState.roomId }, (res) => {
        if (res?.error) addToast(res.error, 'error');
        resolve(res);
      });
    });
  }, [socket, roomState, addToast]);

  const unsoldPlayer = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_unsold', { roomId: roomState.roomId }, resolve);
    });
  }, [socket, roomState]);

  const togglePause = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_pause_resume', { roomId: roomState.roomId }, resolve);
    });
  }, [socket, roomState]);

  const resetPlayerBids = useCallback(() => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_reset_player', { roomId: roomState.roomId }, resolve);
    });
  }, [socket, roomState]);

  const sendChatMessage = useCallback((text) => {
    if (!socket || !roomState || !text.trim()) return;
    const sender = userRole === 'admin' ? `Auctioneer (${roomState.adminName})` : (myTeam?.teamName || 'Team');
    socket.emit('send_chat_message', {
      roomId: roomState.roomId,
      sender,
      text: text.trim(),
      teamBadge: myTeam?.logoBadge || (userRole === 'admin' ? '🔨' : '🏏')
    });
  }, [socket, roomState, userRole, myTeam]);

  const addCustomPlayer = useCallback((playerData) => {
    return new Promise((resolve) => {
      if (!socket || !roomState) return resolve({ error: 'Socket not connected' });
      socket.emit('admin_add_player', {
        roomId: roomState.roomId,
        player: playerData
      }, (res) => {
        if (res?.error) {
          addToast(res.error, 'error');
        } else {
          addToast(`✅ ${playerData.name} added to auction queue!`, 'success');
        }
        resolve(res);
      });
    });
  }, [socket, roomState, addToast]);

  const leaveRoom = useCallback(() => {
    setRoomState(null);
    setUserRole(null);
    setMyTeamId(null);
    setMyTeam(null);
    setLastSoldEvent(null);
  }, []);

  const clearSoldEvent = useCallback(() => {
    setLastSoldEvent(null);
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      roomState,
      userRole,
      myTeamId,
      myTeam,
      lastSoldEvent,
      clearSoldEvent,
      timerTick,
      toasts,
      joinRoom,
      placeBid,
      startAuction,
      nextPlayer,
      sellPlayer,
      unsoldPlayer,
      togglePause,
      resetPlayerBids,
      sendChatMessage,
      addCustomPlayer,
      leaveRoom,
      addToast
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
