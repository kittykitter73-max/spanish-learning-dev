import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Borao',
    short_name: 'Borao',
    description: 'Entertainment-first Spanish learning.',
    start_url: '/today',
    display: 'standalone',
    background_color: '#fff9ef',
    theme_color: '#201a20',
    orientation: 'portrait',
  }
}
