// API endpoint to check provider status (for monitoring/debugging)
import { NextRequest, NextResponse } from 'next/server'
import { getProviderManager } from '@/lib/provider-manager'

export async function GET(request: NextRequest) {
  try {
    const manager = await getProviderManager()
    const status = manager.getStatus()
    
    return NextResponse.json({
      providers: status,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    )
  }
}
