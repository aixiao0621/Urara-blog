import { defineConfig } from 'unocss'
import { presetUno, presetIcons, presetTagify } from 'unocss'
import extractorSvelte from '@unocss/extractor-svelte'

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTagify()],
  extractors: [extractorSvelte()],
  include: ['src/**/*.{svelte,ts,js,md,mdx}', 'urara/**/*'],
  safelist: []
})
