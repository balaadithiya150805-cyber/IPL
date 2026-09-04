import { auctionEngine } from '../services/auctionEngine.js';

export function setupAuctionSockets(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // 1. JOIN ROOM
    socket.on('join_room', async (data, callback) => {
      const { roomId, role = 'team', teamName, ownerName, shortCode, color, logoBadge, teamId } = data || {};
      
      if (!roomId) {
        if (callback) callback({ error: 'Room code is required' });
        return;
      }

      const result = await auctionEngine.joinRoom({
        roomId: roomId.toUpperCase().trim(),
        socketId: socket.id,
        role,
        teamName,
        ownerName,
        shortCode,
        color,
        logoBadge,
        teamId
      });

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      const roomCode = roomId.toUpperCase().trim();
      socket.join(roomCode);

      // Acknowledge the joining client
      if (callback) {
        callback({
          success: true,
          role: result.role,
          teamId: result.teamId,
          team: result.team,
          room: result.room
        });
      }

      // Broadcast full room state update to all connected clients in the room
      io.to(roomCode).emit('room_state_update', result.room);
    });

    // 2. PLACE BID
    socket.on('place_bid', (data, callback) => {
      const { roomId, teamId, amount } = data || {};
      if (!roomId || !teamId) {
        if (callback) callback({ error: 'Invalid bid data' });
        return;
      }

      const roomCode = roomId.toUpperCase().trim();
      const result = auctionEngine.placeBid({
        roomId: roomCode,
        teamId,
        amount
      });

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true, currentBid: result.currentBid });

      // Broadcast new bid to all clients in the room
      io.to(roomCode).emit('bid_placed', {
        currentBid: result.currentBid,
        highestBidder: result.highestBidder,
        bidHistory: result.bidHistory,
        room: result.room
      });

      // Restart broadcast timer with socket instance for ticks
      auctionEngine.resetTimer(roomCode, io);
    });

    // 3. ADMIN: START AUCTION
    socket.on('admin_start_auction', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.startAuction(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true });
      io.to(roomCode).emit('auction_started', result.room);
      auctionEngine.resetTimer(roomCode, io);
    });

    // 4. ADMIN: BRING NEXT PLAYER
    socket.on('admin_next_player', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.bringNextPlayer(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true });
      io.to(roomCode).emit('player_on_block', {
        player: result.player,
        completed: result.completed,
        room: result.room
      });

      if (!result.completed) {
        auctionEngine.resetTimer(roomCode, io);
      }
    });

    // 5. ADMIN: SELL PLAYER (SOLD)
    socket.on('admin_sold', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.sellPlayer(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true, soldRecord: result.soldRecord });

      // Broadcast SOLD hammer event
      io.to(roomCode).emit('player_sold', {
        soldRecord: result.soldRecord,
        room: result.room
      });
    });

    // 6. ADMIN: MARK UNSOLD
    socket.on('admin_unsold', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.unsoldPlayer(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true, unsoldRecord: result.unsoldRecord });

      // Broadcast UNSOLD event
      io.to(roomCode).emit('player_unsold', {
        unsoldRecord: result.unsoldRecord,
        room: result.room
      });
    });

    // 7. ADMIN: PAUSE / RESUME AUCTION
    socket.on('admin_pause_resume', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.togglePause(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true, status: result.status });
      io.to(roomCode).emit('auction_pause_toggled', {
        status: result.status,
        room: result.room
      });
    });

    // 8. ADMIN: RESET PLAYER BIDS
    socket.on('admin_reset_player', (data, callback) => {
      const { roomId } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.resetCurrentPlayerBids(roomCode);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true });
      io.to(roomCode).emit('bid_reset', result.room);
      auctionEngine.resetTimer(roomCode, io);
    });

    // 9. ADMIN: ADD CUSTOM PLAYER TO QUEUE
    socket.on('admin_add_player', (data, callback) => {
      const { roomId, player } = data || {};
      const roomCode = (roomId || '').toUpperCase().trim();
      const result = auctionEngine.addPlayerToRoomPool(roomCode, player);

      if (result.error) {
        if (callback) callback({ error: result.error });
        return;
      }

      if (callback) callback({ success: true, player: result.player });
      io.to(roomCode).emit('room_state_update', result.room);
    });

    // 10. LIVE BANTER / CHAT MESSAGE
    socket.on('send_chat_message', (data) => {
      const { roomId, sender, text, teamBadge } = data || {};
      if (!roomId || !text) return;
      const roomCode = roomId.toUpperCase().trim();
      const msg = auctionEngine.addChatMessage(roomCode, {
        sender: sender || 'Participant',
        text,
        teamBadge: teamBadge || 'shield',
        type: 'chat'
      });

      if (msg) {
        io.to(roomCode).emit('new_chat_message', msg);
      }
    });

    // 10. DISCONNECT
    socket.on('disconnect', () => {
      const disconnected = auctionEngine.handleDisconnect(socket.id);
      if (disconnected && disconnected.roomId) {
        console.log(`❌ Disconnected: ${socket.id} from Room: ${disconnected.roomId}`);
        const roomState = auctionEngine.getRoomState(disconnected.roomId);
        if (roomState) {
          io.to(disconnected.roomId).emit('room_state_update', roomState);
        }
      }
    });
  });
}
