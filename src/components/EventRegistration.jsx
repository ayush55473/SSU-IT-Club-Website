import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  QrCode,
  Sparkles
} from 'lucide-react';
import { getEvents, registerForEvent, subscribeToCmsUpdates } from '../services/contentService';
import { validateRegistrationForm } from '../utils/registration';
import { getQrCodeImageUrl, buildTicketQrData, getVisitorGeoLocale } from '../services/api';

export function EventRegistration({ preselectedEvent }) {
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitorLocale, setVisitorLocale] = useState(null);

  // Filter events open for registration
  const openEvents = publishedEvents.filter(e => e.registration_enabled);

  // Form State
  const [formData, setFormData] = useState({
    eventId: '',
    fullName: '',
    email: '',
    phone: '',
    university: 'Sri Sri University',
    department: '',
    yearOfStudy: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await getEvents({ publishedOnly: true });
      setPublishedEvents(data);
    } catch (err) {
      console.error("Failed to load events for registration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    getVisitorGeoLocale().then(loc => setVisitorLocale(loc));
    const unsubscribe = subscribeToCmsUpdates((detail) => {
      if (!detail || detail.section === 'events') {
        fetchEvents();
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync preselectedEvent prop when user clicks "Register Now" on an EventCard
  useEffect(() => {
    if (preselectedEvent && preselectedEvent.id) {
      setFormData(prev => ({ ...prev, eventId: preselectedEvent.id }));
    } else if (openEvents.length > 0 && !formData.eventId) {
      setFormData(prev => ({ ...prev, eventId: openEvents[0].id }));
    }
  }, [preselectedEvent, publishedEvents]);

  // If no open events, keep registration section hidden as required
  if (!isLoading && openEvents.length === 0) {
    return null;
  }

  // Current selected event object
  const currentEvent = openEvents.find(e => e.id === formData.eventId) || openEvents[0] || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      eventId: currentEvent ? currentEvent.id : formData.eventId,
      eventTitle: currentEvent ? currentEvent.title : 'Selected Event',
      eventDate: currentEvent ? currentEvent.event_date || currentEvent.date : '',
      eventVenue: currentEvent ? currentEvent.venue : '',
    };

    const validation = validateRegistrationForm(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await registerForEvent(payload);
      if (result.success) {
        setSubmittedResult({
          ticketCode: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
          eventTitle: payload.eventTitle,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          department: payload.department,
          yearOfStudy: payload.yearOfStudy,
          eventDate: payload.eventDate,
          eventVenue: payload.eventVenue,
          registeredAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred while processing your registration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setFormData({
      eventId: openEvents[0]?.id || '',
      fullName: '',
      email: '',
      phone: '',
      university: 'Sri Sri University',
      department: '',
      yearOfStudy: '',
    });
    setErrors({});
  };

  return (
    <section id="registration" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>CONFIRM YOUR SPOT</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4"
          >
            Event <span className="text-gold-gradient italic">Registration</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#66534B]"
          >
            Register for officially scheduled workshops, technical talks, and hackathons conducted by the Sri Sri University IT Club.
          </motion.p>
        </div>

        {/* Registration Form Box */}
        <div className="max-w-3xl mx-auto bg-[#FFFDF9] border border-[#AE7B29]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
          {submittedResult ? (
            <div className="py-6 sm:py-8 space-y-6">
              <div className="text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-2xl font-serif font-bold text-[#672C1C]">Registration Confirmed!</h3>
                <p className="text-xs sm:text-sm text-[#66534B] max-w-md mx-auto">
                  Thank you, <strong>{submittedResult.fullName}</strong>. Your official entry pass for <strong>{submittedResult.eventTitle}</strong> is ready.
                </p>
              </div>

              {/* Digital Event Pass Ticket with Live Scannable QR Code */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-dashed border-[#AE7B29]/40 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#AE7B29] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                  Official Entry Pass
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Real-time generated QR Code */}
                  <div className="w-36 h-36 bg-white p-2 rounded-xl border border-[rgba(103,44,28,0.15)] shadow-xs flex flex-col items-center justify-center shrink-0">
                    <img
                      src={getQrCodeImageUrl(buildTicketQrData(submittedResult), 180)}
                      alt="Scannable Event Ticket QR Code"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5 text-xs text-[#66534B]">
                    <div className="font-mono text-[11px] text-[#AE7B29] font-bold">
                      TICKET ID: {submittedResult.ticketCode}
                    </div>
                    <div className="font-bold text-sm text-[#672C1C]">
                      {submittedResult.eventTitle}
                    </div>
                    <div>
                      <span className="font-semibold text-[#2B1209]">Attendee:</span> {submittedResult.fullName}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-[#2B1209]">Email:</span> {submittedResult.email}
                    </div>
                    <div>
                      <span className="font-semibold text-[#2B1209]">Venue:</span> {submittedResult.eventVenue || 'Main Auditorium'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(103,44,28,0.1)] flex items-center justify-between text-[10px] text-[#66534B]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Sparkles className="w-3 h-3 text-[#AE7B29]" />
                    QR Verified Pass (Free Public API)
                  </span>
                  <span>Present at entry gate</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-[#AE7B29] text-[#672C1C] hover:bg-[#FAF6F4] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#AE7B29]" />
                  <span>Print / Save Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#672C1C] text-white hover:bg-[#481B0F] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  Register for Another Event
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2320] mb-1.5">Select Event</label>
                <select
                  name="eventId"
                  value={formData.eventId || (currentEvent ? currentEvent.id : '')}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white font-medium"
                >
                  {openEvents.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({new Date(evt.event_date || evt.date || Date.now()).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5">Email ID *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@srisriuniversity.edu.in"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5">Department / Faculty *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. CSE / IT"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white"
                  />
                  {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D8A54E]" />
                    <span>Confirming Registration...</span>
                  </>
                ) : (
                  <span>Submit Event Registration</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventRegistration;
