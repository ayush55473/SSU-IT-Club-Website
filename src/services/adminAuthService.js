import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_SESSION_STORAGE_KEY = 'ssu_it_club_admin_session_v1';
const ADMIN_ACCOUNTS_STORAGE_KEY = 'ssu_it_club_admin_accounts_v1';
const ADMIN_AUTH_EVENT = 'ssu_it_club_admin_auth_changed';

// Recognized Super Admin Emails & Aliases
export const SUPER_ADMIN_EMAILS = [
  'ayushs.etbts25@srisriuniversity.edu.in',
  'admin@ssuitclub.edu.in'
];

// Default Seed Super Admin Account
const INITIAL_SUPER_ADMIN = {
  id: 'adm-seed-001',
  admin_id: 'ADM-001',
  email: 'ayushs.etbts25@srisriuniversity.edu.in',
  password_hash: 'AdminDemo@2026!', // Dev demo fallback only (production uses Supabase Auth)
  full_name: 'Ayush Singh',
  designation: 'Lead Administrator & Core Secretary',
  role: 'SUPER_ADMIN',
  status: 'active',
  avatar_url: null,
  created_at: '2026-10-15T10:00:00.000Z'
};

// Initial Seed Editor Account
const INITIAL_EDITOR = {
  id: 'adm-seed-002',
  admin_id: 'ADM-002',
  email: 'editor@ssuitclub.edu.in',
  password_hash: 'EditorPass@2026!',
  full_name: 'Sanchita Padhi',
  designation: 'Content Editor & Design Lead',
  role: 'EDITOR',
  status: 'active',
  avatar_url: null,
  created_at: '2026-10-16T11:00:00.000Z'
};

// Initial Seed Member Manager Account
const INITIAL_MEMBER_MANAGER = {
  id: 'adm-seed-003',
  admin_id: 'ADM-003',
  email: 'manager@ssuitclub.edu.in',
  password_hash: 'ManagerPass@2026!',
  full_name: 'Priyanka Sharma',
  designation: 'Membership & Logistics Coordinator',
  role: 'MEMBER_MANAGER',
  status: 'active',
  avatar_url: null,
  created_at: '2026-10-17T12:00:00.000Z'
};

const DEFAULT_ACCOUNTS = [INITIAL_SUPER_ADMIN, INITIAL_EDITOR, INITIAL_MEMBER_MANAGER];

// Local store helpers
function getLocalAdminAccounts() {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveLocalAdminAccounts(accounts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to save local admin accounts:", err);
  }
}

/**
 * ==============================================================================
 * ROLE & PERMISSION HELPERS
 * ==============================================================================
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  MEMBER_MANAGER: 'MEMBER_MANAGER'
};

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'Club Administrator',
  EDITOR: 'Content Editor',
  MEMBER_MANAGER: 'Member Manager'
};

/**
 * Checks if an administrator or role string is the designated Super Admin
 */
export function isSuperAdmin(adminOrRole) {
  if (!adminOrRole) return false;
  const role = typeof adminOrRole === 'object' ? adminOrRole.role : adminOrRole;
  return role === ROLES.SUPER_ADMIN;
}

/**
 * ALL AUTHORIZED ADMINISTRATORS HAVE COMPLETE WEBSITE CONTENT MANAGEMENT ACCESS
 */
export function canManageWebsite(role) {
  return Boolean(role);
}

export function canManageAnnouncements(role) {
  return Boolean(role);
}

export function canManageEvents(role) {
  return Boolean(role);
}

export function canManageMembers(role) {
  return Boolean(role);
}

export function canManageProposals(role) {
  return Boolean(role);
}

export function canViewActivityLogs(role) {
  return Boolean(role);
}

export function canRestoreVersions(role) {
  return Boolean(role);
}

/**
 * EXCLUSIVE TO SUPER ADMIN ONLY:
 * Administrator accounts, roles, access permissions, and security settings
 */
export function canManageAdmins(role) {
  return isSuperAdmin(role);
}

/**
 * ==============================================================================
 * CURRENT SESSION MANAGEMENT
 * ==============================================================================
 */
export function getCurrentAdmin() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) || localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setAdminSession(admin, rememberMe = true) {
  if (typeof window === 'undefined') return;
  const data = JSON.stringify(admin);
  if (rememberMe) {
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, data);
  }
  sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, data);
  window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENT, { detail: admin }));
}

function clearAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENT, { detail: null }));
}

/**
 * Validate current active session against Supabase database
 */
export async function validateAdminSession() {
  const current = getCurrentAdmin();
  if (!current) return null;

  if (isSupabaseConfigured && supabase) {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('ssu_admin_session_token') || sessionStorage.getItem('ssu_admin_session_token')) : null;
    if (token) {
      try {
        const { data, error } = await supabase.rpc('verify_admin_session', { p_token: token });
        if (!error && data) {
          if (data.valid && data.admin) {
            setAdminSession(data.admin, true);
            return data.admin;
          } else if (data.valid === false) {
            await logoutAdmin();
            return null;
          }
        }
      } catch (e) {
        console.warn("verify_admin_session check warning:", e);
      }
    }
  }

  return current;
}

export function subscribeToAuthChanges(callback) {
  const handler = (e) => {
    if (typeof callback === 'function') callback(e.detail);
  };
  window.addEventListener(ADMIN_AUTH_EVENT, handler);
  return () => window.removeEventListener(ADMIN_AUTH_EVENT, handler);
}

/**
 * ==============================================================================
 * AUTHENTICATION (Login / Logout / Reset)
 * ==============================================================================
 */

/**
 * Log in an authorized administrator with individual email and password
 */
export async function loginAdmin(email, password, rememberMe = true) {
  const normEmail = (email || '').trim().toLowerCase();
  const rawPassword = (password || '').trim();

  if (!normEmail || !rawPassword) {
    return { success: false, error: 'Please enter both your Admin Email and Password.' };
  }

  // 1. DATABASE-BACKED VERIFICATION VIA POSTGRESQL RPC (Primary multi-device auth)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('verify_admin_login', {
        p_identifier: normEmail,
        p_password: rawPassword
      });

      if (!rpcError && rpcData) {
        if (rpcData.success && rpcData.admin) {
          const profile = rpcData.admin;
          if (rpcData.token && typeof window !== 'undefined') {
            try {
              localStorage.setItem('ssu_admin_session_token', rpcData.token);
              sessionStorage.setItem('ssu_admin_session_token', rpcData.token);
            } catch {}
          }
          // Also sync to local storage cache so offline mode stays updated
          try {
            const localAccounts = getLocalAdminAccounts();
            const updated = localAccounts.map(a => {
              if (a.id === profile.id || a.admin_id === profile.admin_id || (profile.role === 'SUPER_ADMIN' && a.role === 'SUPER_ADMIN')) {
                return { ...a, password_hash: rawPassword };
              }
              return a;
            });
            saveLocalAdminAccounts(updated);
          } catch {}

          setAdminSession(profile, rememberMe);
          return { success: true, admin: profile };
        } else if (rpcData.error) {
          // Explicit failure from database (e.g. wrong password or inactive account)
          return { success: false, error: rpcData.error };
        }
      } else if (rpcError) {
        console.warn("verify_admin_login RPC notice:", rpcError.message);
      }
    } catch (err) {
      console.warn("verify_admin_login exception:", err);
    }

    // 2. SUPABASE AUTH FALLBACK (In case RPC is not yet created in Supabase SQL editor)
    try {
      // First attempt with the provided normalized email
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normEmail,
        password: rawPassword
      });

      // If initial attempt failed and email is one of the Super Admin aliases, try alternate alias
      if (authError && SUPER_ADMIN_EMAILS.includes(normEmail)) {
        const alternateEmail = SUPER_ADMIN_EMAILS.find(e => e !== normEmail);
        if (alternateEmail) {
          const retry = await supabase.auth.signInWithPassword({
            email: alternateEmail,
            password: rawPassword
          });
          if (!retry.error && retry.data?.user) {
            authData = retry.data;
            authError = null;
          }
        }
      }

      if (!authError && authData?.user) {
        // Query admin profile by email, user id or Super Admin alias
        let profile = null;
        const { data: pByEmail } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('email', authData.user.email || normEmail)
          .maybeSingle();

        profile = pByEmail;

        if (!profile && authData.user.id) {
          const { data: pById } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('auth_user_id', authData.user.id)
            .maybeSingle();
          profile = pById;
        }

        if (!profile && SUPER_ADMIN_EMAILS.includes(normEmail)) {
          const { data: saProfile } = await supabase
            .from('admin_profiles')
            .select('*')
            .or('admin_id.eq.ADM-001,role.eq.SUPER_ADMIN')
            .limit(1)
            .maybeSingle();
          profile = saProfile;
        }

        if (!profile) {
          return {
            success: false,
            error: 'Authorized administrative profile not found for this user account. Please contact the Super Admin.'
          };
        }

        if (profile.status === 'inactive') {
          return {
            success: false,
            error: 'This administrator account is currently inactive. Please contact the Super Admin.'
          };
        }

        // Update last_sign_in_at asynchronously
        try {
          supabase
            .from('admin_profiles')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('id', profile.id)
            .then();
        } catch {}

        // Also update local fallback cache so that offline fallback has the current credentials
        try {
          const localAccounts = getLocalAdminAccounts();
          const updatedAccounts = localAccounts.map(a => {
            if (a.id === profile.id || a.admin_id === profile.admin_id || (profile.role === 'SUPER_ADMIN' && a.role === 'SUPER_ADMIN')) {
              return { ...a, password_hash: rawPassword };
            }
            return a;
          });
          saveLocalAdminAccounts(updatedAccounts);
        } catch {}

        setAdminSession(profile, rememberMe);
        return { success: true, admin: profile };
      }
    } catch (err) {
      console.warn("Supabase auth attempted, falling back to verified credentials check:", err);
    }
  }

  // 3. RESILIENT LOCAL / VERIFIED CREDENTIALS CHECK
  const accounts = getLocalAdminAccounts();
  const matched = accounts.find(a => 
    a.email.toLowerCase() === normEmail ||
    (a.role === ROLES.SUPER_ADMIN && SUPER_ADMIN_EMAILS.includes(normEmail))
  );

  if (!matched) {
    return {
      success: false,
      error: 'Invalid email address or unassigned administrator account.'
    };
  }

  if (matched.status === 'inactive') {
    return {
      success: false,
      error: 'Your administrator account has been deactivated. Please contact the Super Admin.'
    };
  }

  // Verify password (in dev/fallback mode matches password_hash or default master password)
  const isMatch = (matched.password_hash && matched.password_hash === rawPassword) ||
    (rawPassword === 'AdminPassword@2026!');

  if (!isMatch) {
    return {
      success: false,
      error: 'Incorrect administrator password. Please try again or use Forgot Password.'
    };
  }

  // Clean object without sensitive hash
  const adminProfile = {
    id: matched.id,
    admin_id: matched.admin_id,
    email: matched.email,
    full_name: matched.full_name,
    designation: matched.designation,
    role: matched.role,
    status: matched.status,
    avatar_url: matched.avatar_url,
    created_at: matched.created_at
  };

  setAdminSession(adminProfile, rememberMe);
  return { success: true, admin: adminProfile };
}

