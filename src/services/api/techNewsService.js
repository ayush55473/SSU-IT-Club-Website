/**
 * ==============================================================================
 * SSU IT CLUB — LIVE TECH & DEVELOPER NEWS API SERVICE
 * ==============================================================================
 * Provider: Dev.to Public REST API (https://dev.to/api)
 * Auth: 100% FREE, NO API KEY REQUIRED, NO SUBSCRIPTION NEEDED.
 * Purpose: Streams curated, live software engineering articles, open-source highlights,
 *          and emerging tech trends for university IT club students.
 * ==============================================================================
 */

const CACHE_KEY = 'ssu_it_club_live_tech_news_v1';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes TTL

// Curated high-quality offline fallbacks for computer science students
const FALLBACK_ARTICLES = [
  {
    id: 'fallback-01',
    title: 'Modern Full-Stack Architecture: React 19, Edge Computing & Scalable Microservices',
    description: 'An architectural exploration of modern client hydration, server components, and distributed database synchronization.',
    url: 'https://dev.to',
    tag_list: ['webdev', 'react', 'architecture'],
    reading_time_minutes: 5,
    user: { name: 'SSU Technical Committee' },
    published_at: new Date().toISOString(),
    reactions_count: 84
  },
  {
    id: 'fallback-02',
    title: 'Demystifying Generative AI & LLM Model Fine-Tuning for Student Researchers',
    description: 'A beginner-friendly guide to understanding embeddings, vector databases, and parameter-efficient fine-tuning on consumer hardware.',
    url: 'https://dev.to',
    tag_list: ['ai', 'datascience', 'python'],
    reading_time_minutes: 6,
    user: { name: 'Campus AI Study Group' },
    published_at: new Date().toISOString(),
    reactions_count: 128
  },
  {
    id: 'fallback-03',
    title: 'Essential Open-Source Git Workflows Every Computer Science Student Should Master',
    description: 'From rebase strategies to squash commits and automated CI/CD pipeline deployments via GitHub Actions.',
    url: 'https://dev.to',
    tag_list: ['git', 'opensource', 'devops'],
    reading_time_minutes: 4,
    user: { name: 'Open Source Guild' },
    published_at: new Date().toISOString(),
    reactions_count: 95
  }
];

/**
 * Fetches latest trending developer articles
 * @param {string} tag - Optional filter (e.g., 'programming', 'ai', 'webdev')
 * @param {number} limit - Number of articles (default 6)
 * @returns {Promise<Array>} List of article objects
 */
export async function getLiveTechNews(tag = 'programming', limit = 6) {
  if (typeof window === 'undefined') return FALLBACK_ARTICLES;

  const cacheKey = `${CACHE_KEY}_${tag}_${limit}`;

  // 1. Check local cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache parse errors
  }

  // 2. Fetch from Dev.to Public API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=${limit}&top=7`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Dev.to API error: status ${response.status}`);
    }

    const rawList = await response.json();
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return FALLBACK_ARTICLES;
    }

    // Clean & normalize payload
    const articles = rawList.slice(0, limit).map(item => ({
      id: String(item.id),
      title: item.title,
      description: item.description,
      url: item.url,
      cover_image: item.cover_image || item.social_image || null,
      tag_list: Array.isArray(item.tag_list) ? item.tag_list : (item.tags || '').split(',').map(t => t.trim()),
      reading_time_minutes: item.reading_time_minutes || 4,
      user: {
        name: item.user?.name || 'Developer',
        username: item.user?.username || '',
        profile_image: item.user?.profile_image_90 || null
      },
      published_at: item.published_at,
      reactions_count: item.public_reactions_count || item.positive_reactions_count || 10
    }));

    // Cache successful response
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: articles
      }));
    } catch {
      // Ignore quota error
    }

    return articles;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Using tech news fallback:", error.message || error);
    return FALLBACK_ARTICLES;
  }
}
