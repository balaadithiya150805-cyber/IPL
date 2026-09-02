import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  adminId: { type: String, default: null }, // admin socket / user ID
  isActive: { type: Boolean, default: false },
  currentActivePlayerId: { type: String, default: null },
  roomName: { type: String, default: 'IPL Mock Auction' },
  adminName: { type: String, default: 'Auctioneer' },
  status: { 
    type: String, 
    enum: ['lobby', 'active', 'paused', 'completed'], 
    default: 'lobby' 
  },
  settings: {
    startingPurse: { type: Number, default: 5000 }, // Lakhs (50 Cr)
    maxSquadSize: { type: Number, default: 35 },
    minSquadSize: { type: Number, default: 7 }, // Minimum required squad size
    playingXISize: { type: Number, default: 11 },
    standardSquadSize: { type: Number, default: 18 },
    maxOverseas: { type: Number, default: 8 },
    timerDuration: { type: Number, default: 4 }, // seconds
    minReservePerSlot: { type: Number, default: 20 } // 20 Lakhs per remaining slot to reach minimum (7)
  },
  currentBid: { type: Number, default: 0 },
  highestBidderTeamId: { type: String, default: null },
  highestBidderTeamName: { type: String, default: null },
  bidHistory: [{
    teamId: String,
    teamName: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  timerTimeLeft: { type: Number, default: 4 },
  timerActive: { type: Boolean, default: false },
  playerPool: [Object],
  completedPlayers: [Object],
  unsoldPlayers: [Object]
}, { timestamps: true });

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
