import { supabase, isSupabaseConfigured, ADMIN_PASSCODE } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'ssu_it_club_registered_members_v2';
const UPDATE_EVENT_NAME = 'ssu_club_members_updated';

// Default initial seed members for offline / initial development
const INITIAL_SEED_MEMBERS = [
  {
    id: "mem-seed-01",
    full_name: "Ayush Singh",
    email: "ayush.s@srisriuniversity.edu.in",
    phone: "9876543210",
    faculty: "Faculty of Engineering & Technology",
    designation: "Student",
    registration_no: "202500567",
    roll_no: "1ETBTS20251019",
    branch: "B. Tech (CSCD)",
    value_addition: "Full Stack Web Developer & Lead Coordinator for IT Club Digital Initiatives.",
    status: "active",
    created_at: "2026-10-15T10:30:00.000Z"
  }
];

// Helper to normalize phone numbers (strip non-digits)
const normalizePhone = (phone = '') => phone.toString().replace(/\D/g, '').slice(-10);

// Helper to get raw members from local storage
function getRawLocalMembers() {
  if (typeof window === 'undefined') return INITIAL_SEED_MEMBERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_MEMBERS));
      return INITIAL_SEED_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_MEMBERS;
  } catch (err) {
    console.error("Error accessing localStorage:", err);
    return INITIAL_SEED_MEMBERS;
  }
}

// Helper to save raw members to local storage
function saveRawLocalMembers(members) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { count: members.length } }));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
}

/**
 * ==============================================================================
 * DUPLICATE CHECK FUNCTION
 * ==============================================================================
 * Checks for duplicate Email, Phone, and (for Students) Registration/Roll Numbers.
 * Returns { isDuplicate: boolean, type: 'contact' | 'academic' | null, title: string, message: string }
 */
