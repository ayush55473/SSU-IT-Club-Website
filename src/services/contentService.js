import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentAdmin, ROLES } from './adminAuthService';
import { MEMBERS } from '../data/members';

const CMS_STORAGE_PREFIX = 'ssu_it_club_cms_';
const CMS_UPDATE_EVENT = 'ssu_it_club_cms_updated';

// Helper to broadcast CMS updates across tabs and views
export function broadcastCmsUpdate(section, data = null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: { section, data, timestamp: Date.now() } }));
}

export function subscribeToCmsUpdates(callback) {
  if (typeof window === 'undefined') return () => {};
  const unsubscribers = [];

  // A. Supabase Realtime Channel (Cross-device, live DB synchrony)
  if (isSupabaseConfigured && supabase) {
    try {
      const channel = supabase
        .channel('realtime_cms_all')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'core_members' },
          (payload) => {
            if (typeof callback === 'function') {
              callback({ section: 'core_members', payload, fromRealtime: true });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'announcements' },
          (payload) => {
            if (typeof callback === 'function') {
              callback({ section: 'announcements', payload, fromRealtime: true });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            if (typeof callback === 'function') {
              callback({ section: 'events', payload, fromRealtime: true });
            }
          }
        )
        .subscribe();

      unsubscribers.push(() => supabase.removeChannel(channel));
    } catch (err) {
      console.warn("Supabase Realtime CMS subscription error:", err);
    }
  }

  // B. Window Custom Event for same-tab instant UI reactions
  const handleCustomEvent = (e) => {
    if (typeof callback === 'function') callback(e.detail);
  };
  window.addEventListener(CMS_UPDATE_EVENT, handleCustomEvent);
  unsubscribers.push(() => window.removeEventListener(CMS_UPDATE_EVENT, handleCustomEvent));

  // C. Storage Event for cross-tab synchrony within the same browser
  const handleStorageEvent = (e) => {
    if (e.key && e.key.startsWith(CMS_STORAGE_PREFIX)) {
      const section = e.key.replace(CMS_STORAGE_PREFIX, '');
      if (typeof callback === 'function') {
        callback({ section, fromStorage: true });
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);
  unsubscribers.push(() => window.removeEventListener('storage', handleStorageEvent));

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}

// Local cache storage helper
function getLocalCache(key, defaultVal) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(`${CMS_STORAGE_PREFIX}${key}`);
    if (!raw) {
      localStorage.setItem(`${CMS_STORAGE_PREFIX}${key}`, JSON.stringify(defaultVal));
      return defaultVal;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : defaultVal;
  } catch {
    return defaultVal;
  }
}

function saveLocalCache(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${CMS_STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save local cache for ${key}:`, err);
  }
}

/**
 * ==============================================================================
 * MEDIA / IMAGE UPLOAD HELPER (Supabase Storage with optimization & cache-busting)
 * ==============================================================================
 */

/**
 * Client-side image compressor & optimizer
 * Downsamples high-resolution photos to max 1200px and 85% quality JPEG.
 * Reduces 5-10MB mobile uploads to clean, crisp ~150-250KB images.
 */
async function optimizeImage(file, maxWidth = 1200, quality = 0.85) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Safely removes an old photograph from Supabase Storage when replaced
 */
export async function cleanupOldStoragePhoto(photoUrl, bucket = 'core-members') {
  if (!isSupabaseConfigured || !supabase || !photoUrl || typeof photoUrl !== 'string') return;
  if (!photoUrl.includes(`/storage/v1/object/public/${bucket}/`)) return;

  try {
    const parts = photoUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length > 1) {
      const rawPath = parts[1].split('?')[0];
      if (rawPath) {
        await supabase.storage.from(bucket).remove([rawPath]);
      }
    }
  } catch (err) {
    console.warn("Storage cleanup warning (ignored):", err);
  }
}

export async function uploadMedia(file, bucket = 'core-members', identifier = null) {
  if (!file) return { success: false, error: 'No file provided.' };

  if (!file.type || !file.type.startsWith('image/')) {
    return { success: false, error: 'Only image files are permitted (JPEG, PNG, WebP, etc.).' };
  }

  // 1. Optimize image client-side to ensure fast uploads and prevent storage bloat
  const processedFile = await optimizeImage(file);

  // 2. Supabase Storage Upload
  if (isSupabaseConfigured && supabase) {
    try {
      const safeId = identifier ? String(identifier).replace(/[^a-zA-Z0-9_-]/g, '_') : 'photo';
      const fileExt = processedFile.name.split('.').pop() || 'jpg';
      const fileName = `${safeId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Ensure target bucket exists
      try {
        await supabase.storage.createBucket(bucket, { public: true });
      } catch {
        // Bucket may already exist
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: processedFile.type || 'image/jpeg'
        });

      if (error) {
        console.warn(`Supabase Storage upload to bucket "${bucket}" reported:`, error);

        // If bucket was not found, attempt creation and retry once
        if (error.statusCode === '404' || error.message?.toLowerCase().includes('not found')) {
          try {
            await supabase.storage.createBucket(bucket, { public: true });
            const retry = await supabase.storage
              .from(bucket)
              .upload(filePath, processedFile, {
                cacheControl: '3600',
                upsert: true,
                contentType: processedFile.type || 'image/jpeg'
              });

            if (retry.data?.path && !retry.error) {
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(retry.data.path);
              if (urlData?.publicUrl) {
                const versionedUrl = `${urlData.publicUrl}?v=${Date.now()}`;
                return { success: true, url: versionedUrl };
              }
            }
          } catch (retryErr) {
            console.error("Bucket creation retry failed:", retryErr);
          }
        }

        return { success: false, error: error.message || 'Supabase storage rejected upload.' };
      }

      if (data?.path) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        if (urlData?.publicUrl) {
          // Versioned image URL with cache-busting timestamp
          const versionedUrl = `${urlData.publicUrl}?v=${Date.now()}`;
          return { success: true, url: versionedUrl };
        }
      }

      return { success: false, error: 'Could not obtain public URL for uploaded photo.' };
    } catch (err) {
      console.error(`Supabase Storage upload exception:`, err);
      return { success: false, error: err.message || 'Storage upload error' };
    }
  }

  // 3. Fallback for local demo/offline development: compressed DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ success: true, url: reader.result });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file locally.' });
    };
    reader.readAsDataURL(processedFile);
  });
}

/**
 * ==============================================================================
 * 1. SITE CONTENT (Homepage, About Us, Footer, Settings)
 * ==============================================================================
 */
const DEFAULT_SITE_CONTENT = {
  homepage: {
    heroBadge: "OFFICIAL STUDENT TECHNOLOGY ORGANISATION",
    heroHeadline: "Innovate. Collaborate. Lead.",
    heroSubheadline: "The student-led technical hub empowering curious minds, builders, and future engineers across Sri Sri University.",
    primaryCtaLabel: "Explore Upcoming Events",
    primaryCtaTarget: "#events",
    secondaryCtaLabel: "Join the Community",
    secondaryCtaTarget: "#team"
  },
  about: {
    title: "About Sri Sri University IT Club",
    description: "Sri Sri University IT Club is a vibrant, student-driven technology community dedicated to fostering innovation, practical computing competence, and peer-to-peer mentorship across all university disciplines.",
    mission: "To provide students with accessible platforms, mentorship, hands-on workshops, and collaborative project spaces that bridge academic theory with industry technologies.",
    vision: "To establish Sri Sri University as an energetic center for student technological excellence, innovative software creation, and ethical digital leadership."
  },
  footer: {
    officialEmail: "itclub@srisriuniversity.edu.in",
    alternateEmail: "contact.itclub@srisriuniversity.edu.in",
    phone: "+91 (555) 123-4567",
    location: "Faculty of Engineering & Technology, Sri Sri University, Cuttack, Odisha",
    description: "The official student technology club of Sri Sri University, fostering innovation, coding proficiency, and collaborative development.",
    instagram: "https://instagram.com/ssu_it_club",
    linkedin: "https://linkedin.com/company/ssu-it-club",
    github: "https://github.com/ssu-it-club",
    youtube: "https://youtube.com/@ssuitclub"
  }
};

export async function getSiteContent(key) {
  const fallback = DEFAULT_SITE_CONTENT[key] || {};

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', key)
        .single();

      if (!error && data?.data) {
        saveLocalCache(`content_${key}`, data.data);
        return { ...fallback, ...data.data };
      }
    } catch (err) {
      console.warn(`Supabase getSiteContent for ${key} failed, using local cache:`, err);
    }
  }

  return getLocalCache(`content_${key}`, fallback);
}

export async function updateSiteContent(key, newData, admin = null) {
  const current = await getSiteContent(key);
  const updated = { ...current, ...newData };
  const currentAdmin = admin || getCurrentAdmin();

  // Save version snapshot before update
  await saveContentVersion(`content_${key}`, current, currentAdmin);

  // 1. Supabase update
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_content').upsert({
        key: key,
        data: updated,
        updated_at: new Date().toISOString(),
        updated_by: currentAdmin?.admin_id || 'ADMIN'
      });
    } catch (err) {
      console.warn(`Supabase upsert for ${key} failed:`, err);
    }
  }

  // 2. Local cache
  saveLocalCache(`content_${key}`, updated);

  // 3. Record Activity Log
  await recordActivityLog({
    action_type: 'UPDATE',
    section_modified: `Website Management • ${key.toUpperCase()}`,
    description: `Updated content for section "${key}"`,
    previous_value: JSON.stringify(current).slice(0, 150),
    new_value: JSON.stringify(updated).slice(0, 150),
    admin: currentAdmin
  });

  broadcastCmsUpdate(key, updated);
  return { success: true, data: updated };
}

/**
 * ==============================================================================
 * 2. OUR JOURNEY MILESTONES
 * ==============================================================================
 */
