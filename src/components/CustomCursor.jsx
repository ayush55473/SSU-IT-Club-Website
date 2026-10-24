import React, { useEffect, useState } from 'react';

/**
 * CustomCursor — A subtle, lightweight cursor interaction for desktop.
 * - Follows mouse smoothly with a dot and golden orbital ring.
 * - Scales slightly when hovering over interactive elements (buttons, links, cards).
 * - Automatically hidden on touch devices (phones/tablets) and when reduced motion is requested.
 */
export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if device has fine pointer (mouse) and does not prefer reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Track hovered interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('.interactive-hover') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth trailing animation frame for the outer ring
    let animationFrameId;
    const animateTrailing = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(animateTrailing);
    };
    animationFrameId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer subtle golden ring */}
      <div
        className="fixed rounded-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x - (isHovering ? 24 : 16)}px, ${trailingPos.y - (isHovering ? 24 : 16)}px, 0) scale(${isHovering ? 1.3 : 1})`,
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          border: '1.5px solid rgba(174, 123, 41, 0.65)',
          backgroundColor: isHovering ? 'rgba(174, 123, 41, 0.08)' : 'transparent',
          boxShadow: isHovering ? '0 0 15px rgba(174, 123, 41, 0.3)' : 'none',
        }}
      />
      {/* Center pinpoint dark brown dot */}
      <div
        className="fixed rounded-full"
        style={{
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          width: '6px',
          height: '6px',
          backgroundColor: '#672C1C',
        }}
      />
    </div>
  );
}
