const fs = require('fs');
const path = require('path');

function processFile(file) {
  if (file.endsWith('api.ts')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.match(/\bfetch\s*\(\s*['"`]\/api\//)) {
    content = content.replace(/\bfetch\s*\(\s*(['"`]\/api\/[^'"`]+['"`])/g, 'apiFetch($1');
    changed = true;
  }
  
  if (changed) {
    if (!content.includes('import { apiFetch }') && !content.includes('import {apiFetch}')) {
       let libPath = path.relative(path.dirname(file), path.join(__dirname, 'src/lib/api')).replace(/\\/g, '/');
       const importPath = libPath.startsWith('.') ? libPath : './' + libPath;
       content = `import { apiFetch } from '${importPath}';\n` + content;
    }
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      processFile(p);
    }
  }
}

walk(path.join(__dirname, 'src'));
