import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Globe,
  Home,
  Info,
  Compass,
  Users,
  ShieldCheck,
  UserCheck,
  Bell,
  Calendar,
  ClipboardList,
  Image as ImageIcon,
  Lightbulb,
  ShieldAlert,
  History,
  FileCode,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  Clock,
  Send,
  HelpCircle,
  FileText,
  Loader2,
  UserPlus,
  UserX,
  Check,
  Filter,
  Trophy,
  Pin
} from 'lucide-react';

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  getAllAdmins,
  createAdminAccount,
  updateAdminProfile,
  deleteAdminAccount,
  resetAdminPassword,
  changeAdminPassword,
  sendAdminPasswordResetEmail,
  revokeAdminActiveSessions,
  toggleAdminStatus,
  requestPasswordReset,
  ROLES,
  ROLE_LABELS,
  isSuperAdmin,
  canManageWebsite,
  canManageAnnouncements,
  canManageEvents,
  canManageMembers,
  canManageProposals,
  canManageAdmins,
  canViewActivityLogs,
  canRestoreVersions
} from '../../services/adminAuthService';

import {
  getSiteContent,
  updateSiteContent,
  getJourneyMilestones,
  saveJourneyMilestone,
  deleteJourneyMilestone,
  getCoreMembers,
  saveCoreMember,
  deleteCoreMember,
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getEvents,
  saveEvent,
  deleteEvent,
  getEventRegistrations,
  getProjectProposals,
  updateProposalStatus,
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  getActivityLogs,
  getContentVersions,
  restoreContentVersion,
  uploadMedia
} from '../../services/contentService';

import { getAdminMembers, deleteClubMember, exportMembersToCSV } from '../../services/memberService';
import { isSupabaseConfigured } from '../../lib/supabase';

// Official logos
import universityLogo from '../../assets/university-logo.png';
import itClubLogo from '../../assets/CLUB_Logo.png';

