import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { CLUB_INFO } from '../data/clubInfo';

// 1. UNIVERSITY LOGO:
import universityLogo from '../assets/university-logo.png';
// 2. IT CLUB LOGO:
import itClubLogo from '../assets/CLUB_Logo.png';

export function Navbar({ onSelectNav, isIntroActive = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Detect scroll position for sticky elevation & highlight active section smoothly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      // Track active section based on scroll position accounting for sticky header offset
      const sections = ['hero', 'about', 'journey', 'announcements', 'events', 'team', 'contact'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Journey', href: '#journey', id: 'journey' },
    { label: 'Announcements', href: '#announcements', id: 'announcements' },
    { label: 'Events', href: '#events', id: 'events' },
    { label: 'Our Team', href: '#team', id: 'team' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Smooth scroll handler accounting for sticky header height
  const handleLinkClick = (e, href, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection(id);

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      const headerOffset = 82;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[rgba(103,44,28,0.12)] py-2.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-[rgba(103,44,28,0.06)] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* =============================================================== */}
          {/* 1. LEFT CORNER: UNIVERSITY LOGO */}
          {/* =============================================================== */}
          <div className="flex items-center">
            <a
              id="nav-university-logo"
              href="#hero"
              onClick={(e) => handleLinkClick(e, '#hero', 'hero')}
              className={`flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#AE7B29] rounded-lg p-1 transition-all duration-300 ${
                isIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              title="State University Home"
            >
              <img
                src={universityLogo}
                alt={CLUB_INFO.logos.university.alt}
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ maxHeight: `${CLUB_INFO.logos.university.height}px` }}
              />
            </a>
          </div>

          {/* =============================================================== */}
          {/* 2. DESKTOP NAVIGATION LINKS WITH SLIDING ACTIVE INDICATOR */}
          {/* =============================================================== */}
          <nav 
            className={`hidden lg:flex items-center space-x-1 sm:space-x-2 transition-opacity duration-500 ${
              isIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`} 
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`relative px-3.5 py-1.5 text-sm font-semibold tracking-wide transition-colors rounded-lg group focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
                    isActive
                      ? 'text-[#672C1C] font-bold'
                      : 'text-[#66534B] hover:text-[#672C1C] hover:bg-[#FAF6F4]/60'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#AE7B29] rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* =============================================================== */}
          {/* 3. RIGHT CORNER: EXPLORE BUTTON & IT CLUB LOGO */}
          {/* =============================================================== */}
          <div className="flex items-center space-x-4">
            {/* Prominent Explore Events CTA Button */}
            <a
              href="#events"
              onClick={(e) => handleLinkClick(e, '#events', 'events')}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
                isIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>Explore Events</span>
            </a>

            {/* Vertical hairline divider */}
            <div className={`hidden sm:block h-7 w-px bg-[rgba(103,44,28,0.15)] transition-opacity duration-300 ${
              isIntroActive ? 'opacity-0' : 'opacity-100'
            }`} />

            {/* IT CLUB LOGO (RIGHT CORNER) */}
            <a
              id="nav-club-logo"
              href="#hero"
              onClick={(e) => handleLinkClick(e, '#hero', 'hero')}
              className={`flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#AE7B29] rounded-lg p-1 transition-all duration-300 ${
                isIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              title="University IT Club Home"
            >
              <img
                src={itClubLogo}
                alt={CLUB_INFO.logos.club.alt}
                className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ maxHeight: `${CLUB_INFO.logos.club.height}px` }}
              />
            </a>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#672C1C] hover:bg-[#FAF6F4] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 4. MOBILE HAMBURGER MENU DRAWER */}
      {/* =============================================================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(103,44,28,0.1)] bg-white px-4 pt-4 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#FAF6F4] text-[#672C1C] border-l-4 border-[#AE7B29]'
                    : 'text-[#66534B] hover:bg-[#FCF9F3] hover:text-[#672C1C]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#AE7B29]" />
              </a>
            ))}

            <div className="pt-2">
              <a
                href="#events"
                onClick={(e) => handleLinkClick(e, '#events', 'events')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-sm transition-all text-center"
              >
                <Calendar className="w-4 h-4 text-[#AE7B29]" />
                <span>Explore Upcoming Events</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
