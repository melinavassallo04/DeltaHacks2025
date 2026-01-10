import { NextRequest, NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/provider-manager'

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, task } = await request.json()

    const manager = await getProviderManager()

    let result: any

    switch (task) {
      case 'questions':
        result = await manager.generateQuestions(
          context?.symptoms || '',
          context?.appointmentType || '',
          context?.concerns || ''
        )
        break

      case 'talking-points':
        result = await manager.generateTalkingPoints(
          context?.symptoms || '',
          context?.concerns || ''
        )
        break

      case 'analyze-note':
        result = await manager.analyzeMedicalNote(prompt || '')
        break

      default:
        return NextResponse.json({ error: 'Invalid task' }, { status: 400 })
    }

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('AI Provider Manager error:', error)
    
    // Check for OpenAI quota/rate limit errors
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      return NextResponse.json(
        { 
          error: 'OpenAI API quota exceeded',
          message: 'You have exceeded your OpenAI API quota. Please check your billing and plan details at https://platform.openai.com/account/billing',
          hint: 'You may need to add payment method or upgrade your plan. The app will work once your quota resets or you add credits.',
          statusCode: 429
        },
        { status: 429 }
      )
    }
    
    // Provide helpful error messages
    if (error.message?.includes('not configured') || error.message?.includes('No AI providers')) {
      return NextResponse.json(
        { 
          error: error.message,
          hint: 'Please configure at least one AI provider (GEMINI_API_KEY or OPENAI_API_KEY) in your .env file'
        },
        { status: 500 }
      )
    }
    
    if (error.message?.includes('All providers are currently unavailable')) {
      return NextResponse.json(
        { 
          error: error.message,
          hint: 'All AI providers have hit rate limits or encountered errors. Please try again in a few minutes.'
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'API error' },
      { status: 500 }
    )
  }
}
