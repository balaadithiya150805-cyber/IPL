import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import { Sparkles, Trophy, X, ShieldCheck } from 'lucide-react';

export default function SoldCelebration() {
  const { lastSoldEvent, clearSoldEvent } = useSocket();

  useEffect(() => {
    if (lastSoldEvent) {
      // Fire celebratory confetti cannons
      try {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.6 } });
          confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.6 } });
        }, 250);
      } catch {}

      // Auto-clear after 6 seconds
      const timer = setTimeout(() => {
        clearSoldEvent();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [lastSoldEvent, clearSoldEvent]);

  if (!lastSoldEvent) return null;

  const { player, winningTeam, soldPrice } = lastSoldEvent;

  return (
    <div 
      onClick={clearSoldEvent}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="glass-panel-glow w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center border-2 border-amber-400 shadow-2xl relative animate-scale-up"
      >
        <button
          onClick={clearSoldEvent}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hammer & Sold Banner */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-display font-black text-xs sm:text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/30">
          <Sparkles className="w-4 h-4" /> OFFICIAL IPL AUCTION HAMMER DOWN
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mb-4">
          <span className="text-amber-400 animate-pulse">SOLD!</span> 🔨
        </h1>

        {/* Player Avatar */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl mb-4 bg-slate-900">
          <img
            src={player.imageURL}
            alt={player.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-black text-white">{player.name}</h2>
        <p className="text-xs sm:text-sm text-slate-300 font-semibold mb-6">{player.role} • {player.nationality}</p>

        {/* Winning Franchise & Price Spotlight */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/30 grid grid-cols-2 gap-3 mb-6">
          <div className="text-center border-r border-white/10 pr-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Winning Franchise</div>
            <div className="text-sm sm:text-base font-extrabold text-amber-400 mt-1 truncate">
              {winningTeam?.teamName}
            </div>
          </div>

          <div className="text-center pl-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Winning Bid</div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-0.5">
              {formatLakhs(soldPrice)}
            </div>
          </div>
        </div>

        <button
          onClick={clearSoldEvent}
          className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm tracking-wide transition transform active:scale-95 shadow-lg shadow-amber-500/20"
        >
          CONTINUE AUCTION
        </button>
      </div>
    </div>
  );
}
