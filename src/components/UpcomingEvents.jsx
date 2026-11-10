import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CalendarDays, 
  Filter, 
  CalendarX, 
  Sparkles, 
  Check, 
  Pause, 
  Play, 
  Calendar,
  Clock,
  Compass
} from 'lucide-react';
import { EventCard } from './EventCard';
import { getEvents, subscribeToCmsUpdates } from '../services/contentService';

export function UpcomingEvents({ onSelectForRegistration }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const fetchPublishedEvents = async () => {
    try {
      const data = await getEvents({ publishedOnly: true });
      setEvents(data);
    } catch (err) {
      console.error("Failed to load published events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedEvents();
    const unsubscribe = subscribeToCmsUpdates((detail) => {
      if (!detail || detail.section === 'events') {
        fetchPublishedEvents();
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter events based on active category tab & open registration toggle
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesOpen = !showOnlyOpen || event.registration_enabled;
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
  const isPaused = isHovered || isManuallyPaused || !isInView;
  const categories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  // =========================================================================
  // INITIAL STATE REQUIREMENT:
  // When no events are published (length === 0), display the animated
  // "EXCITING EVENTS COMING SOON!" section.
  // =========================================================================
  if (!isLoading && events.length === 0) {
    return (
      <section 
        id="events" 
        ref={sectionRef}
        className="py-24 lg:py-32 bg-white relative overflow-hidden selection:bg-[#AE7B29] selection:text-white"
      >
        {/* Subtle architectural background pattern */}
        <div className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#FCF9F3] via-[#FAF6F4]/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/40 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Animated Calendar Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-[#672C1C] via-[#AE7B29] to-[#D8A54E] p-0.5 shadow-xl flex items-center justify-center relative"
          >
            <div className="w-full h-full bg-[#FFFDF9] rounded-[22px] flex items-center justify-center shadow-inner">
              <CalendarDays className="w-10 h-10 text-[#672C1C] animate-pulse" />
            </div>
          </motion.div>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>CAMPUS INNOVATION &amp; WORKSHOPS</span>
          </div>

          {/* Exact Required Heading */}
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#672C1C] tracking-tight uppercase mb-4"
          >
            EXCITING EVENTS <br />
            <span className="text-gold-gradient italic">COMING SOON!</span>
          </motion.h2>

          {/* Exact Required Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg text-[#66534B] max-w-2xl mx-auto leading-relaxed font-sans"
          >
            New opportunities, workshops, competitions, and exciting experiences are on their way. Stay tuned!
          </motion.p>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-[#66534B] bg-white border border-[#AE7B29]/30 px-4 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin Managed Schedule • Realtime Live Updates</span>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // DYNAMIC STATE: When events ARE published, render the moving carousel!
  // =========================================================================
  return (
    <section 
      id="events" 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-b from-[#FCF9F3]/90 via-[#FCF9F3]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-grid opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AE7B29]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3 shadow-2xs">
              <CalendarDays className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>ACTIVITIES &amp; SESSIONS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-3">
              What's <span className="text-gold-gradient italic">Coming Up?</span>
            </h2>

            <p className="text-base sm:text-lg text-[#66534B]">
              Explore our upcoming workshops, competitions, and seminars. Gliding continuously from right to left—hover any card to pause and reserve your spot.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowOnlyOpen(!showOnlyOpen)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                showOnlyOpen
                  ? 'bg-[#672C1C] text-white border-[#AE7B29] shadow-sm'
                  : 'bg-white text-[#672C1C] border-[rgba(103,44,28,0.2)] hover:border-[#AE7B29] hover:bg-[#FAF6F4]'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>Open Registrations Only</span>
            </button>
          </div>
        </div>

        {/* Carousel pause/play bar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#66534B] bg-white/80 px-3 py-1 rounded-full border border-[#AE7B29]/30">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{isPaused ? 'PAUSED' : 'CONTINUOUS SMOOTH MARQUEE'}</span>
          </div>

          <button
            onClick={() => setIsManuallyPaused(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-full bg-white hover:bg-[#FCF9F3] text-[#672C1C] border border-[#AE7B29]/40 transition-all cursor-pointer"
          >
            {isManuallyPaused ? (
              <>
                <Play className="w-3 h-3 text-[#AE7B29] fill-current" />
                <span>RESUME</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-[#AE7B29]" />
                <span>PAUSE</span>
              </>
            )}
          </button>
        </div>

        {/* Marquee viewport */}
        <div 
          className="relative overflow-hidden group py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-20 bg-gradient-to-l from-white via-white/80 to-transparent" />

          <div 
            className="flex w-max will-change-transform"
            style={{
              animation: 'infiniteScroll 35s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            <div className="flex gap-6 pr-6">
              {displayEvents.map((event, idx) => (
                <div key={`event-orig-${event.id || idx}`} className="w-[300px] sm:w-[360px] flex-shrink-0">
                  <EventCard 
                    event={event} 
                    onRegister={() => onSelectForRegistration && onSelectForRegistration(event)} 
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-6 pr-6" aria-hidden="true">
              {displayEvents.map((event, idx) => (
                <div key={`event-dup-${event.id || idx}`} className="w-[300px] sm:w-[360px] flex-shrink-0">
                  <EventCard 
                    event={event} 
                    onRegister={() => onSelectForRegistration && onSelectForRegistration(event)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