const DEFAULT_MILESTONES = [
  {
    id: "ms-01",
    step: "01",
    phase: "PHASE 01 • WELCOME & FOUNDATIONS",
    title: "Curiosity Meets Computing",
    subtitle: "Open to all university disciplines",
    description: "Every technologist starts with a spark of curiosity. We welcome students from computing, engineering, management, and arts to explore foundational coding, digital creative tools, and peer-guided discovery without prerequisites.",
    highlights: ["Beginner-Friendly", "Peer Mentorship", "Open To All Faculties"],
    action_label: "Explore Community",
    action_target: "#about",
    image_url: null,
    display_order: 1,
    is_active: true
  },
  {
    id: "ms-02",
    step: "02",
    phase: "PHASE 02 • SKILL-BUILDING",
    title: "Hands-On Coding & Dev Labs",
    subtitle: "Practical technical workshops",
    description: "Moving from theory into production code. Regular student-led workshops and hands-on coding labs cover full-stack web development, Git collaboration, cloud computing fundamentals, and practical software engineering sprints.",
    highlights: ["Interactive Labs", "Modern Frameworks", "Pair Programming"],
    action_label: "View Workshops",
    action_target: "#events",
    image_url: null,
    display_order: 2,
    is_active: true
  },
  {
    id: "ms-03",
    step: "03",
    phase: "PHASE 03 • STUDENT PROJECTS",
    title: "From Idea to Deployed Software",
    subtitle: "Campus innovation and team hackathons",
    description: "Students form interdisciplinary teams to build real-world software, web applications, and campus digital tools solving university challenges. We encourage experimentation, portfolio building, and public demos.",
    highlights: ["Real World Projects", "Interdisciplinary Teams", "Portfolio Building"],
    action_label: "Propose a Project",
    action_target: "#proposals",
    image_url: null,
    display_order: 3,
    is_active: true
  },
  {
    id: "ms-04",
    step: "04",
    phase: "PHASE 04 • LEADERSHIP & CAREERS",
    title: "Mentorship, Contests & Beyond",
    subtitle: "Annual showcases and industry readiness",
    description: "Advanced members represent Sri Sri University in regional hackathons, tech quizzes, and national competitions. Senior members mentor incoming batches, coordinate club initiatives, and prepare for high-impact tech careers.",
    highlights: ["Hackathons", "Mentorship Leadership", "Career Readiness"],
    action_label: "Join Our Team",
    action_target: "#team",
    image_url: null,
    display_order: 4,
    is_active: true
  }
];

export async function getJourneyMilestones(activeOnly = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('journey_milestones').select('*').order('display_order', { ascending: true });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        saveLocalCache('journey_milestones', data);
        return data;
      }
    } catch (err) {
      console.warn("Supabase journey_milestones fetch failed, using local cache:", err);
    }
  }

  const cached = getLocalCache('journey_milestones', DEFAULT_MILESTONES);
  return activeOnly ? cached.filter(m => m.is_active !== false) : cached;
}

export async function saveJourneyMilestone(milestone, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('journey_milestones', DEFAULT_MILESTONES);
  let updatedList;
  const isEdit = Boolean(milestone.id && all.some(m => m.id === milestone.id));

  if (isEdit) {
    updatedList = all.map(m => m.id === milestone.id ? { ...m, ...milestone, updated_at: new Date().toISOString() } : m);
  } else {
    const newRecord = {
      ...milestone,
      id: milestone.id || `ms-${Date.now()}`,
      display_order: milestone.display_order || all.length + 1,
      is_active: milestone.is_active !== false,
      created_at: new Date().toISOString()
    };
    updatedList = [...all, newRecord];
  }

  // Supabase save
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('journey_milestones').upsert(isEdit ? milestone : {
        ...milestone,
        id: milestone.id || undefined
      });
    } catch (err) {
      console.warn("Supabase journey_milestones upsert failed:", err);
    }
  }

  saveLocalCache('journey_milestones', updatedList);
  await recordActivityLog({
    action_type: isEdit ? 'UPDATE' : 'CREATE',
    section_modified: 'Club Journey',
    description: `${isEdit ? 'Updated' : 'Added new'} milestone: "${milestone.title}"`,
    new_value: milestone.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('journey');
  return { success: true };
}

export async function deleteJourneyMilestone(id, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('journey_milestones', DEFAULT_MILESTONES);
  const target = all.find(m => m.id === id);
  const updatedList = all.filter(m => m.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('journey_milestones').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase delete milestone failed:", err);
    }
  }

  saveLocalCache('journey_milestones', updatedList);
  await recordActivityLog({
    action_type: 'DELETE',
    section_modified: 'Club Journey',
    description: `Deleted milestone: "${target?.title || id}"`,
    previous_value: target?.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('journey');
  return { success: true };
}

/**
 * ==============================================================================
 * 3. CORE MEMBERS MANAGEMENT
 * ==============================================================================
 */
export const DEFAULT_CORE_MEMBERS = (Array.isArray(MEMBERS) ? MEMBERS : []).map((m, idx) => ({
  id: m.id || `member-${idx + 1}`,
  name: m.name,
  role: m.role,
  department: m.department || '',
  branch: m.branch || null,
  year_of_study: m.yearOfStudy || m.year_of_study || '2nd Year',
  bio: m.bio || '',
  responsibilities: Array.isArray(m.responsibilities) ? m.responsibilities : [],
  image: null,
  image_url: null, // Managed strictly dynamically via database
  email: m.email || null,
  phone: null,
  linkedin: m.linkedin || m.linkedin_url || null,
  linkedin_url: m.linkedin_url || m.linkedin || null,
  github: m.github || null,
  twitter: null,
  instagram: null,
  display_order: idx + 1,
  is_active: true
}));

export async function getCoreMembers(activeOnly = true) {
  let dbMembers = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('core_members').select('*').order('display_order', { ascending: true });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        dbMembers = data;
      }
    } catch (err) {
      console.warn("Supabase core_members fetch failed:", err);
    }
  }

  // Pure dynamic resolution: uploaded photo exclusively from image_url column
  if (dbMembers.length > 0) {
    const merged = dbMembers.map(dbM => {
      const defaultMatch = DEFAULT_CORE_MEMBERS.find(d => 
        (d.id && String(d.id) === String(dbM.id)) || 
        (d.name && d.name.trim().toLowerCase() === dbM.name.trim().toLowerCase())
      );
      return {
        ...defaultMatch,
        ...dbM,
        branch: dbM.branch || defaultMatch?.branch || null,
        linkedin_url: dbM.linkedin_url || dbM.linkedin || defaultMatch?.linkedin_url || null,
        linkedin: dbM.linkedin || dbM.linkedin_url || defaultMatch?.linkedin || null,
        image_url: dbM.image_url || null,
        image: null // Completely eliminate old hardcoded asset fallbacks
      };
    });
    saveLocalCache('core_members', merged);
    return activeOnly ? merged.filter(m => m.is_active !== false) : merged;
  }

  const cached = getLocalCache('core_members', DEFAULT_CORE_MEMBERS);
  return activeOnly ? cached.filter(m => m.is_active !== false) : cached;
}

export async function saveCoreMember(member, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  if (!member || !member.name || !member.name.trim()) {
    return { success: false, error: 'Member full name is mandatory.' };
  }

  const all = getLocalCache('core_members', DEFAULT_CORE_MEMBERS);

  // Sanitize payload: ONLY include valid database columns (prevents Supabase unknown-column rejections)
  const cleanPayload = {
    name: member.name.trim(),
    role: member.role ? member.role.trim() : 'Core Member',
    department: member.department ? member.department.trim() : '',
    branch: member.branch ? member.branch.trim() : null,
    year_of_study: member.year_of_study || member.yearOfStudy || '',
    bio: member.bio ? member.bio.trim() : '',
    responsibilities: Array.isArray(member.responsibilities) ? member.responsibilities : [],
    image_url: member.image_url || null,
    email: member.email ? member.email.trim() : null,
    phone: member.phone ? member.phone.trim() : null,
    linkedin: member.linkedin ? member.linkedin.trim() : (member.linkedin_url ? member.linkedin_url.trim() : null),
    linkedin_url: member.linkedin_url ? member.linkedin_url.trim() : (member.linkedin ? member.linkedin.trim() : null),
    github: member.github ? member.github.trim() : null,
    twitter: member.twitter ? member.twitter.trim() : null,
    instagram: member.instagram ? member.instagram.trim() : null,
    display_order: Number(member.display_order) || 1,
    is_active: member.is_active !== false,
    updated_at: new Date().toISOString()
  };

  let isEdit = false;
  let savedId = member.id;
  let previousImageUrl = null;

  // 1. Supabase Database Operation
  if (isSupabaseConfigured && supabase) {
    try {
      // Find existing record by ID or Name
      let existingRecord = null;
      if (member.id) {
        const { data: byId } = await supabase
          .from('core_members')
          .select('id, image_url')
          .eq('id', member.id)
          .maybeSingle();
        existingRecord = byId;
      }
      if (!existingRecord && member.name) {
        const { data: byName } = await supabase
          .from('core_members')
          .select('id, image_url')
          .ilike('name', member.name.trim())
          .maybeSingle();
        existingRecord = byName;
      }

      if (existingRecord) {
        isEdit = true;
        savedId = existingRecord.id;
        previousImageUrl = existingRecord.image_url;

        const { error: updateError } = await supabase
          .from('core_members')
          .update(cleanPayload)
          .eq('id', existingRecord.id);

        if (updateError) {
          console.error("Supabase update core_members error:", updateError);
          return { success: false, error: `Database update failed: ${updateError.message}` };
        }
      } else {
        // Insert new record
        const insertPayload = {
          ...cleanPayload,
          ...(member.id ? { id: member.id } : {})
        };

        const { data: inserted, error: insertError } = await supabase
          .from('core_members')
          .insert([insertPayload])
          .select()
          .single();

        if (insertError) {
          // If insert failed due to UUID type constraint, retry without passing string id
          if (insertError.code === '22P02' || insertError.message?.toLowerCase().includes('uuid')) {
            const { data: retryData, error: retryError } = await supabase
              .from('core_members')
              .insert([cleanPayload])
              .select()
              .single();

            if (retryError) {
              console.error("Supabase insert retry error:", retryError);
              return { success: false, error: `Database insert failed: ${retryError.message}` };
            }
            if (retryData) savedId = retryData.id;
          } else {
            console.error("Supabase insert error:", insertError);
            return { success: false, error: `Database insert failed: ${insertError.message}` };
          }
        } else if (inserted) {
          savedId = inserted.id;
        }
      }

      // Clean up orphaned previous photo in Supabase Storage if replaced
      if (previousImageUrl && previousImageUrl !== cleanPayload.image_url) {
        cleanupOldStoragePhoto(previousImageUrl);
      }
    } catch (err) {
      console.error("Supabase saveCoreMember exception:", err);
      return { success: false, error: err.message || 'Database connection error' };
    }
  }

  // 2. Update Local Cache
  const finalMemberObj = {
    ...cleanPayload,
    id: savedId || member.id || `cm-${Date.now()}`,
    image: null
  };

  const existingIdx = all.findIndex(m => 
    (m.id && String(m.id) === String(finalMemberObj.id)) ||
    (m.name && m.name.trim().toLowerCase() === finalMemberObj.name.toLowerCase())
  );

  let updatedList;
  if (existingIdx >= 0) {
    isEdit = true;
    updatedList = [...all];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...finalMemberObj };
  } else {
    updatedList = [...all, finalMemberObj];
  }

  saveLocalCache('core_members', updatedList);

  // 3. Record Activity Log ONLY when operation actually succeeded!
  await recordActivityLog({
    action_type: isEdit ? 'UPDATE' : 'CREATE',
    section_modified: 'Core Members',
    description: `${isEdit ? 'Updated' : 'Added'} Core Member: "${cleanPayload.name}" (${cleanPayload.role})${cleanPayload.image_url ? ' with profile photograph' : ''}`,
    new_value: cleanPayload.name,
    admin: currentAdmin
  });

  // 4. Broadcast update to all active components, tabs, and subscribers
  broadcastCmsUpdate('core_members', updatedList);

  return { success: true, member: finalMemberObj };
}