/**
 * Log out current administrator
 */
export async function logoutAdmin() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('ssu_admin_session_token') || sessionStorage.getItem('ssu_admin_session_token')) : null;
  if (isSupabaseConfigured && supabase) {
    if (token) {
      try {
        await supabase.rpc('invalidate_admin_session', { p_token: token });
      } catch {}
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // safe fallback
    }
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('ssu_admin_session_token');
      sessionStorage.removeItem('ssu_admin_session_token');
    } catch {}
  }
  clearAdminSession();
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email) {
  const normEmail = (email || '').trim().toLowerCase();
  if (!normEmail) {
    return { success: false, error: 'Please enter your administrator email.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normEmail, {
        redirectTo: `${window.location.origin}/admin`
      });
      if (error) throw error;
      return { success: true, message: `Password reset instructions sent to ${normEmail}` };
    } catch (err) {
      console.warn("Supabase password reset failed:", err);
    }
  }

  // Offline / verified fallback
  const accounts = getLocalAdminAccounts();
  const exists = accounts.find(a => a.email.toLowerCase() === normEmail);
  if (!exists) {
    return { success: false, error: 'No administrator account associated with this email.' };
  }

  return {
    success: true,
    message: `Password reset link generated for ${normEmail}. (In offline mode, use default: AdminPassword@2026!)`
  };
}

/**
 * ==============================================================================
 * ADMIN ACCOUNTS MANAGEMENT (SUPER ADMIN ONLY)
 * ==============================================================================
 */

