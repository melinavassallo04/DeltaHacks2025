'use client'

import { useState } from 'react'
import { Pill, Plus, X, Calendar, Download, Copy, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage, copyToClipboard, formatDate } from '@/lib/export'

interface Treatment {
  id: string
  name: string
  type: string
  startDate: Date
  dosage: string
  frequency: string
  notes: string
  status: 'active' | 'completed' | 'discontinued'
}

export default function TreatmentTracker() {
  const [treatments, setTreatments] = useLocalStorage<Treatment[]>('treatments', [])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', type: 'medication', startDate: format(new Date(), 'yyyy-MM-dd'),
    dosage: '', frequency: '', notes: '', status: 'active' as Treatment['status']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTreatments([{ id: Date.now().toString(), ...formData, startDate: new Date(formData.startDate) }, ...treatments])
    setFormData({ name: '', type: 'medication', startDate: format(new Date(), 'yyyy-MM-dd'), dosage: '', frequency: '', notes: '', status: 'active' })
    setShowForm(false)
  }

  const handleExportPDF = () => {
    const content = treatments.map(t => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${t.name}</span>
          <span class="badge">${t.status}</span>
        </div>
        <div class="meta"><strong>Type:</strong> ${t.type} | <strong>Started:</strong> ${formatDate(t.startDate)}</div>
        ${t.dosage ? `<div class="meta"><strong>Dosage:</strong> ${t.dosage}</div>` : ''}
        ${t.frequency ? `<div class="meta"><strong>Frequency:</strong> ${t.frequency}</div>` : ''}
        ${t.notes ? `<div class="meta"><strong>Notes:</strong> ${t.notes}</div>` : ''}
      </div>
    `).join('')
    exportToPrintablePage('Treatment Report', `<div class="section"><h2>Treatments (${treatments.length})</h2>${content}</div>`)
  }

  const [copied, setCopied] = useState(false)
  
  const handleCopyToClipboard = async () => {
    const data = treatments.map(t => ({
      Name: t.name,
      Type: t.type,
      Status: t.status,
      'Start Date': new Date(t.startDate),
      Dosage: t.dosage,
      Frequency: t.frequency,
      Notes: t.notes
    }))
    const success = await copyToClipboard(data)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Treatment Tracker</h2>
            <p className="text-gray-600 mt-1">Monitor treatment effectiveness</p>
          </div>
          <div className="flex items-center space-x-2">
            {treatments.length > 0 && (
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
              <Plus className="h-5 w-5" /><span>Add Treatment</span>
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="medication">Medication</option>
                  <option value="therapy">Therapy</option>
                  <option value="procedure">Procedure</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input type="text" value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <input type="text" value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} rows={2}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-rose-600">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}

        {treatments.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No treatments tracked yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {treatments.map((t) => (
              <div key={t.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{t.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        t.status === 'active' ? 'bg-green-100 text-green-800' :
                        t.status === 'completed' ? 'bg-pink-100 text-pink-800' : 'bg-red-100 text-red-800'}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><Calendar className="h-3 w-3 inline" /> Started: {format(t.startDate, 'MMM d, yyyy')}</p>
                      {t.dosage && <p>Dosage: {t.dosage}</p>}
                      {t.frequency && <p>Frequency: {t.frequency}</p>}
                      {t.notes && <p className="mt-2">{t.notes}</p>}
                    </div>
                  </div>
                  <button onClick={() => setTreatments(treatments.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-red-600">
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
