import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function InteractiveShell({ children }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0, visible: false });
  const [magnetic, setMagnetic] = useState(false);
  const cursorX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.35 });
  const cursorY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.35 });
  const tiltX = useSpring(0, { stiffness: 90, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 90, damping: 18 });

  const updatePointer = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    setPointer({ x, y, visible: true });
    cursorX.set(0);
    cursorY.set(0);
    tiltX.set((y / window.innerHeight - 0.5) * -1.4);
    tiltY.set((x / window.innerWidth - 0.5) * 1.4);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      setPointer({ x, y, visible: true });
      cursorX.set(0);
      cursorY.set(0);
    };
    const handlePointerOver = (event) => {
      setMagnetic(Boolean(event.target.closest('button, a, select, input, [role="button"]')));
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
    };
  }, [cursorX, cursorY, tiltX, tiltY]);

  return (
    <div className="interactive-shell" onPointerMove={updatePointer}>
      <motion.div
        className={`auction-cursor ${pointer.visible ? 'is-visible' : ''}`}
        style={{ left: pointer.x - 9, top: pointer.y - 9, opacity: pointer.visible ? 1 : 0, scale: magnetic ? 1.8 : 1 }}
      />
      <motion.div
        className="auction-content"
        style={{ rotateX: tiltX, rotateY: tiltY }}
      >
        {children}
      </motion.div>
    </div>
  );
}
