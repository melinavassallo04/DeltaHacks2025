import OpenAI from 'openai'
import type { AIProvider, AIQuestion, AITalkingPoint, AIAnalysis } from '../ai-provider'

class OpenAIProvider implements AIProvider {
  private client: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured')
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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

Return a JSON object with a "questions" array containing objects with:
- "text": The question
- "category": "Diagnosis", "Treatment", "Testing", "Follow-up", or "Advocacy"
- "priority": "high", "medium", or "low"

Example: {"questions": [{"text":"What tests do you recommend?","category":"Testing","priority":"high"}]}`

    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const text = response.choices[0]?.message?.content || '{"questions":[]}'
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

Return a JSON object with a "talkingPoints" array containing objects with:
- "point": The statement to use
- "category": "Symptom Documentation", "Preventing Dismissal", "General Advocacy", or "Test Results"
- "context": Why this helps
- "whenToUse": When to say this

Example: {"talkingPoints": [{"point":"I need this documented in my chart.","category":"General Advocacy","context":"Creates a record","whenToUse":"After discussing concerns"}]}`

    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const text = response.choices[0]?.message?.content || '{"talkingPoints":[]}'
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

    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const text = response.choices[0]?.message?.content || '{}'
    
    try {
      const data = JSON.parse(text)
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
      const parsed = JSON.parse(text)
      // Handle different response formats
      const items = 
        Array.isArray(parsed) ? parsed :
        parsed.questions ? parsed.questions :
        parsed.talkingPoints ? parsed.talkingPoints :
        parsed.items || parsed.data || []
      const array = Array.isArray(items) ? items : []
      return array.map((item: any, i: number) => ({ id: `${idPrefix}-${i}`, ...item }))
    } catch {
      return []
    }
  }
}

export default new OpenAIProvider()
