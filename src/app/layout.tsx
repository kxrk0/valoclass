import { Metadata } from 'next'
import '@/styles/globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

export const metadata: Metadata = {
  title: {
    default: 'ValorantGuides - Valorant Community Hub',
    template: '%s | ValorantGuides'
  },
  description: 'The ultimate destination for Valorant lineups, crosshair sharing, player statistics, and community features. Improve your gameplay with our comprehensive tools and guides.',
  keywords: [
    'Valorant',
    'lineups',
    'crosshairs',
    'player stats',
    'esports',
    'gaming',
    'Riot Games',
    'tactical shooter',
    'community',
    'guides',
    'strategies',
    'agents',
    'maps',
    'ranks'
  ],
  authors: [{ name: 'ValorantGuides Team' }],
  creator: 'ValorantGuides',
  publisher: 'ValorantGuides',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://valoclass.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://valoclass.com',
    title: 'ValorantGuides - Valorant Community Hub',
    description: 'The ultimate destination for Valorant lineups, crosshair sharing, player statistics, and community features.',
    siteName: 'ValorantGuides',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ValorantGuides - Valorant Community Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ValorantGuides - Valorant Community Hub',
    description: 'The ultimate destination for Valorant lineups, crosshair sharing, and community features.',
    images: ['/images/twitter-image.jpg'],
    creator: '@valoclass',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'gaming',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <div id="root">
            {children}
          </div>
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
