import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://meublog.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/_next/',
          '/sign-in/',
          '/sign-up/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