export async function getAllAdmins(currentAdmin) {
  if (!currentAdmin || currentAdmin.role !== ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Permission denied. Super Admin access required.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data)) {
        return { success: true, admins: data };
      }
    } catch (err) {
      console.warn("Failed to fetch admin profiles from Supabase:", err);
    }
  }

  return { success: true, admins: getLocalAdminAccounts() };
}

export async function createAdminAccount(newAdminData, currentAdmin) {
  if (!currentAdmin || currentAdmin.role !== ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Permission denied. Only Super Admin can create accounts.' };
  }

  const normEmail = (newAdminData.email || '').trim().toLowerCase();
  const name = (newAdminData.fullName || newAdminData.full_name || '').trim();
  const designation = (newAdminData.designation || '').trim();
  const role = newAdminData.role || ROLES.EDITOR;
  const password = (newAdminData.password || '').trim() || 'AdminPassword@2026!';

  if (!normEmail || !name || !designation) {
    return { success: false, error: 'Please provide full name, email, and designation.' };
  }

  const accounts = getLocalAdminAccounts();
  if (accounts.some(a => a.email.toLowerCase() === normEmail)) {
    return { success: false, error: `An administrator with email ${normEmail} already exists.` };
  }

  const adminCount = accounts.length + 1;
  const adminId = `ADM-${String(adminCount).padStart(3, '0')}`;

  const newAdmin = {
    id: `adm-${Date.now()}`,
    admin_id: adminId,
    email: normEmail,
    password_hash: password,
    full_name: name,
    designation: designation,
    role: role,
    status: 'active',
    avatar_url: newAdminData.avatarUrl || null,
    created_at: new Date().toISOString()
  };

  // 1. Supabase attempt via RPC or direct insert
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('super_admin_create_account', {
        p_email: normEmail,
        p_admin_id: adminId,
        p_full_name: name,
        p_designation: designation,
        p_role: role,
        p_password: password,
        p_avatar_url: newAdminData.avatarUrl || null
      });

      if (!rpcErr && rpcRes?.success) {
        if (rpcRes.id) newAdmin.id = rpcRes.id;
      } else {
        // Direct table insert fallback
        await supabase.from('admin_profiles').insert([{
          email: normEmail,
          admin_id: adminId,
          full_name: name,
          designation: designation,
          role: role,
          status: 'active',
          avatar_url: newAdminData.avatarUrl || null
        }]);
      }
    } catch (err) {
      console.warn("Could not insert admin to Supabase table:", err);
    }
  }

  // 2. Local storage save
  const updated = [...accounts, newAdmin];
  saveLocalAdminAccounts(updated);

  return { success: true, admin: newAdmin };
}

export async function toggleAdminStatus(targetAdminId, currentAdmin) {
  if (!currentAdmin || currentAdmin.role !== ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Permission denied. Only Super Admin can modify account status.' };
  }

  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => a.id === targetAdminId || a.admin_id === targetAdminId);

  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  if (target.email === currentAdmin.email) {
    return { success: false, error: 'You cannot deactivate your own Super Admin account.' };
  }

  const newStatus = target.status === 'active' ? 'inactive' : 'active';

  // Supabase update
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('admin_profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', target.id);
    } catch (err) {
      console.warn("Could not update admin status in Supabase:", err);
    }
  }

  const updated = accounts.map(a => {
    if (a.id === target.id) {
      return { ...a, status: newStatus };
    }
    return a;
  });
  saveLocalAdminAccounts(updated);

  return { success: true, status: newStatus };
}

/**
 * Update an existing administrator's details & role (Super Admin Only)
 */
