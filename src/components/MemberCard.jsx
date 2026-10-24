import React, { useState, useRef } from 'react';
import { Phone, Mail, GraduationCap, Sparkles } from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';

export function MemberCard({ member, isDuplicate = false }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      className="w-[290px] sm:w-[320px] lg:w-[340px] h-[460px] sm:h-[480px] shrink-0 bg-white rounded-2xl overflow-hidden border border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] shadow-sm hover:shadow-2xl flex flex-col justify-between group relative select-none transition-shadow duration-300"
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3.8] overflow-hidden bg-[#FAF6F4] border-b border-[rgba(103,44,28,0.08)]">
          <img
            src={member.image}
            alt={isDuplicate ? '' : `${member.name} - ${member.role}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
            loading="lazy"
          />

          {/* Role Pill Badge */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-[#AE7B29]/40 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#672C1C] truncate">
                {member.role}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#AE7B29] shrink-0" />
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="p-5 sm:p-6">
          {/* Member Name */}
          <h3 className="text-lg font-bold text-[#672C1C] mb-1 line-clamp-1 group-hover:text-[#672C1C]">
            {member.name}
          </h3>

          {/* Department / Course */}
          <div className="flex items-center gap-1.5 text-xs text-[#AE7B29] font-medium mb-3">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{member.department}</span>
          </div>

          {/* Bio */}
          <p className="text-xs text-[#66534B] leading-relaxed line-clamp-3">
            {member.bio}
          </p>
        </div>
      </div>

      {/* Contact Channels Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[rgba(103,44,28,0.08)] flex items-center justify-between bg-white/90">
        <div className="flex items-center gap-2">
          {/* Click-to-call tel: protocol */}
          {member.phone && (
            <a
              href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
              tabIndex={isDuplicate ? -1 : undefined}
              className="p-2 rounded-lg bg-[#FAF6F4] text-[#672C1C] hover:bg-[#672C1C] hover:text-[#AE7B29] border border-[rgba(103,44,28,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              title={`Call: ${member.phone}`}
              aria-label={`Call ${member.name}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}

          {/* mailto: protocol */}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              tabIndex={isDuplicate ? -1 : undefined}
              className="p-2 rounded-lg bg-[#FAF6F4] text-[#672C1C] hover:bg-[#672C1C] hover:text-[#AE7B29] border border-[rgba(103,44,28,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              title={`Email: ${member.email}`}
              aria-label={`Email ${member.name}`}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}

          {/* LinkedIn Profile link */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isDuplicate ? -1 : undefined}
              className="p-2 rounded-lg bg-[#FAF6F4] text-[#672C1C] hover:bg-[#672C1C] hover:text-[#AE7B29] border border-[rgba(103,44,28,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
              title="LinkedIn Profile"
              aria-label={`${member.name} LinkedIn Profile`}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Placeholder Tag / Quick Tip */}
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#AE7B29] bg-[#FAF6F4] px-2 py-1 rounded border border-[#AE7B29]/30">
          Editable
        </span>
      </div>
    </div>
  );
}
