'use client'

import { useState } from 'react'
import { Search, FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage } from '@/lib/export'

interface Analysis {
  concerns: string[]
  missing: string[]
  recommendations: string[]
  summary: string
}

export default function NoteAnalyzer() {
  const [noteText, setNoteText] = useLocalStorage('note-text', '')
  const [analysis, setAnalysis] = useLocalStorage<Analysis | null>('note-analysis', null)

  const analyzeNote = (text: string): Analysis => {
    const lowerText = text.toLowerCase()
    const concerns: string[] = []
    const missing: string[] = []
    const recommendations: string[] = []

    // Check for common issues
    if (!lowerText.includes('diagnosis') && !lowerText.includes('assessment')) {
      missing.push('Clear diagnosis or assessment')
    }
    if (!lowerText.includes('plan') && !lowerText.includes('treatment')) {
      missing.push('Treatment plan or next steps')
    }
    if (!lowerText.includes('follow') && !lowerText.includes('return')) {
      missing.push('Follow-up instructions')
    }

    // Check for concerning patterns
    if (lowerText.includes('dismiss') || lowerText.includes('anxiety') || lowerText.includes('stress')) {
      concerns.push('Symptoms may have been attributed to psychological causes')
    }
    if (lowerText.includes('normal') && !lowerText.includes('abnormal')) {
      concerns.push('All results marked as normal - consider if additional testing is needed')
    }
    if (!lowerText.includes('test') && !lowerText.includes('lab')) {
      concerns.push('No diagnostic tests mentioned')
    }

    // Generate recommendations
    recommendations.push('Request a copy of this note for your records')
    if (missing.length > 0) {
      recommendations.push('Ask your doctor about the missing information at your next visit')
    }
    if (concerns.length > 0) {
      recommendations.push('Consider getting a second opinion if concerns persist')
    }
    recommendations.push('Keep this note with your other medical records')

    const summary = `This note contains ${text.split(' ').length} words. ${concerns.length > 0 ? 'Some potential concerns were identified. ' : ''}${missing.length > 0 ? 'Some information appears to be missing. ' : ''}Review the details below.`

    return { concerns, missing, recommendations, summary }
  }

  const handleAnalyze = () => {
    if (!noteText.trim()) {
      return
    }
    const result = analyzeNote(noteText)
    setAnalysis(result)
  }

  const handleExportPDF = () => {
    if (!analysis) return
    
    const content = `
      <div class="section">
        <h2>Analysis Summary</h2>
        <p>${analysis.summary}</p>
      </div>
      ${analysis.concerns.length > 0 ? `
        <div class="section">
          <h2>⚠️ Potential Concerns</h2>
          <ul>${analysis.concerns.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      ` : ''}
      ${analysis.missing.length > 0 ? `
        <div class="section">
          <h2>📋 Missing Information</h2>
          <ul>${analysis.missing.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
      ` : ''}
      <div class="section">
        <h2>✅ Recommendations</h2>
        <ul>${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
      <div class="section">
        <h2>Original Note</h2>
        <div class="item" style="white-space: pre-wrap; font-family: monospace;">${noteText}</div>
      </div>
    `
    
    exportToPrintablePage('Medical Note Analysis', content)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Analyzer</h2>
        <p className="text-gray-600 mb-6">Review and analyze your medical notes and records</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Note</label>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={8}
              placeholder="Paste your medical note here..."
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
          </div>

          <button onClick={handleAnalyze} disabled={!noteText.trim()}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-3 rounded-lg hover:from-pink-500 hover:to-rose-600 disabled:opacity-50 flex items-center justify-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Analyze Note</span>
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={handleExportPDF} title="Export as PDF"
              className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
              <Download className="h-4 w-4" /><span className="text-sm">Export Analysis</span>
            </button>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <FileText className="h-5 w-5 text-pink-600 inline mr-2" />
            <span className="font-semibold text-pink-900">Summary</span>
            <p className="text-pink-800 mt-2">{analysis.summary}</p>
          </div>

          {analysis.concerns.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-5 w-5 text-red-600 inline mr-2" />
              <span className="font-semibold text-red-900">Potential Concerns</span>
              <ul className="mt-2 space-y-1">
                {analysis.concerns.map((c, i) => <li key={i} className="text-red-800">• {c}</li>)}
              </ul>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <AlertCircle className="h-5 w-5 text-yellow-600 inline mr-2" />
              <span className="font-semibold text-yellow-900">Missing Information</span>
              <ul className="mt-2 space-y-1">
                {analysis.missing.map((m, i) => <li key={i} className="text-yellow-800">• {m}</li>)}
              </ul>
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <CheckCircle2 className="h-5 w-5 text-green-600 inline mr-2" />
              <span className="font-semibold text-green-900">Recommendations</span>
              <ul className="mt-2 space-y-1">
                {analysis.recommendations.map((r, i) => <li key={i} className="text-green-800">• {r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
