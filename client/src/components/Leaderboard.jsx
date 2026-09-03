import React from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import TeamBadge from './TeamBadge';
import { Trophy, X, Users, Globe2, Eye, ShieldCheck } from 'lucide-react';

export default function Leaderboard({ isOpen, onClose, onSelectTeam }) {
  const { roomState, myTeamId } = useSocket();

  if (!isOpen) return null;

  const teams = roomState?.teams || [];
  const sortedTeams = [...teams].sort((a, b) => (b.scores?.totalScore || 0) - (a.scores?.totalScore || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow w-full max-w-4xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden border border-cyan-500/30 shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950/90 p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">Franchise Standings & Purses</h2>
              <p className="text-xs text-slate-400">Real-time budget tracking across all {teams.length} teams in room</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table / Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3">
            {sortedTeams.map((team, index) => {
              const isMe = team.teamId === myTeamId;
              const lastPlayer = team.playersBought && team.playersBought.length > 0 
                ? team.playersBought[team.playersBought.length - 1] 
                : null;

              return (
                <div
                  key={team.teamId}
                  className={`rounded-2xl p-4 border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isMe 
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Left: Rank, Badge & Team Info */}
                  <div className="flex items-center gap-3.5">
                    <span className="font-display font-black text-lg text-slate-500 w-6 text-center">
                      #{index + 1}
                    </span>

                    <TeamBadge 
                      shortCode={team.shortCode}
                      logoBadge={team.logoBadge}
                      color={team.color}
                      size="md"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{team.teamName}</span>
                        {isMe && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                        {!team.isConnected && (
                          <span className="text-[10px] text-slate-500 italic">(Away)</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">Manager: {team.ownerName}</span>
                    </div>
                  </div>

                  {/* Middle: Squad & Overseas Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 justify-center">
                        <Users className="w-3 h-3 text-cyan-400" /> Squad Size
                      </div>
                      <div className="font-mono font-bold text-white text-sm">
                        {team.squadCount || 0} <span className="text-[11px] text-slate-400 font-normal">/ {roomState?.settings?.maxSquadSize || 35}</span>
                      </div>
                      {(team.squadCount || 0) >= (roomState?.settings?.minSquadSize || 7) && (
                        <span className="text-[9px] font-bold text-emerald-400 uppercase">Min Met</span>
                      )}
                    </div>

                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 justify-center">
                        <Globe2 className="w-3 h-3 text-indigo-400" /> Overseas
                      </div>
                      <div className="font-mono font-bold text-indigo-300 text-sm">{team.overseasCount || 0}</div>
                    </div>
                  </div>

                  {/* Right: Purse & View Button */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
                      <div className="text-base font-black text-cyan-300 font-mono">{team.scores?.totalScore || 0}/100</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Remaining Purse</div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {formatLakhs(team.remainingPurse)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectTeam) onSelectTeam(team);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition"
                      title="View Squad"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Squad</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
