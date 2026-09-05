import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { IPL_FRANCHISES, CUSTOM_BADGES } from '../utils/teams';
import TeamBadge from '../components/TeamBadge';
import { Gavel, Users, Shield, Sparkles, ArrowRight, Play, Trophy, Check } from 'lucide-react';

const API_URL = (
  import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? window.location.origin : 'http://localhost:5000')
).replace(/\/$/, '');

export default function HomePage({ onRoomJoined }) {
  const { joinRoom, addToast } = useSocket();

  const [activeTab, setActiveTab] = useState('join'); // 'join' | 'create'
  
  // Join Room State
  const [joinCode, setJoinCode] = useState('');
  const [managerName, setManagerName] = useState('');
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('csk');
  const [isCustomTeam, setIsCustomTeam] = useState(false);
  const [customTeamName, setCustomTeamName] = useState('');
  const [customBadge, setCustomBadge] = useState('🎓');
  const [customColor, setCustomColor] = useState('#f59e0b');

  // Create Room State (Admin)
  const [adminName, setAdminName] = useState('Host Auctioneer');
  const [customRoomCode, setCustomRoomCode] = useState(
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [startingPurse, setStartingPurse] = useState(5000); // 5000 Lakhs = 50 Cr
  const [maxSquadSize, setMaxSquadSize] = useState(35);
  const [isCustomMaxSquad, setIsCustomMaxSquad] = useState(false);
  const [timerDuration, setTimerDuration] = useState(4);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Join Room Submission
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      addToast('Please enter a 6-character Room Code', 'error');
      return;
    }

    setIsSubmitting(true);

    let teamPayload = {};
    if (isCustomTeam) {
      if (!customTeamName.trim()) {
        addToast('Please enter your custom team name', 'error');
        setIsSubmitting(false);
        return;
      }
      teamPayload = {
        teamName: customTeamName.trim(),
        ownerName: managerName.trim() || 'Manager',
        shortCode: customTeamName.substring(0, 4).toUpperCase(),
        color: customColor,
        logoBadge: customBadge,
        teamId: customTeamName.toLowerCase().replace(/[^a-z0-9]/g, '_')
      };
    } else {
      const franchise = IPL_FRANCHISES.find(f => f.id === selectedFranchiseId) || IPL_FRANCHISES[0];
      teamPayload = {
        teamName: franchise.name,
        ownerName: managerName.trim() || 'Manager',
        shortCode: franchise.shortCode,
        color: franchise.color,
        logoBadge: franchise.logoBadge,
        teamId: franchise.id
      };
    }

    const res = await joinRoom({
      roomId: joinCode.trim().toUpperCase(),
      role: 'team',
      ...teamPayload
    });

    setIsSubmitting(false);

    if (res.error) {
      addToast(res.error, 'error');
    } else {
      addToast(`Joined room ${joinCode.toUpperCase()} as ${teamPayload.teamName}!`, 'success');
      if (onRoomJoined) onRoomJoined();
    }
  };

  // Handle Create Room Submission (Admin)
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call REST endpoint to create room in engine
    try {
      const response = await fetch(`${API_URL}/api/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: customRoomCode.trim().toUpperCase(),
          adminName: adminName.trim() || 'Auctioneer',
          startingPurse: Number(startingPurse),
          maxSquadSize: Number(maxSquadSize),
          timerDuration: Number(timerDuration)
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      if (!data.success) {
        addToast(data.error || 'Failed to create room', 'error');
        setIsSubmitting(false);
        return;
      }

      // Now join room via socket as admin
      const joinRes = await joinRoom({
        roomId: data.roomId,
        role: 'admin',
        ownerName: adminName.trim() || 'Auctioneer'
      });

      setIsSubmitting(false);

      if (joinRes.error) {
        addToast(joinRes.error, 'error');
      } else {
        addToast(`Room ${data.roomId} created successfully! You are the Auctioneer.`, 'success');
        if (onRoomJoined) onRoomJoined();
      }
    } catch (err) {
      setIsSubmitting(false);
      const isNetworkError = err instanceof TypeError && err.message.toLowerCase().includes('fetch');
      addToast(
        isNetworkError
          ? 'Cannot reach the auction server. Check the Netlify VITE_API_URL and Render service.'
          : `Error: ${err.message}`,
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Header */}
      <div className="max-w-4xl mx-auto w-full text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 mb-4 shadow-lg shadow-amber-500/10 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-Time IPL Mock Auction Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white mb-3">
          <span className="gold-gradient-text">IPL AUCTION</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Experience the high-stakes thrill of the IPL mega-auction. Form your squad, manage budgets in real-time, and outbid your rivals!
        </p>
      </div>

      {/* Main Form Box */}
      <div className="max-w-xl mx-auto w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('join')}
            className={`py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'join'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>JOIN A ROOM</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>CREATE ROOM</span>
          </button>
        </div>

        {/* 1. JOIN ROOM FORM */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Room Code (6 Characters)
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. IPL924"
                maxLength={6}
                required
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-lg font-mono font-bold text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition tracking-widest uppercase text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Manager / Owner Name
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Franchise Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Franchise Identity
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomTeam(!isCustomTeam)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                >
                  {isCustomTeam ? 'Pick IPL Team' : 'Custom Team'}
                </button>
              </div>

              {!isCustomTeam ? (
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1.5 bg-slate-900/60 rounded-2xl border border-white/10">
                  {IPL_FRANCHISES.map((team) => {
                    const isSelected = selectedFranchiseId === team.id;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedFranchiseId(team.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/30'
                            : 'bg-slate-800/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <TeamBadge 
                          shortCode={team.shortCode}
                          logoBadge={team.logoBadge}
                          color={team.color}
                          size="sm"
                        />
                        <span className="text-[10px] font-bold text-white tracking-wider">{team.shortCode}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-white/10">
                  <input
                    type="text"
                    value={customTeamName}
                    onChange={(e) => setCustomTeamName(e.target.value)}
                    placeholder="Enter Team Name (e.g. Titans)"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">Badge:</span>
                    <div className="flex gap-1 overflow-x-auto">
                      {CUSTOM_BADGES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setCustomBadge(b)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition ${
                            customBadge === b ? 'border-amber-400 bg-amber-500/20' : 'border-white/5 bg-slate-800'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'JOINING...' : 'ENTER AUCTION LOBBY'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* 2. CREATE ROOM FORM (ADMIN) */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Auctioneer Host Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Auctioneer Bala"
                required
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Room Code (Share with Franchises)
              </label>
              <input
                type="text"
                value={customRoomCode}
                onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. IPL924"
                maxLength={6}
                required
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-lg font-mono font-bold text-purple-400 placeholder-slate-600 focus:outline-none focus:border-purple-400 transition tracking-widest uppercase text-center"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Starting Purse */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Starting Purse
                </label>
                <select
                  value={startingPurse}
                  onChange={(e) => setStartingPurse(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-400"
                >
                  <option value={8000}>₹80 Cr</option>
                  <option value={5000}>₹50 Cr (Default)</option>
                  <option value={10000}>₹100 Cr</option>
                  <option value={12000}>₹120 Cr</option>
                  <option value={15000}>₹150 Cr</option>
                </select>
              </div>

              {/* Max Squad Size */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Max Squad
                </label>
                <select
                  value={isCustomMaxSquad ? 'custom' : maxSquadSize}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomMaxSquad(true);
                      return;
                    }
                    setIsCustomMaxSquad(false);
                    setMaxSquadSize(Number(e.target.value));
                  }}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-400"
                >
                  <option value={18}>18 Players</option>
                  <option value={20}>20 Players</option>
                  <option value={35}>35 Players (Default)</option>
                  <option value="custom">Customize Squad</option>
                </select>
                {isCustomMaxSquad && (
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={maxSquadSize}
                    onChange={(e) => setMaxSquadSize(Math.max(1, Math.min(Number(e.target.value) || 1, 100)))}
                    aria-label="Custom maximum squad size"
                    className="w-full mt-2 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-400"
                  />
                )}
              </div>

              {/* Bid Timer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Bid Timer
                </label>
                <select
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-400"
                >
                  <option value={10}>10 Seconds</option>
                  <option value={4}>4 Seconds (Default)</option>
                  <option value={8}>8 Seconds</option>
                  <option value={20}>20 Seconds</option>
                  <option value={30}>30 Seconds</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition transform active:scale-95 disabled:opacity-50"
            >
              <Shield className="w-5 h-5" />
              <span>{isSubmitting ? 'CREATING...' : 'CREATE ROOM & BECOME AUCTIONEER'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-2xl mx-auto w-full text-center text-xs text-slate-500 mt-8">
        IPL Mock Auction • Real-Time Synchronized Bidding Engine • Socket.io Enabled
      </div>
    </div>
  );
}
