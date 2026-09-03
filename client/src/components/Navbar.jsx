import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useSound } from '../context/SoundContext';
import { formatLakhs } from '../utils/formatters';
import TeamBadge from './TeamBadge';
import { Copy, Check, Volume2, VolumeX, Shield, Users, Trophy, LogOut, Flame } from 'lucide-react';

export default function Navbar({ onOpenSquad, onOpenLeaderboard, onOpenSummary }) {
  const { roomState, userRole, myTeam, isConnected, leaveRoom, addToast } = useSocket();
  const { isMuted, toggleMute } = useSound();
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    if (!roomState?.roomId) return;
    navigator.clipboard.writeText(roomState.roomId);
    setCopied(true);
    addToast(`Room code ${roomState.roomId} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Room Code */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-black text-lg tracking-wider text-white">
                <span>IPL</span>
                <span className="text-amber-400">AUCTION</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Mock Arena</p>
            </div>
          </div>

          {roomState && (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-inner">
              <span className="text-xs text-slate-400 font-semibold uppercase">Room</span>
              <span className="font-mono font-bold text-amber-400 tracking-wider text-sm">{roomState.roomId}</span>
              <button
                onClick={copyRoomCode}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Center/Right: Team Purse Status or Admin Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-500/40 px-3 py-1.5 rounded-xl">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Auctioneer</span>
            </div>
          ) : myTeam ? (
            <div className="flex items-center gap-3">
              {/* Franchise Pill */}
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl">
                <TeamBadge 
                  shortCode={myTeam.shortCode}
                  logoBadge={myTeam.logoBadge}
                  color={myTeam.color}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{myTeam.teamName}</div>
                  <div className="text-[10px] text-slate-400">{myTeam.ownerName}</div>
                </div>
              </div>

              {/* Remaining Purse Badge */}
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 px-3.5 py-1.5 rounded-xl shadow-lg shadow-amber-500/10">
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Remaining Purse</div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                    {formatLakhs(myTeam.remainingPurse)}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-2 sm:pl-3">
            {myTeam && (
              <button
                onClick={onOpenSquad}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
                title="My Squad"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Squad</span>
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold">
                  {myTeam.playersBought?.length || 0}/{roomState?.settings?.maxSquadSize || 35}
                </span>
                {(myTeam.playersBought?.length || 0) >= (roomState?.settings?.minSquadSize || 7) && (
                  <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline" title={`Minimum ${roomState?.settings?.minSquadSize || 7} squad met`}>✓</span>
                )}
              </button>
            )}

            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
              title="All Teams / Leaderboard"
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Teams</span>
            </button>

            <button
              onClick={onOpenSummary}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
              title="Auction Summary & Report"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Report</span>
            </button>

            {/* Audio Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg border transition ${
                isMuted 
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-900/60' 
                  : 'bg-slate-800 border-white/10 text-amber-400 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Connection Indicator & Leave */}
            <div 
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500'}`}
              title={isConnected ? 'Connected to live room' : 'Connecting...'}
            />

            <button
              onClick={leaveRoom}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-white/10 transition"
              title="Leave Room"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
