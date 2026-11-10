import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  UserPlus, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  getPublicClubMembers, 
  subscribeToMemberUpdates, 
  exportMembersToCSV 
} from '../services/memberService';
import { isSupabaseConfigured } from '../lib/supabase';

export function ClubMembersModal({ isOpen, onClose, onOpenJoinModal, onOpenAdminModal }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('All'); // 'All' | 'Student' | 'Faculty' | 'Staff'
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sno', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load members on modal open and attach realtime listener
  useEffect(() => {
    let unsubscribe = null;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadMembers();

      // Subscribe to live database updates (Supabase Realtime & CustomEvent)
      unsubscribe = subscribeToMemberUpdates(() => {
        loadMembers(false); // silent refresh without full loading spinner
      });
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
      setSelectedDesignation('All');
      setSelectedFaculty('All');
      setCurrentPage(1);
    }

    return () => {
      document.body.style.overflow = '';
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadMembers = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    try {
      const data = await getPublicClubMembers();
      setMembers(data);
    } catch (err) {
      console.error("Failed to load public club members:", err);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  };

  // Collect unique faculties from members list
  const faculties = useMemo(() => {
    const set = new Set();
    members.forEach(m => {
      if (m.faculty && m.faculty.trim()) {
        set.add(m.faculty.trim());
      }
    });
    return Array.from(set).sort();
  }, [members]);

  // Filter logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // 1. Designation filter
      if (selectedDesignation !== 'All' && member.designation !== selectedDesignation) {
        return false;
      }

      // 2. Faculty filter
      if (selectedFaculty !== 'All' && member.faculty !== selectedFaculty) {
        return false;
      }

      // 3. Search query across Name, Faculty, Branch
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const nameMatch = member.name && member.name.toLowerCase().includes(query);
      const facultyMatch = member.faculty && member.faculty.toLowerCase().includes(query);
      const branchMatch = member.branch && member.branch.toLowerCase().includes(query);
      const desigMatch = member.designation && member.designation.toLowerCase().includes(query);

      return nameMatch || facultyMatch || branchMatch || desigMatch;
    });
  }, [members, selectedDesignation, selectedFaculty, searchQuery]);

  // Sorting logic
  const sortedMembers = useMemo(() => {
    const sorted = [...filteredMembers];
    if (!sortConfig.key) return sorted;

    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredMembers, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedMembers.slice(start, start + itemsPerPage);
  }, [sortedMembers, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#66534B]/40 group-hover:text-[#672C1C]" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 text-[#672C1C]" /> 
      : <ChevronDown className="w-3.5 h-3.5 text-[#672C1C]" />;
  };

  if (!isOpen) return null;

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

      {/* Main Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
        className="relative w-full max-w-5xl bg-[#FFFDF9] border border-[#AE7B29]/30 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* 1. MODAL HEADER */}
        {/* ================================================================= */}
        <div className="relative px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] text-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-[#D8A54E]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#AE7B29]/30 border border-[#D8A54E]/30 text-[10px] font-bold tracking-wider uppercase text-[#F6E4C4] mb-1">
                  <Sparkles className="w-3 h-3 text-[#D8A54E]" />
                  Verified Member Directory
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                  <span>SSU IT Club Members</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-[#F6E4C4] border border-white/20">
                    {members.length} Registered
                  </span>
                </h2>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Join Us Shortcut */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenJoinModal) onOpenJoinModal();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#AE7B29] to-[#D8A54E] hover:brightness-110 text-[#2B1712] text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Us</span>
              </button>

              {/* Admin Portal Shortcut */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenAdminModal) onOpenAdminModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
                title="Admin Dashboard (Passcode Protected)"
              >
                <Lock className="w-3.5 h-3.5 text-[#D8A54E]" />
                <span className="hidden sm:inline">Admin Portal</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all ml-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            Explore all verified students, faculty members, and staff registered with the SSU IT Club.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 2. FILTER & SEARCH CONTROLS BAR */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#AE7B29]/20 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66534B]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search member by name, faculty, or branch..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs sm:text-sm bg-[#FFFDF9] text-[#2B2320] placeholder-[#66534B]/50 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/40 transition-all"
              />
            </div>

            {/* Designation Filter Pills */}
            <div className="inline-flex rounded-xl p-1 bg-[#FAF6F4] border border-[#AE7B29]/20 text-xs font-semibold">
              {['All', 'Student', 'Faculty', 'Staff'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedDesignation(role);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedDesignation === role
                      ? 'bg-[#672C1C] text-white shadow-sm'
                      : 'text-[#66534B] hover:text-[#2B2320]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Faculty Dropdown Filter */}
            {faculties.length > 0 && (
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FFFDF9] text-[#2B2320] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/40 max-w-[190px] truncate"
              >
                <option value="All">All Faculties</option>
                {faculties.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            )}
          </div>

          {/* Action buttons: Refresh & Export */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadMembers(true)}
              disabled={isLoading}
              className="p-2 rounded-xl border border-[#AE7B29]/30 hover:bg-[#FAF6F4] text-[#66534B] transition-all"
              title="Refresh member list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => exportMembersToCSV(sortedMembers, false)}
              disabled={sortedMembers.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#AE7B29]/40 bg-white hover:bg-[#FAF6F4] text-[#672C1C] text-xs font-bold uppercase tracking-wider transition-all"
              title="Download public member roster"
            >
              <Download className="w-3.5 h-3.5 text-[#AE7B29]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. TABLE BODY (EXACT PUBLIC COLUMNS ONLY) */}
        {/* | S.No. | Name | Faculty | Designation | Branch | */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#AE7B29] mb-3" />
              <p className="text-sm text-[#66534B] font-medium">Loading verified member directory...</p>
            </div>
          ) : sortedMembers.length === 0 ? (
            <div className="py-16 px-6 text-center max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#AE7B29]/15 flex items-center justify-center text-[#672C1C]">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#672C1C] mb-1">
                No Members Found
              </h3>
              <p className="text-xs text-[#66534B] leading-relaxed mb-4">
                {searchQuery || selectedDesignation !== 'All' || selectedFaculty !== 'All'
                  ? 'No registered club members matched your search or filter filters. Try clearing your filters.'
                  : 'No registered members yet. Be the first to join the SSU IT Club!'}
              </p>
              {searchQuery || selectedDesignation !== 'All' || selectedFaculty !== 'All' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDesignation('All');
                    setSelectedFaculty('All');
                  }}
                  className="px-4 py-2 rounded-xl border border-[#AE7B29]/40 text-xs font-semibold text-[#672C1C] hover:bg-[#FAF6F4]"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenJoinModal && onOpenJoinModal()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#672C1C] to-[#7B3522] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Join Us Now
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm text-[#2B2320]">
              <thead className="bg-[#FAF6F4] text-[#672C1C] uppercase font-bold text-[10px] sm:text-xs tracking-wider sticky top-0 z-10 border-b border-[#AE7B29]/20 shadow-sm">
                <tr>
                  {/* Column 1: S.No. */}
                  <th 
                    onClick={() => handleSort('sno')}
                    className="px-4 sm:px-6 py-3 cursor-pointer select-none group w-16"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>S.No.</span>
                      {getSortIcon('sno')}
                    </div>
                  </th>

                  {/* Column 2: Name */}
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-4 sm:px-6 py-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>

                  {/* Column 3: Faculty */}
                  <th 
                    onClick={() => handleSort('faculty')}
                    className="px-4 sm:px-6 py-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Faculty</span>
                      {getSortIcon('faculty')}
                    </div>
                  </th>

                  {/* Column 4: Designation */}
                  <th 
                    onClick={() => handleSort('designation')}
                    className="px-4 sm:px-6 py-3 cursor-pointer select-none group w-28 sm:w-36"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Designation</span>
                      {getSortIcon('designation')}
                    </div>
                  </th>

                  {/* Column 5: Branch */}
                  <th 
                    onClick={() => handleSort('branch')}
                    className="px-4 sm:px-6 py-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Branch</span>
                      {getSortIcon('branch')}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#AE7B29]/10">
                {paginatedMembers.map((member, index) => {
                  const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  const isStaffOrFaculty = member.designation === 'Faculty' || member.designation === 'Staff';

                  return (
                    <motion.tr
                      key={member.id || member.sno || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="hover:bg-[#FAF6F4]/70 transition-colors"
                    >
                      {/* S.No. */}
                      <td className="px-4 sm:px-6 py-3.5 font-mono font-semibold text-[#66534B]">
                        {displayIndex}
                      </td>

                      {/* Name */}
                      <td className="px-4 sm:px-6 py-3.5 font-semibold text-[#672C1C]">
                        {member.name}
                      </td>

                      {/* Faculty */}
                      <td className="px-4 sm:px-6 py-3.5 text-[#4A3E39]">
                        {member.faculty}
                      </td>

                      {/* Designation */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          member.designation === 'Faculty'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : member.designation === 'Staff'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          {member.designation === 'Faculty' ? (
                            <Building2 className="w-3 h-3 text-purple-700" />
                          ) : member.designation === 'Staff' ? (
                            <Briefcase className="w-3 h-3 text-amber-700" />
                          ) : (
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                          )}
                          <span>{member.designation}</span>
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-4 sm:px-6 py-3.5 text-[#4A3E39]">
                        {isStaffOrFaculty ? (
                          <span className="text-[#66534B]/60 italic font-mono text-xs">N/A</span>
                        ) : (
                          member.branch || 'N/A'
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ================================================================= */}
        {/* 4. MODAL FOOTER & PAGINATION */}
        {/* ================================================================= */}
        <div className="px-6 py-3.5 bg-[#FAF6F4] border-t border-[#AE7B29]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#66534B] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#AE7B29]" />
              <span>Public View — Personal contact details & ID numbers are protected</span>
            </div>
            <span>•</span>
            <span className="font-semibold text-[#2B2320]">
              Showing {sortedMembers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sortedMembers.length)} of {sortedMembers.length}
            </span>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#AE7B29]/30 hover:bg-white text-[#66534B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono font-medium text-[#2B2320]">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#AE7B29]/30 hover:bg-white text-[#66534B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ClubMembersModal;
