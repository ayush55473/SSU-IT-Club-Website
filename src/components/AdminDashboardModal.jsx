import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  Hash, 
  IdCard, 
  AlertTriangle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { 
  getAdminMembers, 
  deleteClubMember, 
  exportMembersToCSV, 
  verifyAdminPasscode 
} from '../services/memberService';
import { isSupabaseConfigured } from '../lib/supabase';

export function AdminDashboardModal({ isOpen, onClose }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isAuthenticated) {
        fetchAdminData();
      }
    } else {
      document.body.style.overflow = '';
      setPasscode('');
      setAuthError('');
      setSelectedMemberDetail(null);
      setMemberToDelete(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (selectedMemberDetail) {
          setSelectedMemberDetail(null);
        } else if (memberToDelete) {
          setMemberToDelete(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedMemberDetail, memberToDelete, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    if (!verifyAdminPasscode(passcode)) {
      setAuthError('Incorrect Admin Passcode. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);
    const result = await getAdminMembers(passcode);
    if (result.success) {
      setMembers(result.members);
    } else {
      setAuthError(result.error || 'Failed to load records.');
    }
    setIsLoading(false);
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    const result = await getAdminMembers(passcode || 'SSUITCLUB@2026');
    if (result.success) {
      setMembers(result.members);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    const result = await deleteClubMember(memberToDelete.id, passcode || 'SSUITCLUB@2026');
    if (result.success) {
      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      setDeleteSuccessMsg(`Successfully removed ${memberToDelete.full_name || memberToDelete.name}`);
      setTimeout(() => setDeleteSuccessMsg(''), 4000);
      setMemberToDelete(null);
    }
    setIsDeleting(false);
  };

  // Unique Faculties for filter
  const faculties = useMemo(() => {
    const set = new Set();
    members.forEach(m => {
      if (m.faculty && m.faculty.trim()) {
        set.add(m.faculty.trim());
      }
    });
    return Array.from(set).sort();
  }, [members]);

  // Summary KPI Counts
  const stats = useMemo(() => {
    const total = members.length;
    const students = members.filter(m => (m.designation || '').toLowerCase() === 'student').length;
    const faculty = members.filter(m => (m.designation || '').toLowerCase() === 'faculty').length;
    const staff = members.filter(m => (m.designation || '').toLowerCase() === 'staff').length;
    return { total, students, faculty, staff };
  }, [members]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Designation filter
      if (selectedDesignation !== 'All' && m.designation !== selectedDesignation) {
        return false;
      }
      // Faculty filter
      if (selectedFaculty !== 'All' && m.faculty !== selectedFaculty) {
        return false;
      }
      // Search
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const name = (m.full_name || m.name || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      const phone = (m.phone || '').toLowerCase();
      const reg = (m.registration_no || m.registrationNo || '').toLowerCase();
      const roll = (m.roll_no || m.rollNo || '').toLowerCase();
      const branch = (m.branch || '').toLowerCase();
      const value = (m.value_addition || m.valueAddition || '').toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        reg.includes(query) ||
        roll.includes(query) ||
        branch.includes(query) ||
        value.includes(query)
      );
    });
  }, [members, selectedDesignation, selectedFaculty, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-6xl bg-[#FFFDF9] border border-[#AE7B29]/30 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[94vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#2B1712] via-[#672C1C] to-[#2B1712] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#D8A54E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-white">
                  SSU IT Club — Admin Portal & Private Directory
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/80 text-red-200 border border-red-500/40">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-white/70">
                Authorized access only • Full confidential member records & management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPasscode('');
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 transition-all"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PASSCODE AUTHENTICATION SCREEN */}
        {/* ================================================================= */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#672C1C]/10 border border-[#AE7B29]/30 flex items-center justify-center text-[#672C1C] mb-5 shadow-inner">
              <Lock className="w-8 h-8 text-[#672C1C]" />
            </div>

            <h3 className="text-xl font-serif font-bold text-[#672C1C] mb-2">
              Admin Passcode Required
            </h3>
            <p className="text-xs text-[#66534B] leading-relaxed mb-6">
              This portal displays private, sensitive information including personal Email addresses, Phone numbers, and Roll Numbers. Please enter the club administrator passcode to continue.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66534B]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#AE7B29]/40 bg-white text-sm text-[#2B2320] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/50 tracking-wider font-mono"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-medium">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !passcode}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#672C1C] to-[#7B3522] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Unlock Admin Portal'}
              </button>
            </form>

            <div className="mt-6 text-[11px] text-[#66534B]/70 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Default Master Key: configured in your environment</span>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* AUTHENTICATED ADMIN DASHBOARD VIEW */
          /* ================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* KPI STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-[#FAF6F4] border-b border-[#AE7B29]/20 flex-shrink-0">
              <div className="p-3.5 bg-white rounded-2xl border border-[#AE7B29]/20 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66534B]">Total Members</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C]">{stats.total}</div>
                </div>
                <Users className="w-7 h-7 text-[#AE7B29]/70" />
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#AE7B29]/20 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66534B]">Students</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C]">{stats.students}</div>
                </div>
                <GraduationCap className="w-7 h-7 text-[#AE7B29]/70" />
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#AE7B29]/20 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66534B]">Faculty</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C]">{stats.faculty}</div>
                </div>
                <Building2 className="w-7 h-7 text-[#AE7B29]/70" />
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#AE7B29]/20 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66534B]">Staff</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C]">{stats.staff}</div>
                </div>
                <Briefcase className="w-7 h-7 text-[#AE7B29]/70" />
              </div>
            </div>

            {/* CONTROLS BAR: SEARCH, FILTERS, EXPORT */}
            <div className="p-4 sm:p-6 bg-white border-b border-[#AE7B29]/20 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66534B]/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, email, phone, reg no, branch..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs sm:text-sm bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/50"
                  />
                </div>

                {/* Designation Filter */}
                <select
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FFFDF9] text-[#2B2320] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/50"
                >
                  <option value="All">All Roles</option>
                  <option value="Student">Students Only</option>
                  <option value="Faculty">Faculty Only</option>
                  <option value="Staff">Staff Only</option>
                </select>

                {/* Faculty Filter */}
                {faculties.length > 0 && (
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FFFDF9] text-[#2B2320] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/50 max-w-[180px] truncate"
                  >
                    <option value="All">All Faculties</option>
                    {faculties.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchAdminData}
                  disabled={isLoading}
                  className="p-2 rounded-xl border border-[#AE7B29]/30 hover:bg-[#FAF6F4] text-[#66534B] transition-all"
                  title="Refresh records"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => exportMembersToCSV(filteredMembers, true)}
                  disabled={filteredMembers.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#D8A54E]" />
                  <span>Export Full CSV</span>
                </button>
              </div>
            </div>

            {/* DELETE SUCCESS NOTIFICATION */}
            {deleteSuccessMsg && (
              <div className="px-6 py-2.5 bg-green-50 border-b border-green-200 text-green-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{deleteSuccessMsg}</span>
              </div>
            )}

            {/* TABLE CONTAINER */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs text-[#2B2320]">
                <thead className="bg-[#FAF6F4] text-[#672C1C] uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 border-b border-[#AE7B29]/20 shadow-sm">
                  <tr>
                    <th className="px-4 py-3">S.No.</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Contact Details (Private)</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Faculty / Dept</th>
                    <th className="px-4 py-3">Academic IDs (Private)</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3 text-center">Value Statement</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#AE7B29]/10">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-[#66534B]">
                        No members found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m, idx) => (
                      <tr key={m.id || idx} className="hover:bg-[#FAF6F4]/60 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-[#66534B]">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-[#672C1C]">
                          {m.full_name || m.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1 font-mono text-[11px] text-[#2B2320]">
                              <Mail className="w-3 h-3 text-[#AE7B29]" />
                              {m.email || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-[#66534B]">
                              <Phone className="w-3 h-3 text-[#AE7B29]" />
                              {m.phone || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.designation === 'Faculty'
                              ? 'bg-purple-100 text-purple-800'
                              : m.designation === 'Staff'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {m.designation}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#4A3E39] max-w-[160px] truncate" title={m.faculty}>
                          {m.faculty}
                        </td>
                        <td className="px-4 py-3">
                          {m.designation === 'Student' ? (
                            <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                              <span title="Registration Number">Reg: {m.registration_no || m.registrationNo || 'N/A'}</span>
                              <span className="text-[#66534B]" title="Roll Number">Roll: {m.roll_no || m.rollNo || 'N/A'}</span>
                            </div>
                          ) : (
                            <span className="text-[#66534B]/60 italic font-mono text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#4A3E39] max-w-[140px] truncate" title={m.branch}>
                          {m.designation === 'Student' ? (m.branch || 'N/A') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedMemberDetail(m)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#672C1C] hover:text-[#AE7B29] underline decoration-[#AE7B29]/40"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setMemberToDelete(m)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                            title="Delete registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="p-3 bg-[#FAF6F4] border-t border-[#AE7B29]/20 text-[11px] text-[#66534B] flex items-center justify-between px-6 flex-shrink-0">
              <span>Showing {filteredMembers.length} of {members.length} records</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span>{isSupabaseConfigured ? 'Live Database Active' : 'Local Storage Mode'}</span>
              </span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW MEMBER DETAILS MODAL */}
        {/* ================================================================= */}
        <AnimatePresence>
          {selectedMemberDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedMemberDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#AE7B29]/30 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C]/10 flex items-center justify-center text-[#672C1C]">
                      <Eye className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-[#672C1C] text-lg">
                      {selectedMemberDetail.full_name || selectedMemberDetail.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedMemberDetail(null)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-xs text-[#2B2320]">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF6F4]">
                    <div>
                      <span className="font-bold text-[#66534B]">Email:</span>{' '}
                      <span className="font-mono">{selectedMemberDetail.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#66534B]">Phone:</span>{' '}
                      <span className="font-mono">{selectedMemberDetail.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#66534B]">Designation:</span>{' '}
                      <span>{selectedMemberDetail.designation}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#66534B]">Faculty:</span>{' '}
                      <span>{selectedMemberDetail.faculty}</span>
                    </div>
                    {selectedMemberDetail.designation === 'Student' && (
                      <>
                        <div>
                          <span className="font-bold text-[#66534B]">Reg No:</span>{' '}
                          <span className="font-mono">{selectedMemberDetail.registration_no || selectedMemberDetail.registrationNo || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-[#66534B]">Roll No:</span>{' '}
                          <span className="font-mono">{selectedMemberDetail.roll_no || selectedMemberDetail.rollNo || 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-bold text-[#66534B]">Branch:</span>{' '}
                          <span>{selectedMemberDetail.branch}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-[#672C1C] mb-1 uppercase tracking-wider text-[11px]">
                      Value Addition Statement:
                    </h5>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed font-sans text-xs">
                      {selectedMemberDetail.value_addition || selectedMemberDetail.valueAddition || 'No statement provided.'}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setSelectedMemberDetail(null)}
                    className="px-5 py-2 rounded-xl bg-[#672C1C] text-white text-xs font-semibold hover:bg-[#7B3522]"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================= */}
        {/* DELETE CONFIRMATION MODAL */}
        {/* ================================================================= */}
        <AnimatePresence>
          {memberToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setMemberToDelete(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-red-200 text-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <h4 className="text-lg font-serif font-bold text-[#672C1C] mb-2">
                  Confirm Member Deletion
                </h4>

                <p className="text-xs text-[#66534B] leading-relaxed mb-5">
                  Are you sure you want to permanently delete <strong>{memberToDelete.full_name || memberToDelete.name}</strong> from the SSU IT Club member directory? This action cannot be undone.
                </p>

                <div className="flex gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(null)}
                    disabled={isDeleting}
                    className="px-5 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
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

export default AdminDashboardModal;
