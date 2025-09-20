import { Metadata } from 'next'
import '@/styles/globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

export const metadata: Metadata = {
  title: {
    default: 'PLAYVALORANTGUIDES.COM - Valorant Community Hub',
    template: '%s | PLAYVALORANTGUIDES.COM'
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
  
  // 🎨 FAVICON & ICONS CONFIGURATION
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/icons/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'icon', 
        url: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
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
        <LanguageProvider>
          <div id="root">
            {children}
          </div>
          <PWAInstallPrompt />
        </LanguageProvider>
      </body>
    </html>
  )
}
