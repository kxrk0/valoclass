'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Crosshair,
  TrendingUp,
  Gamepad2,
  Star,
  Rocket,
  Play,
  Code,
  Palette,
  Layers,
  Heart,
  Eye,
  Download,
  Share2,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react'

const TestLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10
  }))

  return (
    <div className="test-landing-page">
      {/* Dynamic Background */}
      <div className="background-layers">
        <div
          className="background-gradient"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        />
        <div className="grid-overlay" />
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="content-container">
        {/* Header */}
        <header className="header-section">
          <div className="logo-container">
            <div className="logo-icon">
              <Sparkles size={32} />
            </div>
            <div className="logo-text">
              <span className="logo-main">TestPage</span>
              <span className="logo-sub">by Supernova</span>
            </div>
          </div>
          <nav className="navigation">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/lineups" className="nav-link">Lineups</Link>
            <Link href="/crosshairs" className="nav-link">Crosshairs</Link>
            <Link href="/stats" className="nav-link">Stats</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Star size={16} />
              <span>Next Generation Design</span>
            </div>

            <h1 className="hero-title">
              <span className="title-line">Elevate</span>
              <span className="title-line gradient">Your Experience</span>
            </h1>

            <p className="hero-description">
              Witness the future of web design with cutting-edge animations,
              interactive elements, and breathtaking visual effects that redefine
              digital excellence.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Play size={20} />
                <span>Start Experience</span>
                <ArrowRight size={18} className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
              </button>

              <button className="secondary-button">
                <Eye size={20} />
                <span>View Demo</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card glass-card card-1">
                <div className="card-icon">
                  <Target size={24} />
                </div>
                <h3>Precision</h3>
                <p>Pixel-perfect design</p>
              </div>

              <div className="card glass-card card-2">
                <div className="card-icon">
                  <Zap size={24} />
                </div>
                <h3>Performance</h3>
                <p>Lightning fast</p>
              </div>

              <div className="card glass-card card-3">
                <div className="card-icon">
                  <Rocket size={24} />
                </div>
                <h3>Innovation</h3>
                <p>Next level features</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Revolutionary Features</h2>
            <p className="section-subtitle">
              Discover what makes this experience truly exceptional
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Code size={28} />,
                title: 'Modern Architecture',
                description: 'Built with the latest technologies and best practices',
                color: '#ff4654'
              },
              {
                icon: <Palette size={28} />,
                title: 'Stunning Visuals',
                description: 'Breathtaking graphics and smooth animations',
                color: '#00d4ff'
              },
              {
                icon: <Layers size={28} />,
                title: 'Layered Design',
                description: 'Multiple visual layers creating depth and dimension',
                color: '#a855f7'
              },
              {
                icon: <Heart size={28} />,
                title: 'User Centric',
                description: 'Designed with user experience as the top priority',
                color: '#f0db4f'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div
                  className="feature-icon"
                  style={{ color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Performance</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Animations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Possibilities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1</div>
              <div className="stat-label">Unique Experience</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Experience the Future?</h2>
            <p>Join thousands who have already elevated their digital presence</p>
            <div className="cta-actions">
              <button className="cta-button primary">
                <Download size={20} />
                <span>Get Started</span>
              </button>
              <button className="cta-button secondary">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles size={24} />
              <span>TestPage</span>
            </div>
            <p>Crafting exceptional digital experiences with passion and precision.</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <Link href="/">Home</Link>
              <Link href="/lineups">Lineups</Link>
              <Link href="/crosshairs">Crosshairs</Link>
            </div>

            <div className="link-group">
              <h4>Community</h4>
              <Link href="/stats">Stats</Link>
              <Link href="/community">Community</Link>
              <Link href="/updates">Updates</Link>
            </div>

            <div className="link-group">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Github size={20} />
                </a>
                <a href="#" className="social-link">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 ValoClass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default TestLandingPage
