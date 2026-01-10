// AI Provider Abstraction Layer
// Allows switching between different AI providers (Gemini, OpenAI, etc.)

export interface AIQuestion {
  id?: string
  text: string
  category: string
  priority: 'high' | 'medium' | 'low'
}

export interface AITalkingPoint {
  id?: string
  point: string
  category: string
  context: string
  whenToUse: string
}

export interface AIAnalysis {
  concerns: string[]
  missing: string[]
  recommendations: string[]
  summary: string
}

export interface AIProvider {
  generateQuestions(
    symptoms: string,
    appointmentType: string,
    concerns: string
  ): Promise<AIQuestion[]>
  
  generateTalkingPoints(
    symptoms: string,
    concerns: string
  ): Promise<AITalkingPoint[]>
  
  analyzeMedicalNote(noteText: string): Promise<AIAnalysis>
}

// Get the configured AI provider
export async function getAIProvider(): Promise<AIProvider> {
  const provider = process.env.AI_PROVIDER || 'gemini'
  
  switch (provider) {
    case 'openai':
      const { default: openaiProvider } = await import('./providers/openai')
      return openaiProvider
    case 'gemini':
    default:
      const { default: geminiProvider } = await import('./providers/gemini')
      return geminiProvider
  }
}
