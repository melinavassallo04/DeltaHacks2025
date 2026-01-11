'use client'

import { useState } from 'react'
import { Plus, Clock, Calendar, X, AlertCircle, Download, Copy, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage, copyToClipboard, formatDate } from '@/lib/export'

interface Symptom {
  id: string
  name: string
  severity: number
  frequency: string
  duration: string
  triggers: string
  notes: string
  timestamp: Date
}

export default function SymptomTracker() {
  const [symptoms, setSymptoms] = useLocalStorage<Symptom[]>('symptoms', [])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', severity: 5, frequency: 'daily', duration: '', triggers: '', notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSymptoms([{ id: Date.now().toString(), ...formData, timestamp: new Date() }, ...symptoms])
    setFormData({ name: '', severity: 5, frequency: 'daily', duration: '', triggers: '', notes: '' })
    setShowForm(false)
  }

  const handleExportPDF = () => {
    const content = symptoms.map(s => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${s.name}</span>
          <span class="badge">${s.severity}/10 severity</span>
        </div>
        <div class="meta">
          <strong>Frequency:</strong> ${s.frequency} | 
          <strong>Duration:</strong> ${s.duration || 'Not specified'} |
          <strong>Recorded:</strong> ${formatDate(s.timestamp)}
        </div>
        ${s.triggers ? `<div class="meta"><strong>Triggers:</strong> ${s.triggers}</div>` : ''}
        ${s.notes ? `<div class="meta"><strong>Notes:</strong> ${s.notes}</div>` : ''}
      </div>
    `).join('')
    exportToPrintablePage('Symptom Report', `<div class="section"><h2>Recorded Symptoms (${symptoms.length})</h2>${content}</div>`)
  }

  const [copied, setCopied] = useState(false)
  
  const handleCopyToClipboard = async () => {
    const data = symptoms.map(s => ({
      Name: s.name,
      Severity: s.severity,
      Frequency: s.frequency,
      Duration: s.duration,
      Triggers: s.triggers,
      Notes: s.notes,
      Date: new Date(s.timestamp)
    }))
    const success = await copyToClipboard(data)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Symptom Documentation</h2>
            <p className="text-gray-600 mt-1.5 text-sm">Record symptoms with medical-grade precision</p>
          </div>
          <div className="flex items-center space-x-2">
            {symptoms.length > 0 && (
              <div className="flex items-center space-x-1">
                <button onClick={handleExportPDF} title="Export as PDF"
                  className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                  <Download className="h-4 w-4" /><span className="text-sm">PDF</span>
                </button>
                <button onClick={handleCopyToClipboard} title="Copy to Clipboard"
                  className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 font-semibold shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4" /><span>Add Symptom</span>
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptom Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chest pain, Fatigue" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity: {formData.severity}/10</label>
                <input type="range" min="1" max="10" value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="constant">Constant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="occasional">Occasional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input type="text" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 weeks" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Triggers</label>
                <input type="text" value={formData.triggers}
                  onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
                  placeholder="e.g., After eating, During stress" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} rows={2}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details..." className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 font-semibold shadow-sm hover:shadow-md transition-all">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}

        {symptoms.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700">No symptoms recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((s) => (
              <div key={s.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{s.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${s.severity > 6 ? 'bg-red-100 text-red-800' : s.severity > 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {s.severity}/10
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span><Clock className="h-3 w-3 inline" /> {s.duration}</span>
                      <span><Calendar className="h-3 w-3 inline" /> {s.frequency}</span>
                      <span>{format(s.timestamp, 'MMM d, yyyy')}</span>
                    </div>
                    {s.triggers && <p className="text-sm text-gray-700 mt-1">Triggers: {s.triggers}</p>}
                    {s.notes && <p className="text-sm bg-gray-50 p-2 rounded mt-2">{s.notes}</p>}
                  </div>
                  <button onClick={() => setSymptoms(symptoms.filter(x => x.id !== s.id))} className="text-gray-400 hover:text-red-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
