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
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-2.5 rounded-xl shadow-glow group-hover:shadow-glow-lg transition-all">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Medical Advocacy Assistant</h1>
                  <p className="text-sm text-gray-600 font-medium">Your healthcare companion</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-5">
              <Link href="/" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-pink-600 transition-colors font-medium">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                <Clock className="h-4 w-4" />
                <span>Beta</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-0.5 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3.5 text-base font-semibold transition-all whitespace-nowrap relative
                    ${activeTab === tab.id
                      ? 'text-pink-700'
                      : 'text-gray-700 hover:text-gray-900'}`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span className="font-body">{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-full"></span>
                  )}
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

      <footer className="bg-white/90 backdrop-blur-md border-t border-pink-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <span>This tool is not a substitute for professional medical advice</span>
            </div>
            <div className="text-gray-500">© 2025 Medical Advocacy Assistant</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
