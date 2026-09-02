import React from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import TeamBadge from './TeamBadge';
import { Trophy, Download, X, Award, Flame, Users, FileSpreadsheet } from 'lucide-react';

export default function SummaryModal({ isOpen, onClose }) {
  const { roomState } = useSocket();

  if (!isOpen || !roomState) return null;

  const { teams = [], completedPlayers = [], unsoldPlayers = [] } = roomState;

  // Top Buys
  const topBuys = [...completedPlayers]
    .sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0))
    .slice(0, 5);

  // Export CSV Report
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Team,Manager,Total Purse,Spent,Remaining,Squad Size,Overseas\n';
    
    teams.forEach(t => {
      csvContent += `"${t.teamName}","${t.ownerName}","${(t.totalPurse / 100).toFixed(2)} Cr","${(t.spentPurse / 100).toFixed(2)} Cr","${(t.remainingPurse / 100).toFixed(2)} Cr",${t.squadCount},${t.overseasCount}\n`;
    });

    csvContent += '\nSOLD PLAYERS\nPlayer Name,Role,Nationality,Price,Sold To\n';
    completedPlayers.forEach(p => {
      csvContent += `"${p.name}","${p.role}","${p.nationality}","${(p.soldPrice / 100).toFixed(2)} Cr","${p.soldToTeamName || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IPL_Auction_Summary_${roomState.roomId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow w-full max-w-5xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950/90 p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">IPL Auction Official Report</h2>
              <p className="text-xs text-slate-400">Comprehensive room breakdown for Room #{roomState.roomId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top 5 Most Expensive Players */}
          {topBuys.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-base text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" /> Top Marquee Buys of the Auction
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {topBuys.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className="bg-slate-900/80 rounded-2xl p-3 border border-amber-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>#{idx + 1} PICK</span>
                        <span className="text-[10px] text-amber-400">{player.role}</span>
                      </div>
                      <div className="text-sm font-bold text-white truncate">{player.name}</div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">To: {player.soldToTeamName || 'Franchise'}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 text-sm font-black font-mono text-emerald-400">
                      {formatLakhs(player.soldPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Franchise Rosters Breakdown */}
          <div>
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Complete Franchise Rosters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.teamId} className="bg-slate-900/70 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2.5">
                      <TeamBadge 
                        shortCode={team.shortCode}
                        logoBadge={team.logoBadge}
                        color={team.color}
                        size="sm"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">{team.teamName}</div>
                        <div className="text-[10px] text-slate-400">Manager: {team.ownerName}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-amber-400">
                        {formatLakhs(team.remainingPurse)} left
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {team.squadCount || 0} players ({team.overseasCount || 0} overseas)
                      </div>
                    </div>
                  </div>

                  {/* Player list */}
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {(team.playersBought || []).length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No players acquired</p>
                    ) : (
                      team.playersBought.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-800/40">
                          <span className="text-slate-200">{p.name} <span className="text-[10px] text-slate-500">({p.role})</span></span>
                          <span className="font-mono font-bold text-amber-300">{formatLakhs(p.soldPrice)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
