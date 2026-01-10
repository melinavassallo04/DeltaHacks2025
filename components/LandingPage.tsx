'use client'

import { Stethoscope, MessageSquare, Calendar, CheckCircle2, FileText, Search, Users, Heart, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Feature {
  icon: any
  title: string
  description: string
}

export default function LandingPage() {
  const features: Feature[] = [
    {
      icon: Stethoscope,
      title: 'Symptom Tracker',
      description: 'Document symptoms with precision and track patterns over time'
    },
    {
      icon: MessageSquare,
      title: 'Question Generator',
      description: 'Get personalized questions to ask your doctor at appointments'
    },
    {
      icon: Calendar,
      title: 'Medical Timeline',
      description: 'Track your complete medical history in one place'
    },
    {
      icon: CheckCircle2,
      title: 'Treatment Tracker',
      description: 'Monitor treatments and their effectiveness'
    },
    {
      icon: FileText,
      title: 'Talking Points',
      description: 'Powerful advocacy statements to ensure your voice is heard'
    },
    {
      icon: Search,
      title: 'Note Analyzer',
      description: 'Review and analyze your medical notes for completeness'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with others on similar healthcare journeys'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-pink-300 to-rose-400 p-4 rounded-2xl shadow-lg">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Advocacy Companion
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Empowering you to navigate healthcare with confidence, clarity, and the tools you need to advocate for yourself.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-rose-600 transition-all transform hover:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white/60 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Exist</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Healthcare can feel overwhelming, especially when your concerns are dismissed or minimized. 
            We believe every person deserves to be heard, understood, and taken seriously in their healthcare journey.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is to empower you with the tools, knowledge, and confidence to advocate for yourself 
            and ensure your healthcare needs are met with the attention and care you deserve.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-lg text-gray-600">Comprehensive tools to support your healthcare advocacy journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-pink-100"
              >
                <div className="bg-gradient-to-br from-pink-200 to-rose-300 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-pink-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-pink-50 mb-8">
            Start tracking your health, preparing for appointments, and advocating for yourself today.
          </p>
          <Link
            href="/app"
            className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-50 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-pink-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>© 2025 Medical Advocacy Assistant - Empowering Your Healthcare Journey</p>
          <p className="mt-2 text-xs">This tool is not a substitute for professional medical advice</p>
        </div>
      </footer>
    </div>
  )
}