export async function deleteCoreMember(id, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('core_members', DEFAULT_CORE_MEMBERS);
  const target = all.find(m => String(m.id) === String(id));
  const updatedList = all.filter(m => String(m.id) !== String(id));

  if (target?.image_url) {
    cleanupOldStoragePhoto(target.image_url);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('core_members').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase delete core_member failed:", err);
    }
  }

  saveLocalCache('core_members', updatedList);
  await recordActivityLog({
    action_type: 'DELETE',
    section_modified: 'Core Members',
    description: `Removed Core Member: "${target?.name || id}"`,
    previous_value: target?.name,
    admin: currentAdmin
  });

  broadcastCmsUpdate('core_members', updatedList);
  return { success: true };
}

/**
 * ==============================================================================
 * 4. ANNOUNCEMENTS (With Initial "Coming Soon" Requirement)
 * ==============================================================================
 * INITIAL REQUIREMENT:
 * In the initial deployment, no announcements are published by default.
 * Therefore, getAnnouncements({ publishedOnly: true }) returns empty array,
 * which displays the requested animated "EXCITING ANNOUNCEMENTS COMING SOON!" section.
 * Once an administrator publishes an announcement, it dynamically displays.
 */
const DEFAULT_ANNOUNCEMENTS = []; // Intentionally empty initially as specified!

export async function getAnnouncements({ publishedOnly = false } = {}) {
  let list = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('announcements').select('*').order('publish_date', { ascending: false });
      if (publishedOnly) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
        saveLocalCache('announcements', list);
      }
    } catch (err) {
      console.warn("Supabase announcements fetch failed, checking local cache:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache('announcements', DEFAULT_ANNOUNCEMENTS);
  }

  if (publishedOnly) {
    const now = new Date().getTime();
    return list.filter(item => {
      if (item.status !== 'published') return false;
      if (item.expiry_date && new Date(item.expiry_date).getTime() < now) return false;
      return true;
    });
  }

  return list;
}

