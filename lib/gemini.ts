// Re-export types for backward compatibility
export type {
  AIQuestion as GeminiQuestion,
  AITalkingPoint as GeminiTalkingPoint,
  AIAnalysis as GeminiAnalysis,
} from './ai-provider'

// Client-side functions that call the API
export async function generateQuestions(
  symptoms: string,
  appointmentType: string,
  concerns: string
) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: 'questions',
      context: { symptoms, appointmentType, concerns },
    }),
  })

  const result = await response.json()
  if (result.error) throw new Error(result.error)
  
  const questions = Array.isArray(result.data) ? result.data : []
  return questions.map((q: any, i: number) => ({ id: `q-${i}`, ...q }))
}

export async function generateTalkingPoints(
  symptoms: string,
  concerns: string
) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: 'talking-points',
      context: { symptoms, concerns },
    }),
  })

  const result = await response.json()
  if (result.error) throw new Error(result.error)
  
  const points = Array.isArray(result.data) ? result.data : []
  return points.map((p: any, i: number) => ({ id: `tp-${i}`, ...p }))
}

export async function analyzeMedicalNote(noteText: string) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: 'analyze-note', prompt: noteText }),
  })

  const result = await response.json()
  if (result.error) throw new Error(result.error)
  
  return result.data || { concerns: [], missing: [], recommendations: [], summary: 'Analysis completed.' }
}
