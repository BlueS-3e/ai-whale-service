"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * AI in Space - Animated Background
 * Combines cosmic elements with AI/neural network aesthetics
 * Features: Nebula clouds, neural network connections, data streams, pulsars
 */
export function AISpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Adaptive counts based on device
    const particleCount = isMobile ? 25 : 50;
    const starCount = isMobile ? 100 : 200;
    const streamCount = isMobile ? 8 : 15;

    // Particle system for neural network nodes
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      pulsePhase: number;
      connections: number[];
    }[] = [];

    // Create particles in a network pattern
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      });
    }

    // Stars background
    const stars: { x: number; y: number; size: number; twinkleSpeed: number; phase: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Data stream particles (like flowing code)
    const dataStreams: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];
    for (let i = 0; i < streamCount; i++) {
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 100 + 50,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.005;
      
      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; // Deep space blue-black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cosmic gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#030014'); // Deep space purple
      gradient.addColorStop(0.5, '#0a0a1f'); // Cosmic blue
      gradient.addColorStop(1, '#1a0b2e'); // Nebula purple
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds (blended)
      ctx.globalCompositeOperation = 'screen';
      
      // Nebula cloud 1 - Purple
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.5
      );
      gradient1.addColorStop(0, 'rgba(147, 51, 234, 0.15)'); // Purple
      gradient1.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)'); // Blue
      gradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula cloud 2 - Cyan/Pink
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.8, 0,
        canvas.width * 0.7, canvas.height * 0.8, canvas.width * 0.6
      );
      gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.12)'); // Cyan
      gradient2.addColorStop(0.4, 'rgba(236, 72, 153, 0.08)'); // Pink
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling
      ctx.globalCompositeOperation = 'screen';
      stars.forEach(star => {
        const twinkle = Math.sin(time * 10 + star.phase) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw neural network connections
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'; // Light blue
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = 0.15 * (1 - distance / 150);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw neural network nodes (AI "brains")
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx + Math.sin(time + i) * 0.1;
        particle.y += particle.vy + Math.cos(time + i) * 0.1;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulsing effect
        const pulse = Math.sin(time * 3 + particle.pulsePhase) * 0.3 + 0.7;
        
        // Glow effect
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15 * pulse;
        
        // Draw node
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulse * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw data streams (like flowing code/binary)
      ctx.globalCompositeOperation = 'screen';
      dataStreams.forEach(stream => {
        stream.x += stream.speed;
        
        if (stream.x > canvas.width + stream.length) {
          stream.x = -stream.length;
          stream.y = Math.random() * canvas.height;
        }

        // Create gradient for stream
        const gradient = ctx.createLinearGradient(
          stream.x - stream.length, stream.y,
          stream.x, stream.y
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, `rgba(6, 182, 212, ${stream.opacity})`); // Cyan
        gradient.addColorStop(0.7, `rgba(139, 92, 246, ${stream.opacity})`); // Purple
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        
        // Draw wavy line
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
          const t = i / 19;
          const x = stream.x - stream.length * (1 - t);
          const y = stream.y + Math.sin(time * 5 + x * 0.01) * 5;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw small dots (like data packets)
        ctx.fillStyle = `rgba(255, 255, 255, ${stream.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(stream.x, stream.y + Math.sin(time * 5 + stream.x * 0.01) * 5, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Occasional shooting star/comet
      if (Math.random() < 0.005) {
        const startX = Math.random() * canvas.width * 0.3;
        const startY = Math.random() * canvas.height * 0.3;
        
        ctx.globalCompositeOperation = 'screen';
        const gradient = ctx.createLinearGradient(
          startX, startY,
          startX + 150, startY + 150
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.5)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + 150, startY + 150);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <>
      {/* Canvas for dynamic effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: '#030014' }}
      />
      
      {/* CSS overlay for additional texture */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(2, 6, 23, 0.7) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Grid overlay (subtle) */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    </>
  );
}

/**
 * Static fallback for performance or older browsers
 */
export function AISpaceBackgroundStatic() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient - deep space */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0a0a1f] to-[#1a0b2e]" />
      
      {/* Nebula clouds - CSS version */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full opacity-20 animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
        }}
      />
      
      <div 
        className="absolute w-[900px] h-[900px] rounded-full opacity-15 animate-float-medium"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-5%',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
          animationDelay: '2s',
        }}
      />
      
      <div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 animate-float-fast"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
          top: '30%',
          right: '20%',
          filter: 'blur(70px)',
          mixBlendMode: 'screen',
          animationDelay: '4s',
        }}
      />
      
      {/* Stars (static) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(2px 2px at 10px 10px, white, rgba(0,0,0,0))',
          backgroundSize: '100px 100px',
          opacity: 0.3
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}
