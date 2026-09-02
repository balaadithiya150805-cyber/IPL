import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFX } from '../utils/audio';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    soundFX.setMuted(isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playGavel = () => soundFX.playGavel();
  const playBidPing = () => soundFX.playBidPing();
  const playCountdownTick = (urgent) => soundFX.playCountdownTick(urgent);
  const playSoldFanfare = () => soundFX.playSoldFanfare();
  const playUnsoldBuzzer = () => soundFX.playUnsoldBuzzer();

  return (
    <SoundContext.Provider value={{
      isMuted,
      toggleMute,
      playGavel,
      playBidPing,
      playCountdownTick,
      playSoldFanfare,
      playUnsoldBuzzer
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
