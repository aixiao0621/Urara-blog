import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const targetTags = ['span','div','button','a','label','section','article','header','footer','main','nav','figure'];
const tagRegex = new RegExp(`<(${targetTags.join('|')})([^>]*)\\/>`,'gi');

async function walk(dir){
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries){
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(p);
    else {
      if (p.endsWith('.svelte') || p.endsWith('.svelte.md') || p.includes('+page.svelte.md')){
        await fixFile(p);
      }
    }
  }
}

function hasAria(attrs){
  return /aria-label|aria-labelledby|title/.test(attrs);
}

async function fixFile(file){
  let src = await fs.readFile(file, 'utf8');
  let out = src.replace(tagRegex, (m, tag, attrs) => {
    const a = attrs || '';
    if (tag === 'button' || tag === 'a'){
      if (!hasAria(a)){
        return `<${tag}${a} aria-label="icon"></${tag}>`;
      }
      return `<${tag}${a}></${tag}>`;
    }
    return `<${tag}${a}></${tag}>`;
  });
  if (out !== src){
    await fs.writeFile(file, out, 'utf8');
    console.log('[fix] updated', path.relative(ROOT, file));
  }
}

(async ()=>{
  try{
    await walk(path.join(ROOT, 'src'));
    console.log('done');
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();
