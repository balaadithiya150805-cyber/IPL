import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import { Gavel, Plus, AlertTriangle, ShieldCheck, Flame, Wallet, Users, CheckCircle2 } from 'lucide-react';

export default function BiddingControls({ isPaused }) {
  const { roomState, myTeam, myTeamId, placeBid } = useSocket();
  const [isBidding, setIsBidding] = useState(false);

  const currentActivePlayer = roomState?.currentActivePlayer;
  const currentBid = roomState?.currentBid || 0;
  const highestBidder = roomState?.highestBidder;
  const nextMinBid = roomState?.nextMinBid || (currentActivePlayer ? currentActivePlayer.basePrice : 0);
  const nextIncrement = roomState?.nextIncrement || 20;

  // Validation checks
  const isSelfHighestBidder = highestBidder && highestBidder.teamId === myTeamId;
  const remainingPurse = myTeam?.remainingPurse ?? 0;
  const squadCount = myTeam?.playersBought?.length ?? 0;
  const overseasCount = (myTeam?.playersBought || []).filter(p => p.isOverseas).length;

  const maxSquadSize = roomState?.settings?.maxSquadSize ?? 35;
  const minSquadSize = roomState?.settings?.minSquadSize ?? 7;
  const maxOverseas = roomState?.settings?.maxOverseas ?? 8;

  const isSquadFull = squadCount >= maxSquadSize;
  const isOverseasFull = currentActivePlayer?.isOverseas && overseasCount >= maxOverseas;

  // Reserve check (20L per unfilled slot to reach the configured minimum)
  const minReservePerSlot = roomState?.settings?.minReservePerSlot ?? 20;
  const remainingSlotsToMin = Math.max(0, minSquadSize - (squadCount + 1));
  const requiredReserve = remainingSlotsToMin * minReservePerSlot;
  const hasInsufficientPurse = (remainingPurse - nextMinBid) < requiredReserve || nextMinBid > remainingPurse;

  const isDisabled = !currentActivePlayer || 
    isPaused || 
    isSelfHighestBidder || 
    isSquadFull || 
    isOverseasFull || 
    hasInsufficientPurse || 
    isBidding;

  const handleQuickBid = async (customAmount = null) => {
    if (isDisabled) return;
    setIsBidding(true);
    const amountToBid = customAmount || nextMinBid;
    await placeBid(amountToBid);
    setIsBidding(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-bold text-base sm:text-lg text-white">Live Bidding Console</h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Squad Status Pill */}
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Squad:</span>
            <span className="font-bold text-white font-mono">{squadCount}/{maxSquadSize}</span>
            {squadCount >= minSquadSize ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" title={`Minimum ${minSquadSize} players met`} />
            ) : (
              <span className="text-[10px] text-amber-400 font-semibold">(Min {minSquadSize})</span>
            )}
          </div>

          {/* Available Purse */}
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>Purse:</span>
            <span className="font-bold text-amber-400 font-mono">{formatLakhs(remainingPurse)}</span>
          </div>
        </div>
      </div>

      {/* Main Big Bid Button */}
      <div className="relative">
        <button
          onClick={() => handleQuickBid()}
          disabled={isDisabled}
          className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-display font-black text-lg sm:text-2xl tracking-wide flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
            isDisabled
              ? 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 border border-amber-300/80 shadow-amber-500/25 pulse-gold cursor-pointer'
          }`}
        >
          <Gavel className={`w-6 h-6 ${!isDisabled && 'animate-bounce-short'}`} />
          <span>BID {formatLakhs(nextMinBid)}</span>
          <span className="text-xs sm:text-sm font-semibold opacity-80 uppercase tracking-normal">
            (+{formatLakhs(nextIncrement)})
          </span>
        </button>

        {isSelfHighestBidder && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> You Hold Highest Bid!
          </div>
        )}
      </div>

      {/* Quick Jump Increment Chips */}
      {currentActivePlayer && !isPaused && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> Quick Raise Options
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[20, 50, 100].map((inc) => {
              const jumpAmount = (currentBid || currentActivePlayer.basePrice) + inc;
              const canJump = (remainingPurse - jumpAmount) >= requiredReserve;

              return (
                <button
                  key={inc}
                  onClick={() => handleQuickBid(jumpAmount)}
                  disabled={isDisabled || !canJump}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition ${
                    !canJump || isDisabled
                      ? 'bg-slate-900 text-slate-600 border-white/5 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30 hover:border-amber-400'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>+{formatLakhs(inc)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Warning Messages */}
      {isSquadFull && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Maximum squad limit ({maxSquadSize} players) reached! You cannot bid for more players.</span>
        </div>
      )}

      {hasInsufficientPurse && !isSelfHighestBidder && !isSquadFull && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Insufficient purse! Minimum reserve of {formatLakhs(requiredReserve)} required to reach the minimum squad of {minSquadSize} players.</span>
        </div>
      )}

      {isOverseasFull && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Overseas quota reached! You cannot bid on overseas players.</span>
        </div>
      )}
    </div>
  );
}
