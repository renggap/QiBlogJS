// services/cache.ts

interface CacheItem<T> {
  data: T;
  expires: number; // Unix timestamp in milliseconds
}

export class CacheService {
  // In-memory map to store cached items
  private cache = new Map<string, CacheItem<any>>();
  
  /**
   * Sets data in the cache with an optional Time-To-Live (TTL).
   * @param key The cache key.
   * @param data The data to store.
   * @param ttl The time in milliseconds until the cache expires (default: 5 minutes).
   */
  set<T>(key: string, data: T, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }
  
  /**
   * Retrieves data from the cache. Returns null if the key is not found or expired.
   * @param key The cache key.
   * @returns The cached data or null.
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check for expiration
    if (item.expires < Date.now()) {
      this.cache.delete(key); // Remove expired item
      return null;
    }
    
    return item.data as T;
  }
  
  /**
   * Clears a specific key from the cache.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();