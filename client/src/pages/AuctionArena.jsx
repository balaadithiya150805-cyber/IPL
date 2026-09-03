import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatLakhs } from '../utils/formatters';
import Navbar from '../components/Navbar';
import PlayerCard from '../components/PlayerCard';
import BiddingControls from '../components/BiddingControls';
import AuctioneerControls from '../components/AuctioneerControls';
import ActivityFeed from '../components/ActivityFeed';
import SquadModal from '../components/SquadModal';
import Leaderboard from '../components/Leaderboard';
import SummaryModal from '../components/SummaryModal';
import SoldCelebration from '../components/SoldCelebration';
import AuctionScene from '../components/AuctionScene';
import ToastContainer from '../components/ToastContainer';
import { Users, Wallet, Trophy, Globe2, Sparkles, Flame } from 'lucide-react';

export default function AuctionArena() {
  const { roomState, userRole, myTeam, timerTick } = useSocket();

  const [isSquadOpen, setIsSquadOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState(null);

  if (!roomState) return null;

  const {
    currentActivePlayer,
    currentBid,
    highestBidder,
    status
  } = roomState;

  const isPaused = status === 'paused';

  const handleOpenTeamSquad = (team) => {
    setSelectedTeamForSquad(team);
    setIsSquadOpen(true);
  };

  const handleOpenMySquad = () => {
    setSelectedTeamForSquad(myTeam);
    setIsSquadOpen(true);
  };

  return (
    <div className="auction-arena min-h-screen flex flex-col text-slate-100 pb-10">
      <AuctionScene hasBid={Boolean(currentBid)} player={currentActivePlayer} />
      {/* Top Navbar */}
      <Navbar
        onOpenSquad={handleOpenMySquad}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      {/* Main Auction Floor */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Center/Left Stage (8 Cols): Player Spotlight + Controls */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Player Card */}
            <PlayerCard
              player={currentActivePlayer}
              currentBid={currentBid}
              highestBidder={highestBidder}
              timer={timerTick}
              isPaused={isPaused}
            />

            {/* Controls Section */}
            {userRole === 'admin' ? (
              <AuctioneerControls />
            ) : (
              <BiddingControls isPaused={isPaused} />
            )}
          </div>

          {/* Right Stage (4 Cols): Live Feed & Franchise Overview */}
          <div className="lg:col-span-4 space-y-6">
            {/* My Franchise Quick Pill (if team) */}
            {myTeam && (
              <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{myTeam.logoBadge || '🏏'}</span>
                    <span className="font-bold text-sm text-white">{myTeam.teamName}</span>
                  </div>
                  <button
                    onClick={handleOpenMySquad}
                    className="text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    View Roster
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Purse Left</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {formatLakhs(myTeam.remainingPurse)}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                      <span>Squad Size</span>
                      {(myTeam.playersBought?.length || 0) >= (roomState.settings?.minSquadSize || 7) && (
                        <span className="text-emerald-400 text-[9px] font-bold">MIN MET ✓</span>
                      )}
                    </span>
                    <span className="font-mono font-black text-white text-sm">
                      {myTeam.playersBought?.length || 0} <span className="text-xs text-slate-400 font-normal">/ {roomState.settings?.maxSquadSize || 25}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Bidding & Banter Stream */}
            <ActivityFeed />
          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <SquadModal
        isOpen={isSquadOpen}
        onClose={() => setIsSquadOpen(false)}
        targetTeam={selectedTeamForSquad}
      />

      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        onSelectTeam={handleOpenTeamSquad}
      />

      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />

      <SoldCelebration />
      <ToastContainer />
    </div>
  );
}
