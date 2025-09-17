import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ValoClass - Valorant Community Hub',
    short_name: 'ValoClass',
    description: 'The ultimate destination for Valorant lineups, crosshair sharing, player statistics, and community features.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1419',
    theme_color: '#ff4654',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['games', 'sports', 'utilities'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/images/screenshot1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'ValoClass home page showing lineups and crosshairs'
      },
      {
        src: '/images/screenshot2.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'ValoClass mobile view with crosshair builder'
      }
    ],
    shortcuts: [
      {
        name: 'Lineups',
        short_name: 'Lineups',
        description: 'Browse and create Valorant lineups',
        url: '/lineups',
        icons: [{ src: '/icons/lineup-icon.png', sizes: '96x96' }]
      },
      {
        name: 'Crosshairs',
        short_name: 'Crosshairs',
        description: 'Build and share custom crosshairs',
        url: '/crosshairs',
        icons: [{ src: '/icons/crosshair-icon.png', sizes: '96x96' }]
      },
      {
        name: 'Player Stats',
        short_name: 'Stats',
        description: 'Check Valorant player statistics',
        url: '/stats',
        icons: [{ src: '/icons/stats-icon.png', sizes: '96x96' }]
      },
      {
        name: 'Community',
        short_name: 'Community',
        description: 'Connect with other players',
        url: '/community',
        icons: [{ src: '/icons/community-icon.png', sizes: '96x96' }]
      }
    ],
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.valoclass.app',
        id: 'com.valoclass.app'
      }
    ],
    prefer_related_applications: false
  }
}
