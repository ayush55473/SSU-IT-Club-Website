import React from 'react';
import { X, Calendar, Bell, ArrowRight, User } from 'lucide-react';

export function AnnouncementModal({ announcement, isOpen, onClose }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[rgba(103,44,28,0.15)] relative p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-announcement-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#66534B] hover:text-[#672C1C] hover:bg-[#FAF6F4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Date Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF6F4] text-[#672C1C] border border-[#AE7B29]/40">
            {announcement.category}
          </span>
          <span className="text-xs text-[#66534B] flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
            {announcement.date}
          </span>
        </div>

        {/* Title */}
        <h3 id="modal-announcement-title" className="text-2xl font-bold font-serif text-[#672C1C] leading-snug mb-4">
          {announcement.title}
        </h3>

        {/* Author Stamp */}
        <div className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#FAF6F4] border border-[rgba(103,44,28,0.08)] mb-6 text-xs text-[#66534B]">
          <User className="w-3.5 h-3.5 text-[#AE7B29]" />
          <span>Published by: <strong className="text-[#672C1C]">{announcement.author}</strong></span>
        </div>

        {/* Content Body with whitespace preservation */}
        <div className="text-sm text-[#2B1209] leading-relaxed space-y-4 mb-8 whitespace-pre-line font-normal">
          {announcement.fullContent || announcement.shortMessage}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[rgba(103,44,28,0.1)]">
          {announcement.actionLink && (
            <a
              href={announcement.actionLink}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] transition-all"
            >
              <span>{announcement.actionText || 'Proceed'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29]" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] hover:bg-[#FCF9F3] border border-[rgba(103,44,28,0.15)] transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
