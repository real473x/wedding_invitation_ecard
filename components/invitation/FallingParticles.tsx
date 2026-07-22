'use client';
import { useEffect, useState } from 'react';
import styles from './FallingParticles.module.css';

export default function FallingParticles({ color }: { color?: string }) {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; dur: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      dur: 6 + Math.random() * 6,
      size: 4 + Math.random() * 8,
    })));
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            width: p.size,
            height: p.size,
            backgroundColor: color || 'var(--particle-color)',
          }}
        />
      ))}
    </div>
  );
}
