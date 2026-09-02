import mongoose from 'mongoose';

const bidHistorySchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  playerId: { type: String, required: true },
  playerName: { type: String, required: true },
  teamId: { type: String, required: true },
  teamName: { type: String, required: true },
  bidAmount: { type: Number, required: true }, // Lakhs
  bidType: { type: String, enum: ['bid', 'sold', 'unsold'], default: 'bid' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const BidHistory = mongoose.models.BidHistory || mongoose.model('BidHistory', bidHistorySchema);
