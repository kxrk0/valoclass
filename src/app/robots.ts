import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/verify/',
        '/admin/',
        '/_next/',
        '/profile/settings',
        '/private'
      ],
    },
    sitemap: 'https://valoclass.com/sitemap.xml',
  }
}
