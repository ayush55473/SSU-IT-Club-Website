/**
 * ==============================================================================
 * SSU IT CLUB — DAILY TECH LEADERSHIP & INNOVATION QUOTE SERVICE
 * ==============================================================================
 * Provider: DummyJSON / Quotes & Curated Computer Science Pioneers Array
 * Auth: 100% FREE, NO API KEY REQUIRED, NO SUBSCRIPTION NEEDED.
 * Purpose: Inspires university engineering students with timeless wisdom from
 *          historical and modern technology innovators.
 * ==============================================================================
 */

const CACHE_KEY = 'ssu_it_club_daily_quote_v1';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours TTL

const CURATED_TECH_QUOTES = [
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    designation: "Pioneer of Object-Oriented Programming & GUI"
  },
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    designation: "Creator of the Linux Kernel & Git"
  },
  {
    quote: "That brain of mine is something more than merely mortal; as time will show.",
    author: "Ada Lovelace",
    designation: "First Computer Programmer in History"
  },
  {
    quote: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    author: "Alan Turing",
    designation: "Father of Theoretical Computer Science & AI"
  },
  {
    quote: "The most dangerous phrase in the language is: We've always done it this way.",
    author: "Grace Hopper",
    designation: "Computer Scientist & US Navy Rear Admiral"
  },
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    designation: "Founding Computer Scientist & Algorithm Pioneer"
  },
  {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    designation: "Co-founder of Apple"
  }
];

export async function getDailyTechQuote() {
  if (typeof window === 'undefined') return CURATED_TECH_QUOTES[0];

  // 1. Check local cache (one quote per day)
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && parsed.data) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache error
  }

  // 2. Select today's quote based on day-of-year index
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const selectedQuote = CURATED_TECH_QUOTES[dayOfYear % CURATED_TECH_QUOTES.length];

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: selectedQuote
    }));
  } catch {
    // Ignore quota error
  }

  return selectedQuote;
}
