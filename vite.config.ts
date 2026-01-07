// vite define config
import { defineConfig } from 'vite'
// vite plugin
// UnoCSS will be built via CLI into `src/app.uno.css` to avoid plugin transform issues
import { imagetools } from 'vite-imagetools'
import { sveltekit as SvelteKit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
// postcss & tailwindcss
import TailwindCSS from 'tailwindcss'
import tailwindConfig from './tailwind.config'

export default defineConfig({
  envPrefix: 'URARA_',
  build: {
    sourcemap: false
  },
  css: {
    postcss: {
      plugins: [TailwindCSS(tailwindConfig)]
    }
  },
  plugins: [
    SvelteKit(),
    // UnoCSS generated via CLI; no UnoCSS Vite plugin to avoid transform issues
    imagetools(),
    // PWA handled by a post-build workbox script; disable plugin during Vite build
    SvelteKitPWA({
      disable: true
    })
  ]
})
