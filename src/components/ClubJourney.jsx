import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Compass, 
  Lightbulb, 
  Code2, 
  Rocket, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  MousePointer2
} from 'lucide-react';

// Official SVG event/activity illustrations
import techWorkshopImg from '../assets/events/tech-workshop.svg';
import codingWorkshopImg from '../assets/events/coding-workshop.svg';
import creativityShowcaseImg from '../assets/events/creativity-showcase.svg';
import interCollegeQuizImg from '../assets/events/inter-college-quiz.svg';

const PATH_D = "M 80,380 C 260,380 340,320 450,320 C 680,320 950,160 1150,160 C 1350,160 1650,360 1850,360 C 2050,360 2350,180 2500,180 C 2620,180 2700,220 2780,220";

const MILESTONES = [
  {
    id: "foundations",
    step: "01",
    phase: "PHASE 01 • WELCOME & FOUNDATIONS",
    title: "Curiosity Meets Computing",
    subtitle: "Open to all university disciplines",
    description: "Every technologist starts with a spark of curiosity. We welcome students from computing, engineering, management, and arts to explore foundational coding, digital creative tools, and peer-guided discovery without prerequisites.",
    highlights: ["Beginner-Friendly", "Peer Mentorship", "Open To All Faculties"],
    actionLabel: "Explore Community",
    actionTarget: "#about",
    icon: Compass,
    image: codingWorkshopImg,
    pathPoint: { x: 450, y: 320 },
    cardPos: { x: 260, y: 20 },
    lineDir: "down"
  },
  {
    id: "workshops",
    step: "02",
    phase: "PHASE 02 • SKILL-BUILDING",
    title: "Hands-On Coding & Dev Labs",
    subtitle: "Practical technical workshops",
    description: "Moving from theory into production code. Regular student-led workshops and hands-on coding labs cover full-stack web development, Git collaboration, cloud computing fundamentals, and practical software engineering sprints.",
    highlights: ["Interactive Labs", "Modern Frameworks", "Pair Programming"],
    actionLabel: "View Workshops",
    actionTarget: "#events",
    icon: Code2,
    image: techWorkshopImg,
    pathPoint: { x: 1150, y: 160 },
    cardPos: { x: 960, y: 200 },
    lineDir: "up"
  },
  {
    id: "innovation",
    step: "03",
    phase: "PHASE 03 • STUDENT PROJECTS",
    title: "Transforming Concepts into Products",
    subtitle: "Collaborative squads & exhibitions",
    description: "Where student creativity turns into tangible impact. Multidisciplinary project squads design web platforms, campus utility applications, digital media, and open-source contributions showcased at our annual student exhibition.",
    highlights: ["Project Showcases", "Open-Source", "Portfolio Building"],
    actionLabel: "See Showcases",
    actionTarget: "#events",
    icon: Rocket,
    image: creativityShowcaseImg,
    pathPoint: { x: 1850, y: 360 },
    cardPos: { x: 1660, y: 20 },
    lineDir: "down"
  },
  {
    id: "leadership",
    step: "04",
    phase: "PHASE 04 • EXCELLENCE & IMPACT",
    title: "Competitions, Seminars & Leadership",
    subtitle: "University quizzes & industry horizons",
    description: "Testing skills on bigger stages and broadening horizons through inter-college tech quizzes, distinguished guest speaker sessions, alumni mentorship, and executive leadership roles that shape university technology culture.",
    highlights: ["Tech Quizzes & Prizes", "Distinguished Seminars", "Executive Committee"],
    actionLabel: "Meet the Team",
    actionTarget: "#team",
    icon: Trophy,
    image: interCollegeQuizImg,
    pathPoint: { x: 2500, y: 180 },
    cardPos: { x: 2310, y: 200 },
    lineDir: "up"
  }
];

