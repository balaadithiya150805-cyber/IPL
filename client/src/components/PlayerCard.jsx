import React from 'react';
import { formatLakhs, formatTimer, getRoleBadgeStyle } from '../utils/formatters';
import TeamBadge from './TeamBadge';
import { usePlayerImage } from '../utils/playerImages';
import { Shield, Clock, Award, Globe2, Zap, Flame, PauseCircle } from 'lucide-react';

export default function PlayerCard({ player, currentBid, highestBidder, timer, isPaused }) {
  const realPlayerImage = usePlayerImage(player);

  if (!player) {
    return (
      <div className="glass-panel rounded-2xl p-8 lg:p-12 text-center flex flex-col items-center justify-center min-h-[440px] border border-dashed border-white/20">
        <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-4xl mb-4 shadow-inner">
          🏏
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">No Player Currently on the Block</h3>
        <p className="text-sm text-slate-400 max-w-md">
          The auctioneer will bring the next star player to the auction stage shortly. Get your purse ready!
        </p>
      </div>
    );
  }

  const roleStyle = getRoleBadgeStyle(player.role);
  const timeLeft = timer?.timeLeft ?? 15;
  const isUrgentTimer = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="glass-panel-glow rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl relative">
      {/* Top Banner: Status & Countdown Timer */}
      <div className="bg-slate-950/80 px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPaused ? (
            <span className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/40">
              <PauseCircle className="w-3.5 h-3.5" /> PAUSED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> LIVE ON BLOCK
            </span>
          )}
          
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            <span>{roleStyle.icon}</span>
            <span>{player.role}</span>
          </span>
        </div>

        {/* Live Timer Clock */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-bold text-sm border transition-all ${
          isUrgentTimer 
            ? 'bg-rose-950 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/40 animate-bounce-short' 
            : timeLeft <= 10 
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
              : 'bg-slate-900 border-white/10 text-slate-300'
        }`}>
          <Clock className={`w-4 h-4 ${isUrgentTimer ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
          <span className="text-base tracking-wider">{formatTimer(timeLeft)}s</span>
        </div>
      </div>

      {/* Main Spotlight Area */}
      <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Player Avatar & Nationality Badge */}
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-900 flex items-center justify-center">
              {realPlayerImage ? (
                <img src={realPlayerImage} alt={player.name} className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <span className="text-5xl font-display font-black text-amber-300/80">{player.name.slice(0, 1)}</span>
              )}
            </div>
            {player.isOverseas ? (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-indigo-900 text-indigo-200 border border-indigo-400/50 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                <Globe2 className="w-3 h-3 text-indigo-300" /> Overseas ({player.nationality})
              </span>
            ) : (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-950 text-blue-200 border border-blue-400/50 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                🇮🇳 Indian Star
              </span>
            )}
          </div>
        </div>

        {/* Right: Player Name, Specialty & T20 Career Stats */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center gap-2">
              {player.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium italic">
              {player.stats?.specialty || `${player.role} • ${player.nationality}`}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 my-4 bg-slate-900/80 p-3 rounded-xl border border-white/5">
            <div className="text-center p-1.5 rounded-lg bg-slate-800/50">
              <div className="text-[10px] uppercase font-bold text-slate-400">Matches</div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono">{player.stats?.matches || 0}</div>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-800/50">
              <div className="text-[10px] uppercase font-bold text-slate-400">Runs</div>
              <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">{player.stats?.runs || 0}</div>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-800/50">
              <div className="text-[10px] uppercase font-bold text-slate-400">Strike Rate</div>
              <div className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono">{player.stats?.strikeRate || 0}</div>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-800/50">
              <div className="text-[10px] uppercase font-bold text-slate-400">Wickets</div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">{player.stats?.wickets || 0}</div>
            </div>
            <div className="text-center p-1.5 rounded-lg bg-slate-800/50">
              <div className="text-[10px] uppercase font-bold text-slate-400">Economy</div>
              <div className="text-sm sm:text-base font-extrabold text-purple-400 font-mono">{player.stats?.economy || 0}</div>
            </div>
          </div>

          {/* Live Bid Spotlight Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
            {/* Base Price */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Base Price</span>
                <span className="text-lg font-extrabold text-slate-200 font-mono">{formatLakhs(player.basePrice)}</span>
              </div>
              <Award className="w-6 h-6 text-slate-500" />
            </div>

            {/* Current Highest Bid */}
            <div className="bg-gradient-to-br from-amber-950/80 to-slate-900 p-3 rounded-xl border border-amber-500/40 flex items-center justify-between shadow-lg shadow-amber-500/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 animate-pulse" /> Current Highest Bid
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                  {currentBid > 0 ? formatLakhs(currentBid) : 'No Bids Yet'}
                </span>
              </div>

              {highestBidder ? (
                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-400/50 px-2 py-1 rounded-lg">
                  <TeamBadge 
                    shortCode={highestBidder.shortCode}
                    logoBadge={highestBidder.logoBadge}
                    color={highestBidder.color}
                    size="sm"
                  />
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Leader</div>
                    <div className="text-xs font-black text-white truncate max-w-[80px]">{highestBidder.shortCode || highestBidder.teamName}</div>
                  </div>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-500 italic">Waiting...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
