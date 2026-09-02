import React from 'react';
import { SoundProvider } from './context/SoundContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import AuctionArena from './pages/AuctionArena';
import ToastContainer from './components/ToastContainer';
import InteractiveShell from './components/InteractiveShell';

function MainRouter() {
  const { roomState } = useSocket();

  // 1. If not in a room, show Home Page (Create / Join)
  if (!roomState) {
    return <HomePage />;
  }

  // 2. If room is in lobby mode, show Lobby Waiting Room
  if (roomState.status === 'lobby') {
    return <LobbyPage />;
  }

  // 3. If room is active, paused, or completed, show Live Auction Arena
  return <AuctionArena />;
}

export default function App() {
  return (
    <SoundProvider>
      <SocketProvider>
        <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-amber-500 selection:text-black">
          <InteractiveShell>
            <MainRouter />
            <ToastContainer />
          </InteractiveShell>
        </div>
      </SocketProvider>
    </SoundProvider>
  );
}
