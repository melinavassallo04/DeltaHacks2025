'use client'

import { useState } from 'react'
import { FileText, Copy, CheckCircle2, Shield, Download } from 'lucide-react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage } from '@/lib/export'

interface TalkingPoint {
  id: string
  point: string
  category: string
  context: string
  whenToUse: string
}

export default function TalkingPoints() {
  const [symptoms, setSymptoms] = useLocalStorage('talking-symptoms', '')
  const [concerns, setConcerns] = useLocalStorage('talking-concerns', '')
  const [points, setPoints] = useLocalStorage<TalkingPoint[]>('talking-points', [])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getTemplatePoints = (): TalkingPoint[] => {
    return [
      {
        id: '1',
        point: 'I need this documented in my chart.',
        category: 'General Advocacy',
        context: 'Creates a permanent record of your concerns',
        whenToUse: 'After discussing any concerns or symptoms'
      },
      {
        id: '2',
        point: 'These symptoms are significantly impacting my daily life.',
        category: 'Symptom Documentation',
        context: 'Emphasizes severity and validates your experience',
        whenToUse: 'When describing symptoms that are being minimized'
      },
      {
        id: '3',
        point: 'I would like to explore all possible causes, not just the most common ones.',
        category: 'Preventing Dismissal',
        context: 'Encourages thorough investigation',
        whenToUse: 'If you feel your concerns are being dismissed too quickly'
      },
      {
        id: '4',
        point: 'Can you explain why you\'re ruling out [specific condition]?',
        category: 'General Advocacy',
        context: 'Ensures you understand the diagnostic process',
        whenToUse: 'When you want clarity on diagnostic decisions'
      },
      {
        id: '5',
        point: 'I\'ve been tracking these symptoms for [time period].',
        category: 'Symptom Documentation',
        context: 'Shows you\'re proactive and have data',
        whenToUse: 'When presenting symptom history'
      },
      {
        id: '6',
        point: 'What tests would help rule out or confirm this?',
        category: 'Test Results',
        context: 'Encourages appropriate testing',
        whenToUse: 'When discussing diagnostic options'
      },
      {
        id: '7',
        point: 'I\'d like a copy of my test results and visit notes.',
        category: 'General Advocacy',
        context: 'Ensures you have your own records',
        whenToUse: 'At the end of any appointment'
      },
      {
        id: '8',
        point: 'If this doesn\'t improve, what should be our next steps?',
        category: 'Follow-up',
        context: 'Establishes a clear plan for ongoing care',
        whenToUse: 'When discussing treatment or wait-and-see approaches'
      }
    ]
  }

  const handleGenerate = () => {
    if (!symptoms.trim() && !concerns.trim()) {
      return
    }
    setPoints(getTemplatePoints())
  }

  const handleExportPDF = () => {
    const grouped = points.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {} as Record<string, typeof points>)
    
    const content = Object.entries(grouped).map(([category, ps]) => `
      <h3>${category}</h3>
      ${ps.map(p => `
        <div class="item">
          <p><em>"${p.point}"</em></p>
          <div class="meta"><strong>Context:</strong> ${p.context}</div>
          <div class="meta"><strong>When to use:</strong> ${p.whenToUse}</div>
        </div>
      `).join('')}
    `).join('')
    
    exportToPrintablePage('Talking Points for My Appointment', `
      <div class="section">
        ${symptoms ? `<p><strong>My Symptoms:</strong> ${symptoms}</p>` : ''}
        ${concerns ? `<p><strong>My Concerns:</strong> ${concerns}</p>` : ''}
      </div>
      <div class="section"><h2>Talking Points (${points.length})</h2>${content}</div>
    `)
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categories = Array.from(new Set(points.map(p => p.category)))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Talking Points</h2>
        <p className="text-gray-600 mb-6">Helpful advocacy statements for your appointments</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Symptoms</label>
            <input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., Chronic fatigue, Joint pain" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Concerns</label>
            <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} rows={3}
              placeholder="e.g., Symptoms dismissed as anxiety before..." className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <button onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-3 rounded-lg hover:from-pink-500 hover:to-rose-600 flex items-center justify-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Show Talking Points</span>
          </button>
        </div>
      </div>

      {points.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{points.length} Talking Points</h3>
            <button onClick={handleExportPDF} title="Export as PDF"
              className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
              <Download className="h-4 w-4" /><span className="text-sm">Export PDF</span>
            </button>
          </div>
          {categories.map((category) => (
                <div key={category} className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-pink-600" />
                <h4 className="font-semibold">{category}</h4>
              </div>
              <div className="space-y-3">
                {points.filter(p => p.category === category).map((p) => (
                  <div key={p.id} className="border-l-4 border-pink-400 bg-pink-50 rounded-r-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-900 font-medium italic">"{p.point}"</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>Context:</strong> {p.context}</p>
                        <p className="text-sm text-gray-600"><strong>When:</strong> {p.whenToUse}</p>
                      </div>
                      <button onClick={() => copy(p.point, p.id)} className="text-gray-400 hover:text-pink-600 ml-4">
                        {copiedId === p.id ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