export async function checkMemberDuplicate(candidate) {
  const normEmail = (candidate.email || '').trim().toLowerCase();
  const normPhone = normalizePhone(candidate.phone);
  const isStudent = candidate.designation === 'Student';
  const normRegNo = (candidate.registrationNo || candidate.registration_no || '').trim().toUpperCase();
  const normRollNo = (candidate.rollNo || candidate.roll_no || '').trim().toUpperCase();

  // 1. SUPABASE LIVE CHECK
  if (isSupabaseConfigured && supabase) {
    try {
      // Check A: Email or Phone duplicate
      const { data: contactMatches, error: contactError } = await supabase
        .from('club_members')
        .select('id, email, phone')
        .or(`email.ilike.${normEmail},phone.ilike.%${normPhone}%`)
        .limit(1);

      if (!contactError && contactMatches && contactMatches.length > 0) {
        return {
          isDuplicate: true,
          type: 'contact',
          title: 'Duplicate Registration Detected!',
          message: 'This email address or phone number is already associated with an existing membership. Please contact our Core Members if you need assistance.'
        };
      }

      // Check B: Registration Number or Roll Number (for Students)
      if (isStudent && (normRegNo || normRollNo)) {
        let academicQuery = supabase
          .from('club_members')
          .select('id, registration_no, roll_no')
          .eq('designation', 'Student');

        if (normRegNo && normRollNo) {
          academicQuery = academicQuery.or(`registration_no.ilike.${normRegNo},roll_no.ilike.${normRollNo}`);
        } else if (normRegNo) {
          academicQuery = academicQuery.ilike('registration_no', normRegNo);
        } else {
          academicQuery = academicQuery.ilike('roll_no', normRollNo);
        }

        const { data: academicMatches, error: academicError } = await academicQuery.limit(1);

        if (!academicError && academicMatches && academicMatches.length > 0) {
          return {
            isDuplicate: true,
            type: 'academic',
            title: 'Duplicate Registration Detected!',
            message: 'This Registration Number or Roll Number is already registered with SSU IT Club. If you believe this is your correct information, please contact our Core Members for assistance.'
          };
        }
      }

      return { isDuplicate: false };
    } catch (err) {
      console.warn("Supabase duplicate check encountered an error, falling back to local verification:", err);
    }
  }

  // 2. LOCAL STORAGE / RESILIENT FALLBACK CHECK
  const localList = getRawLocalMembers();

  // Check Contact duplicate
  const contactHit = localList.find(m => {
    const mEmail = (m.email || '').trim().toLowerCase();
    const mPhone = normalizePhone(m.phone);
    return (normEmail && mEmail === normEmail) || (normPhone && mPhone === normPhone);
  });

  if (contactHit) {
    return {
      isDuplicate: true,
      type: 'contact',
      title: 'Duplicate Registration Detected!',
      message: 'This email address or phone number is already associated with an existing membership. Please contact our Core Members if you need assistance.'
    };
  }

  // Check Academic duplicate for Students
  if (isStudent) {
    const academicHit = localList.find(m => {
      if (m.designation !== 'Student') return false;
      const mReg = (m.registration_no || m.registrationNo || '').trim().toUpperCase();
      const mRoll = (m.roll_no || m.rollNo || '').trim().toUpperCase();
      const hasRegMatch = normRegNo && mReg && mReg !== 'N/A' && mReg === normRegNo;
      const hasRollMatch = normRollNo && mRoll && mRoll !== 'N/A' && mRoll === normRollNo;
      return hasRegMatch || hasRollMatch;
    });

    if (academicHit) {
      return {
        isDuplicate: true,
        type: 'academic',
        title: 'Duplicate Registration Detected!',
        message: 'This Registration Number or Roll Number is already registered with SSU IT Club. If you believe this is your correct information, please contact our Core Members for assistance.'
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * ==============================================================================
 * REGISTER MEMBER
 * ==============================================================================
 * Performs pre-flight duplicate check, validates input, and writes to database.
 */
export async function registerClubMember(formData) {
  // Pre-flight duplicate check
  const dupCheck = await checkMemberDuplicate(formData);
  if (dupCheck.isDuplicate) {
    return {
      success: false,
      duplicateInfo: dupCheck
    };
  }

  const isStudent = formData.designation === 'Student';
  const cleanRecord = {
    full_name: (formData.name || formData.full_name || '').trim(),
    email: (formData.email || '').trim().toLowerCase(),
    phone: (formData.phone || '').trim(),
    faculty: (formData.faculty || '').trim(),
    designation: formData.designation,
    registration_no: isStudent ? (formData.registrationNo || formData.registration_no || '').trim().toUpperCase() : 'N/A',
    roll_no: isStudent ? (formData.rollNo || formData.roll_no || '').trim().toUpperCase() : 'N/A',
    branch: isStudent ? (formData.branch || '').trim() : 'N/A',
    value_addition: (formData.valueAddition || formData.value_addition || '').trim(),
    status: 'active'
  };

  // 1. SUPABASE INSERTION
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .insert([cleanRecord])
        .select()
        .single();

      if (error) {
        // Handle database unique constraint violations gracefully
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
          if (error.message?.includes('reg') || error.message?.includes('roll')) {
            return {
              success: false,
              duplicateInfo: {
                isDuplicate: true,
                type: 'academic',
                title: 'Duplicate Registration Detected!',
                message: 'This Registration Number or Roll Number is already registered with SSU IT Club. If you believe this is your correct information, please contact our Core Members for assistance.'
              }
            };
          } else {
            return {
              success: false,
              duplicateInfo: {
                isDuplicate: true,
                type: 'contact',
                title: 'Duplicate Registration Detected!',
                message: 'This email address or phone number is already associated with an existing membership. Please contact our Core Members if you need assistance.'
              }
            };
          }
        }
        throw error;
      }

      // Also sync to local storage cache for offline responsiveness
      const local = getRawLocalMembers();
      saveRawLocalMembers([data, ...local.filter(m => m.id !== data.id)]);

      return {
        success: true,
        member: data,
        storageMode: 'supabase'
      };
    } catch (err) {
      console.warn("Supabase insertion failed, falling back to persistent local storage:", err);
    }
  }

  // 2. LOCAL STORAGE INSERTION
  const localRecord = {
    ...cleanRecord,
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    created_at: new Date().toISOString()
  };

  const existing = getRawLocalMembers();
  saveRawLocalMembers([localRecord, ...existing]);

  return {
    success: true,
    member: localRecord,
    storageMode: 'local'
  };
}

/**
 * ==============================================================================
 * PUBLIC MEMBERS DIRECTORY FETCH
 * ==============================================================================
 * CRITICAL PRIVACY REQUIREMENT:
 * Exposes ONLY: S.No., Name, Faculty, Designation, Branch.
 * NEVER returns Email ID, Phone Number, Registration Number, or Roll Number!
 */
export async function getPublicClubMembers() {
  let rawList = [];

  // 1. SUPABASE QUERY
  if (isSupabaseConfigured && supabase) {
    try {
      // Query either public view or explicit non-sensitive columns
      const { data, error } = await supabase
        .from('public_club_members')
        .select('id, full_name, faculty, designation, branch, created_at')
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data)) {
        rawList = data;
      } else {
        // Fallback to table with restricted select
        const { data: tableData, error: tableError } = await supabase
          .from('club_members')
          .select('id, full_name, faculty, designation, branch, created_at')
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        if (!tableError && Array.isArray(tableData)) {
          rawList = tableData;
        }
      }
    } catch (err) {
      console.warn("Could not query Supabase public members, using local cache:", err);
    }
  }

  // 2. FALLBACK TO LOCAL STORAGE
  if (rawList.length === 0) {
    rawList = getRawLocalMembers().filter(m => (m.status || 'active') === 'active');
  }

  // Map to strictly privacy-sanitized objects
  return rawList.map((m, index) => {
    const isStaffOrFaculty = m.designation === 'Faculty' || m.designation === 'Staff';
    return {
      sno: index + 1,
      id: m.id,
      name: m.full_name || m.name || 'Anonymous Member',
      faculty: m.faculty || 'General',
      designation: m.designation || 'Student',
      branch: isStaffOrFaculty ? 'N/A' : (m.branch || 'N/A'),
      createdAt: m.created_at || m.registeredAt || new Date().toISOString()
      // NOTICE: NO email, NO phone, NO registration_no, NO roll_no returned!
    };
  });
}

