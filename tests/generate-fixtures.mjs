import fs from 'node:fs/promises';
import path from 'node:path';
import { stressSets, makeFlashcardRows } from './fixtures/stress-data.mjs';

const output = path.resolve('tests/fixtures/generated');
await fs.mkdir(output, { recursive: true });
const sets = [
    ['quiz-1.edtech', { name: 'Một câu', type: 'quiz', rows: stressSets.quiz1 }],
    ['quiz-4.edtech', { name: 'Bốn câu', type: 'quiz', rows: stressSets.quiz4 }],
    ['quiz-50.edtech', { name: 'Năm mươi câu', type: 'quiz', rows: stressSets.quiz50 }],
    ['quiz-100.edtech', { name: 'Một trăm câu', type: 'quiz', rows: stressSets.quiz100 }],
    ['quiz-500.edtech', { name: 'Năm trăm câu', type: 'quiz', rows: stressSets.quiz500 }],
    ['quiz-long-special.edtech', { ...stressSets.specialName, rows: stressSets.quizLong }],
    ['flashcard-long.edtech', { name: 'Flashcard đoạn văn dài', type: 'flashcard', rows: stressSets.flashcardLong }],
    ['flashcard-500.edtech', { name: 'Flashcard 500 thẻ', type: 'flashcard', rows: makeFlashcardRows(500) }],
    ['quiz-duplicates.edtech', { name: 'Bộ đề có câu trùng', type: 'quiz', rows: [stressSets.quiz4[0], stressSets.quiz4[1], stressSets.quiz4[1], ...stressSets.quiz4.slice(2)] }]
];
for (const [file, payload] of sets) {
    await fs.writeFile(path.join(output, file), JSON.stringify({ format: 'EdTechQuestionSet', schemaVersion: 4, ...payload }, null, 2));
}
console.log(`Generated ${sets.length} stress fixtures.`);
