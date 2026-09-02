import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper'], 
    required: true 
  },
  nationality: { type: String, default: 'India' },
  isOverseas: { type: Boolean, default: false },
  basePrice: { type: Number, required: true }, // in Lakhs (e.g. 200 for 2 Cr)
  imageURL: { type: String, default: '' },
  stats: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    specialty: { type: String, default: '' }
  },
  status: { 
    type: String, 
    enum: ['available', 'in_auction', 'sold', 'unsold'], 
    default: 'available' 
  },
  soldPrice: { type: Number, default: 0 },
  soldTo: { type: String, default: null }, // teamId / teamName
  soldToTeamName: { type: String, default: null }
}, { timestamps: true });

export const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);
