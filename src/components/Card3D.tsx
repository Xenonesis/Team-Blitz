"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { AnimatedElement } from "@/utils/animations";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glareOpacity?: number;
  shadow?: boolean;
  delay?: number;
}

export default function Card3D({
  children,
  className = "",
  intensity = 15,
  glareOpacity = 0.15,
  shadow = true,
  delay = 0,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (inverted for natural feel)
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity * -1;
    const rotateXValue = (mouseY / (rect.height / 2)) * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    
    // Calculate glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Reset rotation when component unmounts or window resizes
  useEffect(() => {
    const handleResize = () => {
      setRotateX(0);
      setRotateY(0);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AnimatedElement animation="fade-in" delay={delay}>
      <div
        ref={cardRef}
        className={`relative transform-gpu transition-transform duration-200 ${className}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          boxShadow: shadow && isHovered ? `0 20px 40px rgba(0, 0, 0, 0.3)` : undefined,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        
        {/* Glare effect */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0) 60%)`,
              borderRadius: "inherit",
            }}
          />
        )}
      </div>
    </AnimatedElement>
  );
}
