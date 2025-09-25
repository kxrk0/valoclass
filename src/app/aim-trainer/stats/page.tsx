'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AimTrainerStats from '@/components/aim-trainer/AimTrainerStats'

export default function AimTrainerStatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 0, 84, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 84, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 84, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-flow 30s linear infinite'
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <div className={`w-2 h-2 ${i % 4 === 0 ? 'bg-red-400/30' : i % 4 === 1 ? 'bg-cyan-400/30' : i % 4 === 2 ? 'bg-purple-400/30' : 'bg-pink-400/30'} rounded-full`} />
            </div>
          ))}
        </div>
      </div>

      <Header />
      <div className="relative z-10 pt-20">
        <AimTrainerStats />
      </div>
      <Footer />
    </div>
  )
}
