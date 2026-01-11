'use client'

import { useState } from 'react'
import { Users, MessageSquare, Search, Heart, Lock } from 'lucide-react'
import { format } from 'date-fns'

interface Post {
  id: string
  author: string
  date: Date
  title: string
  content: string
  category: string
  replies: number
  helpful: number
}

export default function CommunityConnector() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const posts: Post[] = [
    { id: '1', author: 'Sarah M.', date: new Date(2025, 0, 15), title: 'Finally got diagnosed after 2 years',
      content: 'After being told it was "just stress" for so long, I finally found a doctor who listened...',
      category: 'success-story', replies: 12, helpful: 45 },
    { id: '2', author: 'Anonymous', date: new Date(2025, 0, 14), title: 'How to prepare for a second opinion?',
      content: 'I\'m seeking a second opinion next week. What documents should I bring?',
      category: 'advice', replies: 8, helpful: 23 },
    { id: '3', author: 'Jessica K.', date: new Date(2025, 0, 13), title: 'Similar symptoms - anyone else?',
      content: 'Chronic fatigue, joint pain, brain fog. Has anyone had similar experiences?',
      category: 'support', replies: 15, helpful: 31 },
  ]

  const categories = [
    { id: 'all', label: 'All' }, { id: 'success-story', label: 'Success Stories' },
    { id: 'advice', label: 'Advice' }, { id: 'support', label: 'Support' }
  ]

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community</h2>
        <p className="text-gray-600 mb-6">Connect with others who understand your journey</p>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === c.id ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <Lock className="h-5 w-5 text-pink-600 inline mr-2" />
          <span className="text-sm text-pink-900">This is a safe, anonymous space.</span>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-medium">{post.author}</span>
              <span className="text-xs text-gray-500">{format(post.date, 'MMM d, yyyy')}</span>
              <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">{post.category}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1"><MessageSquare className="h-4 w-4" /><span>{post.replies}</span></span>
              <span className="flex items-center space-x-1"><Heart className="h-4 w-4" /><span>{post.helpful}</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
        <Users className="h-5 w-5 text-pink-600 inline mr-2" />
        <span className="text-sm font-medium text-pink-900">Beta Feature</span>
        <p className="text-sm text-pink-700 mt-1">Full community features coming soon!</p>
      </div>
    </div>
  )
}
