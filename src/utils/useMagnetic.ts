import { useRef, useState, useEffect, useCallback, MouseEvent } from 'react';

/**
 * Hook for subtle magnetic micro-interactions on buttons, links, and badges.
 * Moves the element slightly toward the cursor with silky easing.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 0.28, maxDist = 8) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;

      // Clamp distance
      const clampedX = Math.max(-maxDist, Math.min(maxDist, distX));
      const clampedY = Math.max(-maxDist, Math.min(maxDist, distY));

      setOffset({ x: clampedX, y: clampedY });
      setIsHovered(true);
    },
    [strength, maxDist]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const magneticStyle = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: isHovered ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
  };

  return {
    ref,
    magneticProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      style: magneticStyle,
    },
    isHovered,
  };
}
