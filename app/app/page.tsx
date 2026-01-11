'use client'

import { useState } from 'react'
import { Stethoscope, FileText, Calendar, MessageSquare, Users, AlertCircle, CheckCircle2, Search, Clock, Heart, Home } from 'lucide-react'
import SymptomTracker from '@/components/SymptomTracker'
import QuestionGenerator from '@/components/QuestionGenerator'
import MedicalTimeline from '@/components/MedicalTimeline'
import TreatmentTracker from '@/components/TreatmentTracker'
import TalkingPoints from '@/components/TalkingPoints'
import NoteAnalyzer from '@/components/NoteAnalyzer'
import CommunityConnector from '@/components/CommunityConnector'
import Link from 'next/link'

type Tab = 'symptoms' | 'questions' | 'timeline' | 'treatments' | 'talking-points' | 'notes' | 'community'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<Tab>('symptoms')

  const tabs = [
    { id: 'symptoms' as Tab, label: 'Symptom Tracker', icon: Stethoscope },
    { id: 'questions' as Tab, label: 'Question Generator', icon: MessageSquare },
    { id: 'timeline' as Tab, label: 'Medical Timeline', icon: Calendar },
    { id: 'treatments' as Tab, label: 'Treatment Tracker', icon: CheckCircle2 },
    { id: 'talking-points' as Tab, label: 'Talking Points', icon: FileText },
    { id: 'notes' as Tab, label: 'Note Analyzer', icon: Search },
    { id: 'community' as Tab, label: 'Community', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Medical Advocacy Assistant</h1>
                  <p className="text-sm text-gray-600">Your healthcare companion</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Beta Version</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-pink-400 text-pink-600 bg-pink-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-pink-200'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={activeTab === 'symptoms' ? '' : 'hidden'}><SymptomTracker /></div>
        <div className={activeTab === 'questions' ? '' : 'hidden'}><QuestionGenerator /></div>
        <div className={activeTab === 'timeline' ? '' : 'hidden'}><MedicalTimeline /></div>
        <div className={activeTab === 'treatments' ? '' : 'hidden'}><TreatmentTracker /></div>
        <div className={activeTab === 'talking-points' ? '' : 'hidden'}><TalkingPoints /></div>
        <div className={activeTab === 'notes' ? '' : 'hidden'}><NoteAnalyzer /></div>
        <div className={activeTab === 'community' ? '' : 'hidden'}><CommunityConnector /></div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>This tool is not a substitute for professional medical advice</span>
            </div>
            <div>© 2025 Medical Advocacy Assistant - Beta</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
