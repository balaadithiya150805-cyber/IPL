import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import { Shield, Play, SkipForward, CheckCircle2, XCircle, Pause, RotateCcw, UserPlus, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function AuctioneerControls() {
  const { 
    roomState, 
    startAuction, 
    nextPlayer, 
    sellPlayer, 
    unsoldPlayer, 
    togglePause, 
    resetPlayerBids,
    addCustomPlayer,
    addToast
  } = useSocket();

  const [loadingAction, setLoadingAction] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  // Add Custom Player Form State
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    role: 'Batter',
    nationality: 'India',
    isOverseas: false,
    basePrice: 100, // 100 Lakhs = 1 Cr
    imageURL: '',
    matches: 0,
    runs: 0,
    strikeRate: 0,
    wickets: 0,
    economy: 0,
    specialty: ''
  });

  const status = roomState?.status || 'lobby';
  const currentActivePlayer = roomState?.currentActivePlayer;
  const currentBid = roomState?.currentBid || 0;
  const highestBidder = roomState?.highestBidder;
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';

  const handleAction = async (actionName, fn) => {
    setLoadingAction(actionName);
    try {
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayer.name.trim()) {
      addToast('Player name is required', 'error');
      return;
    }

    setLoadingAction('addPlayer');
    try {
      const res = await addCustomPlayer(newPlayer);
      if (res?.success || !res?.error) {
        // Reset form
        setNewPlayer({
          name: '',
          role: 'Batter',
          nationality: 'India',
          isOverseas: false,
          basePrice: 100,
          imageURL: '',
          matches: 0,
          runs: 0,
          strikeRate: 0,
          wickets: 0,
          economy: 0,
          specialty: ''
        });
        setShowAddPlayer(false);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const updateNewPlayer = (field, value) => {
    setNewPlayer(prev => ({ ...prev, [field]: value }));
  };

  const ROLES = ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];
  const NATIONALITIES = ['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka', 'Pakistan', 'Bangladesh', 'Afghanistan', 'Other'];
  const BASE_PRICE_OPTIONS = [
    { label: '₹20L', value: 20 },
    { label: '₹50L', value: 50 },
    { label: '₹1 Cr', value: 100 },
    { label: '₹1.5 Cr', value: 150 },
    { label: '₹2 Cr', value: 200 },
  ];

  return (
    <div className="glass-panel-glow rounded-2xl p-4 sm:p-6 border border-purple-500/40 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">Auctioneer Command Console</h3>
            <p className="text-[11px] text-purple-300">Official host controls for room flow</p>
          </div>
        </div>

        {/* Live Queue Counter */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-400">Queue:</span>
          <span className="font-bold text-white font-mono">{roomState?.remainingPlayersCount || 0} left</span>
        </div>
      </div>

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. START / NEXT PLAYER */}
        {status === 'lobby' ? (
          <button
            onClick={() => handleAction('start', startAuction)}
            disabled={loadingAction !== null}
            className="col-span-2 sm:col-span-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>START AUCTION</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction('next', nextPlayer)}
            disabled={loadingAction !== null || (currentActivePlayer && !isCompleted)}
            className={`py-3 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
              currentActivePlayer
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
            }`}
            title={currentActivePlayer ? 'Sell or Unsold the current player first' : 'Bring next player from queue'}
          >
            <SkipForward className="w-4 h-4" />
            <span>NEXT PLAYER</span>
          </button>
        )}

        {/* 2. SOLD (Hammer Strike) */}
        <button
          onClick={() => handleAction('sold', sellPlayer)}
          disabled={loadingAction !== null || !currentActivePlayer || currentBid === 0 || !highestBidder}
          className={`py-3 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
            !currentActivePlayer || currentBid === 0 || !highestBidder
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-500/30 active:scale-95 pulse-gold'
          }`}
          title={!highestBidder ? 'Waiting for bids to sell' : `Sell to ${highestBidder?.teamName}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>SOLD 🔨</span>
        </button>

        {/* 3. UNSOLD */}
        <button
          onClick={() => handleAction('unsold', unsoldPlayer)}
          disabled={loadingAction !== null || !currentActivePlayer}
          className={`py-3 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
            !currentActivePlayer
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-rose-700 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/30 active:scale-95'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>UNSOLD ❌</span>
        </button>

        {/* 4. PAUSE / RESUME */}
        <button
          onClick={() => handleAction('pause', togglePause)}
          disabled={loadingAction !== null || status === 'lobby'}
          className={`py-3 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
            isPaused
              ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>
      </div>

      {/* Secondary Controls Bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-slate-400">
          <span>Sold: <b className="text-emerald-400 font-mono">{roomState?.soldCount || 0}</b></span>
          <span>Unsold: <b className="text-rose-400 font-mono">{roomState?.unsoldCount || 0}</b></span>
          {highestBidder && (
            <span className="text-amber-300">
              Highest: <b>{highestBidder.teamName}</b> ({formatLakhs(currentBid)})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentActivePlayer && currentBid > 0 && (
            <button
              onClick={() => handleAction('reset', resetPlayerBids)}
              disabled={loadingAction !== null}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition"
              title="Reset current player bids"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bids</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* ADD CUSTOM PLAYER - Toggle Button */}
      {/* ========================================= */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => setShowAddPlayer(!showAddPlayer)}
          className={`w-full py-2.5 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
            showAddPlayer
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>ADD CUSTOM PLAYER</span>
          {showAddPlayer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Add Player Form - Collapsible */}
        {showAddPlayer && (
          <form onSubmit={handleAddPlayer} className="mt-4 space-y-4 bg-slate-900/80 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-display font-bold text-purple-300 flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Add Player to Auction Queue
              </h4>
              <button type="button" onClick={() => setShowAddPlayer(false)} className="text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Row 1: Name + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Player Name *</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => updateNewPlayer('name', e.target.value)}
                  placeholder="e.g. Virat Kohli"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Role</label>
                <select
                  value={newPlayer.role}
                  onChange={(e) => updateNewPlayer('role', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Nationality + Base Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Nationality</label>
                <select
                  value={newPlayer.nationality}
                  onChange={(e) => {
                    const nat = e.target.value;
                    updateNewPlayer('nationality', nat);
                    updateNewPlayer('isOverseas', nat !== 'India');
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition"
                >
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Base Price</label>
                <div className="flex flex-wrap gap-1.5">
                  {BASE_PRICE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateNewPlayer('basePrice', opt.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        newPlayer.basePrice === opt.value
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-white/10 hover:border-amber-500/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Image URL + Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={newPlayer.imageURL}
                  onChange={(e) => updateNewPlayer('imageURL', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Specialty Tag</label>
                <input
                  type="text"
                  value={newPlayer.specialty}
                  onChange={(e) => updateNewPlayer('specialty', e.target.value)}
                  placeholder="e.g. Death Overs Expert"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition"
                />
              </div>
            </div>

            {/* Row 4: Stats Mini-Grid (optional) */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">Stats (optional)</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { key: 'matches', label: 'Mat' },
                  { key: 'runs', label: 'Runs' },
                  { key: 'strikeRate', label: 'SR' },
                  { key: 'wickets', label: 'Wkts' },
                  { key: 'economy', label: 'Econ' },
                ].map(stat => (
                  <div key={stat.key} className="text-center">
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">{stat.label}</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={newPlayer[stat.key]}
                      onChange={(e) => updateNewPlayer(stat.key, Number(e.target.value) || 0)}
                      className="w-full px-1.5 py-1.5 rounded-md bg-slate-800 border border-white/10 text-white text-xs text-center font-mono focus:border-purple-400 focus:outline-none transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingAction === 'addPlayer' || !newPlayer.name.trim()}
              className={`w-full py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
                !newPlayer.name.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-600/30 active:scale-95'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {loadingAction === 'addPlayer' ? 'Adding...' : `Add ${newPlayer.name || 'Player'} to Queue`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
