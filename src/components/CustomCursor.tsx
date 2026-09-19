import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const mouse = { x: -100, y: -100 };
    const trailing = { x: -100, y: -100 };
    let isClicking = false;
    let isHovered = false;
    let currentText = '';
    let isVisible = false;
    let animId = 0;
    let isLoopRunning = false;

    const render = () => {
      const dx = mouse.x - trailing.x;
      const dy = mouse.y - trailing.y;
      trailing.x += dx * 0.35;
      trailing.y += dy * 0.35;

      if (ringRef.current) {
        const scale = isClicking ? 'scale(0.85)' : isHovered && !currentText ? 'scale(1.2)' : 'scale(1)';
        ringRef.current.style.transform = `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%) ${scale}`;
      }

      // If close to target, stop loop to save CPU/GPU cycles
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animId = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
        animId = 0;
      }
    };

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        if (containerRef.current) {
          containerRef.current.style.opacity = '1';
        }
      }

      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${
          isClicking ? '0.5' : isHovered ? '0' : '1'
        })`;
      }

      startLoop();

      // Check hovered elements
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const customCursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      let newText = '';
      let newHovered = false;

      if (customCursorEl) {
        newText = customCursorEl.getAttribute('data-cursor') || '';
        newHovered = true;
      } else if (target.closest('canvas')) {
        newText = 'ROTATE 3D';
        newHovered = true;
      } else if (target.closest('img')) {
        newText = 'VIEW';
        newHovered = true;
      } else if (target.closest('button, a, input, select, [role="button"]')) {
        newText = '';
        newHovered = true;
      }

      if (newText !== currentText) {
        currentText = newText;
        if (textRef.current) {
          textRef.current.textContent = newText;
          textRef.current.style.display = newText ? 'inline' : 'none';
        }
      }

      if (newHovered !== isHovered) {
        isHovered = newHovered;
        if (ringRef.current) {
          if (currentText) {
            ringRef.current.className =
              'fixed top-0 left-0 rounded-full border border-[#c53030]/80 bg-[#c53030]/30 text-[#f4f4f0] shadow-lg shadow-[#c53030]/25 px-3 py-1 flex items-center justify-center will-change-transform transition-colors duration-150';
          } else if (isHovered) {
            ringRef.current.className =
              'fixed top-0 left-0 rounded-full border border-[#f4f4f0]/70 bg-[#f4f4f0]/10 w-11 h-11 flex items-center justify-center will-change-transform transition-all duration-150';
          } else {
            ringRef.current.className =
              'fixed top-0 left-0 rounded-full border border-[#f4f4f0]/30 bg-transparent w-7 h-7 flex items-center justify-center will-change-transform transition-all duration-150';
          }
        }
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      startLoop();
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(0.5)`;
      }
    };

    const handleMouseUp = () => {
      isClicking = false;
      startLoop();
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${
          isHovered ? '0' : '1'
        })`;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-0 transition-opacity duration-200"
    >
      {/* Crisp point dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#f4f4f0] will-change-transform pointer-events-none"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Trailing ring / pill */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-[#f4f4f0]/30 bg-transparent flex items-center justify-center will-change-transform pointer-events-none"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <span
          ref={textRef}
          className="text-[9px] tracking-[0.22em] font-mono font-medium uppercase text-[#f4f4f0] whitespace-nowrap hidden"
        />
      </div>
    </div>
  );
}
