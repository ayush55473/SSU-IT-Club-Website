import React, { useState, useRef, useEffect } from 'react';
import { Mail, GraduationCap, Sparkles, Building2, User } from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';

export function MemberCard({ member, isDuplicate = false }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset error state when member.image_url changes
  useEffect(() => {
    setImageError(false);
  }, [member.image_url]);

  // Exclusive dynamic resolution: uploaded photo from Supabase Storage
  const activePhoto = (!imageError && member.image_url) ? member.image_url : null;

  // Contact links
  const emailAddress = member.email ? String(member.email).trim() : null;
  const rawLinkedIn = member.linkedin_url || member.linkedin;
  const linkedInUrl = rawLinkedIn ? String(rawLinkedIn).trim() : null;

  // Subtle 3D tilt interaction for member card
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -5;
    const rotY = ((x - centerX) / centerX) * 5;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden={isDuplicate ? true : undefined}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="w-[290px] sm:w-[320px] lg:w-[340px] h-[530px] sm:h-[560px] lg:h-[580px] shrink-0 bg-white rounded-3xl overflow-hidden border border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] shadow-sm hover:shadow-2xl flex flex-col justify-between group relative select-none transition-shadow duration-300"
    >
      <div className="flex-1 flex flex-col">
        {/* Photo Container */}
        <div className="relative aspect-[4/3.8] overflow-hidden bg-gradient-to-b from-[#F7F2EE] to-[#EAE0D7] border-b border-[rgba(103,44,28,0.08)] shrink-0 flex items-center justify-center">
          {activePhoto ? (
            <img
              src={activePhoto}
              alt={isDuplicate ? '' : `${member.name} - ${member.role}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Professional University Default Profile Placeholder */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#672C1C] via-[#853724] to-[#AE7B29] border-2 border-[#D8A54E]/60 flex items-center justify-center text-white font-serif text-3xl font-bold shadow-lg ring-4 ring-[#FAF6F4]">
                {member.name ? member.name.charAt(0).toUpperCase() : <User className="w-10 h-10 text-white/90" />}
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#AE7B29] font-bold">
                SSU IT CLUB CORE
              </span>
            </div>
          )}

          {/* Role Pill Badge */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-[#AE7B29]/40 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#672C1C] truncate">
                {member.role || 'Core Member'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#AE7B29] shrink-0" />
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-start">
          {/* Member Name */}
          <h3 className="text-lg font-bold text-[#672C1C] mb-1 line-clamp-1 group-hover:text-[#AE7B29] transition-colors">
            {member.name}
          </h3>

          {/* Department / Faculty */}
          <div className="flex items-center gap-1.5 text-xs text-[#AE7B29] font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{member.department || 'Faculty of Engineering and Technology'}</span>
          </div>

          {/* Branch (if available) */}
          {member.branch && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#66534B] font-medium mb-3">
              <Building2 className="w-3 h-3 shrink-0 text-[#AE7B29]/80" />
              <span className="truncate">{member.branch}</span>
            </div>
          )}

          {/* Bio */}
          <p className="text-xs text-[#66534B] leading-relaxed line-clamp-3 mt-1">
            {member.bio || 'Active leader and technology enthusiast collaborating to build impactful student digital initiatives.'}
          </p>
        </div>
      </div>

      {/* Social / Contact Channels Footer */}
      <div className="shrink-0 mt-auto px-5 sm:px-6 pb-4 sm:pb-5 pt-3 border-t border-[rgba(103,44,28,0.08)] flex items-center justify-between bg-white/90">
        <div className="flex items-center gap-2">
          {/* 1. Email Icon (Opens default email client with mailto:) */}
          {emailAddress && (
            <a
              href={`mailto:${emailAddress}`}
              tabIndex={isDuplicate ? -1 : undefined}
              className="p-2.5 rounded-xl bg-[#FAF6F4] text-[#672C1C] hover:bg-[#672C1C] hover:text-[#D8A54E] border border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] transition-all transform hover:-translate-y-0.5 shadow-2xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              title={`Email ${member.name} (${emailAddress})`}
              aria-label={`Email ${member.name}`}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          {/* 2. LinkedIn Icon (Opens member's profile in new browser tab) */}
          {linkedInUrl && (
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isDuplicate ? -1 : undefined}
              className="p-2.5 rounded-xl bg-[#FAF6F4] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white border border-[rgba(103,44,28,0.12)] hover:border-[#0A66C2] transition-all transform hover:-translate-y-0.5 shadow-2xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              title={`View ${member.name}'s LinkedIn Profile`}
              aria-label={`View ${member.name}'s LinkedIn Profile`}
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        <span className="text-[10px] font-mono font-bold tracking-widest text-[#AE7B29]/70 uppercase">
          CORE TEAM
        </span>
      </div>
    </div>
  );
}

export default MemberCard;
