import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUB_INFO } from '../data/clubInfo';

/**
 * IntroAnimation — Cinematic University & IT Club Launch Sequence
 * 
 * Refined Sequence & Timing:
 * 1. University Logo Appears (0.0s – 1.6s): Fades in & scales up in the center.
 * 2. University Logo Moves Left (1.6s – 2.6s): Smoothly glides leftward to make room.
 * 3. IT Club Logo Appears (2.6s – 3.8s): Fades in beside it with a distinct, balanced gap (no overlapping!).
 * 4. Tagline Appears (3.8s – 5.6s): "Where Ideas Meet Innovation" glides up beneath both logos.
 * 5. Logos Move to Header (5.6s – 6.85s): Both logos fluidly float to top-left and top-right header positions.
 * 6. Landing Page Reveals (6.85s – 7.3s): Seamless hand-off with zero layout shifts or duplicate logos.
 */
export function IntroAnimation({ onComplete, universityLogo, itClubLogo }) {
  // Stages: 1 = Univ In, 2 = Univ Left, 3 = Club In, 4 = Tagline In, 5 = Fly to Header, 6 = Done
  const [stage, setStage] = useState(1);
  const [targetPositions, setTargetPositions] = useState(null);

  // Dynamic width measurements to prevent ANY logo overlapping regardless of aspect ratio
  const [univCardWidth, setUnivCardWidth] = useState(180);
  const [clubCardWidth, setClubCardWidth] = useState(180);

  const univContainerRef = useRef(null);
  const clubContainerRef = useRef(null);

  useEffect(() => {
    // Respect reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Lock page scroll during the intro animation
    document.body.style.overflow = 'hidden';

    // Measure initial card widths if available
    if (univContainerRef.current) {
      const w = univContainerRef.current.getBoundingClientRect().width;
      if (w > 50) setUnivCardWidth(w);
    }
    if (clubContainerRef.current) {
      const w = clubContainerRef.current.getBoundingClientRect().width;
      if (w > 50) setClubCardWidth(w);
    }

    // Refined, longer & more elegant timeline schedule
    const timer1 = setTimeout(() => setStage(2), 1600); // 1.6s: Univ moves left smoothly
    const timer2 = setTimeout(() => setStage(3), 2600); // 2.6s: IT Club joins beside it
    const timer3 = setTimeout(() => setStage(4), 3800); // 3.8s: Tagline appears beneath them
    
    // 5.6s: Measure exact header logo coordinates for flight transition
    const timer4 = setTimeout(() => {
      const univElem = document.getElementById('nav-university-logo');
      const clubElem = document.getElementById('nav-club-logo');

      if (univElem && clubElem) {
        const univRect = univElem.getBoundingClientRect();
        const clubRect = clubElem.getBoundingClientRect();
        setTargetPositions({
          univ: {
            x: univRect.left + univRect.width / 2,
            y: univRect.top + univRect.height / 2,
            height: univRect.height || 44,
          },
          club: {
            x: clubRect.left + clubRect.width / 2,
            y: clubRect.top + clubRect.height / 2,
            height: clubRect.height || 44,
          },
        });
      }
      setStage(5); // Start fluid flight toward header
    }, 5600);

    // 6.85s: Finish flight, hand off smoothly to main navbar, reveal full page
    const timer5 = setTimeout(() => {
      setStage(6);
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, 450);
    }, 6850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  // Responsive sizing & gap calculations
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
  
  // Height of logos during the centered intro stage
  const centerLogoHeight = isMobile ? 44 : isTablet ? 52 : 58;
  
  // Guaranteed visual gap between logos (inner edge to inner edge)
  const desiredGap = isMobile ? 36 : 64;

  // Mathematically calculated center offsets:
  // Offset ensures that: left logo right edge is at (-desiredGap / 2)
  // and right logo left edge is at (+desiredGap / 2).
  // Overlap is IMPOSSIBLE by geometric definition!
  const centerOffsetUniv = (univCardWidth / 2) + (desiredGap / 2);
  const centerOffsetClub = (clubCardWidth / 2) + (desiredGap / 2);

  // Calculate flight transition delta values to header coordinates
  const getUnivFlightTransform = () => {
    if (stage < 5 || !targetPositions) return { x: 0, y: 0, scale: 1 };
    const currentX = window.innerWidth / 2 - centerOffsetUniv;
    const currentY = window.innerHeight / 2 - 20;
    return {
      x: targetPositions.univ.x - currentX,
      y: targetPositions.univ.y - currentY,
      scale: (targetPositions.univ.height / centerLogoHeight) || 0.65,
    };
  };

  const getClubFlightTransform = () => {
    if (stage < 5 || !targetPositions) return { x: 0, y: 0, scale: 1 };
    const currentX = window.innerWidth / 2 + centerOffsetClub;
    const currentY = window.innerHeight / 2 - 20;
    return {
      x: targetPositions.club.x - currentX,
      y: targetPositions.club.y - currentY,
      scale: (targetPositions.club.height / centerLogoHeight) || 0.65,
    };
  };

  const univFlight = getUnivFlightTransform();
  const clubFlight = getClubFlightTransform();

  return (
    <AnimatePresence>
      {stage <= 5 && (
        <motion.div
          key="intro-backdrop"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden pointer-events-auto select-none"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Subtle architectural drafting grid background pattern */}
          <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />

          {/* Warm ambient aura in center */}
          <div 
            className="absolute w-[540px] h-[540px] rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(174,123,41,0.35) 0%, rgba(103,44,28,0.15) 50%, transparent 75%)',
            }}
          />

          {/* Skip Intro Button in top right corner */}
          <button
            type="button"
            onClick={() => {
              document.body.style.overflow = '';
              onComplete();
            }}
            className="absolute top-5 right-6 z-50 text-[11px] font-bold uppercase tracking-widest text-[#66534B] hover:text-[#672C1C] bg-[#FAF6F4] hover:bg-[#FCF9F3] border border-[#AE7B29]/30 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
          >
            Skip Intro ➔
          </button>

          {/* Central Animated Choreography Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* Logos Row Container */}
            <div className="relative flex items-center justify-center w-full h-32 sm:h-36">
              
              {/* ============================================================= */}
              {/* 1. UNIVERSITY LOGO (Left side of center) */}
              {/* ============================================================= */}
              <motion.div
                ref={univContainerRef}
                className="absolute flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.82, x: 0, y: -20 }}
                animate={{
                  opacity: stage >= 1 ? 1 : 0,
                  // Stage 1: center (x=0). Stage 2+: shift left. Stage 5: fly to header!
                  x: stage < 2 
                    ? 0 
                    : stage < 5 
                      ? -centerOffsetUniv 
                      : -centerOffsetUniv + univFlight.x,
                  y: stage < 5 ? -20 : -20 + univFlight.y,
                  scale: stage < 5 ? 1 : univFlight.scale,
                }}
                transition={{
                  duration: stage === 5 ? 1.25 : 0.85,
                  ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier
                }}
              >
                <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xs border border-[rgba(103,44,28,0.08)]">
                  <img
                    src={universityLogo}
                    alt={CLUB_INFO.logos.university.alt}
                    style={{ height: `${centerLogoHeight}px` }}
                    className="w-auto max-w-[200px] sm:max-w-[260px] object-contain block"
                    onLoad={(e) => {
                      if (e.target) {
                        const measured = e.target.getBoundingClientRect().width + 20;
                        if (measured > 60) setUnivCardWidth(measured);
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Decorative Center Hairline Divider (Appears between both logos) */}
              <motion.div
                className="absolute w-px bg-gradient-to-b from-transparent via-[#AE7B29]/50 to-transparent"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: stage >= 3 && stage < 5 ? 1 : 0,
                  height: stage >= 3 && stage < 5 ? (isMobile ? 36 : 48) : 0,
                  y: -20,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {/* ============================================================= */}
              {/* 2. IT CLUB LOGO (Right side of center) */}
              {/* ============================================================= */}
              <motion.div
                ref={clubContainerRef}
                className="absolute flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.82, x: centerOffsetClub, y: -20 }}
                animate={{
                  opacity: stage >= 3 ? 1 : 0,
                  x: stage < 5 
                    ? centerOffsetClub 
                    : centerOffsetClub + clubFlight.x,
                  y: stage < 5 ? -20 : -20 + clubFlight.y,
                  scale: stage < 3 ? 0.82 : stage < 5 ? 1 : clubFlight.scale,
                }}
                transition={{
                  duration: stage === 5 ? 1.25 : 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xs border border-[rgba(103,44,28,0.08)]">
                  <img
                    src={itClubLogo}
                    alt={CLUB_INFO.logos.club.alt}
                    style={{ height: `${centerLogoHeight}px` }}
                    className="w-auto max-w-[200px] sm:max-w-[260px] object-contain block"
                    onLoad={(e) => {
                      if (e.target) {
                        const measured = e.target.getBoundingClientRect().width + 20;
                        if (measured > 60) setClubCardWidth(measured);
                      }
                    }}
                  />
                </div>
              </motion.div>

            </div>

            {/* ============================================================= */}
            {/* 3. TAGLINE (Beneath both logos) */}
            {/* ============================================================= */}
            <div className="h-20 flex items-center justify-center mt-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: stage >= 4 && stage < 5 ? 1 : 0,
                  y: stage >= 4 && stage < 5 ? 0 : stage >= 5 ? -14 : 20,
                }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center px-4"
              >
                {/* Official Tagline */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#672C1C] tracking-tight">
                  Where Ideas Meet{' '}
                  <span className="text-gold-gradient italic">Innovation.</span>
                </h2>

                {/* Golden Accent Brush Line */}
                <motion.div
                  className="w-28 sm:w-36 h-0.5 bg-gradient-to-r from-transparent via-[#AE7B29] to-transparent mt-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: stage >= 4 && stage < 5 ? (isMobile ? 100 : 140) : 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />

                {/* Subtext */}
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#AE7B29] font-bold mt-2">
                  University IT Club
                </span>
              </motion.div>
            </div>

          </div>

          {/* Bottom Academic Year Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage < 5 ? 0.7 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 text-[10px] tracking-widest uppercase font-semibold text-[#66534B]"
          >
            Academic Session 2026 – 2027 • Official Platform
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
