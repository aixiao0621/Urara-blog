import { createGenerator } from 'unocss'
import { presetUno, presetIcons, presetTagify } from 'unocss'
import extractorSvelte from '@unocss/extractor-svelte'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(__dirname, '..')

// Simple recursive file scanner
function scanFiles(dir, exts = ['.svelte', '.ts', '.js', '.html', '.md']) {
  const files = []
  const scan = (d) => {
    try {
      const entries = readdirSync(d, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        if (entry.name === 'node_modules') continue
        
        const fullPath = path.join(d, entry.name)
        if (entry.isDirectory()) {
          scan(fullPath)
        } else if (exts.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath)
        }
      }
    } catch (e) {}
  }
  scan(dir)
  return files
}

async function generateUnocss() {
  try {
    console.log('[unocss] generating utilities...')
    
    // Define config inline to avoid TypeScript import issues
    const config = {
      presets: [presetUno(), presetIcons(), presetTagify()],
      extractors: [extractorSvelte()],
      include: ['src/**/*.{svelte,ts,js,md,mdx}', 'urara/**/*'],
      safelist: []
    }
    
    // Create generator with the config
    const generator = await createGenerator(config, { cwd: ROOT })
    
    // Scan source and urara directories
    const srcFiles = scanFiles(path.join(ROOT, 'src'))
    const uraraFiles = scanFiles(path.join(ROOT, 'urara'))
    const allFiles = [...srcFiles, ...uraraFiles]
    
    console.log(`[unocss] scanning ${allFiles.length} files...`)
    
    // Collect content for extraction
    let content = ''
    for (const file of allFiles) {
      try {
        content += readFileSync(file, 'utf-8') + '\n'
      } catch (e) {}
    }
    
    // Generate CSS using the combined content
    const { css, matched } = await generator.generate(content)
    
    // Write the CSS
    const outputPath = path.join(ROOT, 'src/app.uno.css')
    writeFileSync(outputPath, css, 'utf-8')
    
    console.log(`[unocss] ✓ generated to src/app.uno.css`)
    console.log(`[unocss] ${matched?.size || 0} utilities found`)
  } catch (err) {
    console.error('[unocss] failed to generate utilities:', err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

generateUnocss()
