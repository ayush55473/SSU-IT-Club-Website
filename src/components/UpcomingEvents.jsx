import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CalendarDays, 
  Filter, 
  CalendarX, 
  Sparkles, 
  Check, 
  Pause, 
  Play, 
  ArrowLeftRight,
  MoveLeft
} from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES } from '../data/events';
import { EventCard } from './EventCard';

export function UpcomingEvents({ onSelectForRegistration }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [hoveredEventId, setHoveredEventId] = useState(null);

  // Filter events based on active category tab & open registration toggle
  const filteredEvents = EVENTS.filter((event) => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesOpen = !showOnlyOpen || event.status === 'Registration Open';
    return matchesCategory && matchesOpen;
  });

  // Ensure minimum 6 items per track set so the conveyor is always wider than screen
  const getDisplayEvents = () => {
    if (filteredEvents.length === 0) return [];
    let list = [...filteredEvents];
    while (list.length < 6) {
      list = [...list, ...filteredEvents];
    }
    return list;
  };

  const displayEvents = getDisplayEvents();

  // Carousel is paused when hovered, manually paused, or outside of viewport
  const isPaused = isHovered || isManuallyPaused || !isInView;

  return (
    <section 
      id="events" 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      {/* =================================================================== */}
      {/* SUBTLE BACKGROUND ACCENT (Lightweight, Non-Intrusive) */}
      {/* =================================================================== */}
      {/* Ambient warm radial glow at top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-b from-[#FCF9F3]/90 via-[#FCF9F3]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 bg-subtle-grid opacity-40 pointer-events-none" />

      {/* Top subtle gold hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =================================================================== */}
        {/* SECTION HEADING WITH STAGGERED ENTRANCE */}
        {/* =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3 shadow-2xs"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>ACTIVITIES &amp; SESSIONS</span>
            </motion.div>

            {/* Main Headline with Brush Accent */}
            <div className="overflow-hidden">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                What's{' '}
                <span className="relative inline-block text-gold-gradient italic">
                  Coming Up?
                  {/* Decorative underline brush */}
                  <svg
                    className="absolute left-0 -bottom-1.5 w-full h-2.5 text-[#AE7B29]/40 pointer-events-none"
                    viewBox="0 0 160 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 6C40 2 120 2 158 6"
                      stroke="#AE7B29"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h2>
            </div>

            {/* Subtitle / Description */}
            <motion.p 
              className="text-base sm:text-lg text-[#66534B]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Explore our upcoming workshops, competitions, and seminars. Gliding continuously from right to left—hover any card to pause and reserve your spot.
            </motion.p>
          </div>

          {/* Filter Option Controls */}
          <motion.div 
            className="flex items-center gap-3 shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={() => setShowOnlyOpen(!showOnlyOpen)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
                showOnlyOpen
                  ? 'bg-[#672C1C] text-white border-[#AE7B29] shadow-sm'
                  : 'bg-white text-[#672C1C] border-[rgba(103,44,28,0.2)] hover:border-[#AE7B29] hover:bg-[#FAF6F4]'
              }`}
            >
              {showOnlyOpen ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#AE7B29]" />
                  <span>Open Registrations Only</span>
                </>
              ) : (
                <>
                  <Filter className="w-3.5 h-3.5 text-[#AE7B29]" />
                  <span>Show Open Only</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* =================================================================== */}
        {/* CATEGORY FILTER TABS WITH SPRING PILL */}
        {/* =================================================================== */}
        <motion.div 
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {EVENT_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-[#66534B] hover:text-[#672C1C] bg-[#FAF6F4] hover:bg-[#FCF9F3] border border-transparent'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#672C1C] border border-[#AE7B29] rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </motion.div>

        {/* =================================================================== */}
        {/* INTERACTIVE CAROUSEL CONTROL & STATUS BAR */}
        {/* =================================================================== */}
        <motion.div 
          className="flex items-center justify-between gap-3 mb-6 px-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-[#66534B]">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isPaused ? 'bg-amber-500' : 'bg-emerald-600'
              }`} />
            </span>
            <span className="font-semibold text-[#672C1C] flex items-center gap-1.5">
              {isPaused ? 'Conveyor Paused' : 'Live Right-to-Left Carousel'}
              <MoveLeft className="w-3.5 h-3.5 text-[#AE7B29]" />
            </span>
            <span className="hidden sm:inline text-[#AE7B29] font-normal">
              • {isHovered ? 'Paused for reading & interaction' : 'Hover any card to pause & explore'}
            </span>
          </div>

          {/* Manual Play / Pause Button */}
          <button
            type="button"
            onClick={() => setIsManuallyPaused(!isManuallyPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 hover:bg-[#FCF9F3] transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
            title={isManuallyPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            aria-label={isManuallyPaused ? 'Resume carousel' : 'Pause carousel'}
          >
            {isManuallyPaused ? (
              <>
                <Play className="w-3 h-3 text-[#AE7B29] fill-[#AE7B29]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-[#AE7B29]" />
                <span>Pause</span>
              </>
            )}
          </button>
        </motion.div>

      </div>

      {/* ===================================================================== */}
      {/* SINGLE-ROW CONTINUOUS RIGHT-TO-LEFT HORIZONTAL CAROUSEL CONTAINER */}
      {/* ===================================================================== */}
      {displayEvents.length > 0 ? (
        <motion.div
          className="relative w-full overflow-hidden py-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Soft edge fade gradient masks to make cards enter & exit elegantly */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-20" />

          {/* Carousel Moving Track: RIGHT TO LEFT */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setHoveredEventId(null);
            }}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setIsHovered(false);
              setHoveredEventId(null);
            }}
            className={`animate-carousel-left flex gap-6 sm:gap-8 px-4 ${
              isPaused ? 'carousel-paused' : ''
            }`}
          >
            {/* Track 1: First set of event cards */}
            {displayEvents.map((event, idx) => (
              <EventCard
                key={`primary-${event.id}-${idx}`}
                event={event}
                isDuplicate={false}
                onSelectForRegistration={onSelectForRegistration}
                isHovered={hoveredEventId === `primary-${event.id}-${idx}`}
                isSiblingHovered={hoveredEventId !== null && hoveredEventId !== `primary-${event.id}-${idx}`}
                onHoverStart={() => setHoveredEventId(`primary-${event.id}-${idx}`)}
                onHoverEnd={() => setHoveredEventId(null)}
              />
            ))}

            {/* Track 2: Duplicate set of event cards for continuous infinite looping */}
            {displayEvents.map((event, idx) => (
              <EventCard
                key={`duplicate-${event.id}-${idx}`}
                event={event}
                isDuplicate={true}
                onSelectForRegistration={onSelectForRegistration}
                isHovered={hoveredEventId === `duplicate-${event.id}-${idx}`}
                isSiblingHovered={hoveredEventId !== null && hoveredEventId !== `duplicate-${event.id}-${idx}`}
                onHoverStart={() => setHoveredEventId(`duplicate-${event.id}-${idx}`)}
                onHoverEnd={() => setHoveredEventId(null)}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        /* Empty State Display */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-[#FAF6F4] rounded-3xl p-12 text-center border-2 border-dashed border-[#AE7B29]/30 max-w-lg mx-auto my-12"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#672C1C] mx-auto mb-4 border border-[#AE7B29]/30 shadow-xs">
              <CalendarX className="w-7 h-7 text-[#AE7B29]" />
            </div>
            <h3 className="text-xl font-bold text-[#672C1C] mb-2 font-serif">No Matching Events Found</h3>
            <p className="text-sm text-[#66534B] mb-6">
              There are currently no events matching the selected filter criteria. Please check back soon or reset the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setShowOnlyOpen(false);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>Explore All Events</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Bottom Direction & Navigation Helper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center">
        <p className="text-xs text-[#66534B]/85 flex items-center justify-center gap-1.5 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
          <span>Moving smoothly from right to left. Want to partner on an event?{' '}</span>
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('contact');
              if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 82;
                window.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            className="font-bold text-[#672C1C] hover:text-[#AE7B29] underline decoration-[#AE7B29] transition-colors"
          >
            Reach out to our events coordinator
          </a>.
        </p>
      </div>

    </section>
  );
}
