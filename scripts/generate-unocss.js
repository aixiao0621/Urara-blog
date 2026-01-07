import { execSync } from 'child_process'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(__dirname, '..')

try {
  console.log('[unocss] generating utilities...')
  
  // Use @unocss/cli which has the actual binary
  const command = `node node_modules/@unocss/cli/bin/unocss.mjs "src/**/*" -c unocss.config.ts -o src/app.uno.css`
  execSync(command, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true
  })
  
  console.log('[unocss] ✓ utilities generated successfully')
} catch (err) {
  console.error('[unocss] failed to generate utilities:', err.message)
  process.exit(1)
}
