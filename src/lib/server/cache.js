const cacheStore = new Map();

function now() {
  return Date.now();
}

export function getCache(key) {
  const item = cacheStore.get(key);
  if (!item) return null;

  if (item.expiresAt <= now()) {
    cacheStore.delete(key);
    return null;
  }

  return item.value;
}

export function setCache(key, value, ttlMs) {
  cacheStore.set(key, {
    value,
    expiresAt: now() + ttlMs,
  });
}

export function deleteCache(key) {
  cacheStore.delete(key);
}

export function deleteCacheByPrefix(prefix) {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}
