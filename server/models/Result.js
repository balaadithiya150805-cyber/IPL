import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  teamId: { type: String, required: true },
  squadBalanceScore: { type: Number, min: 0, max: 70, default: 0 },
  moneyManagementScore: { type: Number, min: 0, max: 10, default: 0 },
  strategyScore: { type: Number, min: 0, max: 10, default: 0 },
  timeManagementScore: { type: Number, min: 0, max: 10, default: 0 },
  totalScore: { type: Number, min: 0, max: 100, default: 0 },
  rank: { type: Number, min: 1 }
}, { timestamps: true });

export const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);