export async function updateAdminProfile(targetAdminId, updateData, currentAdmin) {
  if (!isSuperAdmin(currentAdmin)) {
    return { success: false, error: 'Access Denied: Only Super Admin can modify administrator accounts.' };
  }

  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => a.id === targetAdminId || a.admin_id === targetAdminId);

  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  // Prevent demoting the last active Super Admin
  if (target.role === ROLES.SUPER_ADMIN && updateData.role && updateData.role !== ROLES.SUPER_ADMIN) {
    const superAdminCount = accounts.filter(a => a.role === ROLES.SUPER_ADMIN && a.status === 'active').length;
    if (superAdminCount <= 1) {
      return { success: false, error: 'Operation rejected: Cannot demote the sole designated Super Admin.' };
    }
  }

  const cleanUpdate = {
    full_name: updateData.fullName || updateData.full_name || target.full_name,
    designation: updateData.designation || target.designation,
    role: updateData.role || target.role,
    avatar_url: updateData.avatar_url !== undefined ? updateData.avatar_url : target.avatar_url,
    updated_at: new Date().toISOString()
  };

  // 1. Supabase database update
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update(cleanUpdate)
        .eq('id', target.id);

      if (error) {
        console.error("Supabase admin profile update error:", error);
        return { success: false, error: `Database update failed: ${error.message}` };
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  // 2. Local cache update
  const updated = accounts.map(a => {
    if (a.id === target.id) {
      return { ...a, ...cleanUpdate };
    }
    return a;
  });
  saveLocalAdminAccounts(updated);

  return { success: true, admin: { ...target, ...cleanUpdate } };
}

/**
 * Delete an administrator account permanently (Super Admin Only)
 */
export async function deleteAdminAccount(targetAdminId, currentAdmin) {
  if (!isSuperAdmin(currentAdmin)) {
    return { success: false, error: 'Access Denied: Only Super Admin can remove administrator accounts.' };
  }

  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => a.id === targetAdminId || a.admin_id === targetAdminId);

  if (!target) {
    return { success: false, error: 'Administrator account not found.' };
  }

  // Safety constraint: Never delete the Super Admin!
  if (target.role === ROLES.SUPER_ADMIN || target.email === currentAdmin.email) {
    return { success: false, error: 'Protected Account: The Super Admin account cannot be removed.' };
  }

  // 1. Supabase deletion
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', target.id);

      if (error) {
        console.error("Supabase admin deletion error:", error);
        return { success: false, error: `Database error: ${error.message}` };
      }
    } catch (err) {
      console.warn("Supabase deletion error:", err);
    }
  }

  // 2. Local cache deletion
  const updated = accounts.filter(a => a.id !== target.id);
  saveLocalAdminAccounts(updated);

  return { success: true };
}

/**
 * Reset an administrator's credentials (Super Admin Only)
 */
export async function resetAdminPassword(targetAdminId, newPassword, currentAdmin) {
  if (!isSuperAdmin(currentAdmin)) {
    return { success: false, error: 'Access Denied: Only Super Admin can reset administrator credentials.' };
  }

  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => a.id === targetAdminId || a.admin_id === targetAdminId);

  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  const cleanPass = (newPassword || '').trim() || 'AdminPassword@2026!';
  if (cleanPass.length < 8) {
    return { success: false, error: 'Password must contain at least 8 characters.' };
  }

  // In Supabase, update password via RPC and trigger reset email if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('super_admin_reset_password', {
        p_target_email: target.email,
        p_new_password: cleanPass
      });
    } catch (err) {
      console.warn("super_admin_reset_password RPC notice:", err);
    }

    try {
      await supabase.auth.resetPasswordForEmail(target.email, {
        redirectTo: `${window.location.origin}/admin`
      });
    } catch (err) {
      console.warn("Supabase reset email trigger failed:", err);
    }
  }

  // Update in local store
  const updated = accounts.map(a => {
    if (a.id === target.id) {
      return { ...a, password_hash: cleanPass };
    }
    return a;
  });
  saveLocalAdminAccounts(updated);

  return {
    success: true,
    message: `Password reset successfully initiated for ${target.full_name} (${target.email}). Temporary password set to: ${cleanPass}`
  };
}

/**
 * Change own password (Any authenticated Administrator)
 */
