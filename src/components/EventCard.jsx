import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  Ticket
} from 'lucide-react';

export function EventCard({ 
  event, 
  onSelectForRegistration,
  isHovered = false,
  isSiblingHovered = false,
  onHoverStart,
  onHoverEnd,
  isDuplicate = false,
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [canTilt, setCanTilt] = useState(false);

  // Check if device supports fine hover pointer (mouse)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      setCanTilt(finePointer.matches && !reducedMotion.matches);
    }
  }, []);

  // Subtle, constrained 3D tilt interaction based on cursor coordinates (max ±4.5 deg)
  const handleMouseMove = (e) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -4.5;
    const rotY = ((x - centerX) / centerX) * 4.5;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    onHoverStart?.();
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    onHoverEnd?.();
  };

  // Keyboard navigation focus support
  const handleFocus = () => {
    onHoverStart?.();
  };

  const handleBlur = (e) => {
    if (!cardRef.current?.contains(e.relatedTarget)) {
      setRotateX(0);
      setRotateY(0);
      onHoverEnd?.();
    }
  };

  // Determine badge styling based on event status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Registration Open':
        return {
          bg: 'bg-white/95 text-[#672C1C] border-[#AE7B29]',
          dot: 'bg-emerald-600',
          badgeText: 'Registration Open',
          canRegister: true,
        };
      case 'Coming Soon':
        return {
          bg: 'bg-white/95 text-[#AE7B29] border-[#AE7B29]/60',
          dot: 'bg-[#AE7B29]',
          badgeText: 'Coming Soon',
          canRegister: false,
        };
      case 'Registration Closed':
        return {
          bg: 'bg-stone-100/95 text-stone-600 border-stone-300',
          dot: 'bg-stone-400',
          badgeText: 'Closed',
          canRegister: false,
        };
      case 'Event Completed':
      default:
        return {
          bg: 'bg-stone-100/95 text-stone-500 border-stone-200',
          dot: 'bg-stone-300',
          badgeText: 'Completed',
          canRegister: false,
        };
    }
  };

  const statusConfig = getStatusBadge(event.status);

  // Dynamic transform & transition based on hover/focus and sibling state
  const transformStyle = isHovered
    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`
    : isSiblingHovered
    ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(0.988)'
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';

  return (
    <div
      ref={cardRef}
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? true : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={isDuplicate ? undefined : handleFocus}
      onBlur={isDuplicate ? undefined : handleBlur}
      style={{
        transform: transformStyle,
        opacity: isSiblingHovered ? 0.82 : 1,
        transition: isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.35s ease'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease, opacity 0.35s ease',
      }}
      className={`w-[310px] sm:w-[340px] lg:w-[360px] h-[570px] sm:h-[590px] shrink-0 select-none bg-white rounded-2xl overflow-hidden border flex flex-col justify-between group relative focus:outline-none focus:ring-2 focus:ring-[#AE7B29] ${
        isHovered
          ? 'border-[#AE7B29] shadow-2xl z-20'
          : isSiblingHovered
          ? 'border-[rgba(103,44,28,0.08)] shadow-xs z-10'
          : 'border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] shadow-sm hover:shadow-xl z-10'
      }`}
    >
      {/* Top subtle gold hairline on hovered card */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#672C1C] transition-opacity duration-300 z-30 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* Top Banner & Image Container with Restrained Scale Reveal */}
      <div className="relative overflow-hidden aspect-[16/10] bg-[#FAF6F4] shrink-0">
        <img
          src={event.image}
          alt={isDuplicate ? '' : event.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-108' : 'scale-100'
          }`}
          loading="lazy"
        />

        {/* Subtle Dark Vignette on Image Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

        {/* Category Pill Tag (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#672C1C] border border-[#AE7B29]/40 shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#AE7B29]" />
            <span>{event.category}</span>
          </span>
        </div>

        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-sm ${statusConfig.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <span>{statusConfig.badgeText}</span>
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time Header */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-semibold text-[#AE7B29] mb-2.5">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
              {event.date}
            </span>
            <span className="text-[rgba(103,44,28,0.25)]">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#AE7B29]" />
              {event.time}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg sm:text-xl font-bold font-serif text-[#672C1C] transition-colors mb-2.5 line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#66534B] leading-relaxed mb-3 line-clamp-3">
            {event.shortDescription}
          </p>

          {/* Event Tags Pill Row */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-[#FAF6F4] text-[#672C1C] border border-[#AE7B29]/25 group-hover:border-[#AE7B29]/50 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Venue & Logistics */}
          <div className="space-y-1.5 py-2.5 border-y border-[rgba(103,44,28,0.08)] mb-3 text-xs">
            <div className="flex items-start gap-2 text-[#66534B]">
              <MapPin className="w-3.5 h-3.5 text-[#AE7B29] shrink-0 mt-0.5" />
              <span className="font-medium line-clamp-1">{event.venue}</span>
            </div>

            {event.deadline && (
              <div className="flex items-center gap-2 text-[#66534B]">
                <AlertCircle className="w-3.5 h-3.5 text-[#672C1C] shrink-0" />
                <span>
                  Register by:{' '}
                  <strong className="text-[#672C1C] font-semibold">{event.deadline}</strong>
                </span>
              </div>
            )}

            {/* Seat Availability if specified */}
            {event.seatsTotal && event.status === 'Registration Open' && (
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#66534B]">
                <span className="flex items-center gap-1 text-[#AE7B29] font-medium">
                  <Ticket className="w-3.5 h-3.5" />
                  Seats Available
                </span>
                <span className="font-bold text-[#672C1C]">
                  {event.seatsLeft} of {event.seatsTotal}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {event.externalUrl ? (
            // External Registration Link (e.g. Google Forms)
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isDuplicate ? -1 : undefined}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-xs hover:shadow-md transition-all duration-200 group-hover:border-[#AE7B29] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
            >
              <span>Register via Form</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#AE7B29] transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : event.status === 'Registration Open' ? (
            // In-page Registration Form trigger
            <button
              type="button"
              tabIndex={isDuplicate ? -1 : undefined}
              onClick={() => onSelectForRegistration(event)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-xs hover:shadow-md transition-all duration-200 group-hover:bg-[#481B0F] group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29] transition-transform group-hover:translate-x-1" />
            </button>
          ) : event.status === 'Coming Soon' ? (
            <button
              type="button"
              disabled
              tabIndex={-1}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#AE7B29] bg-[#FAF6F4] border border-[#AE7B29]/40 cursor-not-allowed"
            >
              <span>Opening Soon</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              tabIndex={-1}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-100 border border-stone-200 cursor-not-allowed"
            >
              <span>{event.status}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
