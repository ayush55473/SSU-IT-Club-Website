import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Info, ArrowUpRight, Pause, Play, Sparkles } from 'lucide-react';
import { MEMBERS } from '../data/members';
import { MemberCard } from './MemberCard';

export function TeamMembers() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Carousel is paused when hovered, manually paused, or outside of viewport
  const isPaused = isHovered || isManuallyPaused || !isInView;

  return (
    <section 
      id="team" 
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#FAF6F4] relative overflow-hidden"
    >
      {/* Decorative top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#AE7B29]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Staggered Viewport Entrance */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/40 mb-3 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>EXECUTIVE COMMITTEE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
            Meet Our Team
          </h2>

          <p className="text-base sm:text-lg text-[#66534B]">
            The dedicated students who organize our workshops, build initiatives, and bring our technology community to life.
          </p>
        </motion.div>

        {/* Member Customization Instructions Banner */}
        <motion.div 
          className="bg-white rounded-2xl p-5 border border-[#AE7B29]/30 shadow-xs mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#AE7B29] shrink-0 mt-0.5" />
            <div className="text-xs text-[#66534B] leading-relaxed">
              <strong className="text-[#672C1C] font-semibold block mb-0.5">
                Ready for Your Team Details:
              </strong>
              Add real member photographs into <code className="font-mono text-[#672C1C]">src/assets/members/</code> and edit student names, roles, and contacts in <code className="font-mono text-[#672C1C]">src/data/members.js</code>.
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] hover:bg-[#FCF9F3] border border-[rgba(103,44,28,0.15)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
            >
              <span>Join the Team</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#AE7B29]" />
            </a>
          </div>
        </motion.div>

        {/* Interactive Carousel Control & Status Bar */}
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
            <span className="font-semibold text-[#672C1C]">
              {isPaused ? 'Conveyor Paused' : 'Live Continuous Carousel'}
            </span>
            <span className="hidden sm:inline text-[#AE7B29] font-normal">
              • {isHovered ? 'Paused for reading' : 'Hover any card to pause & interact'}
            </span>
          </div>

          {/* Manual Play / Pause Button */}
          <button
            type="button"
            onClick={() => setIsManuallyPaused(!isManuallyPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#672C1C] bg-white border border-[#AE7B29]/40 hover:bg-[#FCF9F3] transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
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
      {/* SINGLE-ROW CONTINUOUS LEFT-TO-RIGHT HORIZONTAL CAROUSEL CONTAINER */}
      {/* ===================================================================== */}
      <motion.div
        className="relative w-full overflow-hidden py-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft edge fade gradient masks to make cards enter & exit elegantly */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-r from-[#FAF6F4] via-[#FAF6F4]/90 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-l from-[#FAF6F4] via-[#FAF6F4]/90 to-transparent pointer-events-none z-20" />

        {/* Carousel Moving Track */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className={`animate-carousel-right flex gap-6 sm:gap-8 px-4 ${
            isPaused ? 'carousel-paused' : ''
          }`}
        >
          {/* Track 1: First set of 6 member cards */}
          {MEMBERS.map((member) => (
            <MemberCard key={`primary-${member.id}`} member={member} isDuplicate={false} />
          ))}

          {/* Track 2: Duplicate set of 6 member cards for continuous infinite looping */}
          {MEMBERS.map((member) => (
            <MemberCard key={`duplicate-${member.id}`} member={member} isDuplicate={true} />
          ))}
        </div>
      </motion.div>

      {/* Bottom Hint */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <p className="text-xs text-[#66534B]/80 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
          <span>Moving smoothly from left to right. All contact links, calls, and emails are fully interactive.</span>
        </p>
      </div>

    </section>
  );
}
