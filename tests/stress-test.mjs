import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('tests/fixtures/generated');
const expected = new Map([
    ['quiz-1.edtech', 1],
    ['quiz-4.edtech', 4],
    ['quiz-50.edtech', 50],
    ['quiz-100.edtech', 100],
    ['quiz-500.edtech', 500],
    ['flashcard-500.edtech', 500]
]);

for (const [file, count] of expected) {
    const payload = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
    const actual = Math.max(0, (payload.rows?.length || 1) - 1);
    if (actual !== count) throw new Error(`${file}: expected ${count}, got ${actual}`);
}

const longQuiz = JSON.parse(await fs.readFile(path.join(root, 'quiz-long-special.edtech'), 'utf8'));
if (!/[À-ỹ]|✨/.test(longQuiz.name) || !longQuiz.rows.some(row => String(row[0]).includes('$E = mc^2$'))) throw new Error('Vietnamese/special/LaTeX stress fixture is incomplete.');

const longFlashcards = JSON.parse(await fs.readFile(path.join(root, 'flashcard-long.edtech'), 'utf8'));
if (!longFlashcards.rows.some(row => String(row[0]).length > 100)) throw new Error('Long Flashcard fixture is incomplete.');

const duplicatePayload = JSON.parse(await fs.readFile(path.join(root, 'quiz-duplicates.edtech'), 'utf8'));
const seen = new Set();
let duplicates = 0;
for (const row of duplicatePayload.rows.slice(1)) {
    const key = JSON.stringify(row).toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
}
if (duplicates !== 1) throw new Error(`Duplicate fixture expected 1 duplicate, got ${duplicates}`);

const png = await fs.readFile(path.join(root, 'large-image-2400x1600.png'));
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 2400 || height !== 1600) throw new Error(`Large image fixture has unexpected dimensions ${width}x${height}`);

console.log(`Stress fixtures passed: ${expected.size} scale sets, long text, LaTeX, special names, duplicate detection and ${width}x${height} image.`);
