import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  roomId: { type: String, required: true, index: true },
  remainingPurse: { type: Number, default: 5000 }, // In Lakhs (5000 = 50 Cr)
  playersBought: [{
    id: String,
    name: String,
    role: String,
    basePrice: Number,
    soldPrice: Number,
    imageURL: String,
    isOverseas: Boolean,
    nationality: String
  }],
  squadSize: { type: Number, default: 0 },
  teamId: { type: String, required: true },
  ownerName: { type: String, default: 'Manager' },
  shortCode: { type: String, default: 'TEAM' },
  color: { type: String, default: '#F59E0B' },
  logoBadge: { type: String, default: 'shield' },
  socketId: { type: String, default: null },
  isReady: { type: Boolean, default: false },
  totalPurse: { type: Number, default: 5000 },
  spentPurse: { type: Number, default: 0 },
  squadCount: { type: Number, default: 0 },
  overseasCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