export function ClubJourney() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [orbCoords, setOrbCoords] = useState({ x: 80, y: 380 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check user screen size and reduced motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(motionMedia.matches);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Bind scroll progress exclusively to the 340vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Buttery-smooth spring physics for fluid movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001
  });

  // Coordinate camera translation across the 2800px world canvas
  const desktopTranslateX = useTransform(smoothProgress, [0, 1], ['4%', '-66%']);

  // Update traveler orb position and active stage based on real scroll
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));

      // Active stage determination
      if (latest < 0.25) setActiveStage(0);
      else if (latest < 0.52) setActiveStage(1);
      else if (latest < 0.78) setActiveStage(2);
      else setActiveStage(3);

      // Calculate path traveler point
      if (pathRef.current) {
        try {
          const totalLen = pathRef.current.getTotalLength();
          const targetLen = Math.min(0.999, Math.max(0.001, latest)) * totalLen;
          const pt = pathRef.current.getPointAtLength(targetLen);
          setOrbCoords({ x: pt.x, y: pt.y });
        } catch (e) {
          // Fallback gracefully
        }
      }
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  // Smooth scroll handler for CTA buttons
  const handleScrollToSection = (e, targetId) => {
    e.preventDefault();
    const el = document.querySelector(targetId);
    if (el) {
      const headerOffset = 82;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // =========================================================================
  // ACCESSIBILITY FALLBACK: PREFERS-REDUCED-MOTION
  // =========================================================================
  if (isReducedMotion) {
    return (
      <section id="journey" className="py-20 lg:py-28 bg-[#FAF6F4] relative border-t border-[rgba(103,44,28,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/40 mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>THE IT CLUB PATH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
              The IT Club Journey
            </h2>
            <p className="text-base sm:text-lg text-[#66534B]">
              From first curiosity to technical mastery, collaborative innovation, and leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MILESTONES.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="bg-white rounded-2xl p-7 border border-[#AE7B29]/30 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest text-[#AE7B29] uppercase">
                      {m.phase}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF6F4] border border-[#AE7B29]/30 flex items-center justify-center text-[#672C1C]">
                      <Icon className="w-5 h-5 text-[#AE7B29]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-[#672C1C] mb-2">{m.title}</h3>
                  <p className="text-xs text-[#AE7B29] font-semibold mb-3">{m.subtitle}</p>
                  <p className="text-sm text-[#66534B] leading-relaxed mb-5">{m.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[rgba(103,44,28,0.08)]">
                    {m.highlights.map((h, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FAF6F4] text-[#672C1C]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // MAIN SCROLL-DRIVEN PINNED JOURNEY EXPERIENCE
  // =========================================================================
  return (
    <section 
      id="journey" 
      ref={containerRef} 
      className="relative bg-[#FAF6F4] h-[340vh]"
    >
      {/* Decorative top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/40 to-transparent" />

      {/* ===================================================================== */}
      {/* STICKY VIEWPORT CONTAINER (PINNED WHILE SCROLLING) */}
      {/* ===================================================================== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-6 px-4 sm:px-8 select-none">
        
        {/* Subtle Ambient Background Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[rgba(174,123,41,0.04)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[rgba(103,44,28,0.03)] rounded-full blur-3xl pointer-events-none" />

        {/* =================================================================== */}
        {/* TOP HUD: SECTION HEADER & REAL-TIME PROGRESS METER */}
        {/* =================================================================== */}
        <div className="max-w-7xl mx-auto w-full z-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(103,44,28,0.12)]">
            
            {/* Header Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/40 mb-2 shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-[#AE7B29] animate-spin-slow" />
                <span>SCROLL-DRIVEN EXPERIENCE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#672C1C] tracking-tight">
                The IT Club Journey
              </h2>

              <p className="text-xs sm:text-sm text-[#66534B]">
                Scroll down to travel along our illustrated path of learning, innovation, and leadership.
              </p>
            </div>

            {/* Real-time Journey Indicator */}
            <div className="flex items-center gap-3">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#AE7B29]/40 shadow-xs flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#AE7B29] animate-pulse" />
                  <span className="text-xs font-bold text-[#672C1C]">
                    Stage 0{activeStage + 1} of 04
                  </span>
                </div>
                <div className="h-4 w-px bg-[rgba(103,44,28,0.15)]" />
                <span className="text-xs font-mono font-bold text-[#AE7B29]">
                  {scrollPercent}% Traveled
                </span>
              </div>
            </div>

          </div>

          {/* Thin Gold Progress Bar Track */}
          <div className="w-full h-1 bg-[rgba(103,44,28,0.08)] rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E] rounded-full"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* CENTER STAGE: CURVED WINDING PATH & EXPANDED WORLD CANVAS */}
        {/* =================================================================== */}
        {!isMobile ? (
          /* ================================================================= */
          /* DESKTOP: CAMERA-TRACKED 2800PX WORLD CANVAS WITH BEZIER CURVE */
          /* ================================================================= */
          <div className="relative w-full h-[520px] flex items-center overflow-visible my-auto">
            <motion.div 
              style={{ x: desktopTranslateX }}
              className="relative w-[2800px] h-[520px] shrink-0"
            >
              {/* SVG Winding Path Canvas */}
              <svg 
                viewBox="0 0 2800 520" 
                className="w-[2800px] h-[520px] overflow-visible absolute top-0 left-0 pointer-events-none z-10"
              >
                <defs>
                  {/* Glowing Gold Gradient for active drawn path */}
                  <linearGradient id="goldCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#AE7B29" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#D8A54E" stopOpacity="1" />
                    <stop offset="100%" stopColor="#AE7B29" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Soft Ambient Glow Filter */}
                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. Base Inactive Guide Path */}
                <path
                  d={PATH_D}
                  stroke="rgba(103, 44, 28, 0.14)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 8"
                />

                {/* 2. Active Animated Gold Path Drawn Directly by Scroll */}
                <motion.path
                  ref={pathRef}
                  d={PATH_D}
                  stroke="url(#goldCurveGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  style={{ pathLength: smoothProgress }}
                />

                {/* 3. Dotted Connector Lines from Curve to Milestone Cards */}
                {MILESTONES.map((m, idx) => {
                  const isActive = activeStage === idx;
                  const lineY2 = m.lineDir === "down" ? m.cardPos.y + 160 : m.cardPos.y + 120;
                  return (
                    <line
                      key={`connector-${m.id}`}
                      x1={m.pathPoint.x}
                      y1={m.pathPoint.y}
                      x2={m.cardPos.x + 190}
                      y2={lineY2}
                      stroke={isActive ? "#AE7B29" : "rgba(103, 44, 28, 0.2)"}
                      strokeWidth={isActive ? "2" : "1.5"}
                      strokeDasharray="4 4"
                      className="transition-colors duration-300"
                    />
                  );
                })}

                {/* 4. Numbered Beacon Pins on the Path */}
                {MILESTONES.map((m, idx) => {
                  const isActive = activeStage === idx;
                  return (
                    <g 
                      key={`beacon-${m.id}`} 
                      transform={`translate(${m.pathPoint.x}, ${m.pathPoint.y})`}
                    >
                      {isActive && (
                        <circle r="20" fill="#AE7B29" opacity="0.3" className="animate-ping" />
                      )}
                      <circle
                        r={isActive ? "13" : "9"}
                        fill={isActive ? "#AE7B29" : "#FFFFFF"}
                        stroke="#AE7B29"
                        strokeWidth="3"
                        filter={isActive ? "url(#goldGlow)" : undefined}
                        className="transition-all duration-300"
                      />
                      <text
                        y="4"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={isActive ? "#FFFFFF" : "#672C1C"}
                        className="font-mono select-none"
                      >
                        0{idx + 1}
                      </text>
                    </g>
                  );
                })}

                {/* 5. Glowing Traveler Orb Riding the Stroke Tip */}
                <g transform={`translate(${orbCoords.x}, ${orbCoords.y})`}>
                  <circle r="18" fill="#AE7B29" opacity="0.25" className="animate-pulse" />
                  <circle r="8" fill="#AE7B29" filter="url(#goldGlow)" />
                  <circle r="4" fill="#FFFFFF" />
                </g>
              </svg>

              {/* Milestone Content Cards Along the Winding Path */}
              {MILESTONES.map((m, idx) => {
                const isActive = activeStage === idx;
                const Icon = m.icon;

                return (
                  <div
                    key={m.id}
                    style={{
                      left: `${m.cardPos.x}px`,
                      top: `${m.cardPos.y}px`,
                      transform: isActive ? 'scale(1.03) translateY(-4px)' : 'scale(0.96) translateY(0px)',
                      opacity: isActive ? 1 : 0.65,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, border-color 0.3s ease, box-shadow 0.4s ease',
                    }}
                    className={`absolute w-[380px] bg-white rounded-2xl p-6 border flex flex-col justify-between z-20 pointer-events-auto ${
                      isActive
                        ? 'border-[#AE7B29] shadow-2xl ring-1 ring-[#AE7B29]/40'
                        : 'border-[rgba(103,44,28,0.12)] shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold tracking-widest text-[#AE7B29] uppercase">
                          {m.phase}
                        </span>

                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-[#672C1C] text-[#AE7B29] border-[#AE7B29]'
                            : 'bg-[#FAF6F4] text-[#672C1C] border-[#AE7B29]/30'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl font-bold font-serif text-[#672C1C] mb-1">
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#AE7B29] font-medium mb-3">
                        {m.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-[#66534B] leading-relaxed mb-4">
                        {m.description}
                      </p>

                      {/* Highlight Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {m.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF6F4] text-[#672C1C] border border-[#AE7B29]/20"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Action Button */}
                    <div className="pt-3 border-t border-[rgba(103,44,28,0.08)] flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#AE7B29]">
                        MILESTONE 0{m.step}
                      </span>

                      <a
                        href={m.actionTarget}
                        onClick={(e) => handleScrollToSection(e, m.actionTarget)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-[#672C1C] text-white hover:bg-[#481B0F] border border-[#AE7B29] shadow-xs'
                            : 'bg-[#FAF6F4] text-[#672C1C] hover:bg-[#FCF9F3] border border-[rgba(103,44,28,0.15)]'
                        }`}
                      >
                        <span>{m.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29]" />
                      </a>
                    </div>
                  </div>
                );
              })}

            </motion.div>
          </div>
        ) : (
          /* ================================================================= */
          /* TABLET & MOBILE: FOCUSED STAGE SWITCHER WITH ZERO OVERFLOW */
          /* ================================================================= */
          <div className="relative w-full max-w-lg mx-auto my-auto py-2">
            {MILESTONES.map((m, idx) => {
              if (activeStage !== idx) return null;
              const Icon = m.icon;

              return (
                <motion.div
                  key={`mobile-${m.id}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-2xl p-6 border-2 border-[#AE7B29] shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest text-[#AE7B29] uppercase">
                      {m.phase}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#672C1C] text-[#AE7B29] border border-[#AE7B29] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#672C1C] mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#AE7B29] font-medium mb-3">
                    {m.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#66534B] leading-relaxed mb-4">
                    {m.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {m.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FAF6F4] text-[#672C1C] border border-[#AE7B29]/30"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[rgba(103,44,28,0.08)] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#AE7B29]">
                      Stage 0{m.step} of 04
                    </span>

                    <a
                      href={m.actionTarget}
                      onClick={(e) => handleScrollToSection(e, m.actionTarget)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#672C1C] text-white hover:bg-[#481B0F] border border-[#AE7B29] transition-all"
                    >
                      <span>{m.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29]" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* BOTTOM HELPER BAR: SCROLL INVITATION & SMOOTH PASS-THROUGH */}
        {/* =================================================================== */}
        <div className="max-w-7xl mx-auto w-full z-20 flex items-center justify-between text-xs text-[#66534B]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AE7B29] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AE7B29]" />
            </span>
            <span className="font-medium">
              Keep scrolling to advance along the winding curve
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[#AE7B29] font-semibold">
            <span>Stage 0{activeStage + 1} Selected</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </section>
  );
}
