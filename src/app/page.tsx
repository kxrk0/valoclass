import Header from '@/components/layout/Header'
import Hero from '@/components/home/Hero'
import FeaturesSection from '@/components/home/FeaturesSection'
import StatsSection from '@/components/home/StatsSection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  )
}
