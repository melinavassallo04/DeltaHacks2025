'use client'

import { Stethoscope, MessageSquare, Calendar, CheckCircle2, FileText, Search, Users, Heart, ArrowRight, Sparkles, Code, Sparkle } from 'lucide-react'
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
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-5 rounded-3xl shadow-glow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Heart className="h-14 w-14 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-pink-300 px-4 py-2 rounded-full mb-6 shadow-soft">
            <Sparkle className="h-4 w-4 text-pink-600" />
            <span className="text-sm font-bold text-pink-700">By Women, For Women</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-display font-black text-gray-900 mb-6 tracking-tighter text-balance">
            Your Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 animate-gradient">
              Advocacy Companion
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            Empowering you to navigate healthcare with confidence, clarity, and the tools you need to advocate for yourself.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-10 py-5 rounded-full text-lg font-bold shadow-glow-lg hover:from-pink-500 hover:to-rose-600 transition-all transform hover:scale-110 hover:shadow-glow active:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white/60 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Why We Exist</h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 font-medium">
            As three women studying computer science, we've seen firsthand how healthcare systems can fail women. 
            Too often, our concerns are dismissed, our pain is minimized, and our voices go unheard.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 font-medium">
            We created this tool because we believe every woman deserves to be heard, understood, and taken seriously 
            in her healthcare journey. This is our way of using technology to empower women to advocate for themselves.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            <strong className="text-pink-600">By women, for women.</strong> Because your health matters, and your voice deserves to be heard.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything You Need</h2>
          <p className="text-lg md:text-xl text-gray-600 font-medium">Comprehensive tools to support your healthcare advocacy journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-7 shadow-soft hover:shadow-glow-lg transition-all border-2 border-pink-100 hover:border-pink-300 hover:-translate-y-2 group"
              >
                <div className="bg-gradient-to-br from-pink-300 to-rose-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-pink-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border-2 border-pink-100">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-pink-200 to-rose-300 p-3 rounded-xl flex-shrink-0">
                <Code className="h-6 w-6 text-pink-700" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Our Story</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-medium text-lg">
                  As three friends studying computer science, we noticed a gap in healthcare technology. 
                  While there are many health apps, few are designed specifically with women's unique healthcare 
                  challenges in mind—especially the all-too-common experience of being dismissed or not taken seriously.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium text-lg">
                  We decided to build something different: a tool that empowers women to advocate for themselves, 
                  track their health with precision, and ensure their voices are heard in medical settings. 
                  This project represents our commitment to using our technical skills to create meaningful change 
                  for women everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ready to Take Control?</h2>
          <p className="text-xl md:text-2xl text-pink-50 mb-8 font-medium">
            Start tracking your health, preparing for appointments, and advocating for yourself today.
          </p>
          <Link
            href="/app"
            className="bg-white text-pink-600 px-10 py-5 rounded-full text-lg font-bold shadow-glow-lg hover:bg-pink-50 transition-all transform hover:scale-110 active:scale-105 inline-flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-pink-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">© 2025 Medical Advocacy Assistant</p>
          <p className="mb-2">Built with ❤️ by three women in computer science</p>
          <p className="text-xs mt-2">This tool is not a substitute for professional medical advice</p>
        </div>
      </footer>
    </div>
  )
}
