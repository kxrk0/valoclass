'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Target, Clock, Zap, Trophy, Calendar, BarChart3, LineChart } from 'lucide-react'

interface StatData {
  mode: string
  score: number
  accuracy: number
  avgReactionTime: number
  date: string
  duration: number
  targetsHit: number
  targetsMissed: number
}

interface WeeklyStats {
  week: string
  totalScore: number
  avgAccuracy: number
  gamesPlayed: number
  bestScore: number
}

const mockStats: StatData[] = [
  {
    mode: 'Gridshot',
    score: 89,
    accuracy: 87.5,
    avgReactionTime: 245,
    date: '2024-01-15',
    duration: 60,
    targetsHit: 35,
    targetsMissed: 5
  },
  {
    mode: 'Tracking',
    score: 92,
    accuracy: 91.2,
    avgReactionTime: 189,
    date: '2024-01-15',
    duration: 90,
    targetsHit: 42,
    targetsMissed: 4
  },
  {
    mode: 'Flicking',
    score: 76,
    accuracy: 78.9,
    avgReactionTime: 198,
    date: '2024-01-14',
    duration: 60,
    targetsHit: 30,
    targetsMissed: 8
  },
  {
    mode: 'Precision',
    score: 64,
    accuracy: 85.3,
    avgReactionTime: 312,
    date: '2024-01-14',
    duration: 120,
    targetsHit: 29,
    targetsMissed: 5
  }
]

const weeklyStats: WeeklyStats[] = [
  { week: 'This Week', totalScore: 1247, avgAccuracy: 84.2, gamesPlayed: 23, bestScore: 98 },
  { week: 'Last Week', totalScore: 1189, avgAccuracy: 82.7, gamesPlayed: 19, bestScore: 94 },
  { week: '2 Weeks Ago', totalScore: 1098, avgAccuracy: 81.1, gamesPlayed: 17, bestScore: 89 },
  { week: '3 Weeks Ago', totalScore: 987, avgAccuracy: 79.8, gamesPlayed: 15, bestScore: 87 }
]

export default function AimTrainerStats() {
  const [selectedMode, setSelectedMode] = useState<string>('All')
  const [timeRange, setTimeRange] = useState<string>('7days')
  const [isVisible, setIsVisible] = useState(false)

  const gameModes = ['All', 'Gridshot', 'Tracking', 'Flicking', 'Precision']
  const timeRanges = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '3months', label: '3 Months' },
    { value: 'all', label: 'All Time' }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredStats = mockStats.filter(stat => 
    selectedMode === 'All' || stat.mode === selectedMode
  )

  const calculateOverallStats = () => {
    if (filteredStats.length === 0) return null

    const totalGames = filteredStats.length
    const avgScore = filteredStats.reduce((sum, stat) => sum + stat.score, 0) / totalGames
    const avgAccuracy = filteredStats.reduce((sum, stat) => sum + stat.accuracy, 0) / totalGames
    const avgReactionTime = filteredStats.reduce((sum, stat) => sum + stat.avgReactionTime, 0) / totalGames
    const bestScore = Math.max(...filteredStats.map(stat => stat.score))
    const totalTargetsHit = filteredStats.reduce((sum, stat) => sum + stat.targetsHit, 0)

    return {
      totalGames,
      avgScore: Math.round(avgScore),
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      avgReactionTime: Math.round(avgReactionTime),
      bestScore,
      totalTargetsHit
    }
  }

  const overallStats = calculateOverallStats()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Performance <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Track your improvement and analyze your aim training performance
        </p>
      </div>

      {/* Filters */}
      <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Game Mode Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Game Mode</label>
              <div className="flex flex-wrap gap-2">
                {gameModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedMode === mode
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats Cards */}
      {overallStats && (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-green-500/20 mb-3">
              <Trophy className="text-green-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-1">{overallStats.avgScore}</h3>
            <p className="text-gray-400 text-sm">Avg Score</p>
          </div>

          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-purple-500/20 mb-3">
              <Target className="text-purple-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-purple-400 mb-1">{overallStats.avgAccuracy}%</h3>
            <p className="text-gray-400 text-sm">Avg Accuracy</p>
          </div>

          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-cyan-500/20 mb-3">
              <Zap className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-1">{overallStats.avgReactionTime}ms</h3>
            <p className="text-gray-400 text-sm">Avg Reaction</p>
          </div>

          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 0, 84, 0.3)',
              boxShadow: '0 0 20px rgba(255, 0, 84, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-red-500/20 mb-3">
              <TrendingUp className="text-red-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-red-400 mb-1">{overallStats.bestScore}</h3>
            <p className="text-gray-400 text-sm">Best Score</p>
          </div>

          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-pink-500/20 mb-3">
              <Calendar className="text-pink-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-pink-400 mb-1">{overallStats.totalGames}</h3>
            <p className="text-gray-400 text-sm">Games Played</p>
          </div>

          <div 
            className="p-6 rounded-2xl text-center transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)'
            }}
          >
            <div className="inline-flex p-3 rounded-xl bg-yellow-500/20 mb-3">
              <Target className="text-yellow-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-1">{overallStats.totalTargetsHit}</h3>
            <p className="text-gray-400 text-sm">Targets Hit</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className={`grid gap-8 lg:grid-cols-2 mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        {/* Weekly Progress Chart */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="text-cyan-400" size={24} />
            Weekly Progress
          </h3>
          <div className="space-y-4">
            {weeklyStats.map((week, index) => (
              <div key={week.week} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">{week.week}</span>
                  <span className="text-cyan-400 font-bold">{week.totalScore}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(week.totalScore / Math.max(...weeklyStats.map(w => w.totalScore))) * 100}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{week.avgAccuracy}% avg accuracy</span>
                  <span>{week.gamesPlayed} games</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Games */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <LineChart className="text-purple-400" size={24} />
            Recent Games
          </h3>
          <div className="space-y-4">
            {filteredStats.slice(0, 4).map((stat, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-gray-900/30 border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{stat.mode}</h4>
                    <p className="text-gray-400 text-sm">{new Date(stat.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold text-lg">{stat.score}</p>
                    <p className="text-purple-400 text-sm">{stat.accuracy}%</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{stat.targetsHit} hits / {stat.targetsMissed} misses</span>
                  <span>{stat.avgReactionTime}ms avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Comparison */}
      <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <div 
          className="p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Mode <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Comparison</span>
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['Gridshot', 'Tracking', 'Flicking', 'Precision'].map((mode, index) => {
              const modeStats = mockStats.filter(stat => stat.mode === mode)
              const avgScore = modeStats.reduce((sum, stat) => sum + stat.score, 0) / modeStats.length || 0
              const avgAccuracy = modeStats.reduce((sum, stat) => sum + stat.accuracy, 0) / modeStats.length || 0
              
              const colors = [
                'from-cyan-500 to-blue-500',
                'from-purple-500 to-pink-500', 
                'from-red-500 to-orange-500',
                'from-yellow-500 to-green-500'
              ]

              return (
                <div 
                  key={mode}
                  className="text-center p-6 rounded-xl bg-gray-900/30 border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-r ${colors[index]}`}>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{mode}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-cyan-400">{Math.round(avgScore)}</p>
                      <p className="text-xs text-gray-400">Avg Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-purple-400">{Math.round(avgAccuracy * 10) / 10}%</p>
                      <p className="text-xs text-gray-400">Avg Accuracy</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
