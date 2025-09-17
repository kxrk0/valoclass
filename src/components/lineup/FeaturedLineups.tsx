'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Play, Heart, Eye, TrendingUp, Award } from 'lucide-react'
import type { Lineup } from '@/types'

// Mock featured lineups data
const mockFeaturedLineups: Lineup[] = [
  {
    id: '1',
    title: 'Viper Bind A Site One-Way',
    description: 'Professional one-way smoke setup that gives you massive advantage on A site retakes. Used by pro teams worldwide.',
    agent: 'Viper',
    ability: 'Poison Cloud',
    map: 'Bind',
    side: 'defender',
    position: { x: 150, y: 200, angle: 45, description: 'From CT spawn' },
    instructions: [
      'Position at CT spawn corner',
      'Aim at the lamp post tip',
      'Throw with full power',
      'Activate after plant'
    ],
    images: ['/lineups/viper-bind-featured-1.jpg', '/lineups/viper-bind-featured-2.jpg'],
    videoUrl: 'https://youtube.com/watch?v=featured1',
    createdBy: 'ProPlayer',
    createdAt: new Date('2024-01-15'),
    tags: ['smoke', 'one-way', 'retake', 'pro'],
    likes: 456,
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'Sova Ascent Mid Recon Setup',
    description: 'Complete mid control package with multiple recon positions. Essential for competitive play.',
    agent: 'Sova',
    ability: 'Recon Bolt',
    map: 'Ascent',
    side: 'attacker',
    position: { x: 300, y: 250, angle: 30, description: 'From mid market' },
    instructions: [
      'Clear market first',
      'Position behind cover',
      'Use double bounce setup',
      'Coordinate with team'
    ],
    images: ['/lineups/sova-ascent-featured-1.jpg'],
    createdBy: 'SovaMain',
    createdAt: new Date('2024-01-12'),
    tags: ['recon', 'mid-control', 'competitive', 'pro'],
    likes: 234,
    difficulty: 'hard'
  },
  {
    id: '3',
    title: 'Sage Haven C Long Wall',
    description: 'Game-changing wall placement that completely shuts down C long pushes.',
    agent: 'Sage',
    ability: 'Barrier Orb',
    map: 'Haven',
    side: 'defender',
    position: { x: 450, y: 100, angle: 90, description: 'C site default' },
    instructions: [
      'Position at C site',
      'Wait for enemy contact',
      'Place wall at chokepoint',
      'Fall back to site'
    ],
    images: ['/lineups/sage-haven-featured-1.jpg', '/lineups/sage-haven-featured-2.jpg'],
    createdBy: 'SageExpert',
    createdAt: new Date('2024-01-10'),
    tags: ['wall', 'stall', 'defensive', 'haven'],
    likes: 189,
    difficulty: 'easy'
  }
]

const FeaturedLineups = () => {
  const [featuredLineups, setFeaturedLineups] = useState<Lineup[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setFeaturedLineups(mockFeaturedLineups)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Auto-slide carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredLineups.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [featuredLineups.length])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'hard': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getAgentColor = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'viper': return 'text-green-400'
      case 'sova': return 'text-blue-400'
      case 'sage': return 'text-cyan-400'
      case 'omen': return 'text-purple-400'
      case 'jett': return 'text-white'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (featuredLineups.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Featured Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-red-600 px-4 py-2 rounded-full">
          <Star size={20} className="text-white" />
          <span className="font-semibold text-white">Featured Lineups</span>
        </div>
        <span className="text-gray-400 text-sm">Hand-picked by pros</span>
      </div>

      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredLineups.map((lineup, index) => (
            <div key={lineup.id} className="w-full flex-shrink-0">
              <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-yellow-500/20"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/valorant-pattern.svg')] opacity-5"></div>
                </div>

                <div className="relative p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className="space-y-6">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAgentColor(lineup.agent)} bg-white/10`}>
                          {lineup.agent}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium text-blue-400 bg-blue-900/20">
                          {lineup.map}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(lineup.difficulty)}`}>
                          {lineup.difficulty}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3 leading-tight">
                          {lineup.title}
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {lineup.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-red-400">
                          <Heart size={16} />
                          <span>{lineup.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <Eye size={16} />
                          <span>{Math.floor(Math.random() * 5000 + 1000)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-400">
                          <TrendingUp size={16} />
                          <span>Trending</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {lineup.tags.slice(0, 4).map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4">
                        <Link 
                          href={`/lineups/${lineup.id}`}
                          className="btn btn-primary flex items-center gap-2"
                        >
                          <Play size={18} />
                          Watch Tutorial
                        </Link>
                        <button className="btn btn-secondary flex items-center gap-2">
                          <Heart size={18} />
                          Save
                        </button>
                      </div>

                      {/* Creator */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <Award size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Created by</div>
                          <div className="font-medium text-white">{lineup.createdBy}</div>
                        </div>
                      </div>
                    </div>

                    {/* Visual */}
                    <div className="relative">
                      <div className="aspect-video bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 group">
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                          <Play size={48} className="text-white/60 group-hover:text-yellow-400 transition-colors duration-300 group-hover:scale-110" />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                          
                          {/* Corner Badge */}
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            FEATURED
                          </div>
                        </div>
                      </div>

                      {/* Floating Stats */}
                      <div className="absolute -bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-center">
                          <div className="text-yellow-400 font-semibold">{lineup.difficulty}</div>
                          <div className="text-xs text-gray-400">Difficulty</div>
                        </div>
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-center">
                          <div className="text-green-400 font-semibold">{lineup.instructions.length}</div>
                          <div className="text-xs text-gray-400">Steps</div>
                        </div>
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-center">
                          <div className="text-blue-400 font-semibold">{lineup.side}</div>
                          <div className="text-xs text-gray-400">Side</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredLineups.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-yellow-400 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredLineups.length) % featuredLineups.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredLineups.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredLineups.map((lineup, index) => (
          <Link
            key={lineup.id}
            href={`/lineups/${lineup.id}`}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              index === currentSlide
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{lineup.title}</div>
                <div className="text-sm text-gray-400">{lineup.agent} • {lineup.map}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FeaturedLineups