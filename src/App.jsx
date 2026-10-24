import React, { useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ClubJourney } from './components/ClubJourney';
import { UpcomingEvents } from './components/UpcomingEvents';
import { Announcements } from './components/Announcements';
import { EventRegistration } from './components/EventRegistration';
import { TeamMembers } from './components/TeamMembers';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { IntroAnimation } from './components/IntroAnimation';

// Both official logo assets independently imported
import universityLogo from './assets/university-logo.png';
import itClubLogo from './assets/CLUB_Logo.png';

export function App() {
  const [preselectedEvent, setPreselectedEvent] = useState(null);

  // Check if intro has already played in this browser session
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Honor prefers-reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return !sessionStorage.getItem('it_club_intro_seen');
  });

  // Called when intro animation completes its full sequence
  const handleIntroComplete = () => {
    sessionStorage.setItem('it_club_intro_seen', 'true');
    setIsIntroActive(false);
  };

  // Allows user, reviewers, or seniors to replay the intro anytime from footer
  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsIntroActive(true);
  };

  // When a student clicks "Register Now" on an EventCard, pre-fill the form & scroll
  const handleSelectForRegistration = (event) => {
    setPreselectedEvent(event);
    const regSection = document.getElementById('registration');
    if (regSection) {
      const headerOffset = 82;
      const elementPosition = regSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2B1209] flex flex-col relative selection:bg-[#AE7B29] selection:text-white">
      {/* Intro Launch Animation Sequence (Plays on first visit or on replay) */}
      {isIntroActive && (
        <IntroAnimation
          onComplete={handleIntroComplete}
          universityLogo={universityLogo}
          itClubLogo={itClubLogo}
        />
      )}

      {/* 1. Subtle Custom Cursor Interaction (Desktop Only) */}
      <CustomCursor />

      {/* 2. Header & Two-Logo Navigation */}
      <Navbar isIntroActive={isIntroActive} />

      {/* 3. Main Landing Page Sections */}
      <main className={`flex-1 transition-opacity duration-700 ${isIntroActive ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Section with Interactive 3D Developer Workstation */}
        <Hero isIntroActive={isIntroActive} />

        {/* About the IT Club & 4 Core Pillars */}
        <About />

        {/* Scroll-Driven Winding Path Journey Experience */}
        <ClubJourney />

        {/* Future Event Announcements & Bulletins */}
        <Announcements />

        {/* Upcoming Events Carousel (Moving Right to Left) */}
        <UpcomingEvents onSelectForRegistration={handleSelectForRegistration} />

        {/* Event Registration Interface */}
        <EventRegistration preselectedEvent={preselectedEvent} />

        {/* Executive Team Members & Contact Details */}
        <TeamMembers />

        {/* Contact Us Section */}
        <Contact />
      </main>

      {/* 4. Footer with Both Logos, Quick Links, Replay Button, and Copyright */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}

export default App;
