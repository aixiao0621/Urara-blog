// sveltekit config type
import type { Config } from '@sveltejs/kit'
// svelte adapter
import adapterVercel from '@sveltejs/adapter-vercel'
import adapterNetlify from '@sveltejs/adapter-netlify'
import adapterStatic from '@sveltejs/adapter-static'
// svelte preprocessor
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import sveltePreprocess from 'svelte-preprocess'

export default {
  extensions: ['.svelte', ...(mdsvexConfig.extensions as string[])],
  preprocess: [mdsvex(mdsvexConfig), sveltePreprocess()],
  kit: {
    adapter: Object.keys(process.env).some(key => key === 'VERCEL')
      ? adapterVercel({ runtime: 'nodejs20.x' } as any)
      : Object.keys(process.env).some(key => key === 'NETLIFY')
      ? adapterNetlify()
      : adapterStatic({
          pages: 'build',
          assets: 'build',
          fallback: undefined
        }),
    prerender: {
      handleMissingId: 'warn',
      crawl: false,
      entries: []
    },
    csp: {
      mode: 'auto',
      directives: {
        'style-src': ['self', 'unsafe-inline', 'https://giscus.app']
      }
    }
  }
} as Config
