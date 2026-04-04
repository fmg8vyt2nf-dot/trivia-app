import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PARTICLE_COUNT = 50;
const DEFAULT_COLORS = [
  { r: 255, g: 107, b: 53, a: 0.3 },   // orange
  { r: 14, g: 165, b: 233, a: 0.25 },   // blue
];
const LINE_DISTANCE = 120;
const LINE_OPACITY = 0.04;

function createParticle(width, height, colors) {
  const color = colors[Math.random() > 0.5 ? 0 : 1];
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    speedY: -(Math.random() * 0.3 + 0.1),
    speedX: (Math.random() - 0.5) * 0.2,
    wobbleSpeed: Math.random() * 0.02 + 0.01,
    wobbleAmp: Math.random() * 15 + 5,
    phase: Math.random() * Math.PI * 2,
    color,
  };
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { activeTheme } = useTheme();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const colors = activeTheme?.particleColors?.length === 2
      ? activeTheme.particleColors
      : DEFAULT_COLORS;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height, colors));

    if (prefersReducedMotion) {
      // Draw static dots once
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a * 0.5})`;
        ctx.fill();
      });
      return;
    }

    let time = 0;

    function animate() {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.phase) * 0.3;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DISTANCE) {
            const opacity = LINE_OPACITY * (1 - dist / LINE_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
