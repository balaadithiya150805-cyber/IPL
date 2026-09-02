import mongoose from 'mongoose';

const auctionStateSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  currentPlayerId: { type: String, default: null },
  currentBidAmount: { type: Number, default: 0 },
  highestBidderTeamId: { type: String, default: null },
  auctionStatus: { type: String, enum: ['Active', 'Paused', 'Completed'], default: 'Paused' },
  timer: { type: Number, default: 4 }
}, { timestamps: true });

export const AuctionState = mongoose.models.AuctionState || mongoose.model('AuctionState', auctionStateSchema);
