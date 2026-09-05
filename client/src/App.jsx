import React, { lazy, Suspense } from 'react';
import { SoundProvider } from './context/SoundContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import ToastContainer from './components/ToastContainer';
import InteractiveShell from './components/InteractiveShell';

const AuctionArena = lazy(() => import('./pages/AuctionArena'));

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
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <AuctionArena />
    </Suspense>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <SocketProvider>
        <div className="min-h-screen bg-transparent text-slate-100 selection:bg-amber-500 selection:text-black">
          <InteractiveShell>
            <MainRouter />
            <ToastContainer />
          </InteractiveShell>
        </div>
      </SocketProvider>
    </SoundProvider>
  );
}
