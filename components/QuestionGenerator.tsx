'use client'

import { useState } from 'react'
import { MessageSquare, Copy, CheckCircle2, Download } from 'lucide-react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { exportToPrintablePage } from '@/lib/export'

interface Question {
  id: string
  text: string
  category: string
  priority: 'high' | 'medium' | 'low'
}

export default function QuestionGenerator() {
  const [symptoms, setSymptoms] = useLocalStorage('question-symptoms', '')
  const [concerns, setConcerns] = useLocalStorage('question-concerns', '')
  const [appointmentType, setAppointmentType] = useLocalStorage('appointment-type', 'general')
  const [questions, setQuestions] = useLocalStorage<Question[]>('generated-questions', [])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Static template questions based on appointment type
  const getTemplateQuestions = (): Question[] => {
    const baseQuestions: Question[] = [
      { id: '1', text: 'What tests do you recommend to diagnose this?', category: 'Testing', priority: 'high' },
      { id: '2', text: 'What are the possible causes of these symptoms?', category: 'Diagnosis', priority: 'high' },
      { id: '3', text: 'What treatment options are available?', category: 'Treatment', priority: 'high' },
      { id: '4', text: 'What are the risks and benefits of each treatment?', category: 'Treatment', priority: 'high' },
      { id: '5', text: 'How long will it take to see improvement?', category: 'Treatment', priority: 'medium' },
      { id: '6', text: 'What should I do if symptoms worsen?', category: 'Follow-up', priority: 'high' },
      { id: '7', text: 'When should I follow up?', category: 'Follow-up', priority: 'medium' },
      { id: '8', text: 'Can you document this in my chart?', category: 'Advocacy', priority: 'high' },
    ]

    // Add appointment-specific questions
    if (appointmentType === 'specialist') {
      baseQuestions.push(
        { id: '9', text: 'How does this relate to my other conditions?', category: 'Diagnosis', priority: 'medium' },
        { id: '10', text: 'Should I get a second opinion?', category: 'Advocacy', priority: 'low' }
      )
    }

    if (appointmentType === 'second-opinion') {
      baseQuestions.push(
        { id: '9', text: 'How does your assessment differ from my previous doctor?', category: 'Diagnosis', priority: 'high' },
        { id: '10', text: 'What additional information would help you make a diagnosis?', category: 'Testing', priority: 'high' }
      )
    }

    return baseQuestions
  }

  const handleGenerate = () => {
    if (!symptoms.trim() && !concerns.trim()) {
      return
    }
    // Use template questions - personalized based on appointment type
    setQuestions(getTemplateQuestions())
  }

  const handleExportPDF = () => {
    const grouped = questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = []
      acc[q.category].push(q)
      return acc
    }, {} as Record<string, typeof questions>)
    
    const content = Object.entries(grouped).map(([category, qs]) => `
      <h3>${category}</h3>
      ${qs.map(q => `
        <div class="question-item">
          <span class="priority-${q.priority}">[${q.priority.toUpperCase()}]</span> ${q.text}
        </div>
      `).join('')}
    `).join('')
    
    exportToPrintablePage('Questions for My Appointment', `
      <div class="section">
        <p><strong>Appointment Type:</strong> ${appointmentType}</p>
        ${symptoms ? `<p><strong>Symptoms:</strong> ${symptoms}</p>` : ''}
        ${concerns ? `<p><strong>Concerns:</strong> ${concerns}</p>` : ''}
      </div>
      <div class="section"><h2>Questions to Ask (${questions.length})</h2>${content}</div>
    `)
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Question Generator</h2>
        <p className="text-gray-600 mb-6 text-sm">Get helpful questions for your appointment</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
            <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg">
              <option value="general">General Consultation</option>
              <option value="specialist">Specialist Visit</option>
              <option value="second-opinion">Second Opinion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Symptoms</label>
            <input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., Fatigue, Joint pain, Headaches" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Concerns</label>
            <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} rows={3}
              placeholder="e.g., Symptoms dismissed before, worried about X..." className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <button onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-lg hover:from-pink-600 hover:to-rose-600 flex items-center justify-center space-x-2 font-semibold shadow-sm hover:shadow-md transition-all">
            <MessageSquare className="h-5 w-5" />
            <span>Show Questions</span>
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{questions.length} Questions to Ask</h3>
            <button onClick={handleExportPDF} title="Export as PDF"
              className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
              <Download className="h-4 w-4" /><span className="text-sm">Export PDF</span>
            </button>
          </div>
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                      q.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      q.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-pink-100 text-pink-800'}`}>
                      {q.category}
                    </span>
                    <p className="mt-2 text-gray-900">{q.text}</p>
                  </div>
                  <button onClick={() => copy(q.text, q.id)} className="text-gray-400 hover:text-pink-600 ml-4">
                    {copiedId === q.id ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
            <MessageSquare className="h-5 w-5 text-pink-600 inline mr-2" />
            <span className="text-sm text-pink-900 font-medium">Tip:</span>
            <span className="text-sm text-pink-700 ml-1">Bring this list to your appointment!</span>
          </div>
        </div>
      )}
    </div>
  )
}
