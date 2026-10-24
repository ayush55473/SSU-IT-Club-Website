import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Users, Code, Trophy } from 'lucide-react';
import { Hero3D } from './Hero3D';
import { CLUB_INFO } from '../data/clubInfo';

export function Hero({ isIntroActive = false }) {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
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

  const highlights = [
    { icon: Sparkles, label: 'Workshops & Labs', desc: 'Hands-on learning' },
    { icon: Trophy, label: 'Tech Competitions', desc: 'Showcase skills' },
    { icon: Users, label: 'Student Network', desc: 'Collaborative culture' },
    { icon: Code, label: 'Creative Tech', desc: 'Student projects' },
  ];

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white"
    >
      {/* Subtle architectural grid pattern background */}
      <div className="absolute inset-0 bg-subtle-grid opacity-70 pointer-events-none" />

      {/* Ambient warm gradient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[rgba(103,44,28,0.03)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[rgba(174,123,41,0.05)] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =============================================================== */}
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          {/* =============================================================== */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isIntroActive ? 0 : 1, y: isIntroActive ? 24 : 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Small Official Label above Headline */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]">
                <span className="w-2 h-2 rounded-full bg-[#AE7B29] animate-pulse" />
                University's IT CLUB
              </span>
              <span className="text-xs font-medium text-[#AE7B29] tracking-wider uppercase hidden sm:inline-block">
                Academic Year 2026 – 2027
              </span>
            </div>

            {/* Suggested Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#672C1C] leading-[1.12] tracking-tight mb-6">
              Where Ideas Meet{' '}
              <span className="relative inline-block text-gold-gradient">
                Innovation.
                {/* Decorative underline brush */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#AE7B29]/40"
                  viewBox="0 0 250 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C60 3 180 3 247 9"
                    stroke="#AE7B29"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Suggested Supporting Text */}
            <p className="text-lg sm:text-xl text-[#66534B] leading-relaxed max-w-2xl mb-8 font-normal">
              Bringing students together to explore technology, exchange ideas, learn new skills, and create meaningful experiences through events, workshops, and collaboration.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              {/* Primary CTA */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo('events')}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-md hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              >
                <Calendar className="w-4 h-4 text-[#AE7B29] transition-transform group-hover:scale-110" />
                <span>Explore Upcoming Events</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo('registration')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-[#672C1C] bg-white hover:bg-[#FAF6F4] border-2 border-[rgba(103,44,28,0.2)] hover:border-[#AE7B29] shadow-xs hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              >
                <Users className="w-4 h-4 text-[#AE7B29]" />
                <span>Join Our Community</span>
              </motion.button>
            </div>

            {/* Quick Feature Ticker / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[rgba(103,44,28,0.1)]">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#672C1C]">
                      <IconComponent className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[11px] text-[#66534B] mt-0.5">{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: INTERACTIVE 3D COMPOSITION */}
          {/* =============================================================== */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isIntroActive ? 0 : 1, scale: isIntroActive ? 0.95 : 1 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 3D Canvas Scene */}
            <Hero3D />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