export async function saveAnnouncement(announcement, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  if (!announcement || !announcement.title || !announcement.title.trim()) {
    return { success: false, error: 'Announcement title is mandatory.' };
  }

  const cleanPayload = {
    title: announcement.title.trim(),
    category: announcement.category || 'General',
    short_message: (announcement.short_message || announcement.description || '').trim(),
    full_content: (announcement.full_content || announcement.description || announcement.short_message || '').trim(),
    banner_url: announcement.banner_url || null,
    icon: announcement.icon || null,
    author: announcement.author || currentAdmin?.full_name || 'IT Club Core Committee',
    publish_date: announcement.publish_date || new Date().toISOString(),
    expiry_date: announcement.expiry_date || null,
    action_link: announcement.action_link || null,
    action_text: announcement.action_text || null,
    pinned: Boolean(announcement.pinned),
    status: announcement.status || 'draft',
    display_order: Number(announcement.display_order) || 0,
    updated_at: new Date().toISOString()
  };

  const all = getLocalCache('announcements', DEFAULT_ANNOUNCEMENTS);
  const isEdit = Boolean(announcement.id && all.some(a => a.id === announcement.id));
  let savedId = announcement.id;

  if (isSupabaseConfigured && supabase) {
    try {
      if (isEdit && announcement.id) {
        const { error } = await supabase
          .from('announcements')
          .update(cleanPayload)
          .eq('id', announcement.id);
        if (error) {
          console.error("Supabase announcement update error:", error);
          return { success: false, error: error.message };
        }
      } else {
        const insertPayload = {
          ...cleanPayload,
          ...(announcement.id ? { id: announcement.id } : {})
        };
        const { data, error } = await supabase
          .from('announcements')
          .insert([insertPayload])
          .select()
          .single();

        if (error) {
          const { data: retryData, error: retryError } = await supabase
            .from('announcements')
            .insert([cleanPayload])
            .select()
            .single();
          if (retryError) {
            console.error("Supabase announcement insert error:", retryError);
            return { success: false, error: retryError.message };
          }
          if (retryData) savedId = retryData.id;
        } else if (data) {
          savedId = data.id;
        }
      }
    } catch (err) {
      console.warn("Supabase announcements upsert exception:", err);
      return { success: false, error: err.message };
    }
  }

  const finalRecord = {
    ...cleanPayload,
    id: savedId || announcement.id || `ann-${Date.now()}`
  };

  let updatedList;
  if (isEdit) {
    updatedList = all.map(a => a.id === finalRecord.id ? finalRecord : a);
  } else {
    updatedList = [finalRecord, ...all];
  }

  saveLocalCache('announcements', updatedList);
  await recordActivityLog({
    action_type: cleanPayload.status === 'published' ? 'PUBLISH' : (isEdit ? 'UPDATE' : 'CREATE'),
    section_modified: 'Announcements',
    description: `${isEdit ? 'Updated' : 'Created'} announcement: "${cleanPayload.title}" (${cleanPayload.status})`,
    new_value: cleanPayload.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('announcements', updatedList);
  return { success: true, announcement: finalRecord };
}

export async function deleteAnnouncement(id, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('announcements', DEFAULT_ANNOUNCEMENTS);
  const target = all.find(a => a.id === id);
  const updatedList = all.filter(a => a.id !== id);

  if (target?.banner_url) {
    cleanupOldStoragePhoto(target.banner_url, 'announcements');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('announcements').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase delete announcement failed:", err);
    }
  }

  saveLocalCache('announcements', updatedList);
  await recordActivityLog({
    action_type: 'DELETE',
    section_modified: 'Announcements',
    description: `Deleted announcement: "${target?.title || id}"`,
    previous_value: target?.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('announcements', updatedList);
  return { success: true };
}

/**
 * ==============================================================================
 * 5. EVENTS & EVENT REGISTRATIONS (With Initial "Coming Soon" Requirement)
 * ==============================================================================
 * INITIAL REQUIREMENT:
 * In initial deployment, no events are published by default.
 * Therefore, getEvents({ publishedOnly: true }) returns empty array,
 * which displays the requested animated "EXCITING EVENTS COMING SOON!" section.
 * When an admin creates & publishes an event, it automatically becomes active.
 */
const DEFAULT_EVENTS = []; // Intentionally empty initially as requested!

export async function getEvents({ publishedOnly = false } = {}) {
  let list = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('events').select('*').order('event_date', { ascending: true });
      if (publishedOnly) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
        saveLocalCache('events', list);
      }
    } catch (err) {
      console.warn("Supabase events fetch failed:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache('events', DEFAULT_EVENTS);
  }

  if (publishedOnly) {
    return list.filter(e => e.status === 'published');
  }

  return list;
}

export async function saveEvent(event, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  if (!event || !event.title || !event.title.trim()) {
    return { success: false, error: 'Event title is mandatory.' };
  }

  const cleanPayload = {
    title: event.title.trim(),
    category: event.category || 'Workshop',
    description: (event.description || '').trim(),
    short_description: (event.short_description || event.description || '').trim().slice(0, 200),
    poster_url: event.poster_url || event.image || null,
    banner_url: event.banner_url || null,
    icon: event.icon || null,
    gallery_urls: Array.isArray(event.gallery_urls) ? event.gallery_urls : [],
    event_date: event.event_date || event.date || new Date().toISOString(),
    event_time: event.event_time || event.time || '10:00 AM',
    venue: event.venue || 'SSU Campus',
    organizer: event.organizer || 'SSU IT Club',
    registration_deadline: event.registration_deadline || null,
    registration_enabled: Boolean(event.registration_enabled),
    registration_link: event.registration_link || null,
    status: event.status || 'draft',
    event_phase: event.event_phase || 'upcoming',
    max_participants: event.max_participants ? Number(event.max_participants) : null,
    display_order: Number(event.display_order) || 0,
    updated_at: new Date().toISOString()
  };

  const all = getLocalCache('events', DEFAULT_EVENTS);
  const isEdit = Boolean(event.id && all.some(e => e.id === event.id));
  let savedId = event.id;

  if (isSupabaseConfigured && supabase) {
    try {
      if (isEdit && event.id) {
        const { error } = await supabase
          .from('events')
          .update(cleanPayload)
          .eq('id', event.id);
        if (error) {
          console.error("Supabase event update error:", error);
          return { success: false, error: error.message };
        }
      } else {
        const insertPayload = {
          ...cleanPayload,
          ...(event.id ? { id: event.id } : {})
        };
        const { data, error } = await supabase
          .from('events')
          .insert([insertPayload])
          .select()
          .single();

        if (error) {
          const { data: retryData, error: retryError } = await supabase
            .from('events')
            .insert([cleanPayload])
            .select()
            .single();
          if (retryError) {
            console.error("Supabase event insert error:", retryError);
            return { success: false, error: retryError.message };
          }
          if (retryData) savedId = retryData.id;
        } else if (data) {
          savedId = data.id;
        }
      }
    } catch (err) {
      console.warn("Supabase events upsert exception:", err);
      return { success: false, error: err.message };
    }
  }

  const finalRecord = {
    ...cleanPayload,
    id: savedId || event.id || `evt-${Date.now()}`,
    image: cleanPayload.poster_url || cleanPayload.banner_url || event.image || null
  };

  let updatedList;
  if (isEdit) {
    updatedList = all.map(e => e.id === finalRecord.id ? finalRecord : e);
  } else {
    updatedList = [finalRecord, ...all];
  }

  saveLocalCache('events', updatedList);
  await recordActivityLog({
    action_type: cleanPayload.status === 'published' ? 'PUBLISH' : (isEdit ? 'UPDATE' : 'CREATE'),
    section_modified: 'Events Management',
    description: `${isEdit ? 'Updated' : 'Created'} event: "${cleanPayload.title}" (${cleanPayload.status})`,
    new_value: cleanPayload.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('events', updatedList);
  return { success: true, event: finalRecord };
}

export async function deleteEvent(id, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('events', DEFAULT_EVENTS);
  const target = all.find(e => e.id === id);
  const updatedList = all.filter(e => e.id !== id);

  if (target?.poster_url) {
    cleanupOldStoragePhoto(target.poster_url, 'events');
  }
  if (target?.banner_url) {
    cleanupOldStoragePhoto(target.banner_url, 'events');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase delete event failed:", err);
    }
  }

  saveLocalCache('events', updatedList);
  await recordActivityLog({
    action_type: 'DELETE',
    section_modified: 'Events Management',
    description: `Deleted event: "${target?.title || id}"`,
    previous_value: target?.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('events', updatedList);
  return { success: true };
}

// Event Registrations
export async function registerForEvent(regData) {
  const cleanRecord = {
    event_id: regData.eventId || regData.event_id,
    event_title: regData.eventTitle || regData.event_title || 'Club Event',
    full_name: (regData.fullName || regData.full_name || '').trim(),
    email: (regData.email || '').trim().toLowerCase(),
    phone: (regData.phone || '').trim(),
    university: (regData.university || 'Sri Sri University').trim(),
    department: (regData.department || '').trim(),
    year_of_study: regData.yearOfStudy || regData.year_of_study || '',
    registration_no: (regData.registrationNo || regData.registration_no || '').trim()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([cleanRecord])
        .select()
        .single();

      if (!error && data) {
        return { success: true, registration: data };
      }
    } catch (err) {
      console.warn("Supabase event registration insert failed:", err);
    }
  }

  // Local storage fallback
  const localList = getLocalCache('event_registrations', []);
  const localRecord = {
    ...cleanRecord,
    id: `evtr-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  saveLocalCache('event_registrations', [localRecord, ...localList]);
  return { success: true, registration: localRecord };
}

export async function getEventRegistrations(eventId = null) {
  let list = [];
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('event_registrations').select('*').order('created_at', { ascending: false });
      if (eventId) query = query.eq('event_id', eventId);
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
      }
    } catch (err) {
      console.warn("Supabase event_registrations fetch failed:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache('event_registrations', []);
    if (eventId) list = list.filter(r => r.event_id === eventId);
  }

  return list;
}

/**
 * ==============================================================================
 * 6. PROPOSED PROJECTS (Strictly Private Database & Admin Workflow)
 * ==============================================================================
 */
export async function submitProjectProposal(proposalData) {
  const ticketCode = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const cleanRecord = {
    ticket_code: ticketCode,
    role: proposalData.role || 'student',
    proposer_name: (proposalData.proposerName || proposalData.proposer_name || '').trim(),
    email: (proposalData.email || '').trim().toLowerCase(),
    phone: (proposalData.phone || '').trim(),
    branch: (proposalData.branch || '').trim(),
    program: (proposalData.program || '').trim(),
    academic_id: (proposalData.academicId || proposalData.academic_id || '').trim(),
    title: (proposalData.title || '').trim(),
    domain: (proposalData.domain || 'web').trim(),
    timeline: proposalData.timeline || '',
    problem_statement: (proposalData.problemStatement || proposalData.problem_statement || '').trim(),
    explanation: (proposalData.explanation || '').trim(),
    objectives: Array.isArray(proposalData.objectives) ? proposalData.objectives : [],
    additional_notes: proposalData.additionalNotes || proposalData.additional_notes || '',
    status: 'Submitted'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('project_proposals')
        .insert([cleanRecord])
        .select()
        .single();

      if (!error && data) {
        return { success: true, ticketCode, proposal: data };
      }
    } catch (err) {
      console.warn("Supabase project proposal insert failed, saving to local cache:", err);
    }
  }

  const existing = getLocalCache('project_proposals', []);
  const localRecord = {
    ...cleanRecord,
    id: `prop-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  saveLocalCache('project_proposals', [localRecord, ...existing]);

  return { success: true, ticketCode, proposal: localRecord };
}

export async function getProjectProposals() {
  let list = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('project_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        list = data;
        saveLocalCache('project_proposals', list);
      }
    } catch (err) {
      console.warn("Supabase project_proposals fetch failed:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache('project_proposals', []);
  }

  return list;
}

export async function updateProposalStatus(id, newStatus, internalNotes = '', admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('project_proposals', []);
  const target = all.find(p => p.id === id);

  const updatedRecord = {
    status: newStatus,
    internal_notes: internalNotes,
    reviewed_by: currentAdmin?.full_name || 'Admin',
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('project_proposals')
        .update(updatedRecord)
        .eq('id', id);
    } catch (err) {
      console.warn("Supabase proposal status update failed:", err);
    }
  }

  const updatedList = all.map(p => p.id === id ? { ...p, ...updatedRecord } : p);
  saveLocalCache('project_proposals', updatedList);

  await recordActivityLog({
    action_type: 'UPDATE',
    section_modified: 'Project Proposals',
    description: `Updated proposal "${target?.title || id}" status to "${newStatus}"`,
    previous_value: target?.status,
    new_value: newStatus,
    admin: currentAdmin
  });

  return { success: true };
}

/**
 * ==============================================================================
 * 7. GALLERY MANAGEMENT
 * ==============================================================================
 */
export async function getGalleryItems() {
  let list = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        list = data;
        saveLocalCache('gallery_items', list);
      }
    } catch (err) {
      console.warn("Supabase gallery_items fetch failed:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache('gallery_items', []);
  }

  return list;
}

export async function saveGalleryItem(item, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('gallery_items', []);
  const newRecord = {
    ...item,
    id: item.id || `gal-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('gallery_items').insert([{
        title: item.title,
        category: item.category || 'General',
        event_name: item.event_name || '',
        year: item.year || new Date().getFullYear().toString(),
        image_url: item.image_url,
        caption: item.caption || ''
      }]);
    } catch (err) {
      console.warn("Supabase gallery insert failed:", err);
    }
  }

  saveLocalCache('gallery_items', [newRecord, ...all]);
  await recordActivityLog({
    action_type: 'CREATE',
    section_modified: 'Gallery',
    description: `Uploaded new photograph: "${item.title}"`,
    new_value: item.title,
    admin: currentAdmin
  });

  broadcastCmsUpdate('gallery');
  return { success: true };
}

export async function deleteGalleryItem(id, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  const all = getLocalCache('gallery_items', []);
  const updated = all.filter(g => g.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('gallery_items').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase delete gallery item failed:", err);
    }
  }

  saveLocalCache('gallery_items', updated);
  await recordActivityLog({
    action_type: 'DELETE',
    section_modified: 'Gallery',
    description: `Deleted photo with ID: ${id}`,
    admin: currentAdmin
  });

  broadcastCmsUpdate('gallery');
  return { success: true };
}

/**
 * ==============================================================================
 * 8. ACTIVITY LOGS (Server / DB Immutable Audit Trail)
 * ==============================================================================
 */
export async function recordActivityLog({ action_type, section_modified, description, previous_value = null, new_value = null, admin = null }) {
  const currentAdmin = admin || getCurrentAdmin();
  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    admin_id: currentAdmin?.admin_id || 'ADM-000',
    admin_name: currentAdmin?.full_name || 'System / Authorized User',
    admin_email: currentAdmin?.email || null,
    action_type: action_type || 'UPDATE',
    section_modified: section_modified || 'General',
    description: description || 'Action recorded',
    previous_value: previous_value ? String(previous_value) : null,
    new_value: new_value ? String(new_value) : null,
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('activity_logs').insert([{
        admin_id: logEntry.admin_id,
        admin_name: logEntry.admin_name,
        admin_email: logEntry.admin_email,
        action_type: logEntry.action_type,
        section_modified: logEntry.section_modified,
        description: logEntry.description,
        previous_value: logEntry.previous_value,
        new_value: logEntry.new_value,
        ip_address: logEntry.ip_address
      }]);
    } catch (err) {
      console.warn("Supabase activity_logs insert failed:", err);
    }
  }

  const existingLogs = getLocalCache('activity_logs', []);
  saveLocalCache('activity_logs', [logEntry, ...existingLogs.slice(0, 199)]); // keep latest 200 locally
  return logEntry;
}

export async function getActivityLogs(admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  let logs = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150);

      // If not Super Admin, request only own records from the database
      if (currentAdmin && currentAdmin.role !== ROLES.SUPER_ADMIN) {
        query = query.or(`admin_id.eq.${currentAdmin.admin_id},admin_email.eq.${currentAdmin.email}`);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        logs = data;
      }
    } catch (err) {
      console.warn("Supabase activity_logs fetch failed:", err);
    }
  }

  if (logs.length === 0) {
    logs = getLocalCache('activity_logs', []);
  }

  // Security layer: If not Super Admin, strictly filter to show only their own logs
  if (currentAdmin && currentAdmin.role !== ROLES.SUPER_ADMIN) {
    return logs.filter(l => 
      l.admin_id === currentAdmin.admin_id || 
      (l.admin_email && l.admin_email.toLowerCase() === (currentAdmin.email || '').toLowerCase())
    );
  }

  return logs;
}

/**
 * ==============================================================================
 * 9. CONTENT VERSION HISTORY & RESTORE
 * ==============================================================================
 */
export async function saveContentVersion(sectionKey, contentData, admin = null) {
  if (!contentData) return;
  const currentAdmin = admin || getCurrentAdmin();
  const versions = getLocalCache(`versions_${sectionKey}`, []);
  const versionNumber = versions.length + 1;

  const newVersion = {
    id: `ver-${Date.now()}-${versionNumber}`,
    section_key: sectionKey,
    version_number: versionNumber,
    content_data: contentData,
    created_by: currentAdmin?.full_name || 'Admin',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('content_versions').insert([{
        section_key: sectionKey,
        version_number: versionNumber,
        content_data: contentData,
        created_by: newVersion.created_by
      }]);
    } catch (err) {
      console.warn("Supabase content_versions insert failed:", err);
    }
  }

  saveLocalCache(`versions_${sectionKey}`, [newVersion, ...versions.slice(0, 20)]);
  return newVersion;
}

export async function getContentVersions(sectionKey) {
  let list = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('section_key', sectionKey)
        .order('version_number', { ascending: false });

      if (!error && Array.isArray(data)) {
        list = data;
      }
    } catch (err) {
      console.warn("Supabase content_versions fetch failed:", err);
    }
  }

  if (list.length === 0) {
    list = getLocalCache(`versions_${sectionKey}`, []);
  }

  return list;
}

export async function restoreContentVersion(sectionKey, versionId, admin = null) {
  const currentAdmin = admin || getCurrentAdmin();
  if (currentAdmin?.role !== ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Only Super Admin can restore content versions.' };
  }

  const versions = await getContentVersions(sectionKey);
  const targetVersion = versions.find(v => v.id === versionId);

  if (!targetVersion || !targetVersion.content_data) {
    return { success: false, error: 'Version record not found.' };
  }

  // Restore site content
  if (sectionKey.startsWith('content_')) {
    const rawKey = sectionKey.replace('content_', '');
    await updateSiteContent(rawKey, targetVersion.content_data, currentAdmin);
  }

  await recordActivityLog({
    action_type: 'RESTORE',
    section_modified: `Content Version • ${sectionKey}`,
    description: `Restored ${sectionKey} to version #${targetVersion.version_number}`,
    new_value: `Version #${targetVersion.version_number}`,
    admin: currentAdmin
  });

  return { success: true, restoredData: targetVersion.content_data };
}
