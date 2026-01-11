'use client'

import { useState } from 'react'
import { Calendar, Plus, FileText, Stethoscope, Pill, X, Download, Copy, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage, copyToClipboard, formatDate } from '@/lib/export'

interface TimelineEvent {
  id: string
  date: Date
  type: 'appointment' | 'diagnosis' | 'treatment' | 'test'
  title: string
  description: string
  provider?: string
}

export default function MedicalTimeline() {
  const [events, setEvents] = useLocalStorage<TimelineEvent[]>('timeline-events', [])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'), type: 'appointment' as TimelineEvent['type'],
    title: '', description: '', provider: ''
  })

  const icons = { appointment: Calendar, diagnosis: Stethoscope, treatment: Pill, test: FileText }
  const colors = { appointment: 'bg-pink-100 text-pink-800', diagnosis: 'bg-rose-100 text-rose-800',
    treatment: 'bg-green-100 text-green-800', test: 'bg-orange-100 text-orange-800' }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEvents([...events, { id: Date.now().toString(), ...formData, date: new Date(formData.date) }]
      .sort((a, b) => b.date.getTime() - a.date.getTime()))
    setFormData({ date: format(new Date(), 'yyyy-MM-dd'), type: 'appointment', title: '', description: '', provider: '' })
    setShowForm(false)
  }

  const handleExportPDF = () => {
    const content = events.map(e => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${e.title}</span>
          <span class="badge">${e.type}</span>
        </div>
        <div class="meta"><strong>Date:</strong> ${formatDate(e.date)}</div>
        ${e.provider ? `<div class="meta"><strong>Provider:</strong> ${e.provider}</div>` : ''}
        <div class="meta"><strong>Details:</strong> ${e.description}</div>
      </div>
    `).join('')
    exportToPrintablePage('Medical Timeline', `<div class="section"><h2>Timeline Events (${events.length})</h2>${content}</div>`)
  }

  const [copied, setCopied] = useState(false)
  
  const handleCopyToClipboard = async () => {
    const data = events.map(e => ({
      Date: new Date(e.date),
      Type: e.type,
      Title: e.title,
      Provider: e.provider || '',
      Description: e.description
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Medical Timeline</h2>
            <p className="text-gray-600 mt-1.5 text-sm">Track your complete medical history</p>
          </div>
          <div className="flex items-center space-x-2">
            {events.length > 0 && (
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
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-rose-600">
              <Plus className="h-5 w-5" /><span>Add Event</span>
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="appointment">Appointment</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="treatment">Treatment</option>
                  <option value="test">Test</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual physical" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input type="text" value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="Dr. Smith" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={formData.description} rows={2}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 font-semibold shadow-sm hover:shadow-md transition-all">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700">No events yet</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {events.map((event) => {
                const Icon = icons[event.type]
                return (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${colors[event.type]} border-4 border-white shadow`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 bg-white border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-sm text-gray-500">{format(event.date, 'MMM d, yyyy')}</span>
                          <h3 className="font-semibold">{event.title}</h3>
                          {event.provider && <p className="text-sm text-gray-600">Provider: {event.provider}</p>}
                          <p className="text-gray-700 mt-1">{event.description}</p>
                        </div>
                        <button onClick={() => setEvents(events.filter(e => e.id !== event.id))} className="text-gray-400 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