/**
 * ==============================================================================
 * REALTIME SUBSCRIPTION
 * ==============================================================================
 * Listens for new member additions in realtime.
 */
export function subscribeToMemberUpdates(onUpdate) {
  const unsubscribers = [];

  // A. Supabase Realtime Channel
  if (isSupabaseConfigured && supabase) {
    try {
      const channel = supabase
        .channel('realtime_club_members')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'club_members' },
          (payload) => {
            if (typeof onUpdate === 'function') onUpdate(payload);
          }
        )
        .subscribe();

      unsubscribers.push(() => {
        supabase.removeChannel(channel);
      });
    } catch (err) {
      console.warn("Supabase realtime subscription failed:", err);
    }
  }

  // B. Window Custom Event for Local Storage Updates
  const handleCustomEvent = (e) => {
    if (typeof onUpdate === 'function') onUpdate(e.detail);
  };
  window.addEventListener(UPDATE_EVENT_NAME, handleCustomEvent);
  unsubscribers.push(() => window.removeEventListener(UPDATE_EVENT_NAME, handleCustomEvent));

  // C. Storage Event for cross-tab synchrony
  const handleStorageEvent = (e) => {
    if (e.key === LOCAL_STORAGE_KEY && typeof onUpdate === 'function') {
      onUpdate({ type: 'storage_change' });
    }
  };
  window.addEventListener('storage', handleStorageEvent);
  unsubscribers.push(() => window.removeEventListener('storage', handleStorageEvent));

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}

/**
 * ==============================================================================
 * ADMIN PORTAL MANAGEMENT (Passcode Protected)
 * ==============================================================================
 */

export function verifyAdminPasscode(enteredPasscode) {
  if (!enteredPasscode) return false;
  return enteredPasscode.trim() === ADMIN_PASSCODE.trim();
}

/**
 * Fetch full private records for authorized admin dashboard
 */
export async function getAdminMembers(enteredPasscode) {
  if (!verifyAdminPasscode(enteredPasscode)) {
    return {
      success: false,
      error: 'Invalid Admin Passcode. Access Denied.'
    };
  }

  let fullList = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        fullList = data;
      }
    } catch (err) {
      console.warn("Could not fetch admin members from Supabase, checking local:", err);
    }
  }

  if (fullList.length === 0) {
    fullList = getRawLocalMembers();
  }

  return {
    success: true,
    members: fullList
  };
}

/**
 * Delete a member registration (Admin action)
 */
export async function deleteClubMember(memberId, enteredPasscode) {
  if (!verifyAdminPasscode(enteredPasscode)) {
    return { success: false, error: 'Unauthorized.' };
  }

  // Supabase delete
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('club_members').delete().eq('id', memberId);
    } catch (err) {
      console.error("Supabase delete failed:", err);
    }
  }

  // Local storage delete
  const local = getRawLocalMembers();
  const updated = local.filter(m => m.id !== memberId);
  saveRawLocalMembers(updated);

  return { success: true };
}

/**
 * Export members to a formatted CSV file
 */
export function exportMembersToCSV(members, isAdmin = false) {
  if (!members || members.length === 0) return;

  let headers = [];
  let rows = [];

  if (isAdmin) {
    headers = [
      'S.No.',
      'Full Name',
      'Email ID',
      'Phone Number',
      'Designation',
      'Faculty / Department',
      'Registration Number',
      'Roll Number',
      'Branch',
      'Value to IT Club',
      'Registered Date'
    ];

    rows = members.map((m, i) => [
      i + 1,
      `"${(m.full_name || m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || 'N/A').replace(/"/g, '""')}"`,
      `"${(m.phone || 'N/A').replace(/"/g, '""')}"`,
      `"${(m.designation || 'Student').replace(/"/g, '""')}"`,
      `"${(m.faculty || '').replace(/"/g, '""')}"`,
      `"${(m.registration_no || m.registrationNo || 'N/A').replace(/"/g, '""')}"`,
      `"${(m.roll_no || m.rollNo || 'N/A').replace(/"/g, '""')}"`,
      `"${(m.branch || 'N/A').replace(/"/g, '""')}"`,
      `"${(m.value_addition || m.valueAddition || '').replace(/"/g, '""')}"`,
      `"${new Date(m.created_at || m.registeredAt || Date.now()).toLocaleDateString()}"`
    ]);
  } else {
    headers = ['S.No.', 'Name', 'Faculty', 'Designation', 'Branch'];
    rows = members.map((m, i) => [
      i + 1,
      `"${(m.name || m.full_name || '').replace(/"/g, '""')}"`,
      `"${(m.faculty || '').replace(/"/g, '""')}"`,
      `"${(m.designation || 'Student').replace(/"/g, '""')}"`,
      `"${(m.branch || 'N/A').replace(/"/g, '""')}"`
    ]);
  }

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SSU_IT_Club_Members_${isAdmin ? 'Admin_Export' : 'Roster'}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
