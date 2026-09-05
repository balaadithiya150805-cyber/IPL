import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs, getRoleBadgeStyle } from '../utils/formatters';
import { usePlayerImage } from '../utils/playerImages';
import TeamBadge from './TeamBadge';
import { X, Users, Globe2, Wallet, Award, Filter, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

function SquadPlayerImage({ player }) {
  const playerImage = usePlayerImage(player);

  return (
    <img
      src={playerImage || undefined}
      alt={player.name}
      className="w-full h-full object-cover group-hover:scale-105 transition"
    />
  );
}

export default function SquadModal({ isOpen, onClose, targetTeam = null }) {
  const { myTeam, roomState } = useSocket();
  const [roleFilter, setRoleFilter] = useState('ALL');

  if (!isOpen) return null;

  const team = targetTeam || myTeam;
  if (!team) return null;

  const maxSquad = roomState?.settings?.maxSquadSize || 35;
  const minSquad = roomState?.settings?.minSquadSize || 7;
  const maxOverseas = roomState?.settings?.maxOverseas || 8;
  const players = team.playersBought || [];
  const squadCount = players.length;
  
  const filteredPlayers = roleFilter === 'ALL'
    ? players
    : players.filter(p => p.role?.toUpperCase() === roleFilter.toUpperCase());

  const totalSpent = team.spentPurse || 0;
  const remainingPurse = team.remainingPurse || 0;
  const totalPurse = team.totalPurse || 10000;

  const roleCounts = {
    Batter: players.filter(p => p.role === 'Batter').length,
    Bowler: players.filter(p => p.role === 'Bowler').length,
    'All-Rounder': players.filter(p => p.role === 'All-Rounder').length,
    Wicketkeeper: players.filter(p => p.role === 'Wicketkeeper').length,
    Overseas: players.filter(p => p.isOverseas).length
  };

  // Milestone Progress
  const isMinMet = squadCount >= minSquad;
  const isPlayingXIMet = squadCount >= 11;
  const isStandardMet = squadCount >= 18;
  const isMaxReached = squadCount >= maxSquad;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        {/* Modal Header */}
        <div className="bg-slate-950/90 p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <TeamBadge 
              shortCode={team.shortCode}
              logoBadge={team.logoBadge}
              color={team.color}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">{team.teamName}</h2>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                  {team.shortCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">Owner / Manager: <span className="text-slate-200 font-semibold">{team.ownerName}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Squad Milestones Bar */}
        <div className="bg-slate-950/60 px-4 sm:px-6 py-3 border-b border-white/10">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Squad Milestones ({squadCount} / {maxSquad})
            </span>
            <span className="font-mono text-amber-300">
              {isMaxReached ? 'MAX SQUAD REACHED' : isStandardMet ? 'STANDARD SQUAD READY' : isPlayingXIMet ? 'PLAYING XI FORMED' : isMinMet ? 'MINIMUM MET' : `${minSquad - squadCount} MORE NEEDED FOR MIN`}
            </span>
          </div>

          {/* 4 Milestones Progress Strip */}
          <div className="grid grid-cols-4 gap-2">
            {/* 1. Configured minimum */}
            <div className={`p-2 rounded-xl border flex items-center gap-2 transition ${
              isMinMet ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900/60 border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isMinMet ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="text-[10px] uppercase font-bold">Min Squad</div>
                <div className="text-xs font-mono font-black">{minSquad} Players</div>
              </div>
            </div>

            {/* 2. Playing XI 11 */}
            <div className={`p-2 rounded-xl border flex items-center gap-2 transition ${
              isPlayingXIMet ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900/60 border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isPlayingXIMet ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="text-[10px] uppercase font-bold">Playing XI</div>
                <div className="text-xs font-mono font-black">11 Players</div>
              </div>
            </div>

            {/* 3. Matchday Roster 18 */}
            <div className={`p-2 rounded-xl border flex items-center gap-2 transition ${
              isStandardMet ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-white/10 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isStandardMet ? 'text-cyan-400' : 'text-slate-600'}`} />
              <div>
                <div className="text-[10px] uppercase font-bold">Roster</div>
                <div className="text-xs font-mono font-black">18 Players</div>
              </div>
            </div>

            {/* 4. Max Squad */}
            <div className={`p-2 rounded-xl border flex items-center gap-2 transition ${
              isMaxReached ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-white/10 text-slate-400'
            }`}>
              <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isMaxReached ? 'text-amber-400' : 'text-slate-600'}`} />
              <div>
                <div className="text-[10px] uppercase font-bold">Max Limit</div>
                <div className="text-xs font-mono font-black">{maxSquad} Players</div>
              </div>
            </div>
          </div>
        </div>

        {/* Squad & Purse Stats Summary Strip */}
        <div className="bg-slate-900/60 p-4 sm:p-5 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Purse Spent & Remaining */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Wallet className="w-3 h-3 text-amber-400" /> Remaining Purse
            </div>
            <div className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
              {formatLakhs(remainingPurse)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Spent: {formatLakhs(totalSpent)}</div>
          </div>

          {/* Squad Count */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" /> Current Squad Size
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white font-mono">
              {squadCount} <span className="text-xs text-slate-400">/ {maxSquad}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Slots Left: {maxSquad - squadCount}</div>
          </div>

          {/* Overseas Count */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-indigo-400" /> Overseas Slots
            </div>
            <div className="text-base sm:text-lg font-extrabold text-indigo-300 font-mono">
              {roleCounts.Overseas} <span className="text-xs text-slate-400">/ {maxOverseas}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Available: {maxOverseas - roleCounts.Overseas}</div>
          </div>

          {/* Role Counts */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Role Composition</div>
            <div className="text-[11px] font-semibold text-slate-200 mt-1 grid grid-cols-2 gap-0.5">
              <span>🏏 Bat: {roleCounts.Batter}</span>
              <span>🎯 Bowl: {roleCounts.Bowler}</span>
              <span>⚡ AR: {roleCounts['All-Rounder']}</span>
              <span>🧤 WK: {roleCounts.Wicketkeeper}</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {['ALL', 'Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                roleFilter === role
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {role} {role !== 'ALL' && `(${roleCounts[role] || 0})`}
            </button>
          ))}
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 font-medium">No players acquired yet in this category.</p>
              <p className="text-xs text-slate-500 mt-1">Bid and win star players during live auction sets!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredPlayers.map((player, idx) => {
                const roleStyle = getRoleBadgeStyle(player.role);
                return (
                  <div
                    key={player.id || idx}
                    className="bg-slate-900/90 rounded-2xl p-3.5 border border-white/10 flex items-center gap-3 hover:border-amber-400/40 transition group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                      <SquadPlayerImage player={player} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{player.name}</span>
                        {player.isOverseas && (
                          <span className="text-[10px]" title={`Overseas: ${player.nationality}`}>✈️</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                          {player.role}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-black text-amber-400 mt-1">
                        {formatLakhs(player.soldPrice)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
