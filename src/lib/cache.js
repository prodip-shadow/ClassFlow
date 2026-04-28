/**
 * Simple in-memory cache for API requests
 * Improves performance by avoiding duplicate requests
 */

const cache = new Map();
const timers = new Map();
const CACHE_DURATION = 30 * 1000; // 30 seconds

export const cacheGet = (key) => {
  return cache.get(key);
};

export const cacheSet = (key, value) => {
  // Clear existing timer if any
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
  }

  cache.set(key, value);

  // Auto-expire cache after duration
  const timer = setTimeout(() => {
    cache.delete(key);
    timers.delete(key);
  }, CACHE_DURATION);

  timers.set(key, timer);
};

export const cacheClear = (key) => {
  if (key) {
    cache.delete(key);
    if (timers.has(key)) {
      clearTimeout(timers.get(key));
      timers.delete(key);
    }
  } else {
    cache.clear();
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  }
};

export const withCache = async (key, fetcher) => {
  const cached = cacheGet(key);
  if (cached) return cached;

  const result = await fetcher();
  cacheSet(key, result);
  return result;
};
