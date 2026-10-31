import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Briefcase,
  Layers,
  Target,
  FileText,
  Check,
  RotateCcw,
  Download,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  Code2
} from 'lucide-react';
import {
  PROJECT_DOMAINS,
  BRANCH_OPTIONS,
  PROGRAM_OPTIONS,
  SAMPLE_PROPOSALS
} from '../data/sampleProposals';
import { submitProposal, validateProposalForm } from '../utils/projectProposals';

export function ProjectProposal() {
  // Proposer role: 'student' | 'faculty'
  const [role, setRole] = useState('student');

  // Form State
  const [formData, setFormData] = useState({
    proposerName: '',
    email: '',
    phone: '',
    branch: '',
    program: '',
    academicId: '',
    title: '',
    domain: 'web',
    timeline: 'Current Semester (Immediate Need)',
    problemStatement: '',
    explanation: '',
    objectives: [],
    additionalNotes: ''
  });

  // Current objective input for the dynamic checklist builder
  const [currentObjective, setCurrentObjective] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [showSampleDrawer, setShowSampleDrawer] = useState(false);

  // Quick suggestion chips to add objectives quickly
  const quickObjectiveSuggestions = [
    "Real-time Dashboard & Analytics",
    "Automated Email / SMS Notifications",
    "Student & Faculty Role-based Login",
    "Mobile-friendly Responsive Web Interface",
    "Automated PDF Report & Certificate Generation",
    "QR Code / Barcode Scanning Integration",
    "Centralized Cloud Database Storage"
  ];

  // Calculate live completion percentage for the interactive blueprint
  const calculateProgress = () => {
    let score = 0;
    const total = 9; // 9 key factors
    if (formData.proposerName.trim().length >= 2) score++;
    if (formData.email.trim().length > 5) score++;
    if (formData.phone.trim().length >= 8) score++;
    if (formData.branch) score++;
    if (formData.program) score++;
    if (formData.title.trim().length >= 5) score++;
    if (formData.problemStatement.trim().length >= 15) score++;
    if (formData.explanation.trim().length >= 25) score++;
    if (formData.objectives.length > 0) score++;
    return Math.round((score / total) * 100);
  };

  const progressPercentage = calculateProgress();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Add objective to list
  const handleAddObjective = () => {
    const trimmed = currentObjective.trim();
    if (!trimmed) return;
    if (formData.objectives.includes(trimmed)) {
      setErrors(prev => ({ ...prev, objectives: "This objective is already added to your list." }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, trimmed]
    }));
    setCurrentObjective('');
    if (errors.objectives) {
      setErrors(prev => ({ ...prev, objectives: null }));
    }
  };

  // Quick add from suggestion tags
  const handleQuickAddObjective = (suggestion) => {
    if (formData.objectives.includes(suggestion)) return;
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, suggestion]
    }));
    if (errors.objectives) {
      setErrors(prev => ({ ...prev, objectives: null }));
    }
  };

  // Remove objective
  const handleRemoveObjective = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Pre-fill form from sample proposal to help users get inspired
  const handleUseSample = (sample) => {
    setRole(sample.role);
    setFormData({
      proposerName: sample.proposerName,
      email: `${sample.proposerName.toLowerCase().replace(/\s+/g, '.')}${sample.role === 'faculty' ? '@srisriuniversity.edu.in' : '@student.srisriuniversity.edu.in'}`,
      phone: "+91 98765 43210",
      branch: sample.branch,
      program: sample.program,
      academicId: sample.role === 'faculty' ? "FAC-EMP-1082" : "2024-BTECH-CSE-045",
      title: sample.title,
      domain: PROJECT_DOMAINS.find(d => d.name === sample.domain)?.id || 'web',
      timeline: "Current Semester (Immediate Need)",
      problemStatement: sample.problemStatement,
      explanation: sample.explanation,
      objectives: [...sample.objectives],
      additionalNotes: "Inspired by IT Cell sample idea catalog."
    });
    setErrors({});
    setShowSampleDrawer(false);

    // Scroll slightly down to form smoothly
    const formEl = document.getElementById('proposal-form-card');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role
    };

    const validation = validateProposalForm(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to the first error container
      const firstErrorKey = Object.keys(validation.errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await submitProposal(payload);
      setSubmittedResult(result);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#672C1C', '#AE7B29', '#D8A54E', '#481B0F', '#FAF6F4']
        });
      } catch (err) {
        // Safe confetti fallback
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: 'An error occurred while submitting your proposal. Please verify all fields.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setFormData({
      proposerName: '',
      email: '',
      phone: '',
      branch: '',
      program: '',
      academicId: '',
      title: '',
      domain: 'web',
      timeline: 'Current Semester (Immediate Need)',
      problemStatement: '',
      explanation: '',
      objectives: [],
      additionalNotes: ''
    });
    setCurrentObjective('');
    setErrors({});
  };

  const selectedDomainObj = PROJECT_DOMAINS.find(d => d.id === formData.domain) || PROJECT_DOMAINS[0];

  return (
    <section
      id="proposals"
      className="py-20 lg:py-28 bg-[#FAF6F4] relative overflow-hidden"
    >
      {/* Decorative architectural background grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />

      {/* Warm ambient backlights */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[rgba(103,44,28,0.06)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[rgba(174,123,41,0.08)] rounded-full blur-3xl pointer-events-none" />

      {/* Top gold divider accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#AE7B29]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================================================================= */}
        {/* 1. SECTION HEADER WITH CALL-TO-ACTION */}
        {/* ================================================================= */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/40 mb-3 shadow-xs">
            <Lightbulb className="w-4 h-4 text-[#AE7B29] animate-pulse" />
            <span>CAMPUS INNOVATION INCUBATOR • SSU IT CELL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-4">
            Propose a Project.{' '}
            <span className="text-gold-gradient italic font-serif">Bring Ideas to Life.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#66534B] leading-relaxed">
            Have you spotted a campus workflow that needs automation, an academic challenge, or an innovative app idea?
            Whether you are a <strong>student</strong> or a <strong>faculty member</strong>, propose your project directly to the SSU IT Cell.
            Our developer squads collaborate with you to build, test, and deploy practical solutions.
          </p>

          {/* Toggle sample proposals guide */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowSampleDrawer(!showSampleDrawer)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white hover:bg-[#FCF9F3] border border-[#AE7B29]/60 shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span>{showSampleDrawer ? 'Hide Sample Approved Ideas' : 'Explore Sample Approved Proposals & Ideas'}</span>
              {showSampleDrawer ? <ChevronUp className="w-4 h-4 text-[#AE7B29]" /> : <ChevronDown className="w-4 h-4 text-[#AE7B29]" />}
            </button>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* 2. COLLAPSIBLE SAMPLE PROPOSALS DRAWER */}
        {/* ================================================================= */}
        <AnimatePresence>
          {showSampleDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#AE7B29]/40 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(103,44,28,0.1)]">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#672C1C]">
                      Real-World Proposal Inspiration
                    </h3>
                    <p className="text-xs text-[#66534B]">
                      Inspect how students and faculty format problem statements and solution objectives. Click any sample to test-load its structure into the form.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SAMPLE_PROPOSALS.map((sample) => (
                    <div
                      key={sample.id}
                      className="bg-[#FAF6F4] rounded-2xl p-5 border border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sample.role === 'faculty' ? 'bg-[#672C1C] text-[#D8A54E]' : 'bg-[#AE7B29]/20 text-[#672C1C]'
                            }`}>
                            {sample.role === 'faculty' ? 'Faculty Lead' : 'Student Idea'}
                          </span>
                          <span className="text-[11px] font-medium text-[#AE7B29] font-mono">
                            {sample.domain}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#672C1C] leading-snug mb-2 font-serif">
                          {sample.title}
                        </h4>

                        <p className="text-xs text-[#66534B] leading-relaxed line-clamp-3 mb-3">
                          {sample.problemStatement}
                        </p>

                        <div className="text-[11px] text-stone-500 font-medium mb-3">
                          <strong>Proposer:</strong> {sample.proposerName} ({sample.branch})
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUseSample(sample)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#672C1C] bg-white hover:bg-[#FCF9F3] border border-[#AE7B29]/50 transition-colors shadow-2xs group"
                      >
                        <span>Use This Structure As Template</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#AE7B29] transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================= */}
        {/* 3. MAIN SECTION: SUCCESS CONFIRMATION OR INTERACTIVE FORM */}
        {/* ================================================================= */}
        {submittedResult ? (
          /* =============================================================== */
          /* PROPOSAL SUBMISSION SUCCESS PASS & SUMMARY */
          /* =============================================================== */
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#AE7B29] shadow-2xl animate-in zoom-in-95 duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Header Status */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#FAF6F4] text-[#672C1C] flex items-center justify-center mx-auto mb-4 border-2 border-[#AE7B29] shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-[#AE7B29]" />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#AE7B29] uppercase block mb-1">
                Project Proposal Successfully Logged
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#672C1C]">
                {submittedResult.project.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="text-xs font-mono font-bold text-[#672C1C] bg-[#FAF6F4] px-3.5 py-1.5 rounded-full border border-[rgba(103,44,28,0.15)] shadow-xs">
                  TRACKING REF: <strong className="text-[#AE7B29]">{submittedResult.proposalId}</strong>
                </span>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Status: {submittedResult.status}
                </span>
              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div className="bg-[#FCF9F3] rounded-2xl p-5 border border-[#AE7B29]/40 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#672C1C] flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#AE7B29]" />
                <span>What Happens Next (SSU IT Cell Review Workflow)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[rgba(103,44,28,0.1)]">
                  <span className="w-5 h-5 rounded-full bg-[#672C1C] text-white flex items-center justify-center text-[10px] font-bold mb-1">1</span>
                  <strong className="block text-[#672C1C] font-semibold">Technical Evaluation</strong>
                  <span className="text-[#66534B] text-[11px]">IT Cell technical leads assess project feasibility & stack suitability.</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[rgba(103,44,28,0.1)]">
                  <span className="w-5 h-5 rounded-full bg-[#AE7B29] text-white flex items-center justify-center text-[10px] font-bold mb-1">2</span>
                  <strong className="block text-[#672C1C] font-semibold">Proposer Discussion</strong>
                  <span className="text-[#66534B] text-[11px]">We reach back via email or WhatsApp to clarify scope and milestones.</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[rgba(103,44,28,0.1)]">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mb-1">3</span>
                  <strong className="block text-[#672C1C] font-semibold">Squad Assignment</strong>
                  <span className="text-[#66534B] text-[11px]">Assigned to student sprint squads & guided by faculty mentors.</span>
                </div>
              </div>
            </div>

            {/* Submission Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF6F4] border border-[rgba(103,44,28,0.12)] mb-8 text-xs">
              <div>
                <span className="text-[#66534B] block text-[11px]">Proposer</span>
                <span className="font-bold text-[#672C1C] text-sm">
                  {submittedResult.proposer.name} ({submittedResult.proposer.role.toUpperCase()})
                </span>
              </div>
              <div>
                <span className="text-[#66534B] block text-[11px]">Branch / Department</span>
                <span className="font-semibold text-[#672C1C] text-xs">{submittedResult.proposer.branch}</span>
              </div>
              <div>
                <span className="text-[#66534B] block text-[11px]">Program / Role</span>
                <span className="font-semibold text-[#672C1C]">{submittedResult.proposer.program}</span>
              </div>
              <div>
                <span className="text-[#66534B] block text-[11px]">Contact Email</span>
                <span className="font-semibold text-[#672C1C]">{submittedResult.proposer.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#66534B] block text-[11px]">Core Problem Statement</span>
                <p className="text-[#2B1209] font-normal leading-relaxed mt-0.5">
                  {submittedResult.project.problemStatement}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#66534B] block text-[11px] mb-1">What This Project Solves (Key Objectives)</span>
                <ul className="space-y-1">
                  {submittedResult.project.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#672C1C] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#AE7B29] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(103,44,28,0.12)]">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/60 hover:bg-[#FAF6F4] shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-[#AE7B29]" />
                <span>Print / Save Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#AE7B29]" />
                <span>Submit Another Proposal</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* =============================================================== */
          /* DUAL-COLUMN PROPOSAL INTERFACE (FORM + LIVE REAL-TIME BLUEPRINT) */
          /* =============================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ============================================================= */}
            {/* LEFT COLUMN: INTERACTIVE PROPOSAL FORM (7 COLS) */}
            {/* ============================================================= */}
            <motion.div
              id="proposal-form-card"
              className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-[rgba(103,44,28,0.15)] shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <form onSubmit={handleSubmit} className="space-y-7" noValidate>

                {/* ----------------------------------------------------------- */}
                {/* 1. ROLE SELECTOR: STUDENT VS FACULTY */}
                {/* ----------------------------------------------------------- */}
                <div id="field-role">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Step 1: I am Submitting As *</span>
                    </span>
                    <span className="text-[11px] font-normal text-stone-500 font-mono">
                      [ Select Role ]
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Student Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('student');
                        if (errors.role) setErrors(prev => ({ ...prev, role: null }));
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${role === 'student'
                        ? 'bg-[#FCF9F3] border-[#AE7B29] shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${role === 'student' ? 'bg-[#672C1C] text-white' : 'bg-stone-100 text-stone-500'
                        }`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-[#672C1C]">
                          Student Proposal
                        </span>
                        <span className="text-[11px] text-[#66534B] leading-tight block mt-0.5">
                          Undergraduate, Postgraduate, or Research Scholar idea
                        </span>
                      </div>
                    </button>

                    {/* Faculty Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('faculty');
                        if (errors.role) setErrors(prev => ({ ...prev, role: null }));
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${role === 'faculty'
                        ? 'bg-[#FCF9F3] border-[#AE7B29] shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${role === 'faculty' ? 'bg-[#672C1C] text-white' : 'bg-stone-100 text-stone-500'
                        }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-[#672C1C]">
                          Faculty / Staff Lead
                        </span>
                        <span className="text-[11px] text-[#66534B] leading-tight block mt-0.5">
                          Departmental workflow automation or research project
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 2. PROPOSER PROFILE DETAILS */}
                {/* ----------------------------------------------------------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div id="field-proposerName">
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>{role === 'faculty' ? 'Faculty Full Name' : 'Student Full Name'} *</span>
                    </label>
                    <input
                      type="text"
                      name="proposerName"
                      value={formData.proposerName}
                      onChange={handleInputChange}
                      placeholder={role === 'faculty' ? 'e.g. Dr. Akashat' : 'e.g. Ayush Singh'}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.proposerName ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                        }`}
                    />
                    {errors.proposerName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.proposerName}</span>
                      </p>
                    )}
                  </div>

                  {/* Academic Email */}
                  <div id="field-email">
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Institutional Email *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={role === 'faculty' ? 'faculty.name@srisriuniversity.edu.in' : 'student.roll@srisriuniversity.edu.in'}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.email ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                        }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div id="field-phone">
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Contact / WhatsApp No. *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.phone ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                        }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Student Roll No or Faculty ID (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5">
                      {role === 'faculty' ? 'Faculty Employee Code (Optional)' : 'Student Registration / Roll No (Optional)'}
                    </label>
                    <input
                      type="text"
                      name="academicId"
                      value={formData.academicId}
                      onChange={handleInputChange}
                      placeholder={role === 'faculty' ? 'e.g. SSU-FAC-2041' : 'e.g. 2024-BTECH-019'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(103,44,28,0.2)] text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20 transition-colors"
                    />
                  </div>

                  {/* Branch / Department Dropdown */}
                  <div id="field-branch">
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5">
                      Department / Branch *
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.branch ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                        }`}
                    >
                      <option value="">-- Select Your Branch / Department --</option>
                      {BRANCH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.branch && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.branch}</span>
                      </p>
                    )}
                  </div>

                  {/* Program / Academic Designation Dropdown */}
                  <div id="field-program">
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5">
                      {role === 'faculty' ? 'Academic Designation *' : 'Program / Degree *'}
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.program ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                        }`}
                    >
                      <option value="">
                        {role === 'faculty' ? '-- Select Faculty Designation --' : '-- Select Degree / Program --'}
                      </option>
                      {PROGRAM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.program && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.program}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgba(103,44,28,0.15)] to-transparent" />

                {/* ----------------------------------------------------------- */}
                {/* 3. PROJECT TITLE & DOMAIN SELECTION */}
                {/* ----------------------------------------------------------- */}
                <div id="field-title">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Step 2: Proposed Project Title *</span>
                    </span>
                    <span className="text-[11px] font-normal text-stone-500 font-mono">
                      {formData.title.length}/80 chars
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    maxLength={80}
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Automated Student Lost & Found Portal with Image Matching"
                    className={`w-full px-4 py-3 rounded-xl border text-sm sm:text-base font-semibold text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.title ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                      }`}
                  />
                  {errors.title && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                {/* Primary Technology Domain Chips */}
                <div id="field-domain">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-2">
                    Primary Project Domain *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROJECT_DOMAINS.map((dom) => {
                      const Icon = dom.icon;
                      const isSelected = formData.domain === dom.id;
                      return (
                        <button
                          key={dom.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, domain: dom.id }))}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${isSelected
                            ? 'bg-[#672C1C] text-white border-[#AE7B29] shadow-sm'
                            : 'bg-[#FAF6F4]/60 hover:bg-[#FCF9F3] text-[#2B1209] border-[rgba(103,44,28,0.12)]'
                            }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D8A54E]' : 'text-[#AE7B29]'}`} />
                          <span className="text-xs font-bold leading-tight truncate">
                            {dom.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 4. PROBLEM STATEMENT & IN-DEPTH EXPLANATION */}
                {/* ----------------------------------------------------------- */}
                <div id="field-problemStatement">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5 flex items-center justify-between">
                    <span>Core Problem Statement (Summary) *</span>
                    <span className="text-[11px] font-normal text-stone-500 font-mono">
                      Min 15 chars ({formData.problemStatement.length})
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    name="problemStatement"
                    value={formData.problemStatement}
                    onChange={handleInputChange}
                    placeholder="Briefly state the exact bottleneck or problem. e.g. Currently, student lab component borrowing is logged in paper registers, leading to lost microcontrollers and zero inventory visibility."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.problemStatement ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                      }`}
                  />
                  {errors.problemStatement && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.problemStatement}</span>
                    </p>
                  )}
                </div>

                {/* Detailed Explanation */}
                <div id="field-explanation">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#672C1C] mb-1.5 flex items-center justify-between">
                    <span>Problem Statement Explanation & Context *</span>
                    <span className="text-[11px] font-normal text-stone-500 font-mono">
                      Min 25 chars ({formData.explanation.length})
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleInputChange}
                    placeholder="Explain the background in detail: Who experiences this problem? Why do existing manual solutions or spreadsheets fail? What happens if this issue remains unaddressed?"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none transition-colors ${errors.explanation ? 'border-red-500 ring-1 ring-red-400' : 'border-[rgba(103,44,28,0.2)] focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20'
                      }`}
                  />
                  {errors.explanation && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.explanation}</span>
                    </p>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgba(103,44,28,0.15)] to-transparent" />

                {/* ----------------------------------------------------------- */}
                {/* 5. WHAT THIS PROJECT WILL SOLVE (DYNAMIC CHECKLIST BUILDER) */}
                {/* ----------------------------------------------------------- */}
                <div id="field-objectives">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#672C1C] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Step 3: What Will This Project Solve? (Key Objectives) *</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#AE7B29] font-bold">
                      {formData.objectives.length} Added
                    </span>
                  </div>

                  <p className="text-xs text-[#66534B] mb-3">
                    Add specific pain points, features, or deliverables you want the IT Cell to resolve through this project.
                  </p>

                  {/* Input + Add Button */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={currentObjective}
                      onChange={(e) => setCurrentObjective(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddObjective();
                        }
                      }}
                      placeholder="e.g. Provide instant barcode check-out for lab equipment..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[rgba(103,44,28,0.2)] text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-[#D8A54E]" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Quick-add recommendation chips */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                      Quick Suggestions (Click to add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickObjectiveSuggestions.map((sug, i) => {
                        const isAdded = formData.objectives.includes(sug);
                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleQuickAddObjective(sug)}
                            className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors border ${isAdded
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-default'
                              : 'bg-white hover:bg-[#FAF6F4] text-[#672C1C] border-[#AE7B29]/30 hover:border-[#AE7B29]'
                              }`}
                          >
                            + {sug}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Added Objectives List */}
                  {formData.objectives.length > 0 ? (
                    <div className="space-y-2 bg-[#FAF6F4] p-3 rounded-2xl border border-[rgba(103,44,28,0.12)]">
                      {formData.objectives.map((obj, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-[rgba(103,44,28,0.1)] text-xs shadow-2xs group"
                        >
                          <div className="flex items-start gap-2 text-[#672C1C] font-medium leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(index)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                            title="Remove objective"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 text-center text-xs text-amber-800">
                      No objectives added yet. Type a solution point above or click quick suggestions!
                    </div>
                  )}

                  {errors.objectives && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.objectives}</span>
                    </p>
                  )}
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 6. TIMELINE & ADDITIONAL NOTES */}
                {/* ----------------------------------------------------------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Target Implementation Timeline</span>
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(103,44,28,0.2)] text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20 transition-colors"
                    >
                      <option value="Current Semester (Immediate Need)">Current Semester (Immediate Need)</option>
                      <option value="Upcoming Vacation / Sprint Build">Upcoming Vacation / Sprint Build</option>
                      <option value="Annual Hackathon Showcase Entry">Annual Hackathon Showcase Entry</option>
                      <option value="Long-Term Institutional Capstone">Long-Term Institutional Capstone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#672C1C] mb-1.5">
                      Recommended Tech / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Prefer React + Node.js or Python backend"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(103,44,28,0.2)] text-sm text-[#2B1209] bg-[#FAF6F4]/50 focus:bg-white focus:outline-none focus:border-[#AE7B29] focus:ring-2 focus:ring-[#AE7B29]/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Submission Error Banner */}
                {errors.general && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#672C1C] via-[#481B0F] to-[#672C1C] hover:from-[#481B0F] hover:to-[#38140B] border border-[#AE7B29] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Logging Project Proposal...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#D8A54E] transition-transform group-hover:translate-x-1" />
                        <span>Submit Project Proposal to IT Cell</span>
                        <Sparkles className="w-4 h-4 text-[#D8A54E]" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-stone-500 text-center mt-2.5 font-normal">
                    By submitting, you agree to collaborate with IT Cell technical leads during discovery & requirements gathering.
                  </p>
                </div>

              </form>
            </motion.div>

            {/* ============================================================= */}
            {/* RIGHT COLUMN: STICKY LIVE PROPOSAL BLUEPRINT & STATUS (5 COLS)*/}
            {/* ============================================================= */}
            <motion.div
              className="lg:col-span-5 sticky top-28 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Live Blueprint Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#AE7B29]/40 shadow-lg relative overflow-hidden">
                {/* Accent top banner */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E]" />

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(103,44,28,0.1)]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#AE7B29]" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#672C1C]">
                      Live Proposal Blueprint
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>REAL-TIME PREVIEW</span>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#66534B] font-medium">Proposal Readiness</span>
                    <span className="font-mono font-bold text-[#672C1C]">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Proposer Badge & Domain Tag */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${role === 'faculty' ? 'bg-[#672C1C] text-[#D8A54E]' : 'bg-[#AE7B29]/20 text-[#672C1C]'
                    }`}>
                    {role === 'faculty' ? 'Faculty Lead' : 'Student Proposer'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#FAF6F4] text-[#672C1C] border border-[rgba(103,44,28,0.15)] flex items-center gap-1.5">
                    {React.createElement(selectedDomainObj.icon, { className: 'w-3.5 h-3.5 text-[#AE7B29]' })}
                    <span>{selectedDomainObj.name}</span>
                  </span>
                </div>

                {/* Live Title Preview */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Project Working Title:
                  </span>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-[#672C1C] leading-snug">
                    {formData.title || (
                      <span className="italic text-stone-400 font-normal">
                        [ Enter your project title on the left... ]
                      </span>
                    )}
                  </h4>
                </div>

                {/* Proposer Info Preview */}
                <div className="bg-[#FAF6F4] rounded-2xl p-4 mb-4 border border-[rgba(103,44,28,0.1)] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Submitted By:</span>
                    <span className="font-bold text-[#672C1C]">{formData.proposerName || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Department:</span>
                    <span className="font-semibold text-[#672C1C] truncate max-w-[190px]">{formData.branch || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Program / Role:</span>
                    <span className="font-semibold text-[#672C1C] truncate max-w-[190px]">{formData.program || '—'}</span>
                  </div>
                </div>

                {/* Problem Statement Preview */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Problem Summary:
                  </span>
                  <p className="text-xs text-[#2B1209] leading-relaxed line-clamp-3">
                    {formData.problemStatement || (
                      <span className="italic text-stone-400 font-normal">
                        Summarize the core bottleneck you want resolved...
                      </span>
                    )}
                  </p>
                </div>

                {/* Key Objectives Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                      Deliverables To Solve:
                    </span>
                    <span className="text-[10px] font-mono text-[#AE7B29] font-bold">
                      {formData.objectives.length} Item(s)
                    </span>
                  </div>
                  {formData.objectives.length > 0 ? (
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {formData.objectives.map((obj, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5 text-[#672C1C]">
                          <Check className="w-3.5 h-3.5 text-[#AE7B29] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] italic text-stone-400">
                      No key deliverables added yet. Use the objective builder on the left.
                    </p>
                  )}
                </div>

              </div>

              {/* Information & Trust Note */}
              <div className="bg-white rounded-2xl p-5 border border-[#AE7B29]/30 shadow-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#AE7B29] shrink-0 mt-0.5" />
                <div className="text-xs text-[#66534B] leading-relaxed">
                  <strong className="text-[#672C1C] block font-semibold mb-0.5">
                    How IT Cell Incubation Works
                  </strong>
                  Approved projects are assigned dedicated student tech squads, supported by faculty advisors, and provided with university computing infrastructure and certificates.
                </div>
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
}

export default ProjectProposal;
