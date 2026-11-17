import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  Hash, 
  IdCard, 
  BookOpen, 
  MessageSquare, 
  ArrowRight, 
  Users, 
  Loader2, 
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { registerClubMember, checkMemberDuplicate } from '../services/memberService';
import { getVisitorGeoLocale } from '../services/api';

export function JoinTeamModal({ isOpen, onClose, onSuccessViewMembers }) {
  const [visitorLocale, setVisitorLocale] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    faculty: '',
    designation: 'Student', // 'Student' | 'Faculty' | 'Staff'
    registrationNo: '',
    rollNo: '',
    branch: '',
    valueAddition: ''
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState(null); // { title, message, type }
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Common Branches for Quick Select
  const commonBranches = [
    "Computer Science & Engineering (CSE)",
    "Information Technology (IT)",
    "Artificial Intelligence & Data Science (AI & DS)",
    "Electronics & Communication Engineering (ECE)",
    "Master of Computer Applications (MCA)",
    "Bachelor of Computer Applications (BCA)",
    "Mechanical Engineering",
    "Faculty of Management / MBA",
    "Other Department / Specialization"
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      getVisitorGeoLocale().then(loc => setVisitorLocale(loc));
      setFormData({
        name: '',
        email: '',
        phone: '',
        faculty: '',
        designation: 'Student',
        registrationNo: '',
        rollNo: '',
        branch: '',
        valueAddition: ''
      });
      setTouched({});
      setDuplicateAlert(null);
      setSubmissionSuccess(null);
      setIsSubmitting(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (!duplicateAlert && !submissionSuccess) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, duplicateAlert, submissionSuccess, onClose]);

  // Trigger celebration confetti upon success
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#672C1C', '#AE7B29', '#D8A54E', '#F6E4C4', '#2B2320']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#AE7B29', '#672C1C', '#FFFFFF']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#AE7B29', '#672C1C', '#FFFFFF']
        });
      }, 250);
    } catch {
      // safe fallback
    }
  };

  // Form Field Validation Rules
  const validationErrors = useMemo(() => {
    const errors = {};
    const isStudent = formData.designation === 'Student';

    // 1. Full Name
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    // 2. Email ID
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // 3. Phone Number (10 digits Indian format)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    // 4. Faculty / Department
    if (!formData.faculty.trim()) {
      errors.faculty = 'Faculty / Department is required.';
    } else if (formData.faculty.trim().length < 2) {
      errors.faculty = 'Please enter a valid faculty or department.';
    }

    // 5. Designation (Student / Faculty / Staff)
    if (!['Student', 'Faculty', 'Staff'].includes(formData.designation)) {
      errors.designation = 'Please select a valid designation.';
    }

    // 6. Student-Specific Fields
    if (isStudent) {
      if (!formData.registrationNo.trim()) {
        errors.registrationNo = 'Registration Number is required for students.';
      } else if (formData.registrationNo.trim().length < 3) {
        errors.registrationNo = 'Please enter a valid Registration Number.';
      }

      if (!formData.rollNo.trim()) {
        errors.rollNo = 'Roll Number is required for students.';
      } else if (formData.rollNo.trim().length < 3) {
        errors.rollNo = 'Please enter a valid Roll Number.';
      }

      if (!formData.branch.trim()) {
        errors.branch = 'Branch / Department is required for students.';
      }
    }

    // 7. Value to IT Club
    if (!formData.valueAddition.trim()) {
      errors.valueAddition = 'Please tell us what value you will add to the club.';
    } else if (formData.valueAddition.trim().length < 15) {
      errors.valueAddition = 'Please share at least a short sentence explaining your contribution (min 15 chars).';
    }

    return errors;
  }, [formData]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all relevant fields as touched
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      faculty: true,
      designation: true,
      valueAddition: true
    };
    if (formData.designation === 'Student') {
      allTouched.registrationNo = true;
      allTouched.rollNo = true;
      allTouched.branch = true;
    }
    setTouched(allTouched);

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    setDuplicateAlert(null);

    try {
      const result = await registerClubMember(formData);

      if (!result.success && result.duplicateInfo) {
        // Duplicate detected! Show dedicated popup
        setDuplicateAlert(result.duplicateInfo);
        setIsSubmitting(false);
        return;
      }

      if (result.success) {
        setSubmissionSuccess(result.member);
        triggerCelebration();
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setDuplicateAlert({
        title: "Registration Interrupted",
        message: "We encountered an issue saving your registration. Please verify your connection and try again.",
        type: "system"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStudent = formData.designation === 'Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
        className="relative w-full max-w-2xl bg-[#FFFDF9] border border-[#AE7B29]/30 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* 1. MODAL HEADER */}
        {/* ================================================================= */}
        <div className="relative px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
                <UserPlus className="w-6 h-6 text-[#D8A54E]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#AE7B29]/30 border border-[#D8A54E]/30 text-[10px] font-bold tracking-wider uppercase text-[#F6E4C4] mb-1">
                  <Sparkles className="w-3 h-3 text-[#D8A54E]" />
                  Official IT Club Community
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  Join SSU IT Club
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D8A54E]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            Become an active member of Sri Sri University's IT Club. Build, collaborate, learn, and grow together.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 2. MODAL FORM CONTENT (Scrollable) */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-sans">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* SECTION A: COMMON INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#AE7B29]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#AE7B29]">
                  Step 1 • Common Information
                </span>
                <span className="text-[11px] text-[#66534B]/70">(Mandatory for all members)</span>
              </div>

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                  Full Name <span className="text-[#672C1C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Ayush Singh"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                      touched.name && validationErrors.name 
                        ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                        : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                    }`}
                  />
                </div>
                {touched.name && validationErrors.name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{validationErrors.name}</span>
                  </p>
                )}
              </div>

              {/* 2. Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                    Email ID <span className="text-[#672C1C]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="your.email@srisriuniversity.edu.in"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                        touched.email && validationErrors.email 
                          ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                          : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                      }`}
                    />
                  </div>
                  {touched.email && validationErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{validationErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                    Phone Number <span className="text-[#672C1C]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder={visitorLocale?.callingCode ? `${visitorLocale.callingCode} 10-digit mobile` : "10-digit mobile number"}
                      maxLength={14}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                        touched.phone && validationErrors.phone 
                          ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                          : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                      }`}
                    />
                  </div>
                  {touched.phone && validationErrors.phone && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{validationErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Faculty / Department & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Faculty */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                    Faculty / Department <span className="text-[#672C1C]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      onBlur={() => handleBlur('faculty')}
                      placeholder="e.g. Faculty of Engineering & Technology"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                        touched.faculty && validationErrors.faculty 
                          ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                          : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                      }`}
                    />
                  </div>
                  {touched.faculty && validationErrors.faculty && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{validationErrors.faculty}</span>
                    </p>
                  )}
                </div>

                {/* Designation Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                    Designation <span className="text-[#672C1C]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                      {formData.designation === 'Student' ? (
                        <GraduationCap className="w-4 h-4 text-[#AE7B29]" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-[#AE7B29]" />
                      )}
                    </div>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-white/80 text-[#2B2320] focus:outline-none focus:border-[#672C1C] focus:ring-2 focus:ring-[#AE7B29]/40 appearance-none cursor-pointer transition-all font-medium"
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#66534B]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: CONDITIONAL STUDENT INFORMATION */}
            <AnimatePresence>
              {isStudent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-[#AE7B29]/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#672C1C] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#AE7B29]" />
                      Step 2 • Student Information
                    </span>
                    <span className="text-[11px] text-[#66534B]/70">(Mandatory for Students)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Registration Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                        Registration Number <span className="text-[#672C1C]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                          <Hash className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="registrationNo"
                          value={formData.registrationNo}
                          onChange={handleChange}
                          onBlur={() => handleBlur('registrationNo')}
                          placeholder="e.g. 202500567"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm uppercase bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                            touched.registrationNo && validationErrors.registrationNo 
                              ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                              : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                          }`}
                        />
                      </div>
                      {touched.registrationNo && validationErrors.registrationNo && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{validationErrors.registrationNo}</span>
                        </p>
                      )}
                    </div>

                    {/* Roll Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                        Roll Number <span className="text-[#672C1C]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                          <IdCard className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="rollNo"
                          value={formData.rollNo}
                          onChange={handleChange}
                          onBlur={() => handleBlur('rollNo')}
                          placeholder="e.g. 1ETBTS20251019"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm uppercase bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                            touched.rollNo && validationErrors.rollNo 
                              ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                              : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                          }`}
                        />
                      </div>
                      {touched.rollNo && validationErrors.rollNo && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{validationErrors.rollNo}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                      Branch / Department <span className="text-[#672C1C]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#66534B]/50">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        onBlur={() => handleBlur('branch')}
                        placeholder="e.g. B. Tech (CSCD) or select from recommendations below"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 transition-all ${
                          touched.branch && validationErrors.branch 
                            ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                            : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                        }`}
                      />
                    </div>
                    {/* Quick Branch Suggestions */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {commonBranches.slice(0, 5).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, branch: b }));
                            setTouched(prev => ({ ...prev, branch: true }));
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                            formData.branch === b
                              ? 'bg-[#672C1C] text-white border-[#672C1C]'
                              : 'bg-white hover:bg-[#FAF6F4] text-[#66534B] border-[#AE7B29]/20'
                          }`}
                        >
                          {b.split('(')[0].trim()}
                        </button>
                      ))}
                    </div>
                    {touched.branch && validationErrors.branch && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{validationErrors.branch}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SECTION C: ADDITIONAL INFORMATION (Mandatory for Everyone) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#AE7B29]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#AE7B29] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#AE7B29]" />
                  Step {isStudent ? '3' : '2'} • Value Addition Statement
                </span>
                <span className="text-[11px] text-[#66534B]/70">(Mandatory for Everyone)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                  What value will you add to our SSU IT Club? <span className="text-[#672C1C]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    name="valueAddition"
                    value={formData.valueAddition}
                    onChange={handleChange}
                    onBlur={() => handleBlur('valueAddition')}
                    placeholder="Tell us about your skills, interests, experience, ideas, or how you would contribute to our club..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white/80 text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 resize-none transition-all leading-relaxed ${
                      touched.valueAddition && validationErrors.valueAddition 
                        ? 'border-red-400 focus:ring-red-400 bg-red-50/20' 
                        : 'border-[#AE7B29]/30 focus:border-[#672C1C] focus:ring-[#AE7B29]/40'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px] text-[#66534B]/70 px-1">
                    <span>Be descriptive: share your tech skills, event ideas, design passion, or coordination drive.</span>
                    <span className={formData.valueAddition.trim().length >= 15 ? 'text-green-600 font-medium' : 'text-[#66534B]/50'}>
                      {formData.valueAddition.trim().length} chars
                    </span>
                  </div>
                </div>
                {touched.valueAddition && validationErrors.valueAddition && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{validationErrors.valueAddition}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Assurance Pill */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#AE7B29] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#66534B] leading-relaxed">
                <span className="font-semibold text-[#672C1C]">Strict Member Privacy: </span>
                Your personal Email, Phone Number, and Roll/Registration Numbers are kept completely confidential and will <strong className="text-[#2B2320]">NEVER</strong> be displayed on the public member roster.
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-[#AE7B29]/20 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#AE7B29]/40 text-xs sm:text-sm font-semibold text-[#66534B] hover:bg-[#FAF6F4] transition-all focus:outline-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 ${
                  !isFormValid || isSubmitting
                    ? 'bg-[#672C1C]/40 text-white/60 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] hover:brightness-110 active:scale-[0.98] shadow-[#672C1C]/25 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D8A54E]" />
                    <span>Verifying & Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Membership</span>
                    <ArrowRight className="w-4 h-4 text-[#D8A54E]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ================================================================= */}
        {/* 3. DEDICATED DUPLICATE REGISTRATION POPUP MODAL */}
        {/* ================================================================= */}
        <AnimatePresence>
          {duplicateAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-red-200 text-center relative"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shadow-inner">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-serif font-bold text-[#672C1C] mb-3">
                  {duplicateAlert.title || 'Duplicate Registration Detected!'}
                </h3>

                <p className="text-sm text-[#4A3E39] leading-relaxed mb-6 font-sans">
                  {duplicateAlert.message}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={() => setDuplicateAlert(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#672C1C] to-[#7B3522] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                  >
                    Review Information
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================= */}
        {/* 4. DEDICATED SUCCESS POPUP MODAL */}
        {/* ================================================================= */}
        <AnimatePresence>
          {submissionSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FAF6F4] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#AE7B29]/40 text-center relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#AE7B29]/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#672C1C]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Animated Success Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#672C1C] via-[#AE7B29] to-[#D8A54E] p-0.5 shadow-xl flex items-center justify-center"
                >
                  <div className="w-full h-full bg-[#FFFDF9] rounded-[22px] flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#AE7B29]" />
                  </div>
                </motion.div>

                {/* Exact requested Title */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mb-3 leading-snug">
                  🎉 Congratulations! You're Now Part of SSU IT Club!
                </h3>

                {/* Exact requested Message */}
                <div className="text-xs sm:text-sm text-[#4A3E39] font-sans leading-relaxed space-y-2 mb-6 px-2">
                  <p className="font-semibold text-[#2B2320]">
                    Congratulations! You are now officially part of our SSU IT Club community.
                  </p>
                  <p>
                    Thank you for joining us and becoming a part of our journey.
                  </p>
                  <p className="text-green-800 font-medium">
                    Your registration has been successfully submitted.
                  </p>
                  <p>
                    Please check the <strong>'View Our Club Members'</strong> section to verify whether your name has been successfully added to our members list.
                  </p>
                  <p className="font-serif italic text-base text-[#672C1C] pt-1">
                    Welcome to the team!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      if (onSuccessViewMembers) {
                        onSuccessViewMembers();
                      } else {
                        onClose();
                      }
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 shadow-lg shadow-[#672C1C]/30 transition-all cursor-pointer group"
                  >
                    <Users className="w-4 h-4 text-[#D8A54E] group-hover:scale-110 transition-transform" />
                    <span>Explore Our Club Members</span>
                    <ArrowRight className="w-4 h-4 text-[#D8A54E] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#AE7B29]/40 text-xs sm:text-sm font-semibold text-[#66534B] hover:bg-white/80 transition-all"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default JoinTeamModal;
