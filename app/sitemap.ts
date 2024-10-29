import type { MetadataRoute } from 'next'
import { WEBSITE_HOST } from './config'

function generateTimeUrls(): string[] {
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
  const references = ['today', 'yesterday', 'tomorrow']
  const urls: string[] = []

  for (const unit of units) {
    for (let num = 1; num <= 100; num++) {
      const pluralUnit = num === 1 ? unit : `${unit}s`
      for (const reference of references) {
        urls.push(`${num}-${pluralUnit}-ago-from-${reference}`)
        urls.push(`${num}-${pluralUnit}-from-${reference}`)
      }
    }
  }

  return urls
}

export default function sitemap(): MetadataRoute.Sitemap {
  const timeUrls = generateTimeUrls()
  
  return timeUrls.map(url => ({
    url: `${WEBSITE_HOST}/calculators/${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))
}
