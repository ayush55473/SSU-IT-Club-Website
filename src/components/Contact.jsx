import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, GithubIcon } from './SocialIcons';
import { CLUB_INFO } from '../data/clubInfo';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    // Simulate contact message submission
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 700);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>CONNECT WITH US</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
            Have an Idea or Want to Collaborate?
          </h2>

          <p className="text-base sm:text-lg text-[#66534B]">
            We are always eager to partner with students, faculty, and campus clubs.
          </p>
        </motion.div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Official Contact Details */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-[#FAF6F4] rounded-3xl p-8 border border-[rgba(103,44,28,0.12)]">
              <h3 className="text-xl font-bold text-[#672C1C] mb-6">
                University IT Club Headquarters
              </h3>

              <div className="space-y-5 text-sm">
                {/* Campus Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#AE7B29]/30 flex items-center justify-center shrink-0 text-[#672C1C]">
                    <MapPin className="w-4 h-4 text-[#AE7B29]" />
                  </div>
                  <div>
                    <strong className="text-[#672C1C] block font-semibold text-xs uppercase tracking-wider mb-0.5">
                      Campus Location
                    </strong>
                    <p className="text-[#66534B] text-xs leading-relaxed">
                      {CLUB_INFO.contact.location}<br />
                      {CLUB_INFO.contact.city}
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#AE7B29]/30 flex items-center justify-center shrink-0 text-[#672C1C]">
                    <Mail className="w-4 h-4 text-[#AE7B29]" />
                  </div>
                  <div>
                    <strong className="text-[#672C1C] block font-semibold text-xs uppercase tracking-wider mb-0.5">
                      Email Inquiries
                    </strong>
                    <a
                      href={`mailto:${CLUB_INFO.contact.email}`}
                      className="text-xs text-[#672C1C] font-semibold hover:text-[#AE7B29] transition-colors underline decoration-[#AE7B29]"
                    >
                      {CLUB_INFO.contact.email}
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#AE7B29]/30 flex items-center justify-center shrink-0 text-[#672C1C]">
                    <Clock className="w-4 h-4 text-[#AE7B29]" />
                  </div>
                  <div>
                    <strong className="text-[#672C1C] block font-semibold text-xs uppercase tracking-wider mb-0.5">
                      Club Lounge Hours
                    </strong>
                    <p className="text-[#66534B] text-xs leading-relaxed">
                      {CLUB_INFO.contact.officeHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels Section */}
              <div className="mt-8 pt-6 border-t border-[rgba(103,44,28,0.1)]">
                <span className="text-xs font-bold text-[#672C1C] uppercase tracking-wider block mb-3">
                  Follow Our Social Updates
                </span>
                <div className="flex items-center gap-3">
                  {CLUB_INFO.socialLinks.instagram && (
                    <a
                      href={CLUB_INFO.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-[#AE7B29]/40 hover:bg-[#672C1C] text-[#672C1C] hover:text-[#AE7B29] flex items-center justify-center transition-all shadow-xs"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  )}
                  {CLUB_INFO.socialLinks.linkedin && (
                    <a
                      href={CLUB_INFO.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-[#AE7B29]/40 hover:bg-[#672C1C] text-[#672C1C] hover:text-[#AE7B29] flex items-center justify-center transition-all shadow-xs"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {CLUB_INFO.socialLinks.youtube && (
                    <a
                      href={CLUB_INFO.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-[#AE7B29]/40 hover:bg-[#672C1C] text-[#672C1C] hover:text-[#AE7B29] flex items-center justify-center transition-all shadow-xs"
                      aria-label="YouTube"
                    >
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  )}
                  {CLUB_INFO.socialLinks.github && (
                    <a
                      href={CLUB_INFO.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-[#AE7B29]/40 hover:bg-[#672C1C] text-[#672C1C] hover:text-[#AE7B29] flex items-center justify-center transition-all shadow-xs"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Get in Touch Form */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[rgba(103,44,28,0.15)] shadow-xl relative">
              <h3 className="text-2xl font-bold font-serif text-[#672C1C] mb-2">
                Send a Message to the IT Club
              </h3>
              <p className="text-xs text-[#66534B] mb-8">
                Whether you want to propose a student tech talk, inquire about an event, or collaborate with us, drop us a line below.
              </p>

              {isSubmitted ? (
                <div className="bg-[#FAF6F4] rounded-2xl p-8 text-center border border-[#AE7B29]/40 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-[#AE7B29] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-[#672C1C] mb-1">Message Received!</h4>
                  <p className="text-xs text-[#66534B] max-w-sm mx-auto mb-6">
                    Thank you for reaching out. A student representative from the IT Club will respond to your university email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1">
                        Your Name <span className="text-[#AE7B29]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] text-xs text-[#2B1209] border border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29] outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1">
                        Email Address <span className="text-[#AE7B29]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@university.edu"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] text-xs text-[#2B1209] border border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Workshop Proposal / Event Collaboration"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] text-xs text-[#2B1209] border border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29] outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1">
                      Message <span className="text-[#AE7B29]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your thoughts, suggestions, or collaboration proposal..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] text-xs text-[#2B1209] border border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29] outline-none resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSending}
                    whileHover={!isSending ? { scale: 1.02 } : {}}
                    whileTap={!isSending ? { scale: 0.98 } : {}}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-md hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                  >
                    <span>{isSending ? 'Sending Message...' : 'Get in Touch'}</span>
                    <Send className="w-3.5 h-3.5 text-[#AE7B29]" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
