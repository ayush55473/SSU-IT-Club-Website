import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  Compass
} from 'lucide-react';
import { AnnouncementModal } from './AnnouncementModal';
import { getAnnouncements, subscribeToCmsUpdates } from '../services/contentService';

// Dedicated moving announcement card component (TEXT-BASED)
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
            {item.category || 'General'}
          </span>
          <span className="text-stone-400 font-mono flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
            {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'Active'}
          </span>
        </div>

        {/* Announcement Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-[#D8A54E] transition-colors mb-3 leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Announcement Short Message */}
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-4 font-normal">
          {item.short_message || item.shortMessage}
        </p>
      </div>

      {/* Card Footer with Author Stamp & Modal Trigger Button */}
      <div className="pt-4 border-t border-[rgba(174,123,41,0.2)] flex items-center justify-between gap-3 bg-[#0D0705]/80">
        <span className="text-xs text-stone-400 font-medium flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-[#AE7B29] shrink-0" />
          <span className="truncate">By {item.author || 'IT Club Core'}</span>
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

  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Fetch published announcements dynamically
  const fetchPublishedAnnouncements = async () => {
    try {
      const data = await getAnnouncements({ publishedOnly: true });
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load published announcements:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedAnnouncements();
    const unsubscribe = subscribeToCmsUpdates((detail) => {
      if (!detail || detail.section === 'announcements') {
        fetchPublishedAnnouncements();
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter announcements based on active category
  const filteredAnnouncements = announcements.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  // Ensure minimum 6 cards per set so the conveyor is seamless
  const getDisplayAnnouncements = () => {
    if (filteredAnnouncements.length === 0) return [];
    let list = [...filteredAnnouncements];
    while (list.length < 6) {
      list = [...list, ...filteredAnnouncements];
    }
    return list;
  };

  const displayList = getDisplayAnnouncements();
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

  // Categories list
  const categories = ['All', ...Array.from(new Set(announcements.map(a => a.category).filter(Boolean)))];

  // =========================================================================
  // INITIAL STATE REQUIREMENT:
  // When no announcements are published (length === 0), display the animated
  // "EXCITING ANNOUNCEMENTS COMING SOON!" section.
  // =========================================================================
  if (!isLoading && announcements.length === 0) {
    return (
      <section 
        id="announcements" 
        ref={sectionRef}
        className="py-24 lg:py-32 bg-[#000000] text-white relative overflow-hidden selection:bg-[#AE7B29] selection:text-black"
      >
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(174,123,41,0.15)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#672C1C]/30 via-[#AE7B29]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top & Bottom gold hairlines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Subtle Radar Wave Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-[#672C1C] via-[#AE7B29] to-[#D8A54E] p-0.5 shadow-[0_0_40px_rgba(174,123,41,0.35)] relative flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#0D0705] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <span className="absolute inset-0 rounded-[22px] bg-[#AE7B29]/20 animate-ping opacity-30" />
              <Radio className="w-10 h-10 text-[#D8A54E] relative z-10 animate-pulse" />
            </div>
          </motion.div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#672C1C]/60 text-[#D8A54E] border border-[#AE7B29]/40 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D8A54E]" />
            <span>OFFICIAL IT CLUB DISPATCHES</span>
          </div>

          {/* Exact Required Heading */}
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight uppercase mb-4"
          >
            EXCITING ANNOUNCEMENTS <br />
            <span className="text-gold-gradient italic">COMING SOON!</span>
          </motion.h2>

          {/* Exact Required Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Something exciting is brewing at SSU IT Club. Stay connected with us for upcoming updates, opportunities, and important announcements.
          </motion.p>

          {/* Subtle Live Beacon Indicator */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-stone-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Central Admin CMS Connected • Automatic Live Synchronization</span>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // DYNAMIC STATE: When announcements ARE published, render the moving marquee!
  // =========================================================================
  return (
    <section 
      id="announcements" 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#000000] text-white relative overflow-hidden selection:bg-[#AE7B29] selection:text-black"
    >
      {/* 1. Background geometric patterns & ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(174,123,41,0.14)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50 z-0" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[rgba(103,44,28,0.22)] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[rgba(174,123,41,0.15)] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/60 to-transparent z-10" />

      {/* Kinetic Typography Layer */}
      <div className="relative w-full overflow-hidden mb-8 select-none border-b border-[rgba(174,123,41,0.2)] pb-3 z-0 pointer-events-none">
        <div className="animate-marquee-left flex whitespace-nowrap opacity-30">
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-stroke-gold px-4">
            {topMarqueeText}
          </span>
          <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#AE7B29]/70 px-4">
            {topMarqueeText}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#D8A54E] bg-[#672C1C]/60 border border-[#AE7B29]/50 mb-3 shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-[#AE7B29] animate-pulse" />
              <span>LIVE NOTICES &amp; BULLETINS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight uppercase">
              Club Announcements &amp;{' '}
              <span className="text-gold-gradient italic">Bulletins</span>
            </h2>
          </div>

          {/* Pause / Resume Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManuallyPaused(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-full bg-white/10 hover:bg-white/20 text-[#D8A54E] border border-[#AE7B29]/50 transition-all cursor-pointer"
            >
              {isManuallyPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              <span>{isManuallyPaused ? 'RESUME SCROLL' : 'PAUSE SCROLL'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-[#AE7B29] text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Moving Marquee Track */}
      <div 
        className="relative overflow-hidden group py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right gradient edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-black via-black/80 to-transparent" />

        <div 
          className="flex w-max will-change-transform"
          style={{
            animation: 'infiniteScroll 32s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {/* First set */}
          <div className="flex gap-6 pr-6">
            {displayList.map((item, idx) => (
              <AnnouncementCard
                key={`orig-${item.id || idx}`}
                item={item}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>

          {/* Duplicate set for infinite loop */}
          <div className="flex gap-6 pr-6" aria-hidden="true">
            {displayList.map((item, idx) => (
              <AnnouncementCard
                key={`dup-${item.id || idx}`}
                item={item}
                isDuplicate
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full Modal Viewer */}
      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        announcement={selectedAnnouncement}
      />
    </section>
  );
}

export default Announcements;
