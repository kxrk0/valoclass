'use client'

import Link from 'next/link'
import { Users, Trophy, Target, Heart } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

const CommunityHero = () => {
  const t = useTranslation()
  
  const stats = [
    {
      icon: Users,
      value: '25,000+',
      label: t.community.hero.stats.activeMembers,
      color: 'text-blue-400'
    },
    {
      icon: Target,
      value: '5,200+',
      label: t.community.hero.stats.lineupsShared,
      color: 'text-red-400'
    },
    {
      icon: Trophy,
      value: '12,800+',
      label: t.community.hero.stats.crosshairsCreated,
      color: 'text-yellow-400'
    },
    {
      icon: Heart,
      value: '89,000+',
      label: t.community.hero.stats.likesGiven,
      color: 'text-pink-400'
    }
  ]

  return (
    <section className="relative py-16 px-4 bg-gradient-to-r from-gray-900/50 to-purple-900/30">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6">
            {t.community.hero.title.main}{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.community.hero.title.highlight}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            {t.community.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/register" className="btn btn-primary text-lg px-8 py-3">
              <Users size={20} />
              {t.community.hero.joinCommunity}
            </Link>
            <Link href="/community/discord" className="btn btn-secondary text-lg px-8 py-3">
              {t.community.hero.discordServer}
            </Link>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                    <Icon size={24} className={stat.color} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}

export default CommunityHero
