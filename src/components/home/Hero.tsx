'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Target, 
  Crosshair, 
  TrendingUp, 
  Search 
} from 'lucide-react'
import '@/styles/hero.scss'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleRiotLogin = async () => {
    try {
      window.location.href = '/api/auth/oauth/riot'
    } catch {
      // Handle error silently for production
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-particles">
        <div className="particle" style={{ left: '15.4%', top: '23.8%', animationDelay: '2.1s' }}></div>
        <div className="particle" style={{ left: '78.2%', top: '67.3%', animationDelay: '8.7s' }}></div>
        <div className="particle" style={{ left: '45.6%', top: '12.9%', animationDelay: '5.4s' }}></div>
        <div className="particle" style={{ left: '89.1%', top: '34.7%', animationDelay: '11.2s' }}></div>
        <div className="particle" style={{ left: '23.8%', top: '89.4%', animationDelay: '1.6s' }}></div>
        <div className="particle" style={{ left: '67.3%', top: '45.2%', animationDelay: '13.8s' }}></div>
        <div className="particle" style={{ left: '12.9%', top: '78.6%', animationDelay: '4.3s' }}></div>
        <div className="particle" style={{ left: '34.7%', top: '56.1%', animationDelay: '9.9s' }}></div>
        <div className="particle" style={{ left: '56.1%', top: '23.4%', animationDelay: '7.2s' }}></div>
        <div className="particle" style={{ left: '91.8%', top: '12.7%', animationDelay: '14.5s' }}></div>
        <div className="particle" style={{ left: '8.3%', top: '67.9%', animationDelay: '3.1s' }}></div>
        <div className="particle" style={{ left: '42.7%', top: '91.2%', animationDelay: '6.8s' }}></div>
        <div className="particle" style={{ left: '73.4%', top: '34.5%', animationDelay: '12.4s' }}></div>
        <div className="particle" style={{ left: '25.9%', top: '78.3%', animationDelay: '0.7s' }}></div>
        <div className="particle" style={{ left: '58.6%', top: '45.8%', animationDelay: '10.1s' }}></div>
        <div className="particle" style={{ left: '84.2%', top: '67.4%', animationDelay: '5.9s' }}></div>
        <div className="particle" style={{ left: '16.7%', top: '23.1%', animationDelay: '8.3s' }}></div>
        <div className="particle" style={{ left: '49.3%', top: '89.7%', animationDelay: '2.5s' }}></div>
        <div className="particle" style={{ left: '71.8%', top: '12.4%', animationDelay: '11.7s' }}></div>
        <div className="particle" style={{ left: '37.5%', top: '56.8%', animationDelay: '4.8s' }}></div>
        <div className="particle" style={{ left: '62.1%', top: '78.2%', animationDelay: '13.2s' }}></div>
        <div className="particle" style={{ left: '29.4%', top: '34.6%', animationDelay: '7.6s' }}></div>
        <div className="particle" style={{ left: '85.7%', top: '91.3%', animationDelay: '1.4s' }}></div>
        <div className="particle" style={{ left: '14.2%', top: '67.7%', animationDelay: '9.8s' }}></div>
        <div className="particle" style={{ left: '46.8%', top: '23.5%', animationDelay: '6.1s' }}></div>
        <div className="particle" style={{ left: '79.3%', top: '45.9%', animationDelay: '12.6s' }}></div>
        <div className="particle" style={{ left: '21.6%', top: '78.4%', animationDelay: '3.9s' }}></div>
        <div className="particle" style={{ left: '54.1%', top: '12.8%', animationDelay: '10.3s' }}></div>
        <div className="particle" style={{ left: '87.4%', top: '56.2%', animationDelay: '5.7s' }}></div>
        <div className="particle" style={{ left: '32.9%', top: '89.6%', animationDelay: '14.1s' }}></div>
      </div>

      <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
          <div className="lg:col-span-8 flex flex-col justify-center py-16 lg:py-0">
            <div className="hero-title transition-all duration-1000 opacity-100 transform translate-y-0">
              <span className="title-line primary">Master</span>
              <span className="title-line gradient">Valorant</span>
            </div>
            <p className="hero-subtitle transition-all duration-1000 delay-300 opacity-100 transform translate-y-0">
              The ultimate platform for professional lineups, customizable crosshairs and detailed statistics. Elevate your gameplay to the next level.
            </p>
            <div className="hero-buttons transition-all duration-1000 delay-500 opacity-100 transform translate-y-0">
              <Link className="btn-primary group" href="/lineups">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target group-hover:scale-110 transition-transform">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Explore Lineups
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              <Link className="btn-secondary group" href="/crosshairs">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crosshair group-hover:scale-110 transition-transform">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="22" x2="18" y1="12" y2="12"></line>
                  <line x1="6" x2="2" y1="12" y2="12"></line>
                  <line x1="12" x2="12" y1="6" y2="2"></line>
                  <line x1="12" x2="12" y1="22" y2="18"></line>
                </svg>
                Create Crosshair
              </Link>
            </div>
            <div className="transition-all duration-1000 delay-700 opacity-100 transform translate-y-0">
              <div className="valorant-search">
                <div className="search-container">
                  <div className="relative">
                    <input 
                      placeholder="Find an Agent or Guide, ie. player#NA1, or Sage" 
                      className="search-input" 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="search-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                  <button className="riot-id-button w-full mt-4" onClick={handleRiotLogin}>
                    <svg className="riot-icon" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <polygon points="80.11463165283203,8.324189960956573 0,45.35578089952469 19.96091079711914,121.31561595201492 35.225154876708984,119.41886454820633 30.980073928833008,71.72943431138992 36.03803253173828,69.47140055894852 44.61853790283203,118.24470835924149 70.54061126708984,115.08348399400711 65.93424224853516,62.42641764879227 70.81159210205078,60.25872737169266 80.29529571533203,113.90928965806961 106.57864379882812,110.6577256321907 101.52070617675781,52.942733108997345 106.48834228515625,50.775035202503204 116.87525177001953,109.39323741197586 142.79733276367188,106.23201304674149 142.79733276367188,24.040038406848907"></polygon>
                        <polygon points="82.01138305664062,123.3929780125618 83.27587127685547,130.8895142674446 142.79733276367188,140.8247407078743 142.79733276367188,115.98668986558914 82.10169982910156,123.3929780125618"></polygon>
                      </g>
                    </svg>
                    <span className="button-text">Sign in<span className="collapsed"> with Riot ID</span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                <div className="group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer opacity-100 transform translate-y-0 transition-all duration-1000 delay-1000" style={{background: 'rgba(255, 70, 84, 0.1)', border: '1px solid rgba(255, 70, 84, 0.2)', boxShadow: 'rgba(255, 70, 84, 0.1) 0px 8px 32px'}}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{background: 'rgba(255, 70, 84, 0.2)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target" style={{color: 'rgb(255, 70, 84)'}}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-red-300 transition-colors" style={{color: 'var(--text-main)'}}>Pro Lineups</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--text-muted)'}}>Learn and apply smoke, flash and molotov lineups from professional players.</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
                <div className="group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer opacity-100 transform translate-y-0 transition-all duration-1000 delay-1200" style={{background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)', boxShadow: 'rgba(0, 212, 255, 0.1) 0px 8px 32px'}}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{background: 'rgba(0, 212, 255, 0.2)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crosshair" style={{color: 'rgb(0, 212, 255)'}}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="22" x2="18" y1="12" y2="12"></line>
                      <line x1="6" x2="2" y1="12" y2="12"></line>
                      <line x1="12" x2="12" y1="6" y2="2"></line>
                      <line x1="12" x2="12" y1="22" y2="18"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors" style={{color: 'var(--text-main)'}}>Crosshair Editor</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--text-muted)'}}>Create the perfect crosshair with advanced customization tools.</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
                <div className="group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer opacity-100 transform translate-y-0 transition-all duration-1000 delay-1400" style={{background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: 'rgba(168, 85, 247, 0.1) 0px 8px 32px'}}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{background: 'rgba(168, 85, 247, 0.2)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up" style={{color: 'rgb(168, 85, 247)'}}>
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors" style={{color: 'var(--text-main)'}}>Live Statistics</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--text-muted)'}}>Track your progress and compare with other players.</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-red-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse opacity-100 scale-100 transition-all duration-1000 delay-1600"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse opacity-100 scale-100 transition-all duration-1000 delay-1800" style={{animationDelay: '1s'}}></div>
              <div className="absolute -top-4 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse opacity-100 scale-100 transition-all duration-1000 delay-2000" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500/25 to-rose-500/20 rounded-full blur-lg animate-pulse opacity-100 scale-100 transition-all duration-1000 delay-2200" style={{animationDelay: '2.5s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero