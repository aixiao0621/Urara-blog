import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? import.meta.env.DEV ? 'http://' : 'https://',
  domain: import.meta.env.URARA_SITE_DOMAIN ?? 'https://urara-blog-nu.vercel.app/',
  title: 'Az\'s Blog',
  subtitle: ' ',
  lang: 'en-US',
  description: ' ',
  author: {
    avatar: '/assets/maskable@512.png',
    name: 'Az',
    status: '🌸',
    bio: '这里是Az'
  },
  themeColor: '#3D4451'
}
