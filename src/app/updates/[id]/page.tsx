'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink, Newspaper, Share2, MessageCircle, ThumbsUp, Bookmark, Twitter, Facebook, Link as LinkIcon, User, Eye } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

interface ValorantUpdate {
  id: string
  title: string
  version: string
  date: string
  category: 'Agent Updates' | 'Map Changes' | 'Weapon Changes' | 'System Updates' | 'Bug Fixes' | 'Competitive Updates'
  summary: string
  content: string
  imageUrl?: string
  officialUrl: string
  tags: string[]
  isNew?: boolean
}

const UpdateDetailPage = () => {
  const { id } = useParams()
  const [update, setUpdate] = useState<ValorantUpdate | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(42)
  const [isLiked, setIsLiked] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`/api/valorant-updates?lang=${language}`)
        const data = await response.json()
        
        if (data.success) {
          const foundUpdate = data.updates.find((u: ValorantUpdate) => u.id === id)
          setUpdate(foundUpdate || null)
        }
      } catch (error) {
        console.error('Failed to fetch update:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUpdate()
    }
  }, [id, language])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = update?.title || 'VALORANT Update'
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  const toggleBookmark = () => setIsBookmarked(!isBookmarked)
  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="w-32 h-8 bg-gray-700 rounded mb-6"></div>
              <div className="w-3/4 h-12 bg-gray-700 rounded mb-4"></div>
              <div className="w-1/2 h-6 bg-gray-700 rounded mb-8"></div>
              <div className="w-full h-64 bg-gray-700 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-700 rounded"></div>
                <div className="w-5/6 h-4 bg-gray-700 rounded"></div>
                <div className="w-4/5 h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!update) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
              <Newspaper className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Update Not Found</h1>
              <p className="text-gray-400 mb-6">The update you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link
                href="/updates"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Updates</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Gaming Site Layout */}
      <div className="pt-20">
        {/* Breadcrumb Bar */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-slate-500">/</span>
              <Link href="/updates" className="text-slate-400 hover:text-white transition-colors">
                Updates
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-white font-medium truncate">{update.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article Content */}
            <main className="flex-1 max-w-4xl">
              {/* Article Header */}
              <header className="mb-8">
                {/* Category Tag */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                    {update.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {update.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                  {update.summary}
                </p>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-700">
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>VALORANT Team</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(update.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>2.4K views</span>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                        isLiked ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{likes}</span>
                    </button>
                    <button
                      onClick={toggleBookmark}
                      className={`p-2 rounded transition-colors ${
                        isBookmarked ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-slate-700 text-slate-300 hover:bg-blue-800 hover:text-white rounded transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="p-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {update.imageUrl && (
                <div className="mb-8">
                  <img
                    src={update.imageUrl}
                    alt={update.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <article className="prose prose-lg prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed space-y-6">
                  {update.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-l-4 border-red-500 pl-4">
                          {paragraph.replace(/\*\*/g, '')}
                        </h2>
                      )
                    } else if (paragraph.includes('•')) {
                      const lines = paragraph.split('\n')
                      return (
                        <div key={index} className="space-y-3">
                          {lines.map((line, lineIndex) => {
                            if (line.trim().startsWith('•')) {
                              const content = line.replace('•', '').trim()
                              const isBold = content.startsWith('**') && content.includes('**:')
                              if (isBold) {
                                const [boldPart, normalPart] = content.split('**:')
                                return (
                                  <div key={lineIndex} className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                      <strong className="text-white">{boldPart.replace('**', '')}</strong>
                                      <span className="text-slate-300">: {normalPart}</span>
                                    </span>
                                  </div>
                                )
                              } else {
                                return (
                                  <div key={lineIndex} className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-slate-300">{content}</span>
                                  </div>
                                )
                              }
                            } else if (line.trim().match(/^\d+\./)) {
                              return (
                                <div key={lineIndex} className="flex items-start space-x-3 ml-4 bg-slate-800/30 p-3 rounded">
                                  <span className="text-red-400 font-bold min-w-0">{line.trim().split('.')[0]}.</span>
                                  <span className="text-slate-300">{line.trim().substring(line.trim().indexOf('.') + 1).trim()}</span>
                                </div>
                              )
                            } else {
                              return line.trim() ? (
                                <p key={lineIndex} className="text-slate-300">{line}</p>
                              ) : null
                            }
                          })}
                        </div>
                      )
                    } else {
                      return (
                        <p key={index} className="text-slate-300 text-lg leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    }
                  })}
                </div>
              </article>

              {/* Tags Section */}
              {update.tags && update.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {update.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Share this article</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Tweet</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <a
                      href={update.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Official Post</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12 pt-8 border-t border-slate-700">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-semibold text-white">Comments</h3>
                  <span className="text-slate-400">(12)</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">Join the discussion about this update</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors">
                    Add Comment
                  </button>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:w-80 xl:w-96">
              {/* Related Updates */}
              <div className="bg-slate-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Related Updates</h3>
                <div className="space-y-4">
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/80/60?random=10"
                        alt="Related update"
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          VALORANT Champions 2025 Bundle Preview
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/80/60?random=11"
                        alt="Related update"
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          Agent Balance Changes Coming Soon
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">1 week ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/80/60?random=12"
                        alt="Related update"
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          New Map Rotation Announced
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular This Week */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular This Week</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-red-400 font-bold text-lg">#1</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        Replay System Finally Here
                      </h4>
                      <p className="text-xs text-slate-400">15.2K views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-orange-400 font-bold text-lg">#2</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        New AFK Penalty System
                      </h4>
                      <p className="text-xs text-slate-400">12.8K views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-yellow-400 font-bold text-lg">#3</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        Mobile Verification Beta
                      </h4>
                      <p className="text-xs text-slate-400">9.1K views</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default UpdateDetailPage
