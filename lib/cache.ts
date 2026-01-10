// Simple in-memory cache to reduce API calls
// Caches responses for identical queries to avoid hitting rate limits

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 60 * 60 * 1000 // 1 hour default

  // Generate cache key from parameters
  private getKey(prefix: string, ...args: any[]): string {
    return `${prefix}:${JSON.stringify(args)}`
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    })
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries (call periodically)
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Cache key generators for different operations
export function getQuestionsCacheKey(symptoms: string, appointmentType: string, concerns: string): string {
  return `questions:${symptoms}:${appointmentType}:${concerns}`
}

export function getTalkingPointsCacheKey(symptoms: string, concerns: string): string {
  return `talking-points:${symptoms}:${concerns}`
}

export function getAnalysisCacheKey(noteText: string): string {
  // Use hash of note text for cache key (first 100 chars + length)
  const hash = noteText.substring(0, 100) + noteText.length
  return `analysis:${hash}`
}
