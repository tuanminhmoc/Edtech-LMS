'use strict';

const XLSX_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

function cleanJSONText(text) {
    return String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
}

function normalizeCorrect(value, optionCount) {
    if (value !== null && value !== undefined && value !== '' && Number.isInteger(Number(value))) {
        const number = Number(value);
        if (number >= 0 && number < optionCount) return number;
        if (number >= 1 && number <= optionCount) return number - 1;
    }
    const letter = String(value || '').trim().toUpperCase();
    if (/^[A-F]$/.test(letter)) {
        const index = letter.charCodeAt(0) - 65;
        return index < optionCount ? index : null;
    }
    return null;
}

function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function analyzeImport(payload) {
    const parsed = JSON.parse(cleanJSONText(payload.raw));
    if (!Array.isArray(parsed) || !parsed.length) throw new Error('JSON phải là một mảng có dữ liệu.');
    const mode = payload.mode === 'flashcard' ? 'flashcard' : 'quiz';
    const seen = new Set();
    const valid = [];
    const invalid = [];

    parsed.forEach((entry, index) => {
        const errors = [];
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            invalid.push({ index, errors: ['Phần tử không phải object.'] });
            return;
        }
        if (mode === 'quiz') {
            const question = normalizeText(entry.question);
            const options = Array.isArray(entry.options) ? entry.options.slice(0, 6).map(normalizeText).filter(Boolean) : [];
            const correct = normalizeCorrect(entry.correct ?? entry.correctAnswer, options.length);
            if (!question) errors.push('Câu hỏi đang để trống.');
            if (options.length < 2) errors.push('Cần ít nhất hai đáp án.');
            if (new Set(options.map(item => item.toLowerCase())).size !== options.length) errors.push('Có đáp án bị trùng.');
            if (correct === null) errors.push('Chưa xác định được đáp án đúng.');
            const signature = `${question.toLowerCase()}|${options.join('|').toLowerCase()}`;
            if (seen.has(signature)) errors.push('Trùng hoàn toàn với một câu trước đó.');
            seen.add(signature);
            const item = { question, options, correct, explanation: normalizeText(entry.explanation) };
            if (errors.length) invalid.push({ index, errors, item });
            else valid.push(item);
        } else {
            const front = normalizeText(entry.front);
            const back = normalizeText(entry.back);
            if (!front) errors.push('Mặt trước đang để trống.');
            if (!back) errors.push('Mặt sau đang để trống.');
            const signature = `${front.toLowerCase()}|${back.toLowerCase()}`;
            if (seen.has(signature)) errors.push('Trùng hoàn toàn với một thẻ trước đó.');
            seen.add(signature);
            const item = {
                front,
                back,
                explanation: normalizeText(entry.explanation ?? entry.note),
                tags: Array.isArray(entry.tags) ? entry.tags.map(normalizeText).filter(Boolean).slice(0, 12) : [],
                difficulty: ['easy', 'medium', 'hard'].includes(entry.difficulty) ? entry.difficulty : 'medium',
                reversible: entry.reversible !== false
            };
            if (errors.length) invalid.push({ index, errors, item });
            else valid.push(item);
        }
    });
    return { total: parsed.length, valid, invalid };
}

function analyzeBackup(payload) {
    const backup = payload.backup;
    if (!backup || backup.format !== 'EdTechLMSProBackup' || !backup.stores) throw new Error('File sao lưu không hợp lệ.');
    const stores = backup.stores;
    const questionSets = Array.isArray(stores.questionSets) ? stores.questionSets : [];
    const history = Array.isArray(stores.history) ? stores.history : [];
    const media = Array.isArray(stores.media) ? stores.media : [];
    return {
        questionSets: questionSets.length,
        questions: questionSets.reduce((sum, item) => sum + (Number(item.count) || Math.max(0, (item.rows?.length || 1) - 1)), 0),
        history: history.length,
        media: media.length,
        exportedAt: backup.exportedAt || null,
        appVersion: backup.appVersion || 'không rõ'
    };
}

async function parseExcel(payload, taskId) {
    postMessage({ id: taskId, progress: { percent: 12, message: 'Đang tải bộ đọc Excel…' } });
    if (!self.XLSX) importScripts(XLSX_CDN);
    postMessage({ id: taskId, progress: { percent: 48, message: 'Đang đọc bảng tính…' } });
    const workbook = self.XLSX.read(payload.arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = self.XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
    postMessage({ id: taskId, progress: { percent: 100, message: 'Hoàn tất.' } });
    return rows;
}

self.onmessage = async event => {
    const { id, type, payload } = event.data || {};
    try {
        let result;
        if (type === 'parseExcel') result = await parseExcel(payload, id);
        else if (type === 'analyzeImport') result = analyzeImport(payload);
        else if (type === 'analyzeBackup') result = analyzeBackup(payload);
        else throw new Error(`Unknown worker task: ${type}`);
        postMessage({ id, ok: true, result });
    } catch (error) {
        postMessage({ id, ok: false, error: error?.message || String(error) });
    }
};
