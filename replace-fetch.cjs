const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('fetch(') && content.includes('/api/')) {
    content = content.replace(/(?<!\.)\bfetch\s*\(\s*['"`]\/api\//g, 'apiFetch(\'/api/');
    
    if (!content.includes('import { apiFetch }') && !content.includes('import {apiFetch}')) {
      const relPath = path.relative(path.dirname(file), 'src/lib/api.ts').replace(/\\/g, '/').replace('.ts', '');
      const importPath = relPath.startsWith('.') ? relPath : './' + relPath;
      content = "import { apiFetch } from '" + importPath + "';\n" + content;
    }
    
    fs.writeFileSync(file, content);
    modifiedCount++;
  }
});
console.log('Modified files:', modifiedCount);
