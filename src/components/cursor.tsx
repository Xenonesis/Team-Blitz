'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, MotionValue, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Create motion values
  const mouseX: MotionValue<number> = useMotionValue(0);
  const mouseY: MotionValue<number> = useMotionValue(0);

  // Smooth cursor motion
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Glowing outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 blur-2xl opacity-40 mix-blend-lighten"
        style={{
          x: cursorX,
          y: cursorY,
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          opacity: hidden ? 0 : 1,
          scale: clicked ? 1.2 : 1,
        }}
      />

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-white bg-black mix-blend-difference shadow-lg"
        style={{
          x: cursorX,
          y: cursorY,
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          opacity: hidden ? 0 : 1,
          scale: clicked ? 1.6 : 1,
        }}
      />
    </>
  );
}
