import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import TeamBadge from '../components/TeamBadge';
import ActivityFeed from '../components/ActivityFeed';
import { Copy, Check, Play, Users, Shield, Clock, Award, Sparkles } from 'lucide-react';

export default function LobbyPage() {
  const { roomState, userRole, myTeam, startAuction, addToast } = useSocket();
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  if (!roomState) return null;

  const { roomId, adminName, settings, teams = [] } = roomState;

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    addToast(`Room code ${roomId} copied!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setIsStarting(true);
    await startAuction();
    setIsStarting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AUCTION LOBBY WAITING ROOM
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            Room Code: <span className="text-amber-400 font-mono tracking-wider">{roomId}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Hosted by <b className="text-purple-400">{adminName}</b> • Share this code with participants to join!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-sm transition active:scale-95 shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'COPIED!' : 'COPY ROOM CODE'}</span>
          </button>

          {userRole === 'admin' ? (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-base transition transform active:scale-95 shadow-xl shadow-emerald-500/20 pulse-gold"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>START AUCTION NOW</span>
            </button>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-300 text-center animate-pulse">
              Waiting for Auctioneer to start...
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Connected Teams & Room Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Connected Franchises Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Connected Franchises ({teams.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Starting Purse: {formatLakhs(settings?.startingPurse)}</span>
            </div>

            {teams.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic">
                No teams joined yet. Share the code #{roomId} with franchise managers!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teams.map((team) => (
                  <div
                    key={team.teamId}
                    className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <TeamBadge 
                        shortCode={team.shortCode}
                        logoBadge={team.logoBadge}
                        color={team.color}
                        size="md"
                      />
                      <div>
                        <div className="font-bold text-white text-sm truncate max-w-[140px]">{team.teamName}</div>
                        <div className="text-xs text-slate-400">Manager: {team.ownerName}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Ready
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rules & Guidelines */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl text-xs space-y-2.5 text-slate-300">
            <h3 className="font-display font-bold text-sm text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" /> Official Auction Guidelines
            </h3>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><b>Squad Milestones:</b> Minimum <b>7 players</b> required per squad (Playing XI: 11, Standard: 18, Maximum Limit: <b>{settings?.maxSquadSize || 35} players</b>).</li>
              <li><b>Purse Strategy:</b> You have {formatLakhs(settings?.startingPurse)} starting purse to recruit your squad.</li>
              <li><b>Reserve Requirement:</b> You must maintain ₹20 Lakhs per unfilled slot until you reach the minimum 7-player squad threshold.</li>
              <li><b>Overseas Quota:</b> Maximum {settings?.maxOverseas || 8} overseas international players per franchise squad.</li>
              <li><b>Bidding Increments:</b> Under ₹1 Cr (+10L), ₹1-2 Cr (+20L), ₹2-5 Cr (+25L), Above ₹5 Cr (+50L).</li>
            </ul>
          </div>
        </div>

        {/* Right 4 Cols: Live Feed */}
        <div className="lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