export function AdminPortal({ onBackToWebsite }) {
  // Authentication State
  const [currentAdmin, setCurrentAdmin] = useState(getCurrentAdmin());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Active Subsection in Dashboard
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data States
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Subsection Entities
  const [stats, setStats] = useState({
    clubMembers: 0,
    coreMembers: 0,
    admins: 0,
    announcements: 0,
    events: 0,
    registrations: 0,
    proposals: 0
  });

  const [homepageContent, setHomepageContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [footerContent, setFooterContent] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [coreMembersList, setCoreMembersList] = useState([]);
  const [clubMembersList, setClubMembersList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [proposalsList, setProposalsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [activityLogsList, setActivityLogsList] = useState([]);
  const [contentVersionsList, setContentVersionsList] = useState([]);

  // Modals & Creation States
  const [showModal, setShowModal] = useState(null); // 'milestone' | 'coreMember' | 'announcement' | 'event' | 'createAdmin' | 'editAdmin' | 'resetAdminPass' | 'deleteAdminConfirm' | 'proposalDetail' | 'logDetail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [modalError, setModalError] = useState('');

  // Super Admin & Audit Log Filtering States
  const [logFilterAdmin, setLogFilterAdmin] = useState('ALL');
  const [logFilterSection, setLogFilterSection] = useState('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminFilterStatus, setAdminFilterStatus] = useState('ALL');
  const [tempPassword, setTempPassword] = useState('');

  // Auto-clear notification messages
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  // Load section data when activeTab changes or admin logs in
  useEffect(() => {
    if (currentAdmin) {
      loadTabData(activeTab);
    }
  }, [activeTab, currentAdmin]);

  const loadTabData = async (tab) => {
    setIsLoading(true);
    setActionError('');
    try {
      if (tab === 'overview') {
        const [cm, core, adm, ann, ev, reg, prp] = await Promise.all([
          getAdminMembers('SSUITCLUB@2026'),
          getCoreMembers(false),
          getAllAdmins(currentAdmin),
          getAnnouncements({ publishedOnly: false }),
          getEvents({ publishedOnly: false }),
          getEventRegistrations(),
          getProjectProposals()
        ]);
        const adms = adm.admins || [];
        setAdminsList(adms);
        setCoreMembersList(core || []);
        setStats({
          clubMembers: cm.members?.length || 0,
          coreMembers: core.length || 0,
          admins: adms.length,
          activeAdmins: adms.filter(a => a.status === 'active').length,
          inactiveAdmins: adms.filter(a => a.status === 'inactive').length,
          announcements: ann.filter(a => a.status === 'published').length || 0,
          events: ev.filter(e => e.status === 'published').length || 0,
          registrations: reg.length || 0,
          proposals: prp.length || 0
        });
        const logs = await getActivityLogs(currentAdmin);
        setActivityLogsList(logs.slice(0, 8));
      } else if (tab === 'homepage' || tab === 'website') {
        const [hp, ft] = await Promise.all([
          getSiteContent('homepage'),
          getSiteContent('footer')
        ]);
        setHomepageContent(hp);
        setFooterContent(ft);
      } else if (tab === 'about') {
        const ab = await getSiteContent('about');
        setAboutContent(ab);
      } else if (tab === 'journey') {
        const ms = await getJourneyMilestones(false);
        setMilestones(ms);
      } else if (tab === 'core_members' || tab === 'team') {
        const members = await getCoreMembers(false);
        setCoreMembersList(members);
      } else if (tab === 'club_members') {
        const res = await getAdminMembers('SSUITCLUB@2026');
        if (res.success) setClubMembersList(res.members);
      } else if (tab === 'announcements') {
        const list = await getAnnouncements({ publishedOnly: false });
        setAnnouncementsList(list);
      } else if (tab === 'events') {
        const list = await getEvents({ publishedOnly: false });
        setEventsList(list);
      } else if (tab === 'event_registrations') {
        const list = await getEventRegistrations();
        setRegistrationsList(list);
      } else if (tab === 'proposals') {
        const list = await getProjectProposals();
        setProposalsList(list);
      } else if (tab === 'gallery') {
        const list = await getGalleryItems();
        setGalleryList(list);
      } else if (tab === 'admins') {
        const [res, coreRes] = await Promise.all([
          getAllAdmins(currentAdmin),
          getCoreMembers(false)
        ]);
        if (res.success) setAdminsList(res.admins || []);
        setCoreMembersList(coreRes || []);
      } else if (tab === 'activity_logs') {
        const list = await getActivityLogs(currentAdmin);
        setActivityLogsList(list);
      } else if (tab === 'versions') {
        const list = await getContentVersions('content_homepage');
        setContentVersionsList(list);
      }
    } catch (err) {
      console.error(`Error loading data for tab ${tab}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await loginAdmin(loginEmail, loginPassword, rememberMe);
      if (res.success) {
        setCurrentAdmin(res.admin);
        setActiveTab('overview');
      } else {
        setLoginError(res.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setLoginError('A network error occurred. Please verify your connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentAdmin(null);
  };

  // Handle Password Reset Request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    const res = await requestPasswordReset(resetEmail);
    setResetMessage(res.message || res.error);
  };

  // Navigation Items Definition: All website content open to all admins, ONLY Admin Management exclusive to Super Admin
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'website', label: 'Website Management', icon: Globe },
    { id: 'homepage', label: 'Homepage Management', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'journey', label: 'Club Journey', icon: Compass },
    { id: 'core_members', label: 'Core Members', icon: ShieldCheck },
    { id: 'club_members', label: 'Club Members', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'event_registrations', label: 'Event Registrations', icon: ClipboardList },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'proposals', label: 'Project Proposals', icon: Lightbulb },
    { id: 'admins', label: 'Admin Management', icon: ShieldAlert, roleGuard: canManageAdmins },
    { id: 'activity_logs', label: 'Activity Logs', icon: History },
    { id: 'versions', label: 'Content Versions', icon: FileCode }
  ];

  // ============================================================================
  // VIEW: LOGIN INTERFACE (When unauthenticated)
  // ============================================================================
  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF6F4] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#AE7B29] selection:text-white">
        {/* Background Architectural Grid & Subtle Orbs */}
        <div className="absolute inset-0 bg-subtle-grid opacity-35 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#672C1C]/5 via-[#AE7B29]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Minimal Navigation Bar */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-[#AE7B29]/20 bg-white/70 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <img src={universityLogo} alt="University Logo" className="h-9 w-auto" />
            <div className="h-5 w-px bg-[#AE7B29]/30" />
            <img src={itClubLogo} alt="IT Club Logo" className="h-9 w-auto" />
          </div>

          <button
            onClick={onBackToWebsite}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#AE7B29]/40 bg-white hover:bg-[#FAF6F4] text-[#672C1C] text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-3xl border-2 border-[#AE7B29]/35 shadow-2xl p-7 sm:p-9 relative overflow-hidden"
          >
            {/* Top Maroon / Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#672C1C] via-[#AE7B29] to-[#D8A54E]" />

            {/* Lock Header Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#672C1C]/10 border border-[#AE7B29]/30 flex items-center justify-center text-[#672C1C] shadow-inner">
              <Lock className="w-7 h-7 text-[#672C1C]" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#672C1C] tracking-tight mb-2">
                SSU IT Club — Admin Portal
              </h2>

              {/* Exact Prominent Requirement Text */}
              <div className="p-3 rounded-2xl bg-red-50/80 border border-red-200/80 mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-red-800">
                  ONLY CORE MEMBERS CAN ACCESS THIS PORTAL.
                </p>
                <p className="text-[11px] text-[#66534B] leading-relaxed mt-1">
                  This portal is exclusively designed for authorized SSU IT Club Core Members to manage website content, events, announcements, memberships, and club activities.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-100/70 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                  Admin Email / Login ID <span className="text-[#672C1C]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66534B]/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@ssuitclub.edu.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-[#FFFDF9] text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2320] mb-1.5 tracking-wide">
                  Secure Password <span className="text-[#672C1C]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66534B]/60">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm bg-[#FFFDF9] text-[#2B2320] placeholder-[#66534B]/40 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#66534B]/60 hover:text-[#672C1C]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#66534B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#AE7B29]/40 text-[#672C1C] focus:ring-[#AE7B29]"
                  />
                  <span>Remember session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#672C1C] hover:text-[#AE7B29] font-semibold underline decoration-[#AE7B29]/40"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#672C1C] via-[#7B3522] to-[#672C1C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D8A54E]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#D8A54E]" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick credentials hint for initial reviewer / administrator */}
            <div className="mt-6 pt-4 border-t border-[#AE7B29]/20 text-center">
              <p className="text-[11px] text-[#66534B]">
                Default Super Admin: <code className="bg-[#FAF6F4] px-1 py-0.5 rounded text-[#672C1C] font-mono">admin@ssuitclub.edu.in</code>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowForgotPassword(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#AE7B29]/30"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-serif font-bold text-lg text-[#672C1C] mb-2">Password Reset</h3>
                <p className="text-xs text-[#66534B] mb-4">
                  Enter your registered Core Member email address. We will send password reset instructions to your inbox.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your.email@ssuitclub.edu.in"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                  />
                  {resetMessage && (
                    <p className="text-xs text-green-700 bg-green-50 p-2 rounded-lg">{resetMessage}</p>
                  )}
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 rounded-xl border text-xs"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#672C1C] text-white text-xs font-bold"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Security Footer */}
        <footer className="py-4 text-center text-xs text-[#66534B] border-t border-[#AE7B29]/20 bg-white/50">
          <span>Protected by SSU IT Club Enterprise Security • Supabase PostgreSQL & RBAC</span>
        </footer>
      </div>
    );
  }

  // ============================================================================
  // VIEW: AUTHENTICATED DASHBOARD SHELL
  // ============================================================================
  const isCurrentSuperAdmin = isSuperAdmin(currentAdmin);
  const isEditor = currentAdmin.role === ROLES.EDITOR;
  const isMemberManager = currentAdmin.role === ROLES.MEMBER_MANAGER;

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex flex-col md:flex-row font-sans text-[#2B2320]">
      {/* ======================================================================= */}
      {/* 1. SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      {/* ======================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#23120E] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={itClubLogo} alt="Logo" className="h-8 w-auto bg-white/10 p-1 rounded-lg" />
              <div>
                <h1 className="font-serif font-bold text-sm tracking-wide text-white">SSU IT CLUB</h1>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#D8A54E]">ADMIN CMS</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Admin Identity Pill */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#AE7B29] to-[#D8A54E] flex items-center justify-center font-bold text-[#23120E] text-xs">
                {currentAdmin.full_name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentAdmin.full_name}</div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#AE7B29]/30 text-[#F6E4C4] border border-[#D8A54E]/30">
                  {currentAdmin.role}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = !item.roleGuard || item.roleGuard(currentAdmin.role);
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isAllowed) {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                  disabled={!isAllowed}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                    ? 'bg-gradient-to-r from-[#672C1C] to-[#AE7B29] text-white shadow-md'
                    : isAllowed
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-white/20 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D8A54E]' : isAllowed ? 'text-[#AE7B29]' : 'text-white/20'}`} />
                    <span>{item.label}</span>
                  </div>
                  {!isAllowed && <Lock className="w-3 h-3 text-white/30" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D8A54E]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-200 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* ======================================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      {/* ======================================================================= */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="px-6 py-4 bg-white border-b border-[#AE7B29]/20 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#FAF6F4] text-[#672C1C]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#672C1C] capitalize">
                {activeTab.replace('_', ' ')}
              </h2>
              <p className="text-[11px] text-[#66534B]">
                SSU IT Club Unified Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Chip */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#FAF6F4] border border-[#AE7B29]/30 text-[#66534B]">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Mode'}</span>
            </div>

            <button
              onClick={() => loadTabData(activeTab)}
              disabled={isLoading}
              className="p-2 rounded-xl border border-[#AE7B29]/30 text-[#66534B] hover:bg-[#FAF6F4] transition-all"
              title="Refresh Current View"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Global Feedback Banner */}
        {actionSuccess && (
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Dynamic Section Renderer */}
        <div className="p-4 sm:p-8 flex-1">
          {/* A. DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 7 KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Members</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.clubMembers}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Core Team</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.coreMembers}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Admins</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.admins}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Notices</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.announcements}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Events</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.events}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Event Regs</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.registrations}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#AE7B29]/20 shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Proposals</div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.proposals}</div>
                </div>
              </div>

              {/* SUPER ADMIN EXCLUSIVE ADMINISTRATIVE KPI DECK */}
              {isCurrentSuperAdmin && (
                <div className="p-6 rounded-3xl bg-white border-2 border-[#AE7B29]/30 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#AE7B29]/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center shadow-xs">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#672C1C]">Super Admin Command Center</h3>
                        <p className="text-[11px] text-[#66534B]">Exclusive administrator authority, access control & security telemetry</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#D8A54E]" />
                      <span>Manage Admin Accounts</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Total Admins</div>
                      <div className="text-2xl font-serif font-bold text-[#672C1C] mt-1">{stats.admins || adminsList.length}</div>
                      <div className="text-[10px] text-[#AE7B29] font-medium mt-0.5">Authorized Accounts</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Active Admins</div>
                      <div className="text-2xl font-serif font-bold text-emerald-900 mt-1">
                        {stats.activeAdmins ?? adminsList.filter(a => a.status === 'active').length}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Operational Status</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Inactive Admins</div>
                      <div className="text-2xl font-serif font-bold text-amber-900 mt-1">
                        {stats.inactiveAdmins ?? adminsList.filter(a => a.status === 'inactive').length}
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium mt-0.5">Suspended / Inactive</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#23120E] text-white border border-[#D8A54E]/30">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D8A54E]">Security Status</div>
                      <div className="text-sm font-serif font-bold text-white mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>RLS Enforced</span>
                      </div>
                      <div className="text-[10px] text-white/70 font-mono mt-0.5">Triggers & Audit Active</div>
                    </div>
                  </div>

                  {/* Recent Admin Logins Snippet */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#672C1C] mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#AE7B29]" />
                      <span>Recent Administrator Sign-Ins</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {adminsList.slice(0, 3).map(adm => (
                        <div key={adm.id} className="p-2.5 rounded-xl bg-[#FAF6F4] border border-[#AE7B29]/20 text-xs flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-[#2B2320] truncate max-w-[140px]">{adm.full_name}</div>
                            <div className="text-[10px] font-mono text-[#66534B]">{adm.admin_id} • {adm.role}</div>
                          </div>
                          <span className="text-[10px] font-mono text-[#AE7B29] font-medium">
                            {adm.last_sign_in_at ? new Date(adm.last_sign_in_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Never'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#672C1C] to-[#2B1712] text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Central Website Operations</h3>
                  <p className="text-xs text-white/70">Quick shortcuts to manage and publish live club updates</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canManageAnnouncements(currentAdmin.role) && (
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20"
                    >
                      + Create Announcement
                    </button>
                  )}
                  {canManageEvents(currentAdmin.role) && (
                    <button
                      onClick={() => setActiveTab('events')}
                      className="px-4 py-2 rounded-xl bg-[#AE7B29] hover:bg-[#D8A54E] text-xs font-bold text-[#23120E]"
                    >
                      + Schedule Event
                    </button>
                  )}
                  {canManageMembers(currentAdmin.role) && (
                    <button
                      onClick={() => setActiveTab('club_members')}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6F4] text-xs font-bold text-[#672C1C]"
                    >
                      View Club Members
                    </button>
                  )}
                </div>
              </div>

              {/* Recent Activity Log Summary */}
              <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#AE7B29]/15">
                  <h3 className="font-serif font-bold text-base text-[#672C1C] flex items-center gap-2">
                    <History className="w-4 h-4 text-[#AE7B29]" />
                    <span>Recent Administrative Activity Trail</span>
                  </h3>
                  {canViewActivityLogs(currentAdmin.role) && (
                    <button
                      onClick={() => setActiveTab('activity_logs')}
                      className="text-xs text-[#672C1C] font-semibold hover:text-[#AE7B29]"
                    >
                      View All Logs →
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#AE7B29]/10">
                  {activityLogsList.length === 0 ? (
                    <p className="py-6 text-center text-xs text-[#66534B]">No administrative activity logged yet.</p>
                  ) : (
                    activityLogsList.map((log) => (
                      <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                        <div>
                          <div className="font-semibold text-[#2B2320]">
                            <span className="font-mono text-[#672C1C]">[{log.admin_name}]</span> {log.description}
                          </div>
                          <div className="text-[11px] text-[#66534B]/80 font-mono mt-0.5">
                            Section: {log.section_modified} • Action: {log.action_type}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#66534B]/60 shrink-0 font-mono">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* B. HOMEPAGE & WEBSITE MANAGEMENT */}
          {(activeTab === 'homepage' || activeTab === 'website') && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
              <div className="pb-4 border-b border-[#AE7B29]/20">
                <h3 className="font-serif font-bold text-xl text-[#672C1C]">Homepage & Hero Content Management</h3>
                <p className="text-xs text-[#66534B]">
                  Update headline, badge, subtitle, and CTA button destinations directly without code changes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Hero Category Badge</label>
                  <input
                    type="text"
                    value={homepageContent.heroBadge || ''}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={homepageContent.heroHeadline || ''}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-sm font-serif font-bold text-[#672C1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Hero Subtitle & Introduction</label>
                  <textarea
                    rows={3}
                    value={homepageContent.heroSubheadline || ''}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroSubheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2320] mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={homepageContent.primaryCtaLabel || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaLabel: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2320] mb-1">Primary CTA Destination</label>
                    <input
                      type="text"
                      value={homepageContent.primaryCtaTarget || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaTarget: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#AE7B29]/20 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await updateSiteContent('homepage', homepageContent, currentAdmin);
                    setActionSuccess('Homepage content updated successfully and synchronized to live website!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#D8A54E]" />
                  <span>Save & Publish Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* C. ABOUT US MANAGEMENT */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
              <div className="pb-4 border-b border-[#AE7B29]/20">
                <h3 className="font-serif font-bold text-xl text-[#672C1C]">About Us & Objectives Management</h3>
                <p className="text-xs text-[#66534B]">Edit the club overview, mission statement, and long-term vision.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Section Title</label>
                  <input
                    type="text"
                    value={aboutContent.title || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Club Overview Description</label>
                  <textarea
                    rows={4}
                    value={aboutContent.description || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Official Club Mission</label>
                  <textarea
                    rows={3}
                    value={aboutContent.mission || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2320] mb-1">Official Club Vision</label>
                  <textarea
                    rows={3}
                    value={aboutContent.vision || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#AE7B29]/20 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await updateSiteContent('about', aboutContent, currentAdmin);
                    setActionSuccess('About Us information updated successfully!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#D8A54E]" />
                  <span>Save & Publish Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* D. CLUB JOURNEY MANAGEMENT */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#AE7B29]/20">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Club Journey Milestones</h3>
                  <p className="text-xs text-[#66534B]">Manage roadmap steps, descriptions, and interactive links</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem({
                      title: '',
                      step: `0${milestones.length + 1}`,
                      phase: `PHASE 0${milestones.length + 1} • NEW PHASE`,
                      description: '',
                      action_label: 'Explore',
                      action_target: '#about'
                    });
                    setShowModal('milestone');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#D8A54E]" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((ms) => (
                  <div key={ms.id} className="bg-white p-5 rounded-3xl border border-[#AE7B29]/20 relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF6F4] text-[#672C1C] font-bold border border-[#AE7B29]/30">
                        {ms.phase}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedItem(ms);
                            setShowModal('milestone');
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#672C1C] hover:bg-gray-100"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete milestone "${ms.title}"?`)) {
                              await deleteJourneyMilestone(ms.id, currentAdmin);
                              setMilestones(prev => prev.filter(m => m.id !== ms.id));
                              setActionSuccess('Milestone deleted.');
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#672C1C] mb-1">{ms.title}</h4>
                    <p className="text-xs text-[#66534B] leading-relaxed line-clamp-3 mb-3">{ms.description}</p>
                    <div className="text-[10px] font-mono text-[#AE7B29]">Target Link: {ms.action_target}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. CORE MEMBERS MANAGEMENT */}
          {(activeTab === 'core_members' || activeTab === 'team') && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#AE7B29]/20">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Admins</h3>
                  <p className="text-xs text-[#66534B]">Publicly displayed leadership and coordinators of the IT Club</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem({
                      name: '',
                      role: 'Core Coordinator',
                      department: 'Faculty of Engineering and Technology',
                      branch: '',
                      bio: '',
                      email: '',
                      linkedin: '',
                      linkedin_url: '',
                      image_url: null
                    });
                    setShowModal('coreMember');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#D8A54E]" />
                  <span>Add Core Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreMembersList.map((m) => (
                  <div key={m.id} className="bg-white p-5 rounded-3xl border border-[#AE7B29]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/30 overflow-hidden flex items-center justify-center font-bold text-sm text-[#672C1C]">
                          {m.image_url ? (
                            <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{m.name ? m.name.charAt(0).toUpperCase() : 'M'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedItem(m);
                              setShowModal('coreMember');
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#672C1C] hover:bg-gray-100"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Remove Core Member "${m.name}"?`)) {
                                await deleteCoreMember(m.id, currentAdmin);
                                setCoreMembersList(prev => prev.filter(x => x.id !== m.id));
                                setActionSuccess('Core member removed.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#672C1C]">{m.name}</h4>
                      <p className="text-xs font-semibold text-[#AE7B29]">{m.role}</p>
                      <p className="text-[11px] text-[#66534B] mt-0.5">{m.department}</p>
                      <p className="text-xs text-[#4A3E39] mt-2 line-clamp-2 leading-relaxed">{m.bio}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#AE7B29]/15 flex items-center justify-between text-[11px] font-mono text-[#66534B]">
                      <span>{m.email || 'No email'}</span>
                      <span className="text-emerald-700 font-bold">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F. ANNOUNCEMENTS MANAGEMENT */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#AE7B29]/20">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Announcements Management</h3>
                  <p className="text-xs text-[#66534B]">
                    Publish bulletins to the public website or keep in draft. (When 0 published, public site shows "Coming Soon").
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem({
                      title: '',
                      category: 'General',
                      short_message: '',
                      full_content: '',
                      status: 'draft',
                      pinned: false
                    });
                    setShowModal('announcement');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#D8A54E]" />
                  <span>Create Announcement</span>
                </button>
              </div>

              {/* Announcements List */}
              <div className="space-y-3">
                {announcementsList.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-[#AE7B29]/20 text-center">
                    <Bell className="w-10 h-10 text-[#AE7B29] mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-[#672C1C]">No Announcements in Database</p>
                    <p className="text-xs text-[#66534B] mt-1">
                      Currently, the public website displays the animated <strong>"EXCITING ANNOUNCEMENTS COMING SOON!"</strong> placeholder.
                    </p>
                  </div>
                ) : (
                  announcementsList.map((ann) => (
                    <div
                      key={ann.id}
                      className="bg-white p-5 rounded-2xl border border-[#AE7B29]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ann.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                            {ann.status}
                          </span>
                          <span className="text-[11px] font-mono text-[#66534B]">{ann.category}</span>
                          {ann.pinned && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Pinned</span>}
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#672C1C]">{ann.title}</h4>
                        <p className="text-xs text-[#66534B] line-clamp-2">{ann.short_message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={async () => {
                            const newStatus = ann.status === 'published' ? 'draft' : 'published';
                            await saveAnnouncement({ ...ann, status: newStatus }, currentAdmin);
                            setAnnouncementsList(prev => prev.map(a => a.id === ann.id ? { ...a, status: newStatus } : a));
                            setActionSuccess(`Announcement status changed to ${newStatus}.`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${ann.status === 'published'
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                        >
                          {ann.status === 'published' ? 'Unpublish' : 'Publish Live'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(ann);
                            setShowModal('announcement');
                          }}
                          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete announcement "${ann.title}"?`)) {
                              await deleteAnnouncement(ann.id, currentAdmin);
                              setAnnouncementsList(prev => prev.filter(a => a.id !== ann.id));
                              setActionSuccess('Announcement deleted.');
                            }
                          }}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* G. EVENTS MANAGEMENT */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#AE7B29]/20">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Events Management</h3>
                  <p className="text-xs text-[#66534B]">
                    Create, publish workshops, and enable registration forms. (When 0 published, public shows "Coming Soon").
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem({
                      title: '',
                      category: 'Workshop',
                      description: '',
                      event_date: new Date().toISOString().slice(0, 10),
                      event_time: '10:00 AM - 1:00 PM',
                      venue: 'Main Seminar Hall, FET',
                      status: 'draft',
                      event_phase: 'upcoming',
                      registration_enabled: true
                    });
                    setShowModal('event');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#D8A54E]" />
                  <span>Create New Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventsList.length === 0 ? (
                  <div className="col-span-2 bg-white p-8 rounded-3xl border border-[#AE7B29]/20 text-center">
                    <Calendar className="w-10 h-10 text-[#AE7B29] mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-[#672C1C]">No Events Published</p>
                    <p className="text-xs text-[#66534B] mt-1">
                      The public website currently shows the animated <strong>"EXCITING EVENTS COMING SOON!"</strong> section.
                    </p>
                  </div>
                ) : (
                  eventsList.map((evt) => (
                    <div key={evt.id} className="bg-white p-5 rounded-3xl border border-[#AE7B29]/20 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${evt.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {evt.status}
                          </span>
                          <span className="text-xs font-mono text-[#AE7B29]">{evt.event_time}</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#672C1C]">{evt.title}</h4>
                        <p className="text-xs text-[#66534B] mt-1 line-clamp-2">{evt.description}</p>
                        <div className="mt-3 text-[11px] text-[#4A3E39] space-y-1">
                          <div><strong>Venue:</strong> {evt.venue}</div>
                          <div><strong>Date:</strong> {new Date(evt.event_date).toLocaleDateString()}</div>
                          <div>
                            <strong>Registration:</strong>{' '}
                            <span className={evt.registration_enabled ? 'text-green-700 font-bold' : 'text-gray-500'}>
                              {evt.registration_enabled ? 'Enabled (Form Active)' : 'Disabled (Hidden)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#AE7B29]/15 flex items-center justify-between">
                        <button
                          onClick={async () => {
                            const newStatus = evt.status === 'published' ? 'draft' : 'published';
                            await saveEvent({ ...evt, status: newStatus }, currentAdmin);
                            setEventsList(prev => prev.map(e => e.id === evt.id ? { ...e, status: newStatus } : e));
                            setActionSuccess(`Event status changed to ${newStatus}.`);
                          }}
                          className="text-xs font-bold text-[#672C1C] hover:text-[#AE7B29]"
                        >
                          {evt.status === 'published' ? 'Unpublish' : 'Publish Live'}
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedItem(evt);
                              setShowModal('event');
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete event "${evt.title}"?`)) {
                                await deleteEvent(evt.id, currentAdmin);
                                setEventsList(prev => prev.filter(e => e.id !== evt.id));
                                setActionSuccess('Event deleted.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* H. EVENT REGISTRATIONS */}
          {activeTab === 'event_registrations' && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#AE7B29]/15">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Event Registrations Queue</h3>
                  <p className="text-xs text-[#66534B]">Private list of students registered for published events</p>
                </div>
                <button
                  onClick={() => exportMembersToCSV(registrationsList, true)}
                  disabled={registrationsList.length === 0}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#D8A54E]" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F4] text-[#672C1C] font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">S.No.</th>
                      <th className="p-3">Event Title</th>
                      <th className="p-3">Participant Name</th>
                      <th className="p-3">Email & Phone</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Date Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrationsList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">No event registrations found.</td>
                      </tr>
                    ) : (
                      registrationsList.map((r, i) => (
                        <tr key={r.id || i} className="hover:bg-gray-50">
                          <td className="p-3 font-mono">{i + 1}</td>
                          <td className="p-3 font-semibold text-[#672C1C]">{r.event_title}</td>
                          <td className="p-3 font-bold">{r.full_name}</td>
                          <td className="p-3 font-mono text-[11px]">{r.email} • {r.phone}</td>
                          <td className="p-3">{r.department}</td>
                          <td className="p-3 font-mono">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* I. PROJECT PROPOSALS */}
          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#AE7B29]/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Project Proposals (Private Queue)</h3>
                  <p className="text-xs text-[#66534B]">Student and faculty campus tech proposals submitted to the IT Cell</p>
                </div>
              </div>

              <div className="space-y-3">
                {proposalsList.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-[#AE7B29]/20 text-center">
                    <Lightbulb className="w-10 h-10 text-[#AE7B29] mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-[#672C1C]">No Project Proposals in Queue</p>
                  </div>
                ) : (
                  proposalsList.map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#AE7B29]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-100 font-bold text-[#672C1C]">
                            {p.ticket_code}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              p.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {p.status}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">• {p.role} Proposal</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#672C1C]">{p.title}</h4>
                        <p className="text-xs text-[#66534B]">By {p.proposer_name} ({p.branch} • {p.email})</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={p.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await updateProposalStatus(p.id, newStatus, p.internal_notes || '', currentAdmin);
                            setProposalsList(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
                            setActionSuccess(`Proposal status updated to "${newStatus}".`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#AE7B29]/30 text-xs font-semibold bg-white"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                        <button
                          onClick={() => {
                            setSelectedItem(p);
                            setShowModal('proposalDetail');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF6F4] hover:bg-[#672C1C] hover:text-white text-xs font-semibold text-[#672C1C] border border-[#AE7B29]/30 transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* J. CLUB MEMBERS */}
          {activeTab === 'club_members' && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#AE7B29]/15">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#672C1C]">Registered Club Members Roster</h3>
                  <p className="text-xs text-[#66534B]">Total verified members: {clubMembersList.length}</p>
                </div>
                <button
                  onClick={() => exportMembersToCSV(clubMembersList, true)}
                  className="px-4 py-2 rounded-xl bg-[#672C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#D8A54E]" />
                  <span>Export Full CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F4] text-[#672C1C] font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-3">S.No.</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Faculty</th>
                      <th className="p-3">Contact (Private)</th>
                      <th className="p-3">Student Info</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clubMembersList.map((m, i) => (
                      <tr key={m.id || i} className="hover:bg-gray-50">
                        <td className="p-3 font-mono">{i + 1}</td>
                        <td className="p-3 font-bold text-[#672C1C]">{m.full_name || m.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {m.designation}
                          </span>
                        </td>
                        <td className="p-3">{m.faculty}</td>
                        <td className="p-3 font-mono text-[11px]">{m.email} • {m.phone}</td>
                        <td className="p-3 font-mono text-[11px]">
                          {m.designation === 'Student' ? `Reg: ${m.registration_no || m.registrationNo}` : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete membership for ${m.full_name || m.name}?`)) {
                                await deleteClubMember(m.id, 'SSUITCLUB@2026');
                                setClubMembersList(prev => prev.filter(x => x.id !== m.id));
                                setActionSuccess('Member deleted.');
                              }
                            }}
                            className="p-1 rounded text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* K. ADMIN MANAGEMENT (SUPER ADMIN EXCLUSIVE) */}
          {activeTab === 'admins' && (
            !isCurrentSuperAdmin ? (
              <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-red-200 text-center space-y-4 max-w-xl mx-auto shadow-lg">
                <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#672C1C]">Access Restricted</h3>
                <p className="text-xs text-[#66534B] leading-relaxed">
                  The <strong>Admin Management</strong> console is exclusively restricted to the designated <strong>Super Administrator</strong>.
                  Standard administrators, editors, and member managers cannot create accounts, modify roles, or revoke credentials.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-5 py-2.5 rounded-xl bg-[#672C1C] text-white text-xs font-bold hover:bg-[#7B3522] transition-all"
                  >
                    Return to Overview
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header & Controls */}
                <div className="bg-white p-6 rounded-3xl border border-[#AE7B29]/20 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="font-serif font-bold text-xl text-[#672C1C]">Administrator Accounts & Access Control</h3>
                    </div>
                    <p className="text-xs text-[#66534B] mt-0.5">
                      Super Admin exclusive: create admins, promote Core Members, assign IDs, manage roles, reset passwords, or revoke access.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItem({
                        fullName: '',
                        email: '',
                        designation: '',
                        role: ROLES.ADMIN,
                        password: ''
                      });
                      setShowModal('createAdmin');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-[#D8A54E]" />
                    <span>Create Admin Account</span>
                  </button>
                </div>

                {/* Filters & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#AE7B29]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-[#AE7B29]" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or admin ID..."
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-0 focus:ring-0 text-xs text-[#2B2320]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#66534B] uppercase">Status:</span>
                    <select
                      value={adminFilterStatus}
                      onChange={(e) => setAdminFilterStatus(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FAF6F4] text-[#672C1C] font-semibold"
                    >
                      <option value="ALL">All Statuses ({adminsList.length})</option>
                      <option value="active">Active Only ({adminsList.filter(a => a.status === 'active').length})</option>
                      <option value="inactive">Inactive Only ({adminsList.filter(a => a.status === 'inactive').length})</option>
                    </select>
                  </div>
                </div>

                {/* Admin Accounts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminsList
                    .filter(adm => {
                      if (adminFilterStatus !== 'ALL' && adm.status !== adminFilterStatus) return false;
                      if (!adminSearchQuery.trim()) return true;
                      const q = adminSearchQuery.toLowerCase();
                      return (
                        adm.full_name?.toLowerCase().includes(q) ||
                        adm.email?.toLowerCase().includes(q) ||
                        adm.admin_id?.toLowerCase().includes(q) ||
                        adm.role?.toLowerCase().includes(q) ||
                        adm.designation?.toLowerCase().includes(q)
                      );
                    })
                    .map((adm) => {
                      const isMe = adm.email === currentAdmin.email;
                      const isSoleSuperAdmin = adm.role === ROLES.SUPER_ADMIN && adminsList.filter(a => a.role === ROLES.SUPER_ADMIN && a.status === 'active').length <= 1;

                      return (
                        <div
                          key={adm.id}
                          className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${adm.status === 'active' ? 'border-[#AE7B29]/25' : 'border-red-200 bg-red-50/20'
                            }`}
                        >
                          <div>
                            {/* Card Top Pill Row */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="font-mono text-[10px] font-bold text-[#672C1C] px-2.5 py-0.5 rounded-lg bg-[#FAF6F4] border border-[#AE7B29]/30">
                                {adm.admin_id}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${adm.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'active' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                  <span>{adm.status}</span>
                                </span>
                                {isMe && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#672C1C] text-[#F6E4C4] font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Identity */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#672C1C] to-[#AE7B29] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                                {adm.full_name?.charAt(0) || 'A'}
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-serif font-bold text-base text-[#672C1C] truncate">{adm.full_name}</h4>
                                <p className="text-xs font-mono text-[#66534B] truncate">{adm.email}</p>
                              </div>
                            </div>

                            {/* Designation & Role */}
                            <div className="p-3 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/15 text-xs space-y-1 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[#66534B] text-[11px]">Designation:</span>
                                <span className="font-semibold text-[#2B2320]">{adm.designation || 'Administrator'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[#66534B] text-[11px]">Assigned Role:</span>
                                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${adm.role === ROLES.SUPER_ADMIN
                                  ? 'bg-[#672C1C] text-[#F6E4C4] border-[#D8A54E]'
                                  : adm.role === ROLES.ADMIN
                                    ? 'bg-blue-900 text-blue-100 border-blue-400'
                                    : adm.role === ROLES.EDITOR
                                      ? 'bg-purple-900 text-purple-100 border-purple-400'
                                      : 'bg-emerald-900 text-emerald-100 border-emerald-400'
                                  }`}>
                                  {adm.role}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t border-[#AE7B29]/10">
                                <span className="text-[#66534B] text-[11px]">Last Sign-In:</span>
                                <span className="font-mono text-[10px] text-[#AE7B29]">
                                  {adm.last_sign_in_at ? new Date(adm.last_sign_in_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Toolbar */}
                          <div className="pt-3 border-t border-[#AE7B29]/15 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                            <div className="flex flex-wrap gap-1">
                              <button
                                onClick={() => {
                                  setSelectedItem(adm);
                                  setShowModal('editAdmin');
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-[#AE7B29]/30 hover:bg-[#FAF6F4] text-[#672C1C] font-semibold flex items-center gap-1 text-[11px]"
                                title="Edit Details & Role"
                              >
                                <Edit className="w-3 h-3 text-[#AE7B29]" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={async () => {
                                  const res = await sendAdminPasswordResetEmail(adm.email, currentAdmin);
                                  if (res.success) setActionSuccess(res.message);
                                  else setActionError(res.error);
                                }}
                                className="px-2 py-1.5 rounded-lg border border-[#AE7B29]/30 hover:bg-[#FAF6F4] text-[#672C1C] font-semibold flex items-center gap-1 text-[11px]"
                                title="Send Password Reset Email"
                              >
                                <Mail className="w-3 h-3 text-[#AE7B29]" />
                                <span>Send Reset Email</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedItem(adm);
                                  setTempPassword('');
                                  setShowModal('resetAdminPass');
                                }}
                                className="px-2 py-1.5 rounded-lg border border-[#AE7B29]/30 hover:bg-[#FAF6F4] text-[#672C1C] font-semibold flex items-center gap-1 text-[11px]"
                                title="Force Password Reset"
                              >
                                <KeyRound className="w-3 h-3 text-[#AE7B29]" />
                                <span>Set Password</span>
                              </button>

                              {!isMe && (
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Revoke all active sessions for ${adm.full_name}?`)) {
                                      const res = await revokeAdminActiveSessions(adm.id, currentAdmin);
                                      if (res.success) setActionSuccess(res.message);
                                      else setActionError(res.error);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 font-semibold flex items-center gap-1 text-[11px]"
                                  title="Revoke Active Sessions"
                                >
                                  <UserX className="w-3 h-3 text-red-500" />
                                  <span>Revoke Sessions</span>
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {!isMe ? (
                                <button
                                  onClick={async () => {
                                    const actionWord = adm.status === 'active' ? 'deactivate' : 'activate';
                                    if (window.confirm(`Are you sure you want to ${actionWord} administrator "${adm.full_name}"?`)) {
                                      const res = await toggleAdminStatus(adm.id, currentAdmin);
                                      if (res.success) {
                                        setAdminsList(prev => prev.map(a => a.id === adm.id ? { ...a, status: res.status } : a));
                                        setActionSuccess(`Administrator status changed to ${res.status}.`);
                                      } else {
                                        setActionError(res.error);
                                      }
                                    }
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] ${adm.status === 'active'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}
                                >
                                  {adm.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                              ) : null}

                              {!isMe && !isSoleSuperAdmin && (
                                <button
                                  onClick={() => {
                                    setSelectedItem(adm);
                                    setShowModal('deleteAdminConfirm');
                                  }}
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                                  title="Remove Administrator Access"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          )}

          {/* ACCOUNT SETTINGS (INDIVIDUAL PASSWORD & PROFILE MANAGEMENT) */}
          {activeTab === 'account_settings' && (
            <div className="space-y-6 max-w-3xl">
              {/* Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#AE7B29]/20 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#672C1C]">Account Settings & Security</h3>
                  </div>
                  <p className="text-xs text-[#66534B] mt-1">
                    Manage your personal credentials, verify security status, and update your administrator password.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Authenticated Session Active</span>
                </div>
              </div>

              {/* Administrator Profile Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#AE7B29]/20 shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-base text-[#672C1C] pb-3 border-b border-[#AE7B29]/15 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#AE7B29]" />
                  <span>Authenticated Administrator Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Full Name</span>
                    <div className="font-bold text-sm text-[#2B2320]">{currentAdmin.full_name}</div>
                    <div className="text-[11px] text-[#AE7B29] font-semibold">{currentAdmin.designation || 'Administrator'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Login Email & Admin ID</span>
                    <div className="font-mono font-bold text-xs text-[#672C1C]">{currentAdmin.email}</div>
                    <div className="font-mono text-[11px] text-[#66534B]">System ID: <strong>{currentAdmin.admin_id || 'ADM-001'}</strong></div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Assigned Role</span>
                    <div className="mt-0.5">
                      <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-[#672C1C] text-[#F6E4C4] border border-[#D8A54E]/40">
                        {currentAdmin.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66534B]">Authentication Provider</span>
                    <div className="text-xs font-semibold text-[#2B2320] flex items-center gap-1.5 mt-0.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isSupabaseConfigured ? 'Supabase Auth (Argon2 / bcrypt)' : 'Verified Local Store'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#AE7B29]/20 shadow-xs space-y-4">
                <div className="pb-3 border-b border-[#AE7B29]/15">
                  <h4 className="font-serif font-bold text-base text-[#672C1C] flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#AE7B29]" />
                    <span>Change Account Password</span>
                  </h4>
                  <p className="text-xs text-[#66534B] mt-0.5">
                    To change your password, first enter your current password, followed by your new secure password.
                  </p>
                </div>

                {passChangeSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">{passChangeSuccess}</span>
                  </div>
                )}

                {passChangeError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{passChangeError}</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPassChangeSuccess('');
                    setPassChangeError('');
                    setIsChangingPass(true);

                    try {
                      const res = await changeAdminPassword(
                        currentPasswordInput,
                        newPasswordInput,
                        confirmPasswordInput,
                        currentAdmin
                      );

                      if (res.success) {
                        setPassChangeSuccess(res.message);
                        setCurrentPasswordInput('');
                        setNewPasswordInput('');
                        setConfirmPasswordInput('');
                        setActionSuccess('Password updated successfully.');
                      } else {
                        setPassChangeError(res.error || 'Failed to update password.');
                      }
                    } catch (err) {
                      setPassChangeError('A network error occurred while updating your password.');
                    } finally {
                      setIsChangingPass(false);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  {/* Current Password */}
                  <div>
                    <label className="block font-semibold text-[#2B2320] mb-1.5">
                      Current Password <span className="text-[#672C1C]">*</span>
                    </label>
                    <div className="relative max-w-md">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Enter your existing password"
                        required
                        className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-xs font-mono bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div>
                      <label className="block font-semibold text-[#2B2320] mb-1.5">
                        New Password <span className="text-[#672C1C]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Min 8 characters"
                          required
                          className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-xs font-mono bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#2B2320] mb-1.5">
                        Confirm New Password <span className="text-[#672C1C]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                          className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-[#AE7B29]/30 text-xs font-mono bg-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 text-[11px] text-[#66534B] space-y-1">
                    <div className="font-bold text-[#672C1C]">Security Policy Requirements:</div>
                    <ul className="list-disc list-inside space-y-0.5 pl-1">
                      <li>Minimum 8 characters in length.</li>
                      <li>Current password must be verified before changes are committed.</li>
                      <li>Passwords are never stored in plain text and are cryptographically hashed.</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="px-6 py-2.5 rounded-xl bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
                    >
                      {isChangingPass ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#D8A54E]" />
                          <span>Verifying & Updating...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-[#D8A54E]" />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* L. ACTIVITY LOGS (AUDIT TRAIL) */}
          {activeTab === 'activity_logs' && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#AE7B29]/15">
                <div>
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[#AE7B29]" />
                    <h3 className="font-serif font-bold text-xl text-[#672C1C]">
                      {isCurrentSuperAdmin ? 'System-Wide Immutable Audit Trail' : 'My Activity History'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#66534B] mt-0.5">
                    {isCurrentSuperAdmin
                      ? 'Super Admin Audit View: Chronological log of all actions performed by any administrator across all sections.'
                      : `Personal Activity Log for authenticated admin [${currentAdmin.email}]. Log records are permanent and immutable.`}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F4] border border-[#AE7B29]/30 text-xs font-mono text-[#672C1C]">
                  <Lock className="w-3.5 h-3.5 text-[#AE7B29]" />
                  <span>Immutable Log Store</span>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#66534B] uppercase mb-1">Search Details</label>
                  <input
                    type="text"
                    placeholder="Search logs by keyword..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FAF6F4]"
                  />
                </div>

                {isCurrentSuperAdmin && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#66534B] uppercase mb-1">Filter by Admin</label>
                    <select
                      value={logFilterAdmin}
                      onChange={(e) => setLogFilterAdmin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FAF6F4]"
                    >
                      <option value="ALL">All Administrators</option>
                      {adminsList.map(a => (
                        <option key={a.id} value={a.email}>{a.full_name} ({a.admin_id})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-[#66534B] uppercase mb-1">Filter by Section</label>
                  <select
                    value={logFilterSection}
                    onChange={(e) => setLogFilterSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-[#FAF6F4]"
                  >
                    <option value="ALL">All Sections</option>
                    <option value="announcements">Announcements</option>
                    <option value="events">Events</option>
                    <option value="core_members">Core Members</option>
                    <option value="club_members">Club Members</option>
                    <option value="homepage">Homepage Content</option>
                    <option value="journey">Club Journey</option>
                    <option value="admins">Admin Management</option>
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#AE7B29]/15">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F4] text-[#672C1C] font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Admin Identity</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Section</th>
                      <th className="p-3">Activity Summary</th>
                      <th className="p-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {activityLogsList
                      .filter(log => {
                        if (logFilterAdmin !== 'ALL' && log.admin_email !== logFilterAdmin) return false;
                        if (logFilterSection !== 'ALL' && log.section_modified?.toLowerCase() !== logFilterSection.toLowerCase()) return false;
                        if (!logSearchQuery.trim()) return true;
                        const q = logSearchQuery.toLowerCase();
                        return (
                          log.description?.toLowerCase().includes(q) ||
                          log.admin_name?.toLowerCase().includes(q) ||
                          log.admin_email?.toLowerCase().includes(q) ||
                          log.action_type?.toLowerCase().includes(q)
                        );
                      })
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3 text-[#66534B] text-[11px] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[#672C1C]">{log.admin_name}</div>
                            <div className="text-[10px] text-[#66534B]">{log.admin_email || log.admin_id}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${log.action_type?.includes('CREATE') ? 'bg-emerald-100 text-emerald-800' :
                              log.action_type?.includes('DELETE') ? 'bg-red-100 text-red-800' :
                                log.action_type?.includes('UPDATE') ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {log.action_type}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-xs whitespace-nowrap capitalize">
                            {log.section_modified?.replace('_', ' ')}
                          </td>
                          <td className="p-3 font-sans text-xs max-w-sm truncate" title={log.description}>
                            {log.description}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedItem(log);
                                setShowModal('logDetail');
                              }}
                              className="px-2 py-1 rounded bg-[#FAF6F4] hover:bg-[#F2ECE8] text-[#672C1C] font-semibold text-[10px] border border-[#AE7B29]/30"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {activityLogsList.length === 0 && (
                <p className="text-center py-8 text-xs text-[#66534B]">No administrative activities logged yet.</p>
              )}
            </div>
          )}

          {/* M. CONTENT VERSIONS & RESTORE */}
          {activeTab === 'versions' && (
            <div className="bg-white rounded-3xl border border-[#AE7B29]/20 p-6 shadow-xs space-y-4">
              <div className="pb-4 border-b border-[#AE7B29]/15">
                <h3 className="font-serif font-bold text-lg text-[#672C1C]">Content Version History & Rollback</h3>
                <p className="text-xs text-[#66534B]">Restore previous versions of homepage and section content</p>
              </div>

              <div className="space-y-3">
                {contentVersionsList.length === 0 ? (
                  <p className="py-6 text-center text-xs text-gray-500">No previous version snapshots available yet.</p>
                ) : (
                  contentVersionsList.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#672C1C] text-sm">
                          Version #{v.version_number} • {v.section_key}
                        </div>
                        <div className="text-xs text-gray-500">
                          Saved by {v.created_by} on {new Date(v.created_at).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Restore ${v.section_key} to Version #${v.version_number}?`)) {
                            const res = await restoreContentVersion(v.section_key, v.id, currentAdmin);
                            if (res.success) {
                              setActionSuccess(`Restored to Version #${v.version_number} successfully!`);
                            }
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[#672C1C] text-white text-xs font-bold"
                      >
                        Restore Version
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* MODALS FOR ADD / EDIT OPERATIONS */}
        {/* =================================================================== */}

        {/* 1. Milestone Modal */}
        <AnimatePresence>
          {showModal === 'milestone' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowModal(null)}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="font-serif font-bold text-lg text-[#672C1C]">
                  {selectedItem.id ? 'Edit Journey Milestone' : 'Add Journey Milestone'}
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Step Code (e.g. 01)</label>
                    <input
                      type="text"
                      value={selectedItem.step || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, step: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Phase Title</label>
                    <input
                      type="text"
                      value={selectedItem.phase || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, phase: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Milestone Headline</label>
                    <input
                      type="text"
                      value={selectedItem.title || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={selectedItem.description || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Destination Target Link</label>
                    <input
                      type="text"
                      value={selectedItem.action_target || '#about'}
                      onChange={(e) => setSelectedItem({ ...selectedItem, action_target: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-xl text-xs">Cancel</button>
                  <button
                    onClick={async () => {
                      await saveJourneyMilestone(selectedItem, currentAdmin);
                      setShowModal(null);
                      loadTabData('journey');
                      setActionSuccess('Milestone saved.');
                    }}
                    className="px-5 py-2 bg-[#672C1C] text-white rounded-xl text-xs font-bold"
                  >
                    Save Milestone
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Core Member Modal with Photograph Upload */}
        <AnimatePresence>
          {showModal === 'coreMember' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                if (!isUploadingPhoto) {
                  setShowModal(null);
                  setModalError('');
                }
              }}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b">
                  <h4 className="font-serif font-bold text-lg text-[#672C1C]">
                    {selectedItem.id ? 'Edit Core Member Profile' : 'Add New Core Member'}
                  </h4>
                  <span className="text-[10px] font-mono text-[#AE7B29] bg-[#FAF6F4] px-2.5 py-0.5 rounded-full border border-[#AE7B29]/30">
                    Live Sync
                  </span>
                </div>

                {modalError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-[#672C1C]">Full Name *</label>
                    <input
                      type="text"
                      value={selectedItem.name || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                      placeholder="e.g. Sanchita Padhi"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#AE7B29] text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#672C1C]">Designation / Role *</label>
                      <input
                        type="text"
                        value={selectedItem.role || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
                        placeholder="e.g. Frontend Designer"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#AE7B29] text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#672C1C]">Faculty / Department</label>
                      <input
                        type="text"
                        value={selectedItem.department || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, department: e.target.value })}
                        placeholder="e.g. Faculty of Engineering and Technology"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#AE7B29] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#672C1C]">Branch / Stream (Where applicable)</label>
                    <input
                      type="text"
                      value={selectedItem.branch || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, branch: e.target.value })}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#AE7B29] text-xs"
                    />
                  </div>

                  {/* Profile Photograph Upload & Live Preview */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold block text-[#672C1C]">Profile Photograph</label>
                      {selectedItem.image_url ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Custom Photo Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(prev => ({ ...prev, image_url: null }))}
                            className="text-[10px] text-red-600 hover:text-red-800 font-bold bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#66534B] font-medium bg-white px-2 py-0.5 rounded-full border border-[#AE7B29]/20">
                          Professional Initials Placeholder Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#AE7B29]/40 overflow-hidden flex items-center justify-center font-bold text-lg text-[#672C1C] shrink-0 shadow-sm">
                        {selectedItem.image_url ? (
                          <img
                            src={selectedItem.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-serif text-xl">{selectedItem.name ? selectedItem.name.charAt(0).toUpperCase() : 'M'}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingPhoto}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!file.type.startsWith('image/')) {
                              setModalError('Please select a valid image file (JPEG, PNG, WebP).');
                              return;
                            }
                            if (file.size > 10 * 1024 * 1024) {
                              setModalError('Image is larger than 10MB. Please choose a smaller photo.');
                              return;
                            }
                            setModalError('');
                            setIsUploadingPhoto(true);
                            try {
                              const res = await uploadMedia(file, 'core-members', selectedItem.id || selectedItem.name);
                              if (res && res.success && res.url) {
                                setSelectedItem(prev => ({ ...prev, image_url: res.url }));
                              } else {
                                setModalError(res?.error || 'Photo upload failed. Please try again.');
                              }
                            } catch (err) {
                              setModalError(err.message || 'Error occurred during photo upload.');
                            } finally {
                              setIsUploadingPhoto(false);
                            }
                          }}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#672C1C] file:text-white hover:file:bg-[#7B3522] cursor-pointer"
                        />
                        <p className="text-[10px] text-[#66534B]">
                          {isUploadingPhoto ? (
                            <span className="text-[#AE7B29] font-bold animate-pulse flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Supabase Storage...
                            </span>
                          ) : (
                            'Uploads to Supabase Storage bucket "core-members" and links directly to database.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email & LinkedIn (Phone field completely removed) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#672C1C]">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={selectedItem.email || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
                        placeholder="e.g. member@srisriuniversity.edu.in"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#672C1C]">LinkedIn Profile URL (Optional)</label>
                      <input
                        type="url"
                        value={selectedItem.linkedin_url || selectedItem.linkedin || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, linkedin: e.target.value, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#672C1C]">Short Biography</label>
                    <textarea
                      rows={3}
                      value={selectedItem.bio || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, bio: e.target.value })}
                      placeholder="Brief summary of their responsibilities, tech expertise, and student leadership..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => {
                      setShowModal(null);
                      setModalError('');
                    }}
                    className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={async () => {
                      if (!selectedItem.name || !selectedItem.name.trim()) {
                        setModalError('Member full name is mandatory.');
                        return;
                      }
                      if (!selectedItem.role || !selectedItem.role.trim()) {
                        setModalError('Designation / Role is mandatory.');
                        return;
                      }

                      // Optional Email Validation
                      if (selectedItem.email && selectedItem.email.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(selectedItem.email.trim())) {
                          setModalError('Please enter a valid email address (e.g. name@university.edu).');
                          return;
                        }
                      }

                      // Optional LinkedIn URL Validation
                      const rawLinkedIn = selectedItem.linkedin_url || selectedItem.linkedin;
                      if (rawLinkedIn && rawLinkedIn.trim()) {
                        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\//i;
                        if (!linkedinRegex.test(rawLinkedIn.trim())) {
                          setModalError('LinkedIn URL must start with https://linkedin.com/ (e.g. https://linkedin.com/in/username).');
                          return;
                        }
                      }

                      setModalError('');
                      setIsLoading(true);
                      const saveRes = await saveCoreMember({
                        ...selectedItem,
                        branch: selectedItem.branch || null,
                        linkedin_url: rawLinkedIn ? rawLinkedIn.trim() : null,
                        linkedin: rawLinkedIn ? rawLinkedIn.trim() : null
                      }, currentAdmin);
                      setIsLoading(false);

                      if (!saveRes.success) {
                        setModalError(saveRes.error || 'Failed to update member in database.');
                        return;
                      }
                      setShowModal(null);
                      setModalError('');
                      await loadTabData('core_members');
                      setActionSuccess(`Profile & details saved for "${selectedItem.name}".`);
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Profile</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Advanced Announcement Modal */}
        <AnimatePresence>
          {showModal === 'announcement' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                if (!isUploadingBanner) {
                  setShowModal(null);
                  setModalError('');
                }
              }}
            >
              <div
                className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#672C1C]">
                        {selectedItem.id ? 'Edit Announcement' : 'Create New Announcement'}
                      </h4>
                      <p className="text-[11px] text-[#66534B]">Configure public notices, banners, and external action links</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold block mb-1 text-[#2B2320]">Announcement Headline *</label>
                      <input
                        type="text"
                        value={selectedItem.title || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                        placeholder="e.g. SSU Annual Hackathon 2026 Registrations Open!"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Category</label>
                      <select
                        value={selectedItem.category || 'General'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white font-medium"
                      >
                        <option value="General">General Notice</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Urgent">Urgent Alert</option>
                        <option value="Recruitment">Recruitment</option>
                        <option value="Celebration">Celebration</option>
                      </select>
                    </div>
                  </div>

                  {/* Banner Upload directly to Supabase Storage bucket 'announcements' */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/25 space-y-2">
                    <label className="font-bold text-[#672C1C] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#AE7B29]" />
                        <span>Announcement Banner / Poster Image</span>
                      </span>
                      {selectedItem.banner_url && (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                          Banner Attached
                        </span>
                      )}
                    </label>

                    {selectedItem.banner_url ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#AE7B29]/30 max-h-48 group">
                        <img
                          src={selectedItem.banner_url}
                          alt="Banner Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="px-3 py-1.5 rounded-xl bg-white text-[#672C1C] text-xs font-bold cursor-pointer hover:bg-gray-100 shadow-md flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-[#AE7B29]" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingBanner(true);
                                const res = await uploadMedia(file, 'announcements', selectedItem.id || selectedItem.title);
                                setIsUploadingBanner(false);
                                if (res.success) {
                                  setSelectedItem(prev => ({ ...prev, banner_url: res.url }));
                                } else {
                                  setModalError(res.error || 'Failed to upload banner.');
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(prev => ({ ...prev, banner_url: null }))}
                            className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-[#AE7B29]/40 rounded-xl p-4 text-center hover:bg-white/60 transition-colors">
                        <Upload className="w-6 h-6 text-[#AE7B29] mx-auto mb-1.5 opacity-70" />
                        <label className="cursor-pointer text-xs font-bold text-[#672C1C] hover:text-[#AE7B29]">
                          <span>Upload Banner / Poster to Supabase Storage</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingBanner}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingBanner(true);
                              const res = await uploadMedia(file, 'announcements', selectedItem.id || selectedItem.title);
                              setIsUploadingBanner(false);
                              if (res.success) {
                                setSelectedItem(prev => ({ ...prev, banner_url: res.url }));
                              } else {
                                setModalError(res.error || 'Failed to upload banner.');
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-[#66534B] mt-0.5">
                          {isUploadingBanner ? (
                            <span className="text-[#AE7B29] font-bold animate-pulse flex items-center justify-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Uploading image to storage...
                            </span>
                          ) : (
                            'PNG, JPG, WebP up to 10MB (automatically optimized & cache-busted)'
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dates & Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Publication Date</label>
                      <input
                        type="date"
                        value={selectedItem.publish_date ? selectedItem.publish_date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setSelectedItem({ ...selectedItem, publish_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Expiry Date (Optional)</label>
                      <input
                        type="date"
                        value={selectedItem.expiry_date ? selectedItem.expiry_date.slice(0, 10) : ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, expiry_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Notice Icon</label>
                      <select
                        value={selectedItem.icon || 'Bell'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, icon: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white"
                      >
                        <option value="Bell">Bell</option>
                        <option value="Sparkles">Sparkles</option>
                        <option value="AlertCircle">Alert</option>
                        <option value="Trophy">Trophy</option>
                        <option value="Calendar">Calendar</option>
                        <option value="Compass">Compass</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Message (for card) */}
                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Short Notice Summary (Shown on public card preview) *</label>
                    <textarea
                      rows={2}
                      value={selectedItem.short_message || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, short_message: e.target.value })}
                      placeholder="Brief teaser summarizing the key announcement..."
                      className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  {/* Full Content (for modal) */}
                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Full Notice Details (Shown in reader modal) *</label>
                    <textarea
                      rows={4}
                      value={selectedItem.full_content || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, full_content: e.target.value })}
                      placeholder="Comprehensive announcement details, schedules, requirements..."
                      className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  {/* External Action Link & Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Action Target Link (Optional)</label>
                      <input
                        type="url"
                        value={selectedItem.action_link || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, action_link: e.target.value })}
                        placeholder="https://forms.gle/... or https://devpost.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Action Button Text</label>
                      <input
                        type="text"
                        value={selectedItem.action_text || 'Proceed'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, action_text: e.target.value })}
                        placeholder="e.g. Register on Devpost, Apply Now"
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Status & Pin Toggles */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#AE7B29]/15">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#672C1C]">
                        <input
                          type="checkbox"
                          checked={selectedItem.pinned || false}
                          onChange={(e) => setSelectedItem({ ...selectedItem, pinned: e.target.checked })}
                          className="rounded text-[#672C1C] focus:ring-[#AE7B29]"
                        />
                        <span>Pin to Top of Announcements</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#66534B]">Publication Status:</span>
                      <select
                        value={selectedItem.status || 'draft'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${selectedItem.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : selectedItem.status === 'archived'
                            ? 'bg-gray-100 text-gray-800 border-gray-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                      >
                        <option value="draft">Draft (Hidden from Public)</option>
                        <option value="published">Published (Live on Website)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    disabled={isUploadingBanner}
                    onClick={() => setShowModal(null)}
                    className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingBanner}
                    onClick={async () => {
                      if (!selectedItem.title || !selectedItem.title.trim()) {
                        setModalError('Announcement headline is required.');
                        return;
                      }
                      setModalError('');
                      setIsLoading(true);
                      const res = await saveAnnouncement(selectedItem, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        await loadTabData('announcements');
                        setActionSuccess(`Announcement "${selectedItem.title}" saved successfully.`);
                      } else {
                        setModalError(res.error || 'Failed to save announcement.');
                      }
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D8A54E]" />
                    <span>Save Notice</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Advanced Event Modal */}
        <AnimatePresence>
          {showModal === 'event' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                if (!isUploadingPoster) {
                  setShowModal(null);
                  setModalError('');
                }
              }}
            >
              <div
                className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#672C1C]">
                        {selectedItem.id ? 'Edit Event' : 'Create New Event'}
                      </h4>
                      <p className="text-[11px] text-[#66534B]">Configure schedule, venue, posters, and registration controls</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  {/* Title & Category & Phase */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold block mb-1 text-[#2B2320]">Event Title *</label>
                      <input
                        type="text"
                        value={selectedItem.title || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                        placeholder="e.g. Full Stack Cloud & AI Bootcamp"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Category</label>
                      <select
                        value={selectedItem.category || 'Workshop'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white font-medium"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Competition">Competition</option>
                        <option value="Social">Social</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                    </div>
                  </div>

                  {/* Poster Upload to Supabase Storage bucket 'events' */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/25 space-y-2">
                    <label className="font-bold text-[#672C1C] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#AE7B29]" />
                        <span>Event Poster / Promotional Banner</span>
                      </span>
                      {selectedItem.poster_url && (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                          Poster Attached
                        </span>
                      )}
                    </label>

                    {selectedItem.poster_url ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#AE7B29]/30 max-h-48 group">
                        <img
                          src={selectedItem.poster_url}
                          alt="Poster Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="px-3 py-1.5 rounded-xl bg-white text-[#672C1C] text-xs font-bold cursor-pointer hover:bg-gray-100 shadow-md flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-[#AE7B29]" />
                            <span>Replace Poster</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingPoster(true);
                                const res = await uploadMedia(file, 'events', selectedItem.id || selectedItem.title);
                                setIsUploadingPoster(false);
                                if (res.success) {
                                  setSelectedItem(prev => ({ ...prev, poster_url: res.url, banner_url: res.url }));
                                } else {
                                  setModalError(res.error || 'Failed to upload event poster.');
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(prev => ({ ...prev, poster_url: null, banner_url: null }))}
                            className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-[#AE7B29]/40 rounded-xl p-4 text-center hover:bg-white/60 transition-colors">
                        <Upload className="w-6 h-6 text-[#AE7B29] mx-auto mb-1.5 opacity-70" />
                        <label className="cursor-pointer text-xs font-bold text-[#672C1C] hover:text-[#AE7B29]">
                          <span>Upload Event Poster to Supabase Storage</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPoster}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingPoster(true);
                              const res = await uploadMedia(file, 'events', selectedItem.id || selectedItem.title);
                              setIsUploadingPoster(false);
                              if (res.success) {
                                setSelectedItem(prev => ({ ...prev, poster_url: res.url, banner_url: res.url }));
                              } else {
                                setModalError(res.error || 'Failed to upload event poster.');
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-[#66534B] mt-0.5">
                          {isUploadingPoster ? (
                            <span className="text-[#AE7B29] font-bold animate-pulse flex items-center justify-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Uploading poster to storage...
                            </span>
                          ) : (
                            'PNG, JPG, WebP up to 10MB (automatically optimized & displayed on Event Cards)'
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Date, Time, Venue, Organizer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Event Date *</label>
                      <input
                        type="date"
                        value={selectedItem.event_date ? selectedItem.event_date.slice(0, 10) : ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, event_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Event Time *</label>
                      <input
                        type="text"
                        value={selectedItem.event_time || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, event_time: e.target.value })}
                        placeholder="e.g. 10:00 AM - 1:00 PM"
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Venue / Location *</label>
                      <input
                        type="text"
                        value={selectedItem.venue || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, venue: e.target.value })}
                        placeholder="e.g. Main Auditorium / Lab 3"
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Organizer</label>
                      <input
                        type="text"
                        value={selectedItem.organizer || 'SSU IT Club Core Team'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, organizer: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                      />
                    </div>
                  </div>

                  {/* Short & Full Description */}
                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Short Description (Card Teaser)</label>
                    <input
                      type="text"
                      value={selectedItem.short_description || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, short_description: e.target.value })}
                      placeholder="Single line overview for the event cards..."
                      className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Detailed Event Agenda & Requirements</label>
                    <textarea
                      rows={3}
                      value={selectedItem.description || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                      placeholder="Comprehensive breakdown of prerequisites, agenda, and outcomes..."
                      className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  {/* Registration Controls */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/25 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#672C1C]">
                        <input
                          type="checkbox"
                          checked={selectedItem.registration_enabled !== false}
                          onChange={(e) => setSelectedItem({ ...selectedItem, registration_enabled: e.target.checked })}
                          className="rounded text-[#672C1C] focus:ring-[#AE7B29]"
                        />
                        <span>Enable Public Registration Form for this Event</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1 text-[#2B2320]">Registration Deadline</label>
                        <input
                          type="datetime-local"
                          value={selectedItem.registration_deadline ? selectedItem.registration_deadline.slice(0, 16) : ''}
                          onChange={(e) => setSelectedItem({ ...selectedItem, registration_deadline: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-[#AE7B29]/30 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1 text-[#2B2320]">Max Participants</label>
                        <input
                          type="number"
                          value={selectedItem.max_participants || 100}
                          onChange={(e) => setSelectedItem({ ...selectedItem, max_participants: parseInt(e.target.value) || 100 })}
                          className="w-full px-3 py-1.5 rounded-xl border border-[#AE7B29]/30 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status & Phase */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#AE7B29]/15">
                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Event Phase</label>
                      <select
                        value={selectedItem.event_phase || 'upcoming'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, event_phase: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white font-medium"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1 text-[#2B2320]">Publication Status</label>
                      <select
                        value={selectedItem.status || 'draft'}
                        onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${selectedItem.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : selectedItem.status === 'completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                      >
                        <option value="draft">Draft (Hidden from Public)</option>
                        <option value="published">Published Live</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    disabled={isUploadingPoster}
                    onClick={() => setShowModal(null)}
                    className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingPoster}
                    onClick={async () => {
                      if (!selectedItem.title || !selectedItem.title.trim()) {
                        setModalError('Event title is required.');
                        return;
                      }
                      setModalError('');
                      setIsLoading(true);
                      const res = await saveEvent(selectedItem, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        await loadTabData('events');
                        setActionSuccess(`Event "${selectedItem.title}" saved successfully.`);
                      } else {
                        setModalError(res.error || 'Failed to save event.');
                      }
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D8A54E]" />
                    <span>Save Event</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Create Admin Modal (Super Admin Exclusive) */}
        <AnimatePresence>
          {showModal === 'createAdmin' && selectedItem && isCurrentSuperAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                setShowModal(null);
                setModalError('');
              }}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#672C1C]">Create Administrator Account</h4>
                      <p className="text-[11px] text-[#66534B]">Super Admin exclusive: assign login credentials and role permissions</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(null)} className="p-1 rounded-full text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  {/* Quick Core Member Select */}
                  {coreMembersList.length > 0 && (
                    <div className="p-3 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/30">
                      <label className="font-bold text-[#672C1C] block mb-1">
                        Promote Existing Core Member (Optional)
                      </label>
                      <select
                        onChange={(e) => {
                          const memberId = e.target.value;
                          if (!memberId) return;
                          const member = coreMembersList.find(m => String(m.id) === String(memberId));
                          if (member) {
                            setSelectedItem(prev => ({
                              ...prev,
                              fullName: member.name,
                              email: member.email || `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@ssuitclub.edu.in`,
                              designation: member.role || member.designation || 'Core Member'
                            }));
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white text-[#2B2320]"
                      >
                        <option value="">-- Choose from registered Core Members --</option>
                        {coreMembersList.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.role || 'Core Team'})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#66534B] mt-1">
                        Selecting a core member auto-populates their name, email, and designation below.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Full Name *</label>
                    <input
                      type="text"
                      value={selectedItem.fullName || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, fullName: e.target.value })}
                      placeholder="e.g. Ayush Kumar"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Email Address (Login ID) *</label>
                    <input
                      type="email"
                      value={selectedItem.email || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
                      placeholder="ayush@ssuitclub.edu.in"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Designation / Department</label>
                    <input
                      type="text"
                      value={selectedItem.designation || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, designation: e.target.value })}
                      placeholder="e.g. Lead Technical Coordinator"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Administrative Role *</label>
                    <select
                      value={selectedItem.role || ROLES.ADMIN}
                      onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white font-semibold"
                    >
                      <option value={ROLES.ADMIN}>ADMIN (Full Website & Content Management)</option>
                      <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN (Exclusive Account Authority + Full Website)</option>
                      <option value={ROLES.EDITOR}>EDITOR (Announcements, Events, Milestones, Content)</option>
                      <option value={ROLES.MEMBER_MANAGER}>MEMBER_MANAGER (Club Registrations & Core Team)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Initial Setup Password</label>
                    <input
                      type="text"
                      value={selectedItem.password || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, password: e.target.value })}
                      placeholder="Leave blank for secure default (AdminPassword@2026!)"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-mono bg-[#FAF6F4]"
                    />
                    <p className="text-[10px] text-[#66534B] mt-0.5">
                      New administrators will be assigned a unique `ADM-xxx` ID upon account activation.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedItem.fullName?.trim() || !selectedItem.email?.trim()) {
                        setModalError('Both Full Name and Email are mandatory.');
                        return;
                      }
                      setModalError('');
                      setIsLoading(true);
                      const res = await createAdminAccount(selectedItem, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        await loadTabData('admins');
                        setActionSuccess(`Administrator account [${selectedItem.email}] successfully created with ID ${res.admin?.admin_id || ''}.`);
                      } else {
                        setModalError(res.error || 'Failed to create admin account.');
                      }
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D8A54E]" />
                    <span>Create Administrator</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Edit Admin Modal (Super Admin Exclusive) */}
        <AnimatePresence>
          {showModal === 'editAdmin' && selectedItem && isCurrentSuperAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                setShowModal(null);
                setModalError('');
              }}
            >
              <div
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <Edit className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#672C1C]">Edit Administrator</h4>
                      <p className="text-[11px] text-[#66534B]">Update name, designation, or modify assigned role</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(null)} className="p-1 rounded-full text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Admin ID & Email</label>
                    <div className="px-3.5 py-2 rounded-xl bg-[#FAF6F4] border border-[#AE7B29]/20 font-mono text-[11px] text-[#672C1C] flex items-center justify-between">
                      <span className="font-bold">{selectedItem.admin_id}</span>
                      <span>{selectedItem.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Full Name *</label>
                    <input
                      type="text"
                      value={selectedItem.full_name || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, full_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Designation</label>
                    <input
                      type="text"
                      value={selectedItem.designation || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, designation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">Administrative Role</label>
                    <select
                      value={selectedItem.role || ROLES.ADMIN}
                      onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs bg-white font-semibold"
                    >
                      <option value={ROLES.ADMIN}>ADMIN (Full Website & Content Management)</option>
                      <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN (Exclusive Account Authority)</option>
                      <option value={ROLES.EDITOR}>EDITOR (Content, Announcements, Events)</option>
                      <option value={ROLES.MEMBER_MANAGER}>MEMBER_MANAGER (Members & Core Team)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!selectedItem.full_name?.trim()) {
                        setModalError('Full name is required.');
                        return;
                      }
                      setModalError('');
                      setIsLoading(true);
                      const res = await updateAdminProfile(selectedItem.id, {
                        full_name: selectedItem.full_name,
                        designation: selectedItem.designation,
                        role: selectedItem.role
                      }, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        await loadTabData('admins');
                        setActionSuccess(`Administrator profile for "${selectedItem.full_name}" updated.`);
                      } else {
                        setModalError(res.error || 'Failed to update admin profile.');
                      }
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D8A54E]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 7. Reset Password Modal (Super Admin Exclusive) */}
        <AnimatePresence>
          {showModal === 'resetAdminPass' && selectedItem && isCurrentSuperAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                setShowModal(null);
                setModalError('');
              }}
            >
              <div
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#AE7B29]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#672C1C] text-[#D8A54E] flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#672C1C]">Reset Password</h4>
                      <p className="text-[11px] text-[#66534B]">Set new secure login credentials for administrator</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(null)} className="p-1 rounded-full text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 text-xs">
                  <div><strong>Admin:</strong> {selectedItem.full_name}</div>
                  <div><strong>Email ID:</strong> <span className="font-mono text-[#672C1C]">{selectedItem.email}</span></div>
                  <div><strong>Admin ID:</strong> <span className="font-mono font-bold text-[#672C1C]">{selectedItem.admin_id}</span></div>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-[#2B2320]">New Password *</label>
                    <input
                      type="text"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="Enter at least 8 characters..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#AE7B29]/30 text-xs font-mono"
                    />
                    <p className="text-[10px] text-[#66534B] mt-0.5">
                      Recommended: Use letters, numbers, and symbols (e.g. SSU@Admin2026!)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!tempPassword || tempPassword.length < 8) {
                        setModalError('Password must contain at least 8 characters.');
                        return;
                      }
                      setModalError('');
                      setIsLoading(true);
                      const res = await resetAdminPassword(selectedItem.id, tempPassword, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        setTempPassword('');
                        setActionSuccess(`Password successfully reset for "${selectedItem.full_name}".`);
                      } else {
                        setModalError(res.error || 'Failed to reset password.');
                      }
                    }}
                    className="px-5 py-2 bg-[#672C1C] hover:bg-[#7B3522] text-[#F6E4C4] rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#D8A54E]" />
                    <span>Apply New Password</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 8. Delete Admin Confirmation Modal (Super Admin Exclusive) */}
        <AnimatePresence>
          {showModal === 'deleteAdminConfirm' && selectedItem && isCurrentSuperAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowModal(null)}
            >
              <div
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-serif font-bold text-lg text-[#672C1C]">Revoke Administrator Access?</h4>
                  <p className="text-xs text-[#66534B]">
                    Are you sure you want to permanently delete administrator account <strong>{selectedItem.full_name}</strong> ({selectedItem.email})?
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1 font-mono">
                  <div>Admin ID: {selectedItem.admin_id}</div>
                  <div>Current Role: {selectedItem.role}</div>
                  <div className="font-sans text-[11px] text-red-700 pt-1">
                    This administrator will immediately lose access to the Admin Portal and CMS operations.
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-xl text-xs hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await deleteAdminAccount(selectedItem.id, currentAdmin);
                      setIsLoading(false);
                      if (res.success) {
                        setShowModal(null);
                        await loadTabData('admins');
                        setActionSuccess(`Administrator account [${selectedItem.email}] deleted.`);
                      } else {
                        setActionError(res.error || 'Failed to delete admin account.');
                      }
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Revocation</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 9. Activity Log Detail Modal */}
        <AnimatePresence>
          {showModal === 'logDetail' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowModal(null)}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 font-mono">
                      {selectedItem.action_type}
                    </span>
                    <span className="text-xs font-mono text-[#AE7B29]">
                      {new Date(selectedItem.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button onClick={() => setShowModal(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F4] border border-[#AE7B29]/20 space-y-1">
                    <div><strong>Admin Actor:</strong> {selectedItem.admin_name}</div>
                    <div><strong>Admin ID:</strong> <span className="font-mono">{selectedItem.admin_id}</span></div>
                    <div><strong>Admin Email:</strong> <span className="font-mono">{selectedItem.admin_email || 'N/A'}</span></div>
                    <div><strong>Section:</strong> <span className="capitalize">{selectedItem.section_modified?.replace('_', ' ')}</span></div>
                  </div>

                  <div>
                    <h5 className="font-bold text-[#672C1C] mb-1">Activity Description:</h5>
                    <p className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#2B2320] leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {selectedItem.previous_content && (
                    <div>
                      <h5 className="font-bold text-[#672C1C] mb-1">Previous Content Snapshot:</h5>
                      <pre className="p-3 rounded-xl bg-gray-900 text-gray-100 font-mono text-[10px] max-h-36 overflow-y-auto">
                        {typeof selectedItem.previous_content === 'object'
                          ? JSON.stringify(selectedItem.previous_content, null, 2)
                          : String(selectedItem.previous_content)}
                      </pre>
                    </div>
                  )}

                  {selectedItem.updated_content && (
                    <div>
                      <h5 className="font-bold text-[#672C1C] mb-1">Updated Content Snapshot:</h5>
                      <pre className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[10px] max-h-36 overflow-y-auto">
                        {typeof selectedItem.updated_content === 'object'
                          ? JSON.stringify(selectedItem.updated_content, null, 2)
                          : String(selectedItem.updated_content)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={() => setShowModal(null)}
                    className="px-5 py-2 bg-[#672C1C] text-white rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Proposal Detail Modal */}
        <AnimatePresence>
          {showModal === 'proposalDetail' && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowModal(null)}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{selectedItem.ticket_code}</span>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#672C1C]">{selectedItem.title}</h3>

                <div className="p-3 rounded-xl bg-[#FAF6F4] text-xs space-y-1">
                  <div><strong>Proposer:</strong> {selectedItem.proposer_name} ({selectedItem.role})</div>
                  <div><strong>Email:</strong> {selectedItem.email} | <strong>Phone:</strong> {selectedItem.phone}</div>
                  <div><strong>Branch:</strong> {selectedItem.branch} | <strong>Program:</strong> {selectedItem.program}</div>
                </div>

                <div className="text-xs space-y-2">
                  <h5 className="font-bold text-[#672C1C]">Problem Statement:</h5>
                  <p className="p-3 bg-gray-50 rounded-xl leading-relaxed text-[#2B2320]">{selectedItem.problem_statement}</p>

                  <h5 className="font-bold text-[#672C1C]">Detailed Solution Explanation:</h5>
                  <p className="p-3 bg-gray-50 rounded-xl leading-relaxed text-[#2B2320]">{selectedItem.explanation}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={() => setShowModal(null)} className="px-5 py-2 bg-[#672C1C] text-white rounded-xl text-xs font-bold">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminPortal;
