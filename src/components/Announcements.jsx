import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Bell, 
  Pin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  User, 
  Radio, 
  Pause, 
  Play, 
  MoveLeft
} from 'lucide-react';
import { ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORIES } from '../data/announcements';
import { AnnouncementModal } from './AnnouncementModal';

// Dedicated moving announcement card component (STRICTLY TEXT-BASED, NO IMAGES)
function AnnouncementCard({ item, isDuplicate = false, onOpenModal }) {
  return (
    <article
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? true : undefined}
      className="w-[320px] sm:w-[380px] lg:w-[420px] h-[370px] sm:h-[390px] shrink-0 select-none bg-[#0D0705]/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[rgba(174,123,41,0.35)] hover:border-[#AE7B29] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.9)] hover:shadow-[0_20px_45px_-10px_rgba(174,123,41,0.3)] flex flex-col justify-between relative group transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
    >
      {/* Top Hairline Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E] rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Decorative Corner Monospace Watermark & Pinned Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {item.pinned && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#AE7B29]/25 text-[#D8A54E] border border-[#AE7B29] shadow-[0_0_12px_rgba(174,123,41,0.35)]">
            <Pin className="w-3 h-3 text-[#AE7B29] rotate-45" />
            <span>PINNED</span>
          </div>
        )}
        <span className="text-[10px] font-mono font-bold text-[#AE7B29]/40 tracking-widest select-none">
          [ + ]
        </span>
      </div>

      <div>
        {/* Category & Date Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#672C1C] text-[#D8A54E] border border-[#AE7B29]/50 shadow-2xs">
            {item.category}
          </span>
          <span className="text-stone-400 font-mono flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
            {item.date}
          </span>
        </div>

        {/* Announcement Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-[#D8A54E] transition-colors mb-3 leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Announcement Short Message (NO IMAGES) */}
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-4 font-normal">
          {item.shortMessage}
        </p>
      </div>

      {/* Card Footer with Author Stamp & Modal Trigger Button */}
      <div className="pt-4 border-t border-[rgba(174,123,41,0.2)] flex items-center justify-between gap-3 bg-[#0D0705]/80">
        <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-[#AE7B29] shrink-0" />
          <span className="truncate">By {item.author}</span>
        </span>

        <button
          type="button"
          tabIndex={isDuplicate ? -1 : undefined}
          onClick={() => onOpenModal(item)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-[#672C1C] border border-[#AE7B29]/40 hover:border-[#AE7B29] transition-all shadow-xs group/btn shrink-0 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
        >
          <span>Read Full Notice</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29] transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

export function Announcements() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Filter announcements based on active category
  const filteredAnnouncements = ANNOUNCEMENTS.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  // Ensure minimum 6 cards per set so the track is always wider than any display
  const getDisplayAnnouncements = () => {
    if (filteredAnnouncements.length === 0) return [];
    let list = [...filteredAnnouncements];
    while (list.length < 6) {
      list = [...list, ...filteredAnnouncements];
    }
    return list;
  };

  const displayList = getDisplayAnnouncements();

  // Carousel is paused when hovered, manually paused, or outside of viewport
  const isPaused = isHovered || isManuallyPaused || !isInView;

  const handleOpenModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Repeating marquee phrases for background layer
  const topMarqueeText = "OFFICIAL BULLETINS ✦ ANNOUNCEMENTS ✦ SSU IT CLUB DISPATCHES ✦ CAMPUS TECH UPDATES ✦ REAL-TIME NOTICES ✦ ";
  const bottomMarqueeText = "WHERE IDEAS MEET INNOVATION ◆ SRI SRI UNIVERSITY IT CLUB ◆ CONNECT • COLLABORATE • CREATE ◆ ACADEMIC YEAR 2026-2027 ◆ ";

  return (
    <section 
      id="announcements" 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#000000] text-white relative overflow-hidden selection:bg-[#AE7B29] selection:text-black"
    >
      {/* =================================================================== */}
      {/* 1. BACKGROUND GEOMETRIC PATTERNS & AMBIENT GLOW */}
      {/* =================================================================== */}
      {/* Subtle geometric dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(174,123,41,0.14)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50 z-0" />

      {/* Ambient warm gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[rgba(103,44,28,0.22)] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[rgba(174,123,41,0.15)] rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top & Bottom gold hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />

      {/* =================================================================== */}
      {/* 2. LAYERED BACKGROUND KINETIC TYPOGRAPHY MARQUEE (Behind Cards) */}
      {/* =================================================================== */}
      <div className="relative w-full overflow-hidden mb-8 select-none border-b border-[rgba(174,123,41,0.2)] pb-3 z-0 pointer-events-none">
        <div className="animate-marquee-left flex whitespace-nowrap opacity-30">
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-stroke-gold px-4">
            {topMarqueeText}
          </span>
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#AE7B29]/70 px-4">
            {topMarqueeText}
          </span>
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-stroke-gold px-4">
            {topMarqueeText}
          </span>
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#AE7B29]/70 px-4">
            {topMarqueeText}
          </span>
        </div>

        {/* Animated Geometric Pattern Ribbon (Chevron/Zigzag wireframe strip) */}
        <div className="mt-2 py-1.5 bg-[#0A0503] border-y border-[rgba(174,123,41,0.3)] overflow-hidden">
          <div className="animate-marquee-right flex items-center whitespace-nowrap gap-6 text-[11px] font-mono tracking-widest text-[#AE7B29]">
            <span>▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ ▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ SYSTEM BULLETIN BROADCAST // DEPT. OF CS &amp; IT // REAL-TIME DISPATCH</span>
            <span>▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ ▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ SYSTEM BULLETIN BROADCAST // DEPT. OF CS &amp; IT // REAL-TIME DISPATCH</span>
            <span>▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ ▲ ▼ ▲ ▼ ▲ ▼ ✦ ❖ ✦ SYSTEM BULLETIN BROADCAST // DEPT. OF CS &amp; IT // REAL-TIME DISPATCH</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =================================================================== */}
        {/* 3. SECTION HEADING & EDITORIAL DISPATCH HEADER */}
        {/* =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            {/* Live Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-[#D8A54E] bg-[#140C0A] border border-[#AE7B29]/50 mb-3 shadow-[0_0_15px_rgba(174,123,41,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AE7B29] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D8A54E]" />
              </span>
              <Bell className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>OFFICIAL DISPATCHES // BULLETINS</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight mb-3">
              Latest{' '}
              <span className="text-gold-gradient italic font-serif">Announcements</span>
            </h2>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
              Key updates, future event notices, registration deadlines, and club initiatives moving continuously from right to left—hover any card to pause and read.
            </p>
          </div>

          /* {/* Admin Source Badge */}
          <div className="text-xs font-mono text-[#D8A54E] bg-[#140C0A] px-4 py-2.5 rounded-xl border border-[#AE7B29]/40 shadow-xs flex items-center gap-2 shrink-0">
            <Radio className="w-3.5 h-3.5 text-[#AE7B29] animate-pulse" />
            <span>Admin Feed:</span>
            <code className="text-white font-bold">src/data/announcements.js</code>
          </div>
        </div> */

        {/* =================================================================== */}
        {/* 4. CATEGORY FILTER TABS WITH SPRING INDICATOR */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {ANNOUNCEMENT_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
                  isSelected
                    ? 'text-black'
                    : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeAnnouncementCat"
                    className="absolute inset-0 bg-[#AE7B29] border border-[#D8A54E] rounded-full shadow-[0_0_15px_rgba(174,123,41,0.4)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10 font-bold">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* 5. INTERACTIVE CAROUSEL CONTROL & STATUS BAR */}
        {/* =================================================================== */}
        <div className="flex items-center justify-between gap-3 mb-6 px-1">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isPaused ? 'bg-amber-500' : 'bg-emerald-600'
              }`} />
            </span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              {isPaused ? 'Conveyor Paused' : 'Live Right-to-Left Card Stream'}
              <MoveLeft className="w-3.5 h-3.5 text-[#AE7B29]" />
            </span>
            <span className="hidden sm:inline text-[#AE7B29] font-normal">
              • {isHovered ? 'Paused for reading notice' : 'Hover any card to pause & explore'}
            </span>
          </div>

          {/* Manual Play / Pause Button */}
          <button
            type="button"
            onClick={() => setIsManuallyPaused(!isManuallyPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#140C0A] border border-[#AE7B29]/50 hover:bg-[#1E120F] transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
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
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 6. CONTINUOUSLY MOVING ANNOUNCEMENT CARDS TRACK (RIGHT TO LEFT) */}
      {/* ===================================================================== */}
      {displayList.length > 0 ? (
        <div className="relative w-full overflow-hidden py-4 z-10">
          {/* Soft edge fade gradient masks to make cards enter & exit gracefully */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-l from-black via-black/90 to-transparent pointer-events-none z-20" />

          {/* Moving Cards Track: Travel horizontally from right to left */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className={`animate-announcements-cards flex gap-6 sm:gap-8 px-4 ${
              isPaused ? 'carousel-paused' : ''
            }`}
          >
            {/* Track 1: Primary set of existing announcement cards */}
            {displayList.map((item, idx) => (
              <AnnouncementCard
                key={`primary-${item.id}-${idx}`}
                item={item}
                isDuplicate={false}
                onOpenModal={handleOpenModal}
              />
            ))}

            {/* Track 2: Duplicate set of existing announcement cards for seamless infinite loop */}
            {displayList.map((item, idx) => (
              <AnnouncementCard
                key={`duplicate-${item.id}-${idx}`}
                item={item}
                isDuplicate={true}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-stone-400">
          No announcements found in this category.
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. BOTTOM CONTINUOUS MARQUEE TICKER (Opposite Direction) */}
      {/* =================================================================== */}
      <div className="relative w-full overflow-hidden mt-12 select-none border-t border-[rgba(174,123,41,0.25)] pt-4 z-0 pointer-events-none">
        <div className="animate-marquee-right flex whitespace-nowrap opacity-30">
          <span className="text-lg sm:text-xl lg:text-2xl font-mono font-bold uppercase tracking-widest text-[#AE7B29]/90 px-4">
            {bottomMarqueeText}
          </span>
          <span className="text-lg sm:text-xl lg:text-2xl font-mono font-bold uppercase tracking-widest text-white/70 px-4">
            {bottomMarqueeText}
          </span>
          <span className="text-lg sm:text-xl lg:text-2xl font-mono font-bold uppercase tracking-widest text-[#AE7B29]/90 px-4">
            {bottomMarqueeText}
          </span>
          <span className="text-lg sm:text-xl lg:text-2xl font-mono font-bold uppercase tracking-widest text-white/70 px-4">
            {bottomMarqueeText}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 8. FULL NOTICE MODAL (Preserved from Existing Component) */}
      {/* =================================================================== */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

    </section>
  );
}