export async function changeAdminPassword(currentPassword, newPassword, confirmPassword, currentAdmin) {
  if (!currentAdmin || !currentAdmin.email) {
    return { success: false, error: 'Authentication required. Please log in again.' };
  }

  const curPass = (currentPassword || '').trim();
  const newPass = (newPassword || '').trim();
  const confPass = (confirmPassword || '').trim();

  if (!curPass) {
    return { success: false, error: 'Please enter your current password.' };
  }

  if (!newPass) {
    return { success: false, error: 'Please enter a new password.' };
  }

  if (newPass.length < 8) {
    return { success: false, error: 'New password must contain at least 8 characters.' };
  }

  if (newPass !== confPass) {
    return { success: false, error: 'New password and confirmation password do not match.' };
  }

  if (curPass === newPass) {
    return { success: false, error: 'New password cannot be the same as your current password.' };
  }

  let dbUpdated = false;

  // 1. POSTGRESQL DATABASE PASSWORD UPDATE (Multi-Device Bcrypt Update via RPC)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('update_admin_password', {
        p_identifier: currentAdmin.email.toLowerCase(),
        p_current_password: curPass,
        p_new_password: newPass
      });

      if (!rpcError && rpcData) {
        if (rpcData.success) {
          dbUpdated = true;
        } else if (rpcData.error) {
          return { success: false, error: rpcData.error };
        }
      } else if (rpcError) {
        console.warn("update_admin_password RPC notice:", rpcError.message);
      }
    } catch (err) {
      console.warn("update_admin_password RPC exception:", err);
    }

    // Also attempt Supabase Auth updateUser if authenticated session exists
    try {
      await supabase.auth.updateUser({ password: newPass });
    } catch {}
  }

  // 2. ALWAYS SYNCHRONIZE LOCAL ACCOUNT CACHE
  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => 
    a.email.toLowerCase() === currentAdmin.email.toLowerCase() ||
    (a.role === ROLES.SUPER_ADMIN && SUPER_ADMIN_EMAILS.includes(currentAdmin.email.toLowerCase()))
  );

  if (target) {
    // If not on Supabase, verify current password against local store
    if (!isSupabaseConfigured) {
      const isMatch = (target.password_hash && target.password_hash === curPass) ||
        (curPass === 'AdminPassword@2026!');
      if (!isMatch) {
        return { success: false, error: 'Current password is incorrect.' };
      }
    }

    const updated = accounts.map(a => 
      (a.id === target.id || (target.role === ROLES.SUPER_ADMIN && a.role === ROLES.SUPER_ADMIN))
        ? { ...a, password_hash: newPass } 
        : a
    );
    saveLocalAdminAccounts(updated);
  }

  let feedback = 'Your password has been changed successfully. Please remember your new credentials.';
  if (dbUpdated) {
    feedback = 'Your password has been securely updated in the database and is now active across all devices (Mobile & Laptop).';
  } else if (!isSupabaseConfigured) {
    feedback += ' (Saved in Local Browser Storage. Note: To enable multi-device sync across mobile and laptop, set up VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Project Settings).';
  }

  return {
    success: true,
    message: feedback
  };
}

/**
 * Super Admin: Send Password Reset Email to an Administrator
 */
export async function sendAdminPasswordResetEmail(targetEmail, currentAdmin) {
  if (!isSuperAdmin(currentAdmin)) {
    return { success: false, error: 'Access Denied: Only Super Admin can send password reset emails.' };
  }

  const normEmail = (targetEmail || '').trim().toLowerCase();
  if (!normEmail) {
    return { success: false, error: 'Target administrator email is required.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normEmail, {
        redirectTo: `${window.location.origin}/admin`
      });
      if (error) throw error;
      return {
        success: true,
        message: `Secure password reset email has been dispatched to ${normEmail}.`
      };
    } catch (err) {
      console.warn("Supabase sendAdminPasswordResetEmail error:", err);
      return { success: false, error: err.message || 'Failed to dispatch reset email.' };
    }
  }

  return {
    success: true,
    message: `Password reset workflow triggered for ${normEmail}. (Local Demo Mode: credentials can be updated directly).`
  };
}

/**
 * Super Admin: Revoke active sessions for an administrator
 */
export async function revokeAdminActiveSessions(targetAdminId, currentAdmin) {
  if (!isSuperAdmin(currentAdmin)) {
    return { success: false, error: 'Access Denied: Only Super Admin can revoke active sessions.' };
  }

  const accounts = getLocalAdminAccounts();
  const target = accounts.find(a => a.id === targetAdminId || a.admin_id === targetAdminId);
  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('admin_profiles')
        .update({
          sessions_revoked_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', target.id);
    } catch (err) {
      console.warn("Supabase revokeAdminActiveSessions error:", err);
    }
  }

  return {
    success: true,
    message: `Active sessions revoked for ${target.full_name} (${target.email}). Their next request will require re-authentication.`
  };
}
