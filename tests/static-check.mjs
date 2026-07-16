import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const jsFiles = [
  'js/database.js', 'js/lazy-libs.js', 'js/worker-client.js', 'js/audio-manager.js',
  'js/theme.js', 'js/router.js', 'js/backup.js', 'js/pwa.js', 'js/core.js', 'js/app.js',
  'js/workers/data-worker.js', 'sw.js'
];
for (const file of jsFiles) execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate HTML ids: ${duplicates.join(', ')}`);
for (const required of ['manifest.webmanifest', 'sw.js', 'js/database.js', 'js/app.js', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png']) {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing required file: ${required}`);
}
if (/xlsx\.full\.min\.js[^<]*<\/script>/i.test(html) || /tex-mml-svg\.js[^<]*<\/script>/i.test(html)) {
  throw new Error('Heavy libraries must not be loaded eagerly in index.html.');
}
console.log(`Static checks passed: ${jsFiles.length} JavaScript files, ${ids.length} unique HTML ids.`);
