import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const jsFiles = [
  'js/database.js', 'js/recovery.js', 'js/lazy-libs.js', 'js/worker-client.js', 'js/audio-manager.js',
  'js/theme.js', 'js/router.js', 'js/backup.js', 'js/diagnostics.js', 'js/accessibility.js',
  'js/pwa.js', 'js/core.js', 'js/app.js', 'js/workers/data-worker.js', 'sw.js'
];
for (const file of jsFiles) execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
for (const file of ['tests/generate-fixtures.mjs', 'tests/stress-test.mjs', 'tests/visual-regression.mjs']) execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate HTML ids: ${duplicates.join(', ')}`);

const cssFiles = fs.readdirSync(path.join(root, 'css')).filter(file => file.endsWith('.css'));
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(root, 'css', file), 'utf8');
  const opens = (css.match(/\{/g) || []).length;
  const closes = (css.match(/\}/g) || []).length;
  if (opens !== closes) throw new Error(`Unbalanced CSS braces in ${file}: ${opens}/${closes}`);
}
const allCSS = cssFiles.map(file => fs.readFileSync(path.join(root, 'css', file), 'utf8')).join('\n');

const expectedCSS = ['tokens.css', 'base.css', 'components.css', 'dashboard.css', 'practice.css', 'flashcard.css', 'creator.css', 'library.css', 'history.css', 'mobile.css', 'themes.css'];
if (JSON.stringify(cssFiles.sort()) !== JSON.stringify(expectedCSS.sort())) throw new Error(`Unexpected CSS module set: ${cssFiles.join(', ')}`);
const tokenCSS = fs.readFileSync(path.join(root, 'css/tokens.css'), 'utf8');
for (const token of ['--space-1', '--space-2', '--space-3', '--radius-sm', '--radius-md', '--radius-lg', '--control-height-sm', '--control-height-md', '--control-height-lg', '--shadow-1', '--motion-normal']) {
  if (!tokenCSS.includes(`${token}:`)) throw new Error(`Missing design token ${token}`);
}
if (/(^|[^\w-])\.flashcard(?=[\s,{:#.\[])/m.test(allCSS)) throw new Error('Generic .flashcard selector is forbidden; use .study-flashcard-card.');
if (/(^|[^\w-])\.panel(?=[\s,{:#.\[])/m.test(allCSS)) throw new Error('Generic .panel selector is forbidden; use .surface-panel.');
if (/(^|[^\w-])\.quiz(?=[\s,{:#.\[])/m.test(allCSS)) throw new Error('Generic .quiz selector is forbidden; use a component variant.');
const classTokens = [...html.matchAll(/class="([^"]+)"/g)].flatMap(match => match[1].split(/\s+/));
if (classTokens.includes('flashcard')) throw new Error('Generic flashcard HTML class is forbidden.');
if (classTokens.includes('panel')) throw new Error('Generic panel HTML class is forbidden.');
if (classTokens.includes('quiz')) throw new Error('Generic quiz HTML class is forbidden.');

for (const required of [
  'manifest.webmanifest', 'sw.js', 'js/database.js', 'js/recovery.js', 'js/diagnostics.js', 'js/accessibility.js',
  'css/tokens.css', 'css/components.css', 'css/flashcard.css', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png'
]) {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing required file: ${required}`);
}

const localReferences = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]).filter(value => !/^(?:#|https?:|data:|blob:|mailto:|tel:)/.test(value));
for (const reference of localReferences) {
  const clean = reference.split(/[?#]/)[0];
  if (clean && !fs.existsSync(path.join(root, clean))) throw new Error(`Broken local reference in index.html: ${reference}`);
}
const swText = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const match of swText.matchAll(/'\.\/([^']+)'/g)) {
  const reference = match[1];
  if (reference && !fs.existsSync(path.join(root, reference))) throw new Error(`Broken Service Worker asset: ${reference}`);
}
if (/xlsx\.full\.min\.js[^<]*<\/script>/i.test(html) || /tex-mml-svg\.js[^<]*<\/script>/i.test(html)) {
  throw new Error('Heavy libraries must not be loaded eagerly in index.html.');
}
const sourceText = jsFiles.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
if (/addEventListener\(['"]contextmenu|\bF12\b|\beval\s*\(/.test(sourceText)) throw new Error('Fake security blocking or eval detected.');
console.log(`Static checks passed: ${jsFiles.length} JavaScript files, ${cssFiles.length} CSS modules, ${ids.length} unique HTML ids.`);
