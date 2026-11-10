import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Users, 
  Info, 
  ArrowUpRight, 
  Pause, 
  Play, 
  Sparkles, 
  UserPlus, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { MEMBERS } from '../data/members';
import { MemberCard } from './MemberCard';
import { JoinTeamModal } from './JoinTeamModal';
import { ClubMembersModal } from './ClubMembersModal';
import { AdminDashboardModal } from './AdminDashboardModal';
import { getPublicClubMembers, subscribeToMemberUpdates } from '../services/memberService';
import { getCoreMembers, subscribeToCmsUpdates } from '../services/contentService';

export function TeamMembers() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.15 });
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(1);
  const [displayMembers, setDisplayMembers] = useState(MEMBERS);

  // Keep member count synced in realtime with database & storage
  useEffect(() => {
    let isMounted = true;

    const updateCount = async () => {
      try {
        const list = await getPublicClubMembers();
        if (isMounted) {
          setMemberCount(list.length);
        }
      } catch (err) {
        console.error("Error updating member count:", err);
      }
    };

    const fetchCoreTeam = async () => {
      try {
        const dynamicCore = await getCoreMembers(true);
        if (isMounted && dynamicCore && dynamicCore.length > 0) {
          setDisplayMembers(dynamicCore);
        }
      } catch (err) {
        console.warn("Could not load dynamic core members:", err);
      }
    };

    updateCount();
    fetchCoreTeam();

    const unsubMembers = subscribeToMemberUpdates(() => updateCount());
    const unsubCms = subscribeToCmsUpdates((detail) => {
      if (!detail || detail.section === 'core_members') {
        if (detail?.data && Array.isArray(detail.data) && detail.data.length > 0) {
          setDisplayMembers(detail.data.filter(m => m.is_active !== false));
        }
        fetchCoreTeam();
      }
    });

    return () => {
      isMounted = false;
      if (unsubMembers) unsubMembers();
      if (unsubCms) unsubCms();
    };
  }, []);

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
            <span>Meet Our IT Cell Family</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
            Meet the Core Team & Officers
          </h2>
          
          <p className="text-base sm:text-lg text-[#66534B] leading-relaxed font-sans">
            Dedicated student leaders, developers, designers, and innovators steering the technical excellence and digital evolution of Sri Sri University.
          </p>
        </motion.div>

        {/* Continuous Horizontal Infinite Marquee Carousel */}
        <div 
          className="relative py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Pause/Play status indicator */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#66534B] bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[#AE7B29]/30 shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{isPaused ? (isHovered ? 'PAUSED (HOVER)' : 'PAUSED') : 'CONTINUOUS SMOOTH MARQUEE'}</span>
            </div>

            <button
              onClick={() => setIsManuallyPaused(prev => !prev)}
              aria-label={isManuallyPaused ? "Resume continuous movement" : "Pause continuous movement"}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-full bg-white hover:bg-[#FCF9F3] text-[#672C1C] border border-[#AE7B29]/40 hover:border-[#AE7B29] shadow-2xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
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

          {/* Marquee viewport with gradient masks */}
          <div className="relative overflow-hidden group">
            {/* Left Edge Gradient Fade */}
            <div 
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-20 bg-gradient-to-r from-[#FAF6F4] via-[#FAF6F4]/80 to-transparent" 
              aria-hidden="true"
            />
            {/* Right Edge Gradient Fade */}
            <div 
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-20 bg-gradient-to-l from-[#FAF6F4] via-[#FAF6F4]/80 to-transparent" 
              aria-hidden="true"
            />

            {/* Moving Track */}
            <div 
              className="flex w-max will-change-transform"
              style={{
                animation: 'infiniteScroll 35s linear infinite',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* First Set of Members */}
              <div className="flex gap-6 pr-6">
                {displayMembers.map((member) => (
                  <div 
                    key={`original-${member.id}`} 
                    className="w-[280px] sm:w-[320px] flex-shrink-0"
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>

              {/* Duplicate Set for Seamless Continuous Infinite Movement */}
              <div className="flex gap-6 pr-6" aria-hidden="true">
                {displayMembers.map((member) => (
                  <div 
                    key={`duplicate-${member.id}`} 
                    className="w-[280px] sm:w-[320px] flex-shrink-0"
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive hint */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-mono text-[#66534B] bg-white/70 px-4 py-1.5 rounded-full border border-[rgba(103,44,28,0.12)]">
            <Info className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>Hover or tap any card to pause movement and view social profiles</span>
          </p>
        </div>

        {/* ================================================================= */}
        {/* INTERACTIVE MEMBERSHIP ACTION CALLOUT CARD */}
        {/* ================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-white via-[#FCF9F3] to-white border-2 border-[#AE7B29]/40 shadow-xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E]" />

          {/* Subtle Decorative Background Watermark Grid */}
          <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3 shadow-2xs relative z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>BECOME A PART OF OUR COMMUNITY</span>
          </div>

          {/* Headline & Subhead */}
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#672C1C] mb-2.5 relative z-10">
            Join the IT Club & Explore Our Members
          </h3>

          <p className="text-xs sm:text-sm text-[#66534B] max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed font-sans">
            Whether you are an ambitious student eager to learn, build, and lead, or a faculty or staff member supporting student innovation, register today to become part of the official SSU IT Club roster.
          </p>

          {/* The Two Interactive Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            
            {/* 1. JOIN US BUTTON */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsJoinModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#672C1C] via-[#481B0F] to-[#672C1C] hover:from-[#481B0F] hover:to-[#38140B] border border-[#AE7B29] shadow-md hover:shadow-xl hover:shadow-[#AE7B29]/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#AE7B29] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#D8A54E] transition-transform group-hover:scale-110" />
              <span>Join Us</span>
              <ArrowRight className="w-4 h-4 text-[#D8A54E] transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* 2. VIEW OUR CLUB MEMBERS BUTTON */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMembersModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-[#672C1C] bg-white hover:bg-[#FCF9F3] border-2 border-[#AE7B29]/60 hover:border-[#AE7B29] shadow-sm hover:shadow-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#AE7B29] cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#AE7B29] transition-transform group-hover:scale-110" />
              <span>View Our Club Members</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF6F4] text-[#672C1C] border border-[#AE7B29]/30">
                {memberCount}
              </span>
            </motion.button>

          </div>

          {/* Bottom Security & Live Hint */}
          <div className="mt-6 pt-5 border-t border-[rgba(103,44,28,0.08)] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#66534B] relative z-10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>Verified Directory</span>
            </span>
            <span>•</span>
            <span>Real-time Live Sync</span>
            <span>•</span>
            <span>Searchable & Sortable Roster</span>
            <span>•</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[#AE7B29] hover:text-[#672C1C] inline-flex items-center gap-1 font-semibold underline decoration-[#AE7B29]/40 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* 1. JOIN US MODAL FORM */}
      {/* ===================================================================== */}
      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccessViewMembers={() => {
          setIsJoinModalOpen(false);
          setIsMembersModalOpen(true);
        }}
      />

      {/* ===================================================================== */}
      {/* 2. VIEW OUR CLUB MEMBERS MODAL DIRECTORY */}
      {/* ===================================================================== */}
      <ClubMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        onOpenJoinModal={() => {
          setIsMembersModalOpen(false);
          setIsJoinModalOpen(true);
        }}
        onOpenAdminModal={() => {
          setIsMembersModalOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* ===================================================================== */}
      {/* 3. ADMIN DASHBOARD MODAL */}
      {/* ===================================================================== */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

    </section>
  );
}

export default TeamMembers;
