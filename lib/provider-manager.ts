// Intelligent Provider Manager with Automatic Failover
// Automatically switches between providers when rate limits or errors occur

import type { AIProvider, AIQuestion, AITalkingPoint, AIAnalysis } from './ai-provider'
import { cache, getQuestionsCacheKey, getTalkingPointsCacheKey, getAnalysisCacheKey } from './cache'

interface ProviderStatus {
  name: string
  available: boolean
  lastError?: string
  lastErrorTime?: number
  consecutiveFailures: number
  rateLimitUntil?: number
}

class ProviderManager {
  private providers: Map<string, AIProvider> = new Map()
  private status: Map<string, ProviderStatus> = new Map()
  private providerOrder: string[] = []
  private initialized: boolean = false
  private initializationPromise: Promise<void> | null = null

  private async ensureInitialized() {
    if (this.initialized) return
    if (this.initializationPromise) return this.initializationPromise
    
    this.initializationPromise = this.initializeProviders()
    await this.initializationPromise
    this.initialized = true
  }

  private async initializeProviders() {
    // Try to initialize all available providers
    // OpenAI first (more reliable), then Gemini as backup
    const providerConfigs = [
      { 
        name: 'openai', 
        key: 'OPENAI_API_KEY', 
        import: () => import('./providers/openai'),
        packageCheck: 'openai' // Requires openai package
      },
      { 
        name: 'gemini', 
        key: 'GEMINI_API_KEY', 
        import: () => import('./providers/gemini'),
        packageCheck: null // No package needed
      },
    ]

    for (const config of providerConfigs) {
      if (process.env[config.key]) {
        // Check if required package is installed (for OpenAI)
        if (config.packageCheck) {
          try {
            // Try to require the package to see if it's installed
            require.resolve(config.packageCheck)
          } catch {
            console.warn(`⚠️  ${config.name} API key found but '${config.packageCheck}' package not installed. Skipping ${config.name}.`)
            console.warn(`   Install it with: npm install ${config.packageCheck}`)
            continue
          }
        }
        
        try {
          const module = await config.import()
          this.providers.set(config.name, module.default)
          this.status.set(config.name, {
            name: config.name,
            available: true,
            consecutiveFailures: 0,
          })
          this.providerOrder.push(config.name)
        } catch (error: any) {
          console.warn(`Failed to initialize ${config.name}:`, error.message)
        }
      }
    }

    // Default order: prefer OpenAI first (more reliable), then Gemini
    // If no preference set, use: openai -> gemini
    const preferredOrder = process.env.AI_PROVIDER_ORDER?.split(',').map(p => p.trim()) || []
    if (preferredOrder.length > 0) {
      // Reorder based on preference, but only include available providers
      this.providerOrder = [
        ...preferredOrder.filter(p => this.providers.has(p)),
        ...this.providerOrder.filter(p => !preferredOrder.includes(p))
      ]
    } else {
      // Default: OpenAI first if available, then Gemini
      const openaiIndex = this.providerOrder.indexOf('openai')
      const geminiIndex = this.providerOrder.indexOf('gemini')
      
      if (openaiIndex !== -1 && geminiIndex !== -1) {
        // Reorder to put OpenAI first
        this.providerOrder = ['openai', 'gemini']
      } else if (openaiIndex !== -1) {
        // Only OpenAI available
        this.providerOrder = ['openai']
      }
      // If only Gemini, keep it as is
    }

    if (this.providers.size === 0) {
      throw new Error('No AI providers configured. Please set at least one API key (GEMINI_API_KEY or OPENAI_API_KEY)')
    }

    console.log(`Provider Manager initialized with ${this.providers.size} provider(s): ${this.providerOrder.join(', ')}`)
  }

  private isRateLimitError(error: any): boolean {
    const errorMessage = error?.message?.toLowerCase() || ''
    const errorCode = error?.code || error?.status || ''
    
    return (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('429') ||
      errorCode === 429 ||
      errorMessage.includes('resource_exhausted') ||
      errorMessage.includes('too many requests')
    )
  }

  private markProviderUnavailable(name: string, error: any, isRateLimit: boolean) {
    const status = this.status.get(name)
    if (status) {
      status.available = false
      status.lastError = error?.message || 'Unknown error'
      status.lastErrorTime = Date.now()
      status.consecutiveFailures += 1
      
      if (isRateLimit) {
        // Rate limit: mark unavailable for 1 hour (or until reset)
        status.rateLimitUntil = Date.now() + (60 * 60 * 1000) // 1 hour
        console.warn(`Provider ${name} rate limited. Will retry after ${new Date(status.rateLimitUntil).toLocaleTimeString()}`)
      } else {
        // Other error: mark unavailable for 5 minutes
        status.rateLimitUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
      }
    }
  }

  private markProviderAvailable(name: string) {
    const status = this.status.get(name)
    if (status) {
      status.available = true
      status.consecutiveFailures = 0
      status.lastError = undefined
      status.lastErrorTime = undefined
      status.rateLimitUntil = undefined
    }
  }

