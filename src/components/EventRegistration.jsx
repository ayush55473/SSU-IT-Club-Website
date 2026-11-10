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
  ShieldAlert
} from 'lucide-react';
import { getEvents, registerForEvent, subscribeToCmsUpdates } from '../services/contentService';
import { validateRegistrationForm } from '../utils/registration';

export function EventRegistration({ preselectedEvent }) {
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-serif font-bold text-[#672C1C]">Registration Successful!</h3>
              <p className="text-xs sm:text-sm text-[#66534B] max-w-md mx-auto">
                Thank you, <strong>{submittedResult.fullName}</strong>. Your seat for <strong>{submittedResult.eventTitle}</strong> has been reserved.
              </p>
              <div className="p-4 bg-[#FAF6F4] rounded-2xl max-w-sm mx-auto font-mono text-xs">
                Registration Code: <span className="font-bold text-[#672C1C]">{submittedResult.ticketCode}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#672C1C] text-white text-xs font-bold uppercase tracking-wider"
              >
                Register for Another Event
              </button>
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
