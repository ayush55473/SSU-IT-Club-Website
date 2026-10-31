import React from 'react';
import { Calendar, ArrowUp, Mail, MapPin, Heart, RotateCcw } from 'lucide-react';
import { CLUB_INFO } from '../data/clubInfo';

// Separate logo imports (independently editable)
import universityLogo from '../assets/university-logo.png';
import itClubLogo from '../assets/CLUB_Logo.png';

export function Footer({ onReplayIntro }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset - 82;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Journey', href: '#journey' },
    { label: 'Announcements', href: '#announcements' },
    { label: 'Events', href: '#events' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
    { label: 'Register', href: '#registration' },
    { label: 'Propose Project', href: '#proposals' },
  ];

  return (
    <footer className="bg-[#672C1C] text-white pt-16 pb-12 border-t-4 border-[#AE7B29] relative overflow-hidden">
      {/* Background architectural watermark */}
      <div className="absolute inset-0 bg-subtle-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================================================================= */}
        {/* TOP ROW: TWO LOGO PLACEHOLDERS & BRANDING */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-12 mb-12 border-b border-white/10 gap-8">
          
          {/* Left: University Logo Placeholder */}
          <div className="flex items-center gap-3">
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="inline-block p-2 bg-white rounded-xl shadow-xs hover:opacity-95 transition-opacity"
            >
              <img
                src={universityLogo}
                alt={CLUB_INFO.logos.university.alt}
                className="h-10 w-auto object-contain"
                style={{ maxHeight: `${CLUB_INFO.logos.university.height}px` }}
              />
            </a>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AE7B29] block">
                {CLUB_INFO.universityName}
              </span>
              <span className="text-[11px] text-white/70">
                Official Student Technology Organisation
              </span>
            </div>
          </div>

          {/* Right: IT Club Logo Placeholder */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AE7B29] block">
                {CLUB_INFO.clubName}
              </span>
              <span className="text-[11px] text-white/70">
                {CLUB_INFO.clubTagline}
              </span>
            </div>
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="inline-block p-2 bg-white rounded-xl shadow-xs hover:opacity-95 transition-opacity"
            >
              <img
                src={itClubLogo}
                alt={CLUB_INFO.logos.club.alt}
                className="h-10 w-auto object-contain"
                style={{ maxHeight: `${CLUB_INFO.logos.club.height}px` }}
              />
            </a>
          </div>

        </div>

        {/* ================================================================= */}
        {/* MIDDLE SECTION: 4 COLUMNS OF LINKS & INFO */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: About Blurb */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#AE7B29]">
              About University IT Club
            </h4>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              {CLUB_INFO.clubDescription}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-white/10 text-[#AE7B29] border border-[#AE7B29]/40">
                <span>Non-Profit Student Community</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#AE7B29]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-white/80 hover:text-[#AE7B29] transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact Information */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#AE7B29]">
              Contact Details
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#AE7B29] shrink-0 mt-0.5" />
                <span>{CLUB_INFO.contact.location}, {CLUB_INFO.contact.city}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#AE7B29] shrink-0" />
                <a
                  href={`mailto:${CLUB_INFO.contact.email}`}
                  className="hover:text-[#AE7B29] transition-colors underline decoration-[#AE7B29]/60"
                >
                  {CLUB_INFO.contact.email}
                </a>
              </p>
              <p className="text-[11px] text-white/60 pt-2">
                Office Hours: {CLUB_INFO.contact.officeHours}
              </p>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* BOTTOM ROW: COPYRIGHT & BACK-TO-TOP */}
        {/* ================================================================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            &copy; {currentYear} {CLUB_INFO.universityName} • {CLUB_INFO.clubName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#AE7B29] text-white hover:text-[#672C1C] transition-all text-xs font-semibold focus:outline-none"
                title="Replay the landing page intro animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Intro</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#AE7B29] text-white hover:text-[#672C1C] transition-all text-xs font-semibold focus:outline-none"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