  private getAvailableProviders(): string[] {
    const now = Date.now()
    return this.providerOrder.filter(name => {
      const status = this.status.get(name)
      if (!status) return false
      
      // Check if rate limit period has passed
      if (status.rateLimitUntil && now < status.rateLimitUntil) {
        return false
      }
      
      // If rate limit period passed, mark as available again
      if (status.rateLimitUntil && now >= status.rateLimitUntil) {
        this.markProviderAvailable(name)
      }
      
      return status.available || status.consecutiveFailures < 3
    })
  }

  private async tryWithProvider<T>(
    name: string,
    operation: (provider: AIProvider) => Promise<T>
  ): Promise<T> {
    const provider = this.providers.get(name)
    if (!provider) {
      throw new Error(`Provider ${name} not available`)
    }

    try {
      const result = await operation(provider)
      // Success - mark as available
      if (this.status.get(name)?.consecutiveFailures > 0) {
        this.markProviderAvailable(name)
        console.log(`Provider ${name} recovered successfully`)
      }
      return result
    } catch (error: any) {
      const isRateLimit = this.isRateLimitError(error)
      this.markProviderUnavailable(name, error, isRateLimit)
      throw error
    }
  }

  async generateQuestions(
    symptoms: string,
    appointmentType: string,
    concerns: string
  ): Promise<AIQuestion[]> {
    await this.ensureInitialized()
    
    // Check cache first
    const cacheKey = getQuestionsCacheKey(symptoms, appointmentType, concerns)
    const cached = cache.get<AIQuestion[]>(cacheKey)
    if (cached) {
      console.log('Cache hit for questions')
      return cached
    }

    const availableProviders = this.getAvailableProviders()
    
    if (availableProviders.length === 0) {
      throw new Error('All AI providers are currently unavailable. Please try again later.')
    }

    let lastError: any = null

    for (const providerName of availableProviders) {
      try {
        const result = await this.tryWithProvider(providerName, (provider) =>
          provider.generateQuestions(symptoms, appointmentType, concerns)
        )
        // Cache successful result
        cache.set(cacheKey, result, 60 * 60 * 1000) // 1 hour cache
        return result
      } catch (error: any) {
        lastError = error
        console.warn(`Provider ${providerName} failed, trying next...`, error.message)
        // Continue to next provider
      }
    }

    // All providers failed
    throw new Error(`All providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  async generateTalkingPoints(
    symptoms: string,
    concerns: string
  ): Promise<AITalkingPoint[]> {
    await this.ensureInitialized()
    
    // Check cache first
    const cacheKey = getTalkingPointsCacheKey(symptoms, concerns)
    const cached = cache.get<AITalkingPoint[]>(cacheKey)
    if (cached) {
      console.log('Cache hit for talking points')
      return cached
    }

    const availableProviders = this.getAvailableProviders()
    
    if (availableProviders.length === 0) {
      throw new Error('All AI providers are currently unavailable. Please try again later.')
    }

    let lastError: any = null

    for (const providerName of availableProviders) {
      try {
        const result = await this.tryWithProvider(providerName, (provider) =>
          provider.generateTalkingPoints(symptoms, concerns)
        )
        // Cache successful result
        cache.set(cacheKey, result, 60 * 60 * 1000) // 1 hour cache
        return result
      } catch (error: any) {
        lastError = error
        console.warn(`Provider ${providerName} failed, trying next...`, error.message)
        // Continue to next provider
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  async analyzeMedicalNote(noteText: string): Promise<AIAnalysis> {
    await this.ensureInitialized()
    
    // Check cache first
    const cacheKey = getAnalysisCacheKey(noteText)
    const cached = cache.get<AIAnalysis>(cacheKey)
    if (cached) {
      console.log('Cache hit for note analysis')
      return cached
    }

    const availableProviders = this.getAvailableProviders()
    
    if (availableProviders.length === 0) {
      throw new Error('All AI providers are currently unavailable. Please try again later.')
    }

    let lastError: any = null

    for (const providerName of availableProviders) {
      try {
        const result = await this.tryWithProvider(providerName, (provider) =>
          provider.analyzeMedicalNote(noteText)
        )
        // Cache successful result (longer cache for analysis)
        cache.set(cacheKey, result, 2 * 60 * 60 * 1000) // 2 hour cache
        return result
      } catch (error: any) {
        lastError = error
        console.warn(`Provider ${providerName} failed, trying next...`, error.message)
        // Continue to next provider
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  // Get status of all providers (for monitoring/debugging)
  getStatus(): Record<string, ProviderStatus> {
    const result: Record<string, ProviderStatus> = {}
    this.status.forEach((status, name) => {
      result[name] = { ...status }
    })
    return result
  }
}

// Singleton instance
let managerInstance: ProviderManager | null = null

export async function getProviderManager(): Promise<ProviderManager> {
  if (!managerInstance) {
    managerInstance = new ProviderManager()
  }
  return managerInstance
}
