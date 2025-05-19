"use client";

import { useEffect, useState, useRef, ReactNode } from "react";

// Intersection Observer hook for scroll animations
export function useIntersectionObserver(
  options = { threshold: 0.1, triggerOnce: true }
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold,
        rootMargin: "0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return { ref, isVisible };
}

// Animated element component
export function AnimatedElement({
  children,
  animation = "fade-in",
  delay = 0,
  duration = 1000,
  threshold = 0.1,
  className = "",
}: {
  children: ReactNode;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-left" 
    | "slide-right" 
    | "zoom-in" 
    | "bounce";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
  });

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return "opacity-0";
      case "slide-up":
        return "opacity-0 translate-y-10";
      case "slide-left":
        return "opacity-0 -translate-x-10";
      case "slide-right":
        return "opacity-0 translate-x-10";
      case "zoom-in":
        return "opacity-0 scale-95";
      case "bounce":
        return "opacity-0";
      default:
        return "opacity-0";
    }
  };

  const getAnimationStyle = () => {
    if (!isVisible) return {};

    const baseStyle = {
      opacity: 1,
      transform: "translate(0, 0) scale(1)",
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    };

    if (animation === "bounce" && isVisible) {
      return {
        ...baseStyle,
        animation: `bounce 1s ${delay}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };
    }

    return baseStyle;
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClass()}`}
      style={getAnimationStyle()}
    >
      {children}
    </div>
  );
}

// Scroll progress indicator
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
}

// Particle background component
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        if (!canvas) throw new Error('Canvas is not initialized');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, 255, ${Math.random() * 0.3 + 0.1})`;
      }
      
      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    const particles: Particle[] = [];
    
    try {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    } catch (error) {
      console.error('Failed to initialize particles:', error);
      return;
    }
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
