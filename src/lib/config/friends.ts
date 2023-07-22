export interface FriendOld {
    // hCard+XFN
    id: string // HTML id
    rel?: string // XFN, contact / acquaintance / friend
    link?: string // URL
    html?: string // HTML
    title?: string // Link title
    descr?: string // Descriptions
    avatar?: string // Friends avatar
    name?: string // backwards compatibility
  }
  
export type Friend = {
  id: string // HTML id
  rel?: string // XHTML Friends Network
  link?: string // URL
  html?: string // Custom HTML
  title?: string // Link title
  name?: string // Friends name
  avatar?: string // Friends avatar
  descr?: string // Descriptions
  class?: {
    avatar?: string // Avatar class
    img?: string // Photo class
  }
}

export const friends: Friend[] = [
  {
    id: ' StevenRCE0',
    name: 'StevenRCE0',
    title: 'StevenRCE0',
    avatar: 'https://avatars.githubusercontent.com/u/40051361',
    link: 'https://rcex.live/',
    descr: 'Wind rises... We shall try to live!',
  },
  {
    id: 'trdthg',
    name: 'trdthg',
    avatar: 'https://avatars.githubusercontent.com/u/69898423',
    title: 'trdthg',
    link:'https://trdthg.github.io/',
    descr: '🕊 \(￣︶￣*\))🐕',
  }
]