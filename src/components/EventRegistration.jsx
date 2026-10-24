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
import { EVENTS } from '../data/events';
import { submitRegistration, validateRegistrationForm } from '../utils/registration';

export function EventRegistration({ preselectedEvent }) {
  // Filter events open for registration
  const openEvents = EVENTS.filter(e => e.status === 'Registration Open');

  // Form State
  const [formData, setFormData] = useState({
    eventId: '',
    fullName: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    yearOfStudy: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  // Sync preselectedEvent prop when user clicks "Register Now" on an EventCard
  useEffect(() => {
    if (preselectedEvent && preselectedEvent.id) {
      setFormData(prev => ({ ...prev, eventId: preselectedEvent.id }));
    } else if (openEvents.length > 0 && !formData.eventId) {
      setFormData(prev => ({ ...prev, eventId: openEvents[0].id }));
    }
  }, [preselectedEvent]);

  // Current selected event object
  const currentEvent = EVENTS.find(e => e.id === formData.eventId) || openEvents[0] || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear inline error on edit
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected event has an external URL (e.g. Google Form)
    if (currentEvent && currentEvent.externalUrl) {
      window.open(currentEvent.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const payload = {
      ...formData,
      eventTitle: currentEvent ? currentEvent.title : 'Selected Event',
      eventDate: currentEvent ? currentEvent.date : '',
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
      const result = await submitRegistration(payload);
      setSubmittedResult(result);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: 'An unexpected error occurred while processing your registration.' });
      }
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
      university: '',
      department: '',
      yearOfStudy: '',
    });
    setErrors({});
  };

  return (
    <section id="registration" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subheading */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] border border-[#AE7B29]/40 mb-3 shadow-xs">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>EVENT RESERVATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
            Be Part of the Experience
          </h2>

          <p className="text-base sm:text-lg text-[#66534B]">
            Find an event that interests you and reserve your spot.
          </p>
        </motion.div>

        {/* ================================================================= */}
        {/* MAIN CONTAINER: REGISTRATION CARD OR SUCCESS CONFIRMATION */}
        {/* ================================================================= */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          
          {submittedResult ? (
            /* ============================================================= */
            /* SUCCESS CONFIRMATION RECEIPT (FRONTEND DEMONSTRATION) */
            /* ============================================================= */
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#AE7B29] shadow-2xl animate-in zoom-in-95 duration-300">
              {/* Header Badge */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F4] text-[#672C1C] flex items-center justify-center mx-auto mb-4 border-2 border-[#AE7B29] shadow-xs">
                  <CheckCircle2 className="w-9 h-9 text-[#AE7B29]" />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#AE7B29] uppercase block mb-1">
                  Registration Confirmed (Demo)
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#672C1C]">
                  {submittedResult.registeredEvent.title}
                </h3>
                <p className="text-xs font-mono font-bold text-[#672C1C] mt-2 bg-[#FAF6F4] inline-block px-3 py-1 rounded-full border border-[rgba(103,44,28,0.12)]">
                  PASS CODE: {submittedResult.registrationId}
                </p>
              </div>

              {/* Explicit Frontend Limitations Notice */}
              <div className="bg-[#FAF6F4] rounded-2xl p-4 sm:p-5 border border-[#AE7B29]/40 mb-8 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#AE7B29] shrink-0 mt-0.5" />
                <div className="text-xs text-[#66534B] leading-relaxed">
                  <strong className="text-[#672C1C] block font-semibold mb-1">
                    Frontend Demonstration Notice
                  </strong>
                  This registration was validated and simulated locally. No real emails have been sent and no external database has stored your submission. To hook this form up to a permanent backend or Google Sheets, configure <code className="font-mono text-[#672C1C]">src/utils/registration.js</code>.
                </div>
              </div>

              {/* Attendee Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FCF9F3] border border-[rgba(174,123,41,0.25)] mb-8 text-xs">
                <div>
                  <span className="text-[#66534B] block">Attendee Name</span>
                  <span className="font-bold text-[#672C1C] text-sm">{submittedResult.attendee.fullName}</span>
                </div>
                <div>
                  <span className="text-[#66534B] block">Email Address</span>
                  <span className="font-bold text-[#672C1C] text-sm">{submittedResult.attendee.email}</span>
                </div>
                <div>
                  <span className="text-[#66534B] block">Event Date</span>
                  <span className="font-semibold text-[#672C1C]">{submittedResult.registeredEvent.date}</span>
                </div>
                <div>
                  <span className="text-[#66534B] block">Event Venue</span>
                  <span className="font-semibold text-[#672C1C]">{submittedResult.registeredEvent.venue}</span>
                </div>
                <div>
                  <span className="text-[#66534B] block">College / University</span>
                  <span className="font-semibold text-[#672C1C]">{submittedResult.attendee.university}</span>
                </div>
                <div>
                  <span className="text-[#66534B] block">Department &amp; Year</span>
                  <span className="font-semibold text-[#672C1C]">
                    {submittedResult.attendee.department} • {submittedResult.attendee.yearOfStudy}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-[#FAF6F4] hover:bg-[#FCF9F3] border border-[#AE7B29] transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-[#AE7B29]" />
                  <span>Register Another Attendee</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 text-[#AE7B29]" />
                  <span>Print / Save Receipt</span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================= */
            /* INTERACTIVE REGISTRATION FORM */
            /* ============================================================= */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[rgba(103,44,28,0.15)] shadow-xl relative"
            >
              {/* Event Selector Field */}
              <div className="mb-6">
                <label htmlFor="reg-event" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-2">
                  Select Event <span className="text-[#AE7B29]">*</span>
                </label>
                <select
                  id="reg-event"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6F4] border border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/30 text-sm font-semibold text-[#672C1C] transition-all outline-none"
                >
                  {EVENTS.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({event.date}) — [{event.status}]
                    </option>
                  ))}
                </select>
                {errors.eventId && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.eventId}
                  </p>
                )}
              </div>

              {/* Dynamic Event Logistics Preview Box */}
              {currentEvent && (
                <div className="bg-[#FAF6F4] rounded-2xl p-4 border border-[#AE7B29]/30 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#672C1C]">
                      <Calendar className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>{currentEvent.date} ({currentEvent.time})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#66534B]">
                      <MapPin className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>{currentEvent.venue}</span>
                    </div>
                  </div>

                  {currentEvent.externalUrl ? (
                    <div className="sm:text-right">
                      <span className="text-[11px] font-bold text-[#AE7B29] uppercase block">External Form</span>
                      <span className="text-[11px] text-[#66534B]">Opens external form</span>
                    </div>
                  ) : (
                    <div className="sm:text-right">
                      <span className="text-[11px] font-bold text-[#AE7B29] uppercase block">In-Page Reservation</span>
                      <span className="text-[11px] text-[#66534B]">{currentEvent.seatsLeft} spots remaining</span>
                    </div>
                  )}
                </div>
              )}

              {/* External Registration Warning Banner if event has external link */}
              {currentEvent && currentEvent.externalUrl && (
                <div className="mb-6 p-4 rounded-xl bg-[#FCF9F3] border border-[#AE7B29]/50 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#66534B]">
                    This specific event uses an external registration form (e.g. Google Forms / University Portal).
                  </span>
                  <a
                    href={currentEvent.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#672C1C] hover:bg-[#481B0F] transition-colors shrink-0"
                  >
                    <span>Open External Form</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#AE7B29]" />
                  </a>
                </div>
              )}

              {/* Grid of Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="reg-fullname" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    Full Name <span className="text-[#AE7B29]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#AE7B29] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="reg-fullname"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                        errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    Email Address <span className="text-[#AE7B29]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#AE7B29] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@university.edu"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                        errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    Phone Number <span className="text-[#AE7B29]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#AE7B29] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 012-3456"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                        errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* University or College Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="reg-university" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    University / College Name <span className="text-[#AE7B29]">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#AE7B29] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="reg-university"
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="e.g. State University (Main Campus)"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                        errors.university ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                      }`}
                    />
                  </div>
                  {errors.university && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.university}
                    </p>
                  )}
                </div>

                {/* Department or Course */}
                <div>
                  <label htmlFor="reg-department" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    Course / Department <span className="text-[#AE7B29]">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#AE7B29] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="reg-department"
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech Computer Science"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                        errors.department ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                      }`}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Year of Study */}
                <div>
                  <label htmlFor="reg-year" className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5">
                    Year of Study <span className="text-[#AE7B29]">*</span>
                  </label>
                  <select
                    id="reg-year"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-[#FAF6F4] text-sm text-[#2B1209] transition-all outline-none border ${
                      errors.yearOfStudy ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(103,44,28,0.15)] focus:border-[#AE7B29]'
                    }`}
                  >
                    <option value="">Select current year...</option>
                    <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                    <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                    <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                    <option value="4th Year (Senior)">4th Year (Senior)</option>
                    <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                  </select>
                  {errors.yearOfStudy && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.yearOfStudy}
                    </p>
                  )}
                </div>

              </div>

              {/* Submission Button */}
              <div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#AE7B29]" />
                      <span>Processing Registration...</span>
                    </>
                  ) : currentEvent && currentEvent.externalUrl ? (
                    <>
                      <span>Open External Registration</span>
                      <ExternalLink className="w-4 h-4 text-[#AE7B29]" />
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-4 h-4 text-[#AE7B29]" />
                      <span>Submit Event Registration</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Privacy and demo disclaimer note */}
              <p className="text-center text-[11px] text-[#66534B] mt-4">
                Note: Registrations are open to enrolled university and partner college students. By submitting, you agree to attend on scheduled venue timing.
              </p>
            </form>
          )}

        </motion.div>

      </div>
    </section>
  );
}
