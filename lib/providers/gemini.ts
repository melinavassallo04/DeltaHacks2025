import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider, AIQuestion, AITalkingPoint, AIAnalysis } from '../ai-provider'

class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // Use model from env or default to gemini-pro
    // Common model names: 'gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro'
    this.model = this.genAI.getGenerativeModel({ model: modelName })
  }

  async generateQuestions(
    symptoms: string,
    appointmentType: string,
    concerns: string
  ): Promise<AIQuestion[]> {
    const prompt = `You are a medical advocacy assistant. Generate 8-10 questions for a patient to ask their doctor.

Context:
- Symptoms: ${symptoms || 'Not specified'}
- Appointment Type: ${appointmentType || 'General'}
- Concerns: ${concerns || 'None'}

Return ONLY a JSON array with objects containing:
- "text": The question
- "category": "Diagnosis", "Treatment", "Testing", "Follow-up", or "Advocacy"
- "priority": "high", "medium", or "low"

Example: [{"text":"What tests do you recommend?","category":"Testing","priority":"high"}]`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()
    return this.parseJSONArray<AIQuestion>(text, 'q')
  }

  async generateTalkingPoints(
    symptoms: string,
    concerns: string
  ): Promise<AITalkingPoint[]> {
    const prompt = `You are a medical advocacy assistant. Generate 6-8 talking points for a patient.

Context:
- Symptoms: ${symptoms || 'Not specified'}
- Concerns: ${concerns || 'None'}

Return ONLY a JSON array with objects containing:
- "point": The statement to use
- "category": "Symptom Documentation", "Preventing Dismissal", "General Advocacy", or "Test Results"
- "context": Why this helps
- "whenToUse": When to say this

Example: [{"point":"I need this documented in my chart.","category":"General Advocacy","context":"Creates a record","whenToUse":"After discussing concerns"}]`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()
    return this.parseJSONArray<AITalkingPoint>(text, 'tp')
  }

  async analyzeMedicalNote(noteText: string): Promise<AIAnalysis> {
    const prompt = `Analyze this medical note and return JSON with:
- "concerns": Array of potential issues
- "missing": Array of missing information
- "recommendations": Array of actions to take
- "summary": Brief 2-sentence summary

Note: ${noteText}

Return ONLY valid JSON.`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()
    
    try {
      const cleaned = this.cleanJSON(text)
      const data = JSON.parse(cleaned)
      return {
        concerns: data.concerns || [],
        missing: data.missing || [],
        recommendations: data.recommendations || [],
        summary: data.summary || 'Analysis completed.'
      }
    } catch {
      return { concerns: [], missing: [], recommendations: [], summary: 'Analysis completed.' }
    }
  }

  private parseJSONArray<T>(text: string, idPrefix: string): T[] {
    try {
      const cleaned = this.cleanJSON(text)
      const items = JSON.parse(cleaned)
      const array = Array.isArray(items) ? items : []
      return array.map((item: any, i: number) => ({ id: `${idPrefix}-${i}`, ...item }))
    } catch {
      return []
    }
  }

  private cleanJSON(text: string): string {
    let cleaned = text.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```$/g, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '')
    }
    return cleaned
  }
}

export default new GeminiProvider()
