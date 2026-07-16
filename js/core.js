'use strict';

const STORAGE_KEY = 'edtech_lms_pro_learning_v3';
const CREATOR_KEY = 'edtech_lms_pro_creator_v3';
const PREF_KEY = 'edtech_lms_pro_preferences_v3';
const CREATOR_RECOVERY_KEY = 'edtech_lms_pro_creator_recovery_v3';

const FOCUS_MOTIVATIONS = [
    "Bắt đầu nhẹ nhàng, tiến bộ rõ ràng.",
    "Tập trung vào một việc, rồi làm nó thật tốt.",
    "Mỗi câu hỏi hoàn thành là một bước tiến nhỏ.",
    "Học chậm một chút vẫn tốt hơn đứng yên.",
    "Hôm nay hiểu thêm một điều cũng là thành công.",
    "Sự tập trung biến thời gian ngắn thành kết quả lớn.",
    "Một phiên học tốt bắt đầu từ một quyết định nhỏ.",
    "Đừng đợi cảm hứng, hãy bắt đầu để tạo cảm hứng.",
    "Kiến thức vững được xây từ những lần ôn đều đặn.",
    "Bạn không cần hoàn hảo, chỉ cần tiếp tục.",
    "Một câu đúng hôm nay có thể mở ra cả một chương mới.",
    "Tập trung vào tiến bộ, không phải tốc độ.",
    "Học ít nhưng sâu luôn đáng giá hơn học nhiều mà vội.",
    "Mỗi lần sửa sai là một lần hiểu bài rõ hơn.",
    "Bình tĩnh đọc kỹ, đáp án sẽ dần sáng rõ.",
    "Kỷ luật nhỏ mỗi ngày tạo nên năng lực lớn.",
    "Hãy cho bản thân đủ thời gian để hiểu thật sự.",
    "Một giờ tập trung đáng giá hơn nhiều giờ phân tâm.",
    "Bạn đang xây nền móng cho phiên bản tốt hơn của mình.",
    "Không sao nếu khó, khó nghĩa là bạn đang học.",
    "Hãy bắt đầu với câu dễ nhất rồi tiến dần lên.",
    "Mỗi lần ôn lại, trí nhớ của bạn mạnh thêm một chút.",
    "Tập trung hôm nay để tự tin hơn ngày mai.",
    "Sai một câu không định nghĩa khả năng của bạn.",
    "Cứ làm từng bước, bài dài rồi cũng sẽ xong.",
    "Học tập là cuộc đua với chính mình của hôm qua.",
    "Giữ nhịp đều quan trọng hơn bứt tốc nhất thời.",
    "Một mục tiêu rõ ràng giúp đầu óc nhẹ nhàng hơn.",
    "Đọc kỹ câu hỏi là đã đi được nửa đường.",
    "Bạn càng kiên nhẫn, kiến thức càng ở lại lâu.",
    "Đừng sợ câu khó, hãy tách nó thành phần nhỏ.",
    "Mỗi phút tập trung đều đang được tích lũy.",
    "Hãy học để hiểu, điểm số sẽ đi theo sau.",
    "Một ngày tốt để bắt đầu chính là hôm nay.",
    "Những điều lớn lao thường bắt đầu rất yên lặng.",
    "Bạn có thể nghỉ một chút, nhưng đừng bỏ cuộc.",
    "Sự rõ ràng đến sau khi bạn chịu khó đặt câu hỏi.",
    "Từng flashcard nhỏ đang tạo nên một trí nhớ lớn.",
    "Hãy tin vào sức mạnh của việc lặp lại đúng cách.",
    "Một đáp án sai có thể dẫn bạn đến hiểu biết đúng.",
    "Tập trung không phải làm nhiều, mà là làm đúng việc.",
    "Học hôm nay là món quà cho chính bạn ngày mai.",
    "Bạn đang tiến bộ ngay cả khi chưa nhận ra.",
    "Mỗi lần quay lại bàn học là một chiến thắng.",
    "Đừng so sánh chương đầu của bạn với chương cuối của người khác.",
    "Kiến thức cần thời gian, giống như cây cần được tưới đều.",
    "Bắt đầu từ điều bạn biết, rồi mở rộng từng chút.",
    "Câu hỏi khó nhất thường dạy ta nhiều nhất.",
    "Tập trung vào quá trình, kết quả sẽ tự lên tiếng.",
    "Bạn chỉ cần làm tốt bước tiếp theo.",
    "Hãy để sự tò mò dẫn đường cho buổi học.",
    "Một bộ đề hôm nay, thêm một phần tự tin ngày mai.",
    "Không cần học hoàn hảo, chỉ cần học thật.",
    "Nhớ lâu bắt đầu từ hiểu sâu.",
    "Mỗi lần tự kiểm tra là một lần củng cố kiến thức.",
    "Hãy biến lỗi sai thành ghi chú hữu ích.",
    "Tâm trí yên, việc học sáng.",
    "Đừng vội chọn đáp án trước khi đọc hết câu hỏi.",
    "Sự tiến bộ được tạo nên trong những ngày bình thường.",
    "Bạn không chậm, bạn đang xây kiến thức chắc chắn.",
    "Một lần tập trung trọn vẹn có thể thay đổi cả ngày.",
    "Học đúng trọng tâm giúp bạn đi xa mà không kiệt sức.",
    "Bài học hôm nay sẽ trở thành phản xạ ngày mai.",
    "Hãy hoàn thành trước, rồi hoàn thiện sau.",
    "Mỗi câu trả lời đều là một cơ hội luyện tư duy.",
    "Tự tin đến từ sự chuẩn bị lặp lại mỗi ngày.",
    "Điều chưa hiểu hôm nay có thể trở nên đơn giản ngày mai.",
    "Tập trung là cách bạn nói rằng mục tiêu này quan trọng.",
    "Hãy học theo nhịp phù hợp với chính bạn.",
    "Một chút cố gắng đều đặn luôn tạo ra khác biệt.",
    "Bạn đang gần hơn mục tiêu sau mỗi câu hoàn thành.",
    "Không có buổi học nào vô ích nếu bạn rút ra được một điều.",
    "Hãy để câu sai chỉ đường cho lần ôn tiếp theo.",
    "Một tâm trí bình tĩnh ghi nhớ tốt hơn một tâm trí vội vàng.",
    "Học tập tốt không ồn ào, nó tích lũy âm thầm.",
    "Bạn không cần biết hết, chỉ cần sẵn sàng học tiếp.",
    "Mỗi lần lật thẻ là một lần đánh thức trí nhớ.",
    "Hãy dành trọn sự chú ý cho câu hỏi trước mắt.",
    "Sự bền bỉ thắng những khoảnh khắc thiếu động lực.",
    "Một kế hoạch đơn giản vẫn tốt hơn một ý định mơ hồ.",
    "Đừng bỏ qua phần giải thích, đó là nơi kiến thức ở lại.",
    "Hãy biến hôm nay thành một ngày có tiến bộ.",
    "Khi bạn hiểu lý do, bạn sẽ nhớ đáp án lâu hơn.",
    "Từng bước nhỏ đang đưa bạn đến mục tiêu lớn.",
    "Bạn có quyền học lại cho đến khi thật sự hiểu.",
    "Hãy kiên nhẫn với bộ não đang học điều mới.",
    "Tập trung vào câu này, chưa cần lo câu tiếp theo.",
    "Một phiên ôn ngắn vẫn có thể tạo khác biệt dài lâu.",
    "Kiến thức không mất đi khi bạn thường xuyên gọi nó trở lại.",
    "Hãy dùng sự bình tĩnh để vượt qua câu hỏi khó.",
    "Bạn càng chủ động kiểm tra, bạn càng biết mình cần ôn gì.",
    "Mỗi ngày tiến một chút là một chiến lược rất mạnh.",
    "Hãy học với mục đích, không chỉ để hoàn thành.",
    "Sự tập trung là khoảng lặng nơi tiến bộ bắt đầu.",
    "Cứ tiếp tục, phiên bản giỏi hơn của bạn đang được tạo ra.",
    "Một câu hỏi tại một thời điểm là đủ.",
    "Hãy tự hào vì bạn đã dành thời gian để học.",
    "Học tập không cần vội, chỉ cần không ngừng.",
    "Bạn đã bắt đầu, đó luôn là bước khó nhất.",
    "Tập trung vào hiện tại, kết quả sẽ đến đúng lúc."
];

const EMPTY_DATA = {
    history: [],
    xp: 0,
    reviewedCards: 0,
    flashcards: {}
};

let appData = loadJSON(STORAGE_KEY, EMPTY_DATA);
let preferences = loadJSON(PREF_KEY, {
    sound: true,
    studyMode: 'quiz',
    shuffleQuestions: true,
    shuffleOptions: true,
    timeLimit: 15,
    shuffleFlashcards: true,
    dueFirst: true
});

let studyMode = preferences.studyMode === 'flashcard' ? 'flashcard' : 'quiz';
let selectedWorkbookData = null;
let currentFileName = '';
let lastWorkbookData = null;
let lastQuizSource = null;
let confirmCallback = null;

let quizData = [];
let quizAnswers = [];
let flaggedQuestions = new Set();
let quizSubmitted = false;
let quizTimer = null;
let quizElapsed = 0;
let quizTimeLimitSeconds = 0;
let quizNavPage = 0;
let currentQuizIndex = 0;
let quizStartedAt = 0;
let quizDeadline = 0;
const QUIZ_NAV_PAGE_SIZE = 20;
let lastQuizResult = null;

let fcState = null;
let lastFlashcardSource = null;
let lastFlashcardHardSource = null;

let creatorMode = 'quiz';
const loadedCreatorDrafts = loadCreatorDrafts();
let recoveryCreatorDrafts = safeStorageGet(CREATOR_RECOVERY_KEY) === '1' && hasMeaningfulCreatorContent(loadedCreatorDrafts) ? clone(loadedCreatorDrafts) : null;
let creatorDrafts = recoveryCreatorDrafts ? { quiz: [], flashcard: [] } : loadedCreatorDrafts;
let activeCreatorId = null;
let creatorSearchQuery = '';
let creatorFilter = 'all';
let creatorSaveTimer = null;
let creatorRecoveryOffered = false;
let promptMode = 'new';
let pendingImportAnalysis = null;
let draggedCreatorId = null;
let creatorListPage = 0;
let creatorUndoStack = [];
let creatorRedoStack = [];
let creatorMultiSelect = false;
let creatorSelectedIds = new Set();
let creatorHistoryLock = false;
const CREATOR_LIST_PAGE_SIZE = 25;

let audioContext = null;
let soundUnlocked = false;
let introSoundPlayed = false;
let mobileQuizNavTimer = null;
var mobileResultReviewTimer = null;

const creatorMediaURLs = new Map();
const creatorMediaMeta = new Map();
const MEDIA_TOKEN_PATTERN = /\[media:([a-zA-Z0-9_-]+)\]/g;
const MAX_CREATOR_IMAGE_BYTES = 12 * 1024 * 1024;
const TARGET_CREATOR_IMAGE_BYTES = 650 * 1024;

function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
}

function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
}

function safeStorageRemove(key) {
    try { localStorage.removeItem(key); return true; } catch (_) { return false; }
}


function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function hasMeaningfulCreatorContent(drafts) {
    if (!drafts || typeof drafts !== 'object') return false;
    return ['quiz', 'flashcard'].some(mode => (Array.isArray(drafts[mode]) ? drafts[mode] : []).some(item => {
        if (mode === 'quiz') return Boolean(String(item?.question || '').trim() || (item?.options || []).some(option => String(option || '').trim()));
        return Boolean(String(item?.front || '').trim() || String(item?.back || '').trim());
    }));
}

function loadJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        if (value && typeof value === 'object') return { ...clone(fallback), ...value };
    } catch (error) {
        console.warn('Không thể đọc dữ liệu lưu trữ:', error);
    }
    return clone(fallback);
}

function saveLearningData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
        console.warn('Bản sao LocalStorage không thể cập nhật:', error);
    }
    window.EdTechDB?.syncLearning(clone(appData)).catch(error => {
        console.error('Không thể lưu IndexedDB:', error);
        showToast('Không thể lưu dữ liệu trên thiết bị.', 'error');
    });
}

function savePreferences() {
    preferences.studyMode = studyMode;
    preferences.shuffleQuestions = Boolean(document.getElementById('shuffle-questions')?.checked);
    preferences.shuffleOptions = Boolean(document.getElementById('shuffle-options')?.checked);
    preferences.timeLimit = Math.max(0, Number(document.getElementById('time-limit')?.value) || 0);
    preferences.shuffleFlashcards = Boolean(document.getElementById('fc-shuffle')?.checked);
    preferences.dueFirst = Boolean(document.getElementById('fc-due-first')?.checked);
    try {
        localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
        window.EdTechDB?.savePreferences(clone(preferences)).catch(() => {});
    } catch (error) {
        console.warn('Không thể lưu tùy chọn:', error);
    }
}

function loadCreatorDrafts() {
    const fallback = { quiz: [], flashcard: [] };
    try {
        const saved = JSON.parse(localStorage.getItem(CREATOR_KEY));
        if (!saved || typeof saved !== 'object') return fallback;
        return {
            quiz: Array.isArray(saved.quiz) ? saved.quiz : [],
            flashcard: Array.isArray(saved.flashcard) ? saved.flashcard : []
        };
    } catch (error) {
        return fallback;
    }
}

function setCreatorSaveStatus(text, state = 'saved') {
    const status = document.getElementById('creator-save-status');
    if (!status) return;
    status.className = `creator-save-status ${state}`;
    status.innerHTML = `<span></span>${escapeHTML(text)}`;
}

function saveCreatorDrafts(markRecovery = true) {
    try {
        localStorage.setItem(CREATOR_KEY, JSON.stringify(creatorDrafts));
        const recovery = Boolean(markRecovery && hasMeaningfulCreatorContent(creatorDrafts));
        if (recovery) localStorage.setItem(CREATOR_RECOVERY_KEY, '1');
        else if (!markRecovery) localStorage.removeItem(CREATOR_RECOVERY_KEY);
        window.EdTechDB?.saveCreatorDrafts(clone(creatorDrafts), recovery).catch(error => {
            console.warn('Không thể lưu bản nháp vào IndexedDB:', error);
            setCreatorSaveStatus('Không thể lưu', 'error');
        });
        setCreatorSaveStatus('Đã lưu', 'saved');
    } catch (error) {
        console.warn('Không thể lưu bản nháp:', error);
        setCreatorSaveStatus('Không thể lưu', 'error');
    }
}

function scheduleCreatorSave() {
    clearTimeout(creatorSaveTimer);
    setCreatorSaveStatus('Có thay đổi chưa lưu', 'unsaved');
    safeStorageSet(CREATOR_RECOVERY_KEY, '1');
    window.setTimeout(() => {
        if (creatorSaveTimer) setCreatorSaveStatus('Đang lưu…', 'saving');
    }, 90);
    creatorSaveTimer = window.setTimeout(() => {
        creatorSaveTimer = null;
        saveCreatorDrafts(true);
    }, 420);
}

function markCreatorDraftComplete() {
    safeStorageRemove(CREATOR_RECOVERY_KEY);
    setCreatorSaveStatus('Đã xuất và lưu', 'saved');
}

function makeId(prefix = 'item') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function simpleHash(input) {
    let hash = 2166136261;
    const text = String(input || '');
    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatMediaSize(bytes) {
    const value = Math.max(0, Number(bytes) || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
    return `${(value / (1024 * 1024)).toFixed(value > 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

function extractCreatorMediaIds(value) {
    const ids = [];
    String(value || '').replace(/\[media:([a-zA-Z0-9_-]+)\]/g, (_, id) => {
        if (!ids.includes(id)) ids.push(id);
        return _;
    });
    return ids;
}

function stripCreatorMediaMarkup(value) {
    return String(value || '')
        .replace(/\s*\[media:[a-zA-Z0-9_-]+\]\s*/g, '\n')
        .replace(/\s*\[img\][\s\S]*?\[\/img\]\s*/gi, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function preserveCreatorMediaMarkup(existing, visibleText) {
    const media = String(existing || '').match(/\[media:[a-zA-Z0-9_-]+\]/g) || [];
    const legacy = String(existing || '').match(/\[img\][\s\S]*?\[\/img\]/gi) || [];
    const suffix = [...media, ...legacy].join('\n');
    const text = String(visibleText || '').trimEnd();
    return suffix ? `${text}${text ? '\n' : ''}${suffix}` : text;
}

function creatorMediaFieldValue(item, field) {
    if (field.startsWith('option-')) return item.options?.[Number(field.split('-')[1])] || '';
    return item[field] || '';
}

function setCreatorMediaFieldValue(item, field, value) {
    if (field.startsWith('option-')) item.options[Number(field.split('-')[1])] = value;
    else item[field] = value;
}

function renderCreatorMediaCards(value, field) {
    const ids = extractCreatorMediaIds(value);
    if (!ids.length) return '';
    return `<div class="creator-media-list" aria-label="Ảnh đã chèn">${ids.map(id => {
        const meta = creatorMediaMeta.get(id) || {};
        const src = creatorMediaURLs.get(id) || '';
        const dimensions = meta.width && meta.height ? `${meta.width}×${meta.height}` : 'Ảnh minh họa';
        return `<article class="creator-media-card" data-media-id="${escapeHTML(id)}">
            <button class="creator-media-preview" type="button" onclick="openCreatorMedia('${escapeHTML(id)}')" aria-label="Xem ảnh ${escapeHTML(meta.name || '')}">
                ${src ? `<img src="${src}" alt="Ảnh đã chèn">` : '<span class="creator-media-placeholder">Ảnh</span>'}
            </button>
            <span class="creator-media-info"><strong>${escapeHTML(meta.name || 'Ảnh đã chèn')}</strong><small>${escapeHTML(dimensions)} · ${formatMediaSize(meta.size)}</small></span>
            <span class="creator-media-actions"><button type="button" onclick="replaceCreatorMedia('${escapeHTML(field)}','${escapeHTML(id)}')">Thay</button><button class="danger" type="button" onclick="removeCreatorMedia('${escapeHTML(field)}','${escapeHTML(id)}')">Xóa</button></span>
        </article>`;
    }).join('')}</div>`;
}

function parseRichText(value) {
    if (!value) return '';
    let safe = escapeHTML(value).replace(/\n/g, '<br>');
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\[media:([a-zA-Z0-9_-]+)\]/gi, (_, id) => {
        const url = creatorMediaURLs.get(id);
        if (!url) return '<em class="media-missing">[Ảnh chưa sẵn sàng]</em>';
        return `<img class="rendered-img" src="${url}" alt="Hình minh họa" loading="lazy">`;
    });
    safe = safe.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_, source) => {
        const url = source.trim().replace(/\s/g, '');
        if (url.length > 6_000_000) return '<em>[Ảnh vượt giới hạn dung lượng]</em>';
        if (/^(data:image\/(?:png|jpeg|webp|gif);base64,|blob:)/i.test(url)) {
            return `<img class="rendered-img" src="${url}" alt="Hình minh họa" loading="lazy">`;
        }
        return '<em>[Ảnh không hợp lệ]</em>';
    });
    return safe;
}

function blobToDataURLLocal(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error || new Error('Không thể đọc ảnh.'));
        reader.readAsDataURL(blob);
    });
}

function dataURLToBlobLocal(dataURL) {
    const match = /^data:([^;,]+)(?:;base64)?,(.*)$/s.exec(String(dataURL || ''));
    if (!match) throw new Error('Ảnh base64 không hợp lệ.');
    const type = match[1] || 'image/png';
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type });
}

async function readImageDimensions(blob) {
    const url = URL.createObjectURL(blob);
    try {
        const image = await new Promise((resolve, reject) => {
            const element = new Image();
            element.onload = () => resolve(element);
            element.onerror = () => reject(new Error('Không thể đọc kích thước ảnh.'));
            element.src = url;
        });
        return { image, width: image.naturalWidth || image.width, height: image.naturalHeight || image.height, release: () => URL.revokeObjectURL(url) };
    } catch (error) {
        URL.revokeObjectURL(url);
        throw error;
    }
}

async function optimizeCreatorImage(file) {
    if (!(file instanceof Blob) || !String(file.type || '').startsWith('image/')) throw new Error('File đã chọn không phải hình ảnh.');
    if (file.size > MAX_CREATOR_IMAGE_BYTES) throw new Error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 12 MB.');
    if (file.type === 'image/gif') {
        const { width, height, release } = await readImageDimensions(file);
        release();
        return { blob: file, width, height, name: file.name || 'image.gif', optimized: false };
    }
    const { image, width, height, release } = await readImageDimensions(file);
    try {
        const scale = Math.min(1, 1600 / Math.max(width, height));
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));
        if (scale === 1 && file.size <= TARGET_CREATOR_IMAGE_BYTES && /image\/(?:webp|jpeg|png)/.test(file.type)) {
            return { blob: file, width, height, name: file.name || 'image', optimized: false };
        }
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext('2d', { alpha: true });
        if (!context) return { blob: file, width, height, name: file.name || 'image', optimized: false };
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, targetWidth, targetHeight);
        const output = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .82));
        if (!output) return { blob: file, width, height, name: file.name || 'image', optimized: false };
        const baseName = String(file.name || 'image').replace(/\.[^.]+$/, '').slice(0, 70) || 'image';
        return { blob: output, width: targetWidth, height: targetHeight, name: `${baseName}.webp`, optimized: true };
    } finally {
        release();
    }
}

function cacheCreatorMedia(record) {
    if (!record?.id || !(record.blob instanceof Blob)) return;
    const previous = creatorMediaURLs.get(record.id);
    if (previous) URL.revokeObjectURL(previous);
    creatorMediaURLs.set(record.id, URL.createObjectURL(record.blob));
    creatorMediaMeta.set(record.id, { name: record.name, type: record.type, size: record.size || record.blob.size, width: record.width, height: record.height });
}

async function hydrateCreatorMediaCache() {
    const records = await window.EdTechDB?.listMedia?.().catch(() => []) || [];
    records.forEach(cacheCreatorMedia);
}

async function storeCreatorMedia(file, existingId = null, { quiet = false } = {}) {
    const originalSize = file.size;
    const optimized = await optimizeCreatorImage(file);
    const record = await window.EdTechDB.saveMedia({
        id: existingId || makeId('media'),
        name: optimized.name,
        type: optimized.blob.type,
        size: optimized.blob.size,
        width: optimized.width,
        height: optimized.height,
        blob: optimized.blob
    });
    cacheCreatorMedia(record);
    if (!quiet && optimized.optimized) showToast(`Đã tối ưu ảnh: ${formatMediaSize(originalSize)} → ${formatMediaSize(record.size)}.`, 'success');
    return record;
}

async function openCreatorMedia(id) {
    let url = creatorMediaURLs.get(id);
    if (!url) {
        const record = await window.EdTechDB?.getMedia?.(id);
        if (record) { cacheCreatorMedia(record); url = creatorMediaURLs.get(id); }
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else showToast('Không tìm thấy ảnh này.', 'error');
}

async function replaceCreatorMedia(field, id) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
            await storeCreatorMedia(file, id);
            saveCreatorDrafts(true);
            renderCreator();
            playSound('upload');
        } catch (error) { showToast(error.message || 'Không thể thay ảnh.', 'error'); }
    };
    input.click();
}

function mediaIsReferenced(id) {
    const token = `[media:${id}]`;
    return ['quiz', 'flashcard'].some(mode => (creatorDrafts[mode] || []).some(item => {
        const values = mode === 'quiz' ? [item.question, item.explanation, ...(item.options || [])] : [item.front, item.back, item.explanation];
        return values.some(value => String(value || '').includes(token));
    }));
}

async function removeCreatorMedia(field, id) {
    const item = getActiveCreatorItem();
    const value = creatorMediaFieldValue(item, field);
    const next = String(value || '').replace(new RegExp(`\\s*\\[media:${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\]\\s*`, 'g'), '\n').replace(/\n{3,}/g, '\n\n').trim();
    setCreatorMediaFieldValue(item, field, next);
    saveCreatorDrafts(true);
    if (!mediaIsReferenced(id)) {
        await window.EdTechDB?.deleteMedia?.(id).catch(() => {});
        const url = creatorMediaURLs.get(id);
        if (url) URL.revokeObjectURL(url);
        creatorMediaURLs.delete(id);
        creatorMediaMeta.delete(id);
    }
    renderCreator();
    showToast('Đã xóa ảnh khỏi nội dung.', 'info');
}

async function materializeMediaMarkup(value) {
    let output = String(value || '');
    const ids = extractCreatorMediaIds(output);
    for (const id of ids) {
        const record = await window.EdTechDB?.getMedia?.(id);
        if (!record?.blob) continue;
        const dataURL = await blobToDataURLLocal(record.blob);
        output = output.replaceAll(`[media:${id}]`, `[img]${dataURL}[/img]`);
    }
    return output;
}

async function migrateEmbeddedCreatorMedia() {
    let changed = false;
    const fieldsFor = (mode, item) => mode === 'quiz' ? ['question', 'explanation', ...(item.options || []).map((_, index) => `option-${index}`)] : ['front', 'back', 'explanation'];
    for (const mode of ['quiz', 'flashcard']) {
        for (const item of creatorDrafts[mode] || []) {
            for (const field of fieldsFor(mode, item)) {
                let value = creatorMediaFieldValue(item, field);
                const matches = [...String(value || '').matchAll(/\[img\](data:image\/(?:png|jpeg|webp|gif);base64,[\s\S]*?)\[\/img\]/gi)];
                for (const match of matches) {
                    try {
                        const blob = dataURLToBlobLocal(match[1].replace(/\s/g, ''));
                        const file = typeof File === 'function' ? new File([blob], `legacy-${Date.now()}.${blob.type.split('/')[1] || 'png'}`, { type: blob.type }) : blob;
                        const record = await storeCreatorMedia(file, null, { quiet: true });
                        value = value.replace(match[0], `[media:${record.id}]`);
                        changed = true;
                    } catch (error) { console.warn('Không thể chuyển một ảnh base64 cũ:', error); }
                }
                setCreatorMediaFieldValue(item, field, value);
            }
        }
    }
    if (changed) await saveCreatorDrafts(true);
}

function shuffleArray(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
}

function formatDuration(seconds) {
    const value = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(value / 60);
    const remaining = value % 60;
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

function formatLongDuration(seconds) {
    const value = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(value / 60);
    const remaining = value % 60;
    if (minutes === 0) return `${remaining} giây`;
    return `${minutes} phút ${remaining} giây`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'Không rõ';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function timeAgo(timestamp) {
    const date = new Date(timestamp).getTime();
    const diff = Date.now() - date;
    if (!Number.isFinite(diff)) return '';
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return formatDate(timestamp);
}

function typesetMath(target) {
    if (!window.MathJax?.typesetPromise) return;
    const elements = target ? [target] : undefined;
    window.MathJax.typesetPromise(elements).catch(() => {});
}

function showToast(message, type = 'info') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const symbol = type === 'success' ? '✓' : type === 'error' ? '!' : 'i';
    toast.innerHTML = `<span class="toast-icon">${symbol}</span><span>${escapeHTML(message)}</span>`;
    stack.appendChild(toast);
    window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(18px)';
        window.setTimeout(() => toast.remove(), 220);
    }, 3200);
}

let confirmCancelCallback = null;

function openConfirmModal(title, message, actionLabel, callback, cancelLabel = 'Hủy', cancelCallback = null) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    const button = document.getElementById('confirm-action-btn');
    const cancelButton = document.getElementById('confirm-cancel-btn');
    button.textContent = actionLabel;
    cancelButton.textContent = cancelLabel;
    confirmCallback = callback;
    confirmCancelCallback = cancelCallback;
    button.onclick = () => {
        const next = confirmCallback;
        closeConfirmModal(false);
        if (typeof next === 'function') next();
    };
    document.getElementById('confirm-modal').hidden = false;
}

function closeConfirmModal(runCancel = false) {
    document.getElementById('confirm-modal').hidden = true;
    const cancel = confirmCancelCallback;
    confirmCallback = null;
    confirmCancelCallback = null;
    if (runCancel && typeof cancel === 'function') cancel();
}

function showScreen(screenId, options = {}) {
    document.querySelectorAll('.app-screen').forEach(screen => screen.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (!target) return;
    target.classList.add('active');
    document.body.classList.toggle('quiz-screen-active', screenId === 'quiz-app');
    document.body.classList.toggle('quiz-result-active', screenId === 'quiz-result-screen');
    if (screenId !== 'quiz-app') closeMobileQuizNavigator(true);
    if (screenId !== 'quiz-result-screen') closeMobileResultReview(true);

    const navTarget = ['quiz-app', 'quiz-result-screen', 'flashcard-app', 'flashcard-result-screen'].includes(screenId)
        ? 'upload-screen'
        : screenId;
    document.querySelectorAll('.nav-link').forEach(button => {
        button.classList.toggle('active', button.dataset.screen === navTarget);
    });

    if (screenId === 'dashboard-screen') renderDashboard();
    if (screenId === 'history-screen') renderHistoryTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('navigate');
}

function renderDashboard() {
    const history = Array.isArray(appData.history) ? appData.history : [];
    const quizHistory = history.filter(item => item.mode === 'quiz');
    const totalCorrect = quizHistory.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
    const totalQuestions = quizHistory.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    document.getElementById('stat-sessions').textContent = history.length;
    document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
    document.getElementById('stat-xp').textContent = `${Number(appData.xp) || 0} XP`;
    document.getElementById('stat-cards').textContent = Number(appData.reviewedCards) || 0;

    const container = document.getElementById('dashboard-history');
    const latest = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    if (!latest.length) {
        container.innerHTML = '<div class="empty-state"><span><strong>Chưa có hoạt động nào</strong><small>Bắt đầu một bài trắc nghiệm hoặc bộ flashcard để xem tiến độ tại đây.</small></span></div>';
        return;
    }

    container.innerHTML = latest.map(item => {
        const isQuiz = item.mode === 'quiz';
        const score = isQuiz ? `${item.correct || 0}/${item.total || 0}` : `${item.good || 0}/${item.total || 0} nhớ tốt`;
        return `<div class="activity-item">
            <span class="activity-icon ${isQuiz ? 'blue' : 'green'}"><svg><use href="#${isQuiz ? 'i-quiz' : 'i-cards'}"></use></svg></span>
            <span class="activity-copy"><strong>${escapeHTML(item.file || 'Không tên')}</strong><small>${isQuiz ? 'Trắc nghiệm' : 'Flashcard'} · ${timeAgo(item.timestamp)}</small></span>
            <span class="activity-score"><strong>${escapeHTML(score)}</strong><small>+${Number(item.xp) || 0} XP</small></span>
        </div>`;
    }).join('');
}

function showHistoryScreen() {
    showScreen('history-screen');
}

function renderHistoryTable() {
    const history = Array.isArray(appData.history) ? [...appData.history] : [];
    const filter = document.getElementById('history-filter')?.value || 'all';
    const query = (document.getElementById('history-search')?.value || '').trim().toLowerCase();
    const filtered = history
        .filter(item => filter === 'all' || item.mode === filter)
        .filter(item => !query || String(item.file || '').toLowerCase().includes(query))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    document.getElementById('history-total-sessions').textContent = history.length;
    document.getElementById('history-total-quizzes').textContent = history.filter(item => item.mode === 'quiz').length;
    document.getElementById('history-total-flashcards').textContent = history.filter(item => item.mode === 'flashcard').length;
    document.getElementById('history-total-xp').textContent = `${Number(appData.xp) || 0} XP`;

    const tbody = document.getElementById('history-table-body');
    if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-soft);padding:32px">Không có hoạt động phù hợp.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(item => {
        const isQuiz = item.mode === 'quiz';
        const result = isQuiz
            ? `${item.correct || 0}/${item.total || 0} (${item.accuracy || 0}%)`
            : `${item.good || 0}/${item.total || 0} nhớ tốt`;
        const hasSource = Array.isArray(item.sourceRows) && item.sourceRows.length > 1;
        const hasFocusRows = isQuiz
            ? Array.isArray(item.wrongRows) && item.wrongRows.length > 1
            : Array.isArray(item.hardRows) && item.hardRows.length > 1;
        return `<tr>
            <td>${formatDate(item.timestamp)}</td>
            <td><span class="history-mode-chip ${item.mode}">${isQuiz ? 'Trắc nghiệm' : 'Flashcard'}</span></td>
            <td><strong>${escapeHTML(item.file || 'Không tên')}</strong></td>
            <td>${escapeHTML(result)}</td>
            <td>${formatLongDuration(item.duration || 0)}</td>
            <td><strong>+${Number(item.xp) || 0} XP</strong></td>
            <td><div class="history-actions">
                <button type="button" ${hasSource ? '' : 'disabled'} onclick="repeatHistorySession('${item.id}')">${isQuiz ? 'Làm lại' : 'Ôn lại'}</button>
                ${isQuiz && Array.isArray(item.review) ? `<button type="button" onclick="reviewHistoryQuiz('${item.id}')">Xem lại</button>` : ''}
                <button type="button" ${hasFocusRows ? '' : 'disabled'} onclick="repeatHistorySession('${item.id}', true)">${isQuiz ? 'Câu sai' : 'Thẻ khó'}</button>
                <button class="danger" type="button" onclick="deleteHistoryItem('${item.id}')">Xóa</button>
            </div></td>
        </tr>`;
    }).join('');
}

function getHistoryItem(id) {
    return (Array.isArray(appData.history) ? appData.history : []).find(item => item.id === id) || null;
}

function repeatHistorySession(id, focusOnly = false) {
    const item = getHistoryItem(id);
    if (!item) return;
    const rows = focusOnly ? (item.mode === 'quiz' ? item.wrongRows : item.hardRows) : item.sourceRows;
    if (!Array.isArray(rows) || rows.length < 2) {
        showToast('Phiên cũ này chưa lưu dữ liệu nguồn để học lại.', 'info');
        return;
    }
    currentFileName = `${item.file || 'Bộ học'}${focusOnly ? (item.mode === 'quiz' ? ' · Câu sai' : ' · Thẻ khó') : ''}`;
    if (item.mode === 'quiz') startQuizMode(clone(rows));
    else startFlashcardMode(clone(rows));
}

function reviewHistoryQuiz(id) {
    const item = getHistoryItem(id);
    if (!item || item.mode !== 'quiz' || !Array.isArray(item.review)) {
        showToast('Không có dữ liệu xem lại cho phiên này.', 'info');
        return;
    }
    lastQuizResult = {
        correct: Number(item.correct) || 0,
        wrong: Number(item.wrong) || 0,
        empty: Number(item.empty) || 0,
        total: Number(item.total) || item.review.length,
        accuracy: Number(item.accuracy) || 0,
        xp: Number(item.xp) || 0,
        duration: Number(item.duration) || 0,
        review: clone(item.review),
        fileName: item.file || 'Bộ đề trắc nghiệm',
        completedAt: item.timestamp
    };
    lastQuizSource = Array.isArray(item.sourceRows) ? { rows: clone(item.sourceRows), fileName: item.file } : null;
    renderQuizResult(lastQuizResult);
    showScreen('quiz-result-screen');
}

function deleteHistoryItem(id) {
    const item = getHistoryItem(id);
    if (!item) return;
    openConfirmModal('Xóa mục lịch sử?', `Phiên “${item.file || 'Không tên'}” sẽ bị xóa khỏi lịch sử. Điểm tích lũy không thay đổi.`, 'Xóa mục', () => {
        appData.history = appData.history.filter(entry => entry.id !== id);
        saveLearningData();
        renderHistoryTable();
        renderDashboard();
        playSound('delete');
        showToast('Đã xóa mục lịch sử.', 'success');
    });
}

function requestClearLearningData() {
    openConfirmModal(
        'Xóa dữ liệu học tập?',
        'Lịch sử, điểm tích lũy và lịch ôn flashcard sẽ bị xóa. Các bộ đề đang soạn vẫn được giữ lại.',
        'Xóa dữ liệu',
        clearLearningData
    );
}

function clearLearningData() {
    appData = clone(EMPTY_DATA);
    saveLearningData();
    renderDashboard();
    renderHistoryTable();
    playSound('delete');
    showToast('Đã xóa toàn bộ dữ liệu học tập.', 'success');
    showScreen('dashboard-screen');
}

function openPracticeSetup(mode) {
    if (mode) selectStudyMode(mode, false);
    showScreen('upload-screen');
    updateSetupSummary();
}

function selectStudyMode(mode, shouldSound = true) {
    studyMode = mode === 'flashcard' ? 'flashcard' : 'quiz';
    document.getElementById('btn-mode-quiz').classList.toggle('active', studyMode === 'quiz');
    document.getElementById('btn-mode-fc').classList.toggle('active', studyMode === 'flashcard');
    document.getElementById('config-quiz').hidden = studyMode !== 'quiz';
    document.getElementById('config-fc').hidden = studyMode !== 'flashcard';
    savePreferences();
    updateSetupSummary();
    if (shouldSound) playSound('select');
}

function updateSetupSummary() {
    const fileName = currentFileName || 'Chưa chọn file';
    document.getElementById('summary-file-name').textContent = fileName;
    document.getElementById('summary-mode').textContent = studyMode === 'quiz' ? 'Trắc nghiệm' : 'Flashcard thông minh';
    document.getElementById('summary-time').textContent = studyMode === 'quiz'
        ? ((Number(document.getElementById('time-limit')?.value) || 0) > 0 ? `${Number(document.getElementById('time-limit').value)} phút` : 'Không giới hạn')
        : 'Theo tiến độ ghi nhớ';
    const shuffle = studyMode === 'quiz'
        ? document.getElementById('shuffle-questions')?.checked || document.getElementById('shuffle-options')?.checked
        : document.getElementById('fc-shuffle')?.checked;
    document.getElementById('summary-shuffle').textContent = shuffle ? 'Có' : 'Không';
    document.getElementById('start-study-btn').disabled = !selectedWorkbookData;
}

async function handleWorkbookFile(file) {
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
        showToast('Vui lòng chọn file Excel .xlsx hoặc .xls.', 'error');
        return;
    }
    const dropTitle = document.getElementById('drop-title');
    const dropSubtitle = document.getElementById('drop-subtitle');
    try {
        if (dropTitle) dropTitle.textContent = 'Đang đọc bộ đề…';
        if (dropSubtitle) dropSubtitle.textContent = 'Ứng dụng vẫn hoạt động trong khi xử lý file.';
        let rows;
        const arrayBuffer = await file.arrayBuffer();
        try {
            rows = await window.EdTechWorker.parseExcel(arrayBuffer, progress => {
                if (dropSubtitle) dropSubtitle.textContent = `${progress.message || 'Đang xử lý'} ${progress.percent || 0}%`;
            });
        } catch (workerError) {
            console.warn('Worker Excel fallback:', workerError);
            const XLSX = await window.EdTechLibraries.loadXLSX();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
        }
        if (!Array.isArray(rows) || rows.length < 2) throw new Error('File không có dữ liệu hợp lệ.');

        selectedWorkbookData = rows;
        currentFileName = file.name.replace(/\.(xlsx|xls)$/i, '');
        document.getElementById('selected-file-pill').hidden = false;
        document.getElementById('selected-file-pill').textContent = file.name;
        if (dropTitle) dropTitle.textContent = 'Đã chọn bộ đề';
        if (dropSubtitle) dropSubtitle.textContent = `${Math.max(0, rows.length - 1)} dòng dữ liệu được phát hiện`;
        updateSetupSummary();
        const stored = await window.EdTechDB?.saveQuestionSet({
            id: `set-${simpleHash(`${currentFileName}|${rows.length}|${JSON.stringify(rows.slice(0, 3))}`)}`,
            name: currentFileName,
            type: studyMode,
            rows: clone(rows),
            source: 'excel'
        });
        if (stored) window.renderLocalQuestionSets?.();
        playSound('upload');
        showToast('Đã đọc và lưu bộ đề trên thiết bị.', 'success');
    } catch (error) {
        selectedWorkbookData = null;
        currentFileName = '';
        if (dropTitle) dropTitle.textContent = 'Kéo thả file vào đây hoặc bấm để chọn';
        if (dropSubtitle) dropSubtitle.textContent = 'Hỗ trợ .xlsx và .xls';
        updateSetupSummary();
        showToast(error.message || 'Không thể đọc file Excel.', 'error');
    }
}

function startSelectedStudy() {
    if (!selectedWorkbookData) {
        showToast('Bạn chưa chọn file Excel.', 'error');
        return;
    }
    savePreferences();
    lastWorkbookData = clone(selectedWorkbookData);
    if (studyMode === 'quiz') startQuizMode(selectedWorkbookData);
    else startFlashcardMode(selectedWorkbookData);
}

function normalizeHeader(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
}

function detectWorkbookColumns(rows) {
    const headers = (rows?.[0] || []).map(normalizeHeader);
    const find = (...terms) => headers.findIndex(header => terms.some(term => header.includes(term)));
    const question = Math.max(0, find('cau hoi', 'question', 'mat truoc', 'front'));
    let optionColumns = headers.map((header, index) => ({ header, index })).filter(item => /dap an [1-6]|option [1-6]/.test(item.header)).map(item => item.index);
    if (!optionColumns.length) optionColumns = [1, 2, 3, 4].filter(index => index < (rows?.[0]?.length || 7));
    return {
        question,
        optionColumns,
        correct: find('dap an dung', 'correct'),
        explanation: find('giai thich', 'explanation', 'ghi chu', 'note'),
        tags: find('nhan', 'tags'),
        difficulty: find('do kho', 'difficulty'),
        reversible: find('dao chieu', 'reversible')
    };
}

function parseQuizRows(rows) {
    const parsed = [];
    const columns = detectWorkbookColumns(rows);
    for (let index = 1; index < rows.length; index += 1) {
        const row = rows[index] || [];
        const question = String(row[columns.question] ?? '').trim();
        if (!question) continue;
        const rawOptions = columns.optionColumns.map(column => String(row[column] ?? '').trim()).filter(Boolean).slice(0, 6);
        if (rawOptions.length < 2) continue;
        const rawCorrect = columns.correct >= 0 ? row[columns.correct] : row[5];
        let answerIndex = normalizeCorrectIndex(rawCorrect);
        if (Number.isInteger(Number(rawCorrect)) && Number(rawCorrect) >= 1 && Number(rawCorrect) <= rawOptions.length) answerIndex = Number(rawCorrect) - 1;
        if (answerIndex === null || answerIndex >= rawOptions.length) answerIndex = 0;
        const optionObjects = rawOptions.map((text, optionIndex) => ({ text, correct: optionIndex === answerIndex }));
        if (preferences.shuffleOptions) shuffleArray(optionObjects);
        parsed.push({
            id: `q-${index}-${simpleHash(question)}`,
            question,
            options: optionObjects.map(option => option.text),
            correct: optionObjects.findIndex(option => option.correct),
            explanation: String(columns.explanation >= 0 ? row[columns.explanation] ?? '' : row[6] ?? '').trim(),
            tags: columns.tags >= 0 ? String(row[columns.tags] || '').split(',').map(tag => tag.trim()).filter(Boolean) : [],
            difficulty: columns.difficulty >= 0 ? String(row[columns.difficulty] || 'medium').trim().toLowerCase() : 'medium'
        });
    }
    if (preferences.shuffleQuestions) shuffleArray(parsed);
    return parsed;
}

function quizQuestionsToRows(questions) {
    const rows = [['Câu hỏi', 'Đáp án 1', 'Đáp án 2', 'Đáp án 3', 'Đáp án 4', 'Đáp án 5', 'Đáp án 6', 'Đáp án đúng', 'Giải thích', 'Nhãn', 'Độ khó']];
    (questions || []).forEach(question => {
        const options = (question.options || []).slice(0, 6);
        rows.push([
            question.question || '',
            ...options,
            ...Array(Math.max(0, 6 - options.length)).fill(''),
            (Number(question.correct) || 0) + 1,
            question.explanation || '',
            (question.tags || []).join(', '),
            question.difficulty || 'medium'
        ]);
    });
    return rows;
}

function startQuizMode(rows) {
    quizData = parseQuizRows(rows);
    if (!quizData.length) {
        showToast('Không tìm thấy câu hỏi trắc nghiệm hợp lệ trong file.', 'error');
        return;
    }

    lastQuizSource = { rows: clone(rows), fileName: currentFileName };
    quizAnswers = Array(quizData.length).fill(null);
    flaggedQuestions = new Set();
    quizSubmitted = false;
    quizNavPage = 0;
    currentQuizIndex = 0;
    quizElapsed = 0;
    quizTimeLimitSeconds = Math.max(0, Number(preferences.timeLimit) || 0) * 60;
    quizStartedAt = Date.now();
    quizDeadline = quizTimeLimitSeconds > 0 ? quizStartedAt + quizTimeLimitSeconds * 1000 : 0;
    clearInterval(quizTimer);

    document.getElementById('quiz-title').textContent = currentFileName || 'Bộ đề trắc nghiệm';
    renderQuizUI();
    showScreen('quiz-app');
    persistActiveQuizSession();

    quizTimer = window.setInterval(updateQuizTimer, 500);
    updateQuizTimer();
    playSound('start');
}

function updateQuizTimer() {
    const display = document.getElementById('timer-display');
    if (!display || quizSubmitted) return;
    const now = Date.now();
    quizElapsed = Math.max(0, Math.floor((now - (quizStartedAt || now)) / 1000));
    if (quizTimeLimitSeconds > 0) {
        const remaining = Math.max(0, Math.ceil((quizDeadline - now) / 1000));
        display.textContent = formatDuration(remaining);
        if (remaining <= 0) {
            clearInterval(quizTimer);
            showToast('Đã hết thời gian. Bài được nộp tự động.', 'info');
            gradeQuiz(true);
        }
    } else {
        display.textContent = formatDuration(quizElapsed);
    }
}

function renderQuizUI() {
    renderCurrentQuizQuestion();
    renderQuizNavigator();
    updateQuizProgress();
}

function renderCurrentQuizQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer || !quizData.length) return;
    currentQuizIndex = Math.max(0, Math.min(quizData.length - 1, Number(currentQuizIndex) || 0));
    const question = quizData[currentQuizIndex];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const selected = quizAnswers[currentQuizIndex];
    const options = question.options.map((option, optionIndex) => `
        <label class="option-item ${selected === optionIndex ? 'selected' : ''}" id="opt-${currentQuizIndex}-${optionIndex}">
            <input type="radio" name="q-${currentQuizIndex}" value="${optionIndex}" onchange="selectQuizAnswer(${currentQuizIndex}, ${optionIndex})" ${selected === optionIndex ? 'checked' : ''}>
            <span class="radio-custom"></span>
            <span class="option-letter">${letters[optionIndex]}</span>
            <span class="option-text">${parseRichText(option)}</span>
        </label>`).join('');
    questionsContainer.innerHTML = `<article class="question-card question-card-virtual" id="question-card-${currentQuizIndex}">
        <div class="q-title-row">
            <span class="q-number">Câu ${currentQuizIndex + 1} / ${quizData.length}</span>
            <button class="flag-btn ${flaggedQuestions.has(currentQuizIndex) ? 'active' : ''}" id="flag-btn-${currentQuizIndex}" onclick="toggleQuizFlag(${currentQuizIndex})"><svg><use href="#i-flag"></use></svg>${flaggedQuestions.has(currentQuizIndex) ? 'Đã đánh dấu' : 'Đánh dấu'}</button>
        </div>
        <div class="q-content">${parseRichText(question.question)}</div>
        <div class="options-list">${options}</div>
        <div class="quiz-question-controls">
            <button class="btn btn-secondary quiz-step-btn quiz-step-prev" type="button" onclick="moveQuizQuestion(-1)" ${currentQuizIndex <= 0 ? 'disabled' : ''}><svg><use href="#i-back"></use></svg><span>Câu trước</span></button>
            <span><strong>${currentQuizIndex + 1}</strong><small>trên ${quizData.length}</small></span>
            <button class="btn btn-secondary quiz-step-btn quiz-step-next" type="button" onclick="moveQuizQuestion(1)" ${currentQuizIndex >= quizData.length - 1 ? 'disabled' : ''}><span>Câu tiếp</span><svg><use href="#i-chevron-right"></use></svg></button>
        </div>
    </article>`;
    typesetMath(questionsContainer);
    updateQuizProgress();
}

function moveQuizQuestion(direction) {
    const next = Math.max(0, Math.min(quizData.length - 1, currentQuizIndex + Number(direction || 0)));
    if (next === currentQuizIndex) return;
    currentQuizIndex = next;
    quizNavPage = Math.floor(currentQuizIndex / QUIZ_NAV_PAGE_SIZE);
    renderQuizUI();
    persistActiveQuizSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('navigate');
}

function renderQuizNavigator() {
    const navGrid = document.getElementById('nav-grid');
    if (!navGrid) return;
    const totalPages = Math.max(1, Math.ceil(quizData.length / QUIZ_NAV_PAGE_SIZE));
    quizNavPage = Math.min(Math.max(0, quizNavPage), totalPages - 1);
    const start = quizNavPage * QUIZ_NAV_PAGE_SIZE;
    const end = Math.min(start + QUIZ_NAV_PAGE_SIZE, quizData.length);

    navGrid.innerHTML = quizData.slice(start, end).map((_, offset) => {
        const index = start + offset;
        const classes = ['nav-item'];
        if (index === currentQuizIndex) classes.push('current');
        if (flaggedQuestions.has(index)) classes.push('flagged');
        else if (quizAnswers[index] !== null) classes.push('done');
        return `<button class="${classes.join(' ')}" id="nav-${index}" onclick="scrollToQuizQuestion(${index})" aria-current="${index === currentQuizIndex ? 'step' : 'false'}">${index + 1}</button>`;
    }).join('');

    const label = document.getElementById('quiz-nav-page-label');
    const range = document.getElementById('quiz-nav-range');
    const prev = document.getElementById('quiz-nav-prev');
    const next = document.getElementById('quiz-nav-next');
    if (label) label.textContent = `${quizNavPage + 1} / ${totalPages}`;
    if (range) range.textContent = quizData.length ? `Câu ${start + 1}–${end}` : 'Chưa có câu hỏi';
    if (prev) prev.disabled = quizNavPage <= 0;
    if (next) next.disabled = quizNavPage >= totalPages - 1;
}

function changeQuizNavPage(direction) {
    const totalPages = Math.max(1, Math.ceil(quizData.length / QUIZ_NAV_PAGE_SIZE));
    quizNavPage = Math.min(Math.max(0, quizNavPage + Number(direction || 0)), totalPages - 1);
    renderQuizNavigator();
    updateQuizProgress();
    playSound('navigate');
}

function selectQuizAnswer(questionIndex, optionIndex) {
    if (quizSubmitted) return;
    quizAnswers[questionIndex] = optionIndex;
    document.querySelectorAll(`input[name="q-${questionIndex}"]`).forEach(input => input.closest('.option-item')?.classList.toggle('selected', Number(input.value) === optionIndex));
    updateQuizProgress();
    persistActiveQuizSession();
    playSound('select');
}

function toggleQuizFlag(questionIndex) {
    if (quizSubmitted) return;
    if (flaggedQuestions.has(questionIndex)) flaggedQuestions.delete(questionIndex);
    else flaggedQuestions.add(questionIndex);
    const button = document.getElementById(`flag-btn-${questionIndex}`);
    button?.classList.toggle('active', flaggedQuestions.has(questionIndex));
    if (button) button.lastChild.textContent = flaggedQuestions.has(questionIndex) ? 'Đã đánh dấu' : 'Đánh dấu';
    updateQuizProgress();
    persistActiveQuizSession();
    playSound('flag');
}

function updateQuizProgress() {
    const answered = quizAnswers.filter(answer => answer !== null).length;
    const total = quizData.length || 1;
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    if (progressText) progressText.textContent = `${answered} / ${quizData.length}`;
    if (progressBar) progressBar.style.width = `${(answered / total) * 100}%`;
    updateMobileQuizProgress(answered, quizData.length);
    document.querySelectorAll('.quiz-nav-grid .nav-item').forEach(nav => {
        const index = Number(nav.id.replace('nav-', ''));
        nav.className = 'nav-item';
        if (index === currentQuizIndex) nav.classList.add('current');
        if (flaggedQuestions.has(index)) nav.classList.add('flagged');
        else if (quizAnswers[index] !== null) nav.classList.add('done');
    });
}

function scrollToQuizQuestion(index) {
    currentQuizIndex = Math.max(0, Math.min(quizData.length - 1, Number(index) || 0));
    quizNavPage = Math.floor(currentQuizIndex / QUIZ_NAV_PAGE_SIZE);
    if (window.matchMedia('(max-width: 900px)').matches && document.body.classList.contains('quiz-nav-open')) closeMobileQuizNavigator();
    renderQuizUI();
    persistActiveQuizSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function gradeQuiz(autoSubmit = false) {
    closeMobileQuizNavigator();
    if (quizSubmitted) return;
    const answeredCount = quizAnswers.filter(answer => answer !== null).length;
    if (!autoSubmit && answeredCount < quizData.length) {
        openConfirmModal(
            'Nộp bài khi chưa hoàn thành?',
            `Bạn đã trả lời ${answeredCount}/${quizData.length} câu. Các câu bỏ trống sẽ được tính là chưa trả lời.`,
            'Nộp bài',
            () => finalizeQuiz()
        );
        return;
    }
    finalizeQuiz();
}

function finalizeQuiz() {
    quizSubmitted = true;
    clearInterval(quizTimer);

    let correct = 0;
    let wrong = 0;
    let empty = 0;
    const review = quizData.map((question, index) => {
        const userAnswer = quizAnswers[index];
        let status = 'empty';
        if (userAnswer === null) empty += 1;
        else if (userAnswer === question.correct) {
            status = 'correct';
            correct += 1;
        } else {
            status = 'wrong';
            wrong += 1;
        }
        return { ...question, userAnswer, status };
    });

    const total = quizData.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const xp = correct * 10;
    appData.xp = (Number(appData.xp) || 0) + xp;
    const wrongQuestions = review.filter(item => item.status !== 'correct');
    const historyItem = {
        id: makeId('history'),
        timestamp: new Date().toISOString(),
        mode: 'quiz',
        file: currentFileName || 'Bộ đề trắc nghiệm',
        correct,
        wrong,
        empty,
        total,
        accuracy,
        duration: quizElapsed,
        xp,
        sourceRows: lastQuizSource?.rows ? clone(lastQuizSource.rows) : quizQuestionsToRows(quizData),
        wrongRows: quizQuestionsToRows(wrongQuestions),
        review: clone(review)
    };
    appData.history.push(historyItem);
    saveLearningData();

    lastQuizResult = { correct, wrong, empty, total, accuracy, xp, duration: quizElapsed, review, fileName: currentFileName, completedAt: historyItem.timestamp };
    renderQuizResult(lastQuizResult);
    showScreen('quiz-result-screen');
    playSound(accuracy >= 70 ? 'success' : 'complete');
}

function renderQuizResult(result) {
    const completedAt = new Date(result.completedAt || Date.now());
    const resultFileName = result.fileName || 'Bộ đề trắc nghiệm';
    const completedLabel = `Hoàn thành lúc ${new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).format(completedAt)}`;
    document.getElementById('result-file-name').textContent = resultFileName;
    document.getElementById('result-completed-at').textContent = completedLabel;
    const mobileFileName = document.getElementById('result-mobile-file-name');
    const mobileCompletedAt = document.getElementById('result-mobile-completed-at');
    if (mobileFileName) mobileFileName.textContent = resultFileName;
    if (mobileCompletedAt) mobileCompletedAt.textContent = completedLabel;
    document.getElementById('result-percent').textContent = `${result.accuracy}%`;
    document.getElementById('result-fraction').textContent = `${result.correct} / ${result.total} đúng`;
    document.getElementById('result-correct').textContent = result.correct;
    document.getElementById('result-wrong').textContent = result.wrong;
    document.getElementById('result-empty').textContent = result.empty;
    document.getElementById('result-time').textContent = formatDuration(result.duration);
    document.getElementById('result-score-ring').style.setProperty('--score', `${result.accuracy * 3.6}deg`);
    const retryWrongButton = document.getElementById('retry-wrong-btn');
    if (retryWrongButton) retryWrongButton.hidden = !result.review.some(item => item.status !== 'correct');
    const mobileReviewCount = document.getElementById('mobile-review-count');
    if (mobileReviewCount) mobileReviewCount.textContent = `${result.review.length} câu`;
    closeMobileResultReview(true);

    let title = 'Cứ tiếp tục nhé!';
    let message = `Bạn nhận được ${result.xp} XP. Hãy xem lại những câu chưa đúng để ghi nhớ chắc hơn.`;
    if (result.accuracy >= 90) title = 'Xuất sắc!';
    else if (result.accuracy >= 70) title = 'Làm tốt lắm!';
    else if (result.accuracy >= 50) title = 'Bạn đang tiến bộ!';
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    document.getElementById('result-review-list').innerHTML = result.review.map((item, index) => {
        const statusLabel = item.status === 'correct' ? 'Đúng' : item.status === 'wrong' ? 'Sai' : 'Bỏ trống';
        const userText = item.userAnswer === null ? 'Chưa trả lời' : `${letters[item.userAnswer]}. ${item.options[item.userAnswer]}`;
        const correctText = `${letters[item.correct]}. ${item.options[item.correct]}`;
        return `<article class="review-item" data-status="${item.status}">
            <div class="review-item-header"><strong>Câu ${index + 1}: ${parseRichText(item.question)}</strong><span class="status-chip ${item.status}">${statusLabel}</span></div>
            <div class="review-answer-row"><div><small>Bạn chọn</small>${parseRichText(userText)}</div><div><small>Đáp án đúng</small>${parseRichText(correctText)}</div></div>
            ${item.explanation ? `<div class="review-explanation"><small>Giải thích</small>${parseRichText(item.explanation)}</div>` : ''}
        </article>`;
    }).join('');
    typesetMath(document.getElementById('result-review-list'));
}


function openMobileResultReview() {
    const panel = document.getElementById('result-review-panel');
    const backdrop = document.getElementById('result-review-mobile-backdrop');
    if (!panel) return;
    if (!window.matchMedia('(max-width: 680px)').matches) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    clearTimeout(mobileResultReviewTimer);
    if (backdrop) backdrop.hidden = false;
    requestAnimationFrame(() => {
        document.body.classList.add('result-review-open');
        backdrop?.classList.add('is-open');
        panel.querySelector('.result-review-mobile-close')?.focus({ preventScroll: true });
    });
}

function closeMobileResultReview(immediate = false) {
    const backdrop = document.getElementById('result-review-mobile-backdrop');
    clearTimeout(mobileResultReviewTimer);
    document.body.classList.remove('result-review-open');
    backdrop?.classList.remove('is-open');
    const finish = () => {
        if (backdrop) backdrop.hidden = true;
    };
    if (immediate) finish();
    else mobileResultReviewTimer = setTimeout(finish, 260);
}

function filterReview(filter, button) {
    document.querySelectorAll('.review-filter button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.review-item').forEach(item => {
        item.hidden = filter === 'wrong' && item.dataset.status === 'correct';
    });
}

function retryWrongQuiz() {
    const wrongQuestions = lastQuizResult?.review?.filter(item => item.status !== 'correct') || [];
    if (!wrongQuestions.length) {
        showToast('Không có câu sai hoặc bỏ trống để luyện lại.', 'info');
        return;
    }
    currentFileName = `${lastQuizResult.fileName || 'Bộ đề'} · Câu sai`;
    startQuizMode(quizQuestionsToRows(wrongQuestions));
}

function retryLastQuiz() {
    if (!lastQuizSource) {
        openPracticeSetup('quiz');
        return;
    }
    currentFileName = lastQuizSource.fileName;
    startQuizMode(clone(lastQuizSource.rows));
}

function confirmLeaveQuiz() {
    if (quizSubmitted) {
        showScreen('dashboard-screen');
        return;
    }
    openConfirmModal('Rời bài đang làm?', 'Tiến độ hiện tại đã được tự động lưu. Bạn có thể tiếp tục bài này sau khi mở lại trang.', 'Rời bài', () => {
        clearInterval(quizTimer);
        showScreen('dashboard-screen');
    });
}

function parseFlashcardRows(rows) {
    const cards = [];
    const columns = detectWorkbookColumns(rows);
    for (let index = 1; index < rows.length; index += 1) {
        const row = rows[index] || [];
        const front = String(row[columns.question] ?? row[0] ?? '').trim();
        if (!front) continue;
        const backColumn = columns.optionColumns[0] ?? 1;
        const back = String(row[backColumn] ?? '').trim();
        if (!back) continue;
        cards.push({
            id: `fc-${simpleHash(`${front}|${back}`)}`,
            front,
            back,
            explanation: String(columns.explanation >= 0 ? row[columns.explanation] ?? '' : row[6] ?? '').trim(),
            tags: columns.tags >= 0 ? String(row[columns.tags] || '').split(',').map(tag => tag.trim()).filter(Boolean) : [],
            difficulty: columns.difficulty >= 0 ? String(row[columns.difficulty] || 'medium').trim().toLowerCase() : 'medium',
            reversible: columns.reversible >= 0 ? !/^(khong|no|false|0)$/i.test(normalizeHeader(row[columns.reversible])) : true
        });
    }
    return cards;
}

function getDeckSchedule(deckKey) {
    if (!appData.flashcards[deckKey]) appData.flashcards[deckKey] = {};
    return appData.flashcards[deckKey];
}

function getCardMeta(deckKey, cardId) {
    const deck = getDeckSchedule(deckKey);
    return deck[cardId] || null;
}

function flashcardsToRows(cards) {
    const rows = [['Câu hỏi', 'Đáp án 1', 'Đáp án 2', 'Đáp án 3', 'Đáp án 4', 'Đáp án 5', 'Đáp án 6', 'Đáp án đúng', 'Giải thích', 'Nhãn', 'Độ khó', 'Đảo chiều']];
    (cards || []).forEach(card => rows.push([card.front || '', card.back || '', '', '', '', '', '', 1, card.explanation || '', (card.tags || []).join(', '), card.difficulty || 'medium', card.reversible === false ? 'Không' : 'Có']));
    return rows;
}

function startFlashcardMode(rows) {
    const cards = parseFlashcardRows(rows);
    if (!cards.length) {
        showToast('Không tìm thấy flashcard hợp lệ trong file.', 'error');
        return;
    }

    const deckKey = simpleHash(`${currentFileName}|${cards.map(card => card.id).join('|')}`);
    const schedule = getDeckSchedule(deckKey);
    const now = Date.now();
    let due = cards.filter(card => schedule[card.id] && Number(schedule[card.id].due || 0) <= now);
    let fresh = cards.filter(card => !schedule[card.id]);
    let future = cards.filter(card => schedule[card.id] && Number(schedule[card.id].due || 0) > now);

    if (preferences.shuffleFlashcards) {
        due = shuffleArray(due);
        fresh = shuffleArray(fresh);
        future = shuffleArray(future);
    }
    const queue = preferences.dueFirst ? [...due, ...fresh, ...future] : shuffleArray([...cards]);

    fcState = {
        cards,
        queue,
        current: null,
        deckKey,
        fileName: currentFileName || 'Bộ Flashcard',
        startedAt: Date.now(),
        completed: 0,
        totalInitial: cards.length,
        ratings: { again: 0, hard: 0, good: 0, easy: 0 },
        sessionAttempts: {},
        hardCardIds: [],
        suspendedIds: [],
        flipped: false,
        reverse: false,
        typing: false,
        typedChecked: false,
        lastAction: null
    };
    lastFlashcardSource = { rows: clone(rows), fileName: currentFileName };
    lastFlashcardHardSource = null;
    document.getElementById('fc-title').textContent = fcState.fileName;
    showScreen('flashcard-app');
    renderFlashcard();
    playSound('start');
}

function renderFlashcard() {
    if (!fcState) return;
    if (!fcState.queue.length) {
        finishFlashcardSession();
        return;
    }

    fcState.current = fcState.queue[0];
    fcState.flipped = false;
    fcState.typedChecked = false;
    const cardElement = document.getElementById('fc-card');
    cardElement.classList.remove('is-flipped');
    const canReverseCurrent = fcState.current.reversible !== false;
    const reversedCurrent = fcState.reverse && canReverseCurrent;
    const frontText = reversedCurrent ? fcState.current.back : fcState.current.front;
    const backText = reversedCurrent ? fcState.current.front : fcState.current.back;
    document.getElementById('fc-side-label').textContent = reversedCurrent ? 'Mặt sau → mặt trước' : 'Mặt trước';
    document.getElementById('fc-front-text').innerHTML = parseRichText(frontText);
    document.getElementById('fc-back-text').innerHTML = parseRichText(backText);
    document.getElementById('fc-explanation').hidden = true;
    document.getElementById('fc-explanation').innerHTML = fcState.current.explanation ? `<strong>Ghi chú</strong><br>${parseRichText(fcState.current.explanation)}` : '';
    document.getElementById('fc-rating-wrap').hidden = true;

    const typePanel = document.getElementById('fc-type-answer');
    typePanel.hidden = !fcState.typing;
    const typedInput = document.getElementById('fc-typed-input');
    const feedback = document.getElementById('fc-type-feedback');
    typedInput.value = '';
    feedback.textContent = '';
    feedback.className = 'fc-type-feedback';
    window.setTimeout(() => {
        if (fcState?.typing && document.querySelector('.app-screen.active')?.id === 'flashcard-app') typedInput.focus();
    }, 40);

    const reverseToggle = document.getElementById('fc-reverse-toggle');
    reverseToggle.classList.toggle('active', reversedCurrent);
    reverseToggle.disabled = !canReverseCurrent;
    reverseToggle.setAttribute('aria-disabled', String(!canReverseCurrent));
    reverseToggle.title = canReverseCurrent ? 'Đảo chiều mặt trước và mặt sau' : 'Thẻ này đã tắt học đảo chiều';
    document.getElementById('fc-type-toggle').classList.toggle('active', fcState.typing);
    document.getElementById('fc-undo-btn').disabled = !fcState.lastAction;

    const totalActions = fcState.completed + fcState.queue.length;
    const position = Math.min(fcState.completed + 1, Math.max(1, totalActions));
    document.getElementById('fc-counter').textContent = `${position} / ${Math.max(fcState.totalInitial, totalActions)}`;
    document.getElementById('fc-session-position').textContent = `Thẻ ${position}`;
    document.getElementById('fc-progress-bar').style.width = `${Math.min(100, (fcState.completed / Math.max(1, fcState.totalInitial)) * 100)}%`;

    updateFlashcardStats();
    typesetMath(cardElement);
}

function flipCard() {
    if (!fcState?.current) return;
    fcState.flipped = !fcState.flipped;
    document.getElementById('fc-card').classList.toggle('is-flipped', fcState.flipped);
    const reversedCurrent = fcState.reverse && fcState.current.reversible !== false;
    document.getElementById('fc-side-label').textContent = fcState.flipped
        ? (reversedCurrent ? 'Mặt trước' : 'Mặt sau')
        : (reversedCurrent ? 'Mặt sau → mặt trước' : 'Mặt trước');
    document.getElementById('fc-rating-wrap').hidden = !fcState.flipped;
    document.getElementById('fc-explanation').hidden = !(fcState.flipped && fcState.current.explanation);
    playSound('flip');
}

function toggleFlashcardReverse() {
    if (!fcState?.current) return;
    if (fcState.current.reversible === false) {
        showToast('Thẻ này đã được đặt chỉ học theo chiều mặt trước → mặt sau.', 'info');
        return;
    }
    fcState.reverse = !fcState.reverse;
    renderFlashcard();
    showToast(fcState.reverse ? 'Đang học đảo chiều: mặt sau → mặt trước.' : 'Đã trở về chiều học thông thường.', 'info');
}

function toggleFlashcardTyping() {
    if (!fcState) return;
    fcState.typing = !fcState.typing;
    renderFlashcard();
    showToast(fcState.typing ? 'Đã bật chế độ gõ câu trả lời.' : 'Đã tắt chế độ gõ câu trả lời.', 'info');
}

function normalizeAnswerText(value) {
    return String(value || '')
        .replace(/\[img\][\s\S]*?\[\/img\]/gi, ' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function levenshteinDistance(a, b) {
    const rows = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
        let previous = rows[0];
        rows[0] = i;
        for (let j = 1; j <= b.length; j += 1) {
            const saved = rows[j];
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            rows[j] = Math.min(rows[j] + 1, rows[j - 1] + 1, previous + cost);
            previous = saved;
        }
    }
    return rows[b.length];
}

function answerSimilarity(input, expected) {
    const a = normalizeAnswerText(input);
    const b = normalizeAnswerText(expected);
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (b.includes(a) && a.length >= Math.min(8, b.length * .55)) return .86;
    const distance = levenshteinDistance(a, b);
    const charScore = 1 - distance / Math.max(a.length, b.length, 1);
    const aTokens = new Set(a.split(' '));
    const bTokens = new Set(b.split(' '));
    const intersection = [...aTokens].filter(token => bTokens.has(token)).length;
    const tokenScore = intersection / Math.max(1, new Set([...aTokens, ...bTokens]).size);
    return Math.max(0, Math.min(1, charScore * .55 + tokenScore * .45));
}

function checkFlashcardTypedAnswer() {
    if (!fcState?.current || !fcState.typing) return;
    const input = document.getElementById('fc-typed-input').value.trim();
    if (!input) {
        showToast('Hãy nhập câu trả lời trước khi kiểm tra.', 'info');
        return;
    }
    const expected = fcState.reverse && fcState.current.reversible !== false ? fcState.current.front : fcState.current.back;
    const score = answerSimilarity(input, expected);
    const feedback = document.getElementById('fc-type-feedback');
    const percent = Math.round(score * 100);
    feedback.className = `fc-type-feedback ${score >= .82 ? 'good' : score >= .55 ? 'close' : 'miss'}`;
    feedback.innerHTML = score >= .82
        ? `<strong>Rất gần đáp án · ${percent}%</strong><span>Bạn có thể tự đánh giá mức độ nhớ.</span>`
        : score >= .55
            ? `<strong>Gần đúng · ${percent}%</strong><span>So sánh thêm với mặt sau rồi tự đánh giá.</span>`
            : `<strong>Chưa khớp · ${percent}%</strong><span>Xem đáp án và thử ghi nhớ lại.</span>`;
    fcState.typedChecked = true;
    if (!fcState.flipped) flipCard();
}

function scheduleFlashcard(card, rating) {
    const deck = getDeckSchedule(fcState.deckKey);
    const old = deck[card.id] || { interval: 0, ease: 2.5, repetitions: 0, due: 0 };
    const next = { ...old, lastRating: rating, reviewedAt: Date.now() };

    if (rating === 'again') {
        next.interval = 0;
        next.repetitions = 0;
        next.ease = Math.max(1.3, (Number(old.ease) || 2.5) - 0.2);
        next.due = Date.now() + 10 * 60 * 1000;
    } else if (rating === 'hard') {
        next.repetitions = (Number(old.repetitions) || 0) + 1;
        next.interval = Math.max(1, Math.round((Number(old.interval) || 1) * 1.25));
        next.ease = Math.max(1.3, (Number(old.ease) || 2.5) - 0.08);
        next.due = Date.now() + next.interval * 86400000;
    } else if (rating === 'good') {
        next.repetitions = (Number(old.repetitions) || 0) + 1;
        if (!old.interval) next.interval = 3;
        else next.interval = Math.max(3, Math.round(old.interval * (Number(old.ease) || 2.5)));
        next.due = Date.now() + next.interval * 86400000;
    } else {
        next.repetitions = (Number(old.repetitions) || 0) + 1;
        next.ease = Math.min(3.2, (Number(old.ease) || 2.5) + 0.12);
        next.interval = !old.interval ? 7 : Math.max(7, Math.round(old.interval * 3.1));
        next.due = Date.now() + next.interval * 86400000;
    }

    deck[card.id] = next;
    saveLearningData();
}

function captureFlashcardSnapshot(card) {
    const deck = getDeckSchedule(fcState.deckKey);
    return {
        cardId: card.id,
        oldMeta: deck[card.id] ? clone(deck[card.id]) : null,
        queue: clone(fcState.queue),
        completed: fcState.completed,
        ratings: clone(fcState.ratings),
        sessionAttempts: clone(fcState.sessionAttempts),
        hardCardIds: clone(fcState.hardCardIds),
        reviewedCards: Number(appData.reviewedCards) || 0
    };
}

function rateFlashcard(rating) {
    if (!fcState?.current || !fcState.flipped) {
        showToast('Hãy lật thẻ trước khi đánh giá.', 'info');
        return;
    }
    const card = fcState.current;
    fcState.lastAction = captureFlashcardSnapshot(card);
    scheduleFlashcard(card, rating);
    fcState.ratings[rating] += 1;
    fcState.completed += 1;
    appData.reviewedCards = (Number(appData.reviewedCards) || 0) + 1;
    fcState.queue.shift();

    const attempts = (fcState.sessionAttempts[card.id] || 0) + 1;
    fcState.sessionAttempts[card.id] = attempts;
    if (['again', 'hard'].includes(rating) && !fcState.hardCardIds.includes(card.id)) fcState.hardCardIds.push(card.id);
    if (rating === 'again' && attempts <= 2) {
        fcState.queue.splice(Math.min(3, fcState.queue.length), 0, card);
    } else if (rating === 'hard' && attempts <= 1) {
        fcState.queue.splice(Math.min(6, fcState.queue.length), 0, card);
    }

    saveLearningData();
    playSound(rating === 'again' ? 'wrong' : rating === 'easy' ? 'success' : 'select');
    renderFlashcard();
}

function undoFlashcardRating() {
    if (!fcState?.lastAction) {
        showToast('Chưa có đánh giá nào để hoàn tác.', 'info');
        return;
    }
    const snapshot = fcState.lastAction;
    const deck = getDeckSchedule(fcState.deckKey);
    if (snapshot.oldMeta) deck[snapshot.cardId] = clone(snapshot.oldMeta);
    else delete deck[snapshot.cardId];
    fcState.queue = clone(snapshot.queue);
    fcState.completed = snapshot.completed;
    fcState.ratings = clone(snapshot.ratings);
    fcState.sessionAttempts = clone(snapshot.sessionAttempts);
    fcState.hardCardIds = clone(snapshot.hardCardIds);
    appData.reviewedCards = snapshot.reviewedCards;
    fcState.lastAction = null;
    saveLearningData();
    renderFlashcard();
    playSound('navigate');
    showToast('Đã hoàn tác đánh giá gần nhất.', 'success');
}

function suspendCurrentFlashcard() {
    if (!fcState?.current) return;
    const card = fcState.queue.shift();
    if (!fcState.suspendedIds.includes(card.id)) fcState.suspendedIds.push(card.id);
    fcState.lastAction = null;
    showToast('Đã tạm dừng thẻ trong phiên này.', 'info');
    renderFlashcard();
}

function skipFlashcard() {
    if (!fcState || fcState.queue.length <= 1) return;
    const skipped = fcState.queue.shift();
    fcState.queue.push(skipped);
    renderFlashcard();
    playSound('navigate');
}

function previousFlashcard() {
    undoFlashcardRating();
}

function updateFlashcardStats() {
    if (!fcState) return;
    const schedule = getDeckSchedule(fcState.deckKey);
    let fresh = 0;
    let review = 0;
    let mastered = 0;
    let due = 0;
    const now = Date.now();

    fcState.cards.forEach(card => {
        const meta = schedule[card.id];
        if (!meta) fresh += 1;
        else if ((Number(meta.interval) || 0) >= 21) mastered += 1;
        else review += 1;
        if (meta && Number(meta.due || 0) <= now) due += 1;
    });

    document.getElementById('fc-tab-new').textContent = `Mới ${fresh}`;
    document.getElementById('fc-tab-review').textContent = `Đang ôn ${review}`;
    document.getElementById('fc-tab-mastered').textContent = `Đã vững ${mastered}`;
    document.getElementById('fc-stat-new').textContent = fresh;
    document.getElementById('fc-stat-review').textContent = review;
    document.getElementById('fc-stat-mastered').textContent = mastered;
    document.getElementById('fc-stat-again').textContent = fcState.hardCardIds.length;
    document.getElementById('fc-due-label').textContent = due;
    document.getElementById('fc-completed-count').textContent = fcState.completed;
    const progress = Math.min(100, (fcState.completed / Math.max(1, fcState.totalInitial)) * 100);
    document.querySelector('.fc-circle').style.setProperty('--score', `${progress * 3.6}deg`);
}

function finishFlashcardSession() {
    if (!fcState) return;
    const good = fcState.ratings.good + fcState.ratings.easy;
    const again = fcState.ratings.again + fcState.ratings.hard;
    const uniqueReviewed = Object.keys(fcState.sessionAttempts).length;
    const xp = fcState.ratings.easy * 8 + fcState.ratings.good * 6 + fcState.ratings.hard * 3 + fcState.ratings.again;
    const duration = Math.max(1, Math.round((Date.now() - fcState.startedAt) / 1000));
    const hardCards = fcState.cards.filter(card => fcState.hardCardIds.includes(card.id));
    const hardRows = flashcardsToRows(hardCards);

    appData.xp = (Number(appData.xp) || 0) + xp;
    appData.history.push({
        id: makeId('history'),
        timestamp: new Date().toISOString(),
        mode: 'flashcard',
        file: fcState.fileName,
        total: uniqueReviewed,
        good,
        again,
        duration,
        xp,
        sourceRows: lastFlashcardSource?.rows ? clone(lastFlashcardSource.rows) : flashcardsToRows(fcState.cards),
        hardRows
    });
    saveLearningData();

    lastFlashcardHardSource = hardCards.length ? { rows: hardRows, fileName: `${fcState.fileName} · Thẻ khó` } : null;
    document.getElementById('fc-result-total').textContent = uniqueReviewed;
    document.getElementById('fc-result-good').textContent = good;
    document.getElementById('fc-result-again').textContent = again;
    document.getElementById('fc-result-xp').textContent = `${xp} XP`;
    document.getElementById('review-hard-cards-btn').hidden = !hardCards.length;
    showScreen('flashcard-result-screen');
    playSound('success');
}

function reviewHardFlashcards() {
    if (!lastFlashcardHardSource) {
        showToast('Không có thẻ Again hoặc Hard trong phiên vừa rồi.', 'info');
        return;
    }
    currentFileName = lastFlashcardHardSource.fileName;
    startFlashcardMode(clone(lastFlashcardHardSource.rows));
}

function restartFlashcardSession() {
    if (!lastFlashcardSource) {
        openPracticeSetup('flashcard');
        return;
    }
    currentFileName = lastFlashcardSource.fileName;
    startFlashcardMode(clone(lastFlashcardSource.rows));
}

function confirmLeaveFlashcards() {
    if (!fcState || !fcState.completed) {
        showScreen('dashboard-screen');
        return;
    }
    openConfirmModal('Rời phiên flashcard?', 'Tiến độ phiên hiện tại và lịch ôn đã được tự động lưu. Bạn có thể tiếp tục sau khi mở lại trang.', 'Rời phiên', () => showScreen('dashboard-screen'));
}

function openCreator(mode) {
    if (mode) creatorMode = mode === 'flashcard' ? 'flashcard' : 'quiz';
    ensureCreatorItems();
    renderCreator();
    showScreen('creator-screen');

    if (recoveryCreatorDrafts && !creatorRecoveryOffered) {
        creatorRecoveryOffered = true;
        openConfirmModal(
            'Khôi phục bản nháp?',
            'Phát hiện một bản nháp chưa hoàn thành từ lần sử dụng trước. Bạn có muốn khôi phục để tiếp tục chỉnh sửa không?',
            'Khôi phục',
            () => {
                creatorDrafts = clone(recoveryCreatorDrafts);
                recoveryCreatorDrafts = null;
                activeCreatorId = null;
                ensureCreatorItems();
                renderCreator();
                safeStorageSet(CREATOR_RECOVERY_KEY, '1');
                showToast('Đã khôi phục bản nháp.', 'success');
            },
            'Bỏ qua',
            () => {
                recoveryCreatorDrafts = null;
                creatorDrafts = { quiz: [createBlankCreatorItem('quiz')], flashcard: [createBlankCreatorItem('flashcard')] };
                activeCreatorId = creatorDrafts[creatorMode][0].id;
                safeStorageRemove(CREATOR_RECOVERY_KEY);
                saveCreatorDrafts(false);
                renderCreator();
            }
        );
    }
}

function ensureCreatorItems() {
    if (!Array.isArray(creatorDrafts[creatorMode])) creatorDrafts[creatorMode] = [];
    if (!creatorDrafts[creatorMode].length) creatorDrafts[creatorMode].push(createBlankCreatorItem(creatorMode));
    if (!creatorDrafts[creatorMode].some(item => item.id === activeCreatorId)) activeCreatorId = creatorDrafts[creatorMode][0].id;
    saveCreatorDrafts(false);
}

function createBlankCreatorItem(mode) {
    if (mode === 'flashcard') {
        return { id: makeId('fc'), front: '', back: '', explanation: '' };
    }
    return { id: makeId('quiz'), question: '', options: ['', '', '', ''], correct: null, explanation: '' };
}

function validateCreatorItem(item, mode = creatorMode) {
    const errors = [];
    if (mode === 'quiz') {
        const question = String(item?.question || '').trim();
        const options = Array.isArray(item?.options) ? item.options.slice(0, 4).map(value => String(value || '').trim()) : [];
        const nonEmpty = options.filter(Boolean);
        if (!question) errors.push('Câu hỏi đang để trống.');
        if (nonEmpty.length < 4) errors.push(`Cần đủ 4 đáp án, hiện có ${nonEmpty.length}.`);
        const normalized = nonEmpty.map(value => normalizeAnswerText(value));
        if (new Set(normalized).size !== normalized.length) errors.push('Có đáp án bị trùng nhau.');
        const correctValue = item?.correct;
        const hasCorrect = correctValue !== null && correctValue !== undefined && correctValue !== '' && Number.isInteger(Number(correctValue)) && Number(correctValue) >= 0 && Number(correctValue) <= 3;
        if (!hasCorrect) errors.push('Chưa chọn đáp án đúng.');
        else if (!options[Number(correctValue)]) errors.push('Đáp án đúng đang để trống.');
    } else {
        if (!String(item?.front || '').trim()) errors.push('Mặt trước đang để trống.');
        if (!String(item?.back || '').trim()) errors.push('Mặt sau đang để trống.');
    }
    return errors;
}

function getCreatorValidationSummary() {
    const items = getCurrentCreatorItems();
    const details = items.map((item, index) => ({ item, index, errors: validateCreatorItem(item) }));
    return { details, invalid: details.filter(entry => entry.errors.length), valid: details.filter(entry => !entry.errors.length) };
}

function setCreatorMode(mode) {
    creatorMode = mode === 'flashcard' ? 'flashcard' : 'quiz';
    activeCreatorId = null;
    creatorSearchQuery = '';
    creatorFilter = 'all';
    creatorListPage = 0;
    const search = document.getElementById('creator-search');
    const filter = document.getElementById('creator-filter');
    if (search) search.value = '';
    if (filter) filter.value = 'all';
    ensureCreatorItems();
    renderCreator();
    playSound('select');
}

function getCurrentCreatorItems() {
    ensureCreatorItems();
    return creatorDrafts[creatorMode];
}

function getActiveCreatorItem() {
    return getCurrentCreatorItems().find(item => item.id === activeCreatorId) || getCurrentCreatorItems()[0];
}

function renderCreator() {
    ensureCreatorItems();
    document.getElementById('creator-tab-quiz').classList.toggle('active', creatorMode === 'quiz');
    document.getElementById('creator-tab-flashcard').classList.toggle('active', creatorMode === 'flashcard');
    document.getElementById('creator-list-title').textContent = creatorMode === 'quiz' ? 'Câu hỏi' : 'Thẻ học';
    document.getElementById('preview-title').textContent = creatorMode === 'quiz' ? 'Câu hỏi hiện tại' : 'Flashcard hiện tại';
    renderCreatorList();
    renderCreatorEditor();
    renderCreatorPreview();
    renderCreatorValidationState();
}

function renderCreatorValidationState() {
    const { invalid } = getCreatorValidationSummary();
    const button = document.getElementById('creator-export-btn');
    if (!button) return;
    button.disabled = invalid.length > 0;
    const noun = creatorMode === 'quiz' ? 'câu' : 'thẻ';
    button.innerHTML = invalid.length
        ? `<svg><use href="#i-save"></use></svg><span>Không thể xuất · còn ${invalid.length} ${noun} chưa hoàn chỉnh</span>`
        : '<svg><use href="#i-save"></use></svg><span>Xuất Excel</span>';
}

function setCreatorSearch(value) {
    creatorSearchQuery = String(value || '').trim().toLowerCase();
    creatorListPage = 0;
    renderCreatorList();
}

function setCreatorFilter(value) {
    creatorFilter = ['invalid', 'valid'].includes(value) ? value : 'all';
    creatorListPage = 0;
    renderCreatorList();
}

function getFilteredCreatorItems() {
    return getCurrentCreatorItems().filter(item => {
        const searchable = creatorMode === 'quiz'
            ? [item.question, ...(item.options || []), item.explanation].join(' ')
            : [item.front, item.back, item.explanation].join(' ');
        const valid = validateCreatorItem(item).length === 0;
        if (creatorSearchQuery && !String(searchable || '').toLowerCase().includes(creatorSearchQuery)) return false;
        if (creatorFilter === 'invalid' && valid) return false;
        if (creatorFilter === 'valid' && !valid) return false;
        return true;
    });
}

function setCreatorListPage(page) {
    const items = getFilteredCreatorItems();
    const pageCount = Math.max(1, Math.ceil(items.length / CREATOR_LIST_PAGE_SIZE));
    creatorListPage = Math.max(0, Math.min(pageCount - 1, Number(page) || 0));
    renderCreatorList();
}

function focusCreatorListOnActive() {
    const filtered = getFilteredCreatorItems();
    const index = filtered.findIndex(item => item.id === activeCreatorId);
    if (index >= 0) creatorListPage = Math.floor(index / CREATOR_LIST_PAGE_SIZE);
}

function resetCreatorListView() {
    creatorSearchQuery = '';
    creatorFilter = 'all';
    const search = document.getElementById('creator-search');
    const filter = document.getElementById('creator-filter');
    if (search) search.value = '';
    if (filter) filter.value = 'all';
}

function renderCreatorList() {
    const allItems = getCurrentCreatorItems();
    const items = getFilteredCreatorItems();
    const container = document.getElementById('creator-item-list');
    if (!items.length) {
        creatorListPage = 0;
        container.innerHTML = '<div class="creator-list-empty">Không có mục phù hợp với bộ lọc.</div>';
        return;
    }

    const pageCount = Math.max(1, Math.ceil(items.length / CREATOR_LIST_PAGE_SIZE));
    creatorListPage = Math.max(0, Math.min(pageCount - 1, creatorListPage));
    const startIndex = creatorListPage * CREATOR_LIST_PAGE_SIZE;
    const visibleItems = items.slice(startIndex, startIndex + CREATOR_LIST_PAGE_SIZE);
    const tiles = visibleItems.map(item => {
        const index = allItems.findIndex(entry => entry.id === item.id);
        const title = creatorMode === 'quiz' ? item.question : item.front;
        const errors = validateCreatorItem(item);
        const fallback = creatorMode === 'quiz' ? 'Câu hỏi chưa nhập' : 'Thẻ chưa nhập';
        const tooltip = `${creatorMode === 'quiz' ? 'Câu' : 'Thẻ'} ${index + 1}: ${title || fallback}${errors.length ? ` · ${errors.length} lỗi cần sửa` : ' · Hoàn chỉnh'}`;
        return `<div class="creator-list-item creator-grid-tile ${item.id === activeCreatorId ? 'active' : ''} ${errors.length ? 'invalid' : 'valid'}" draggable="true" title="${escapeHTML(tooltip)}" ondragstart="beginCreatorDrag(event, '${item.id}')" ondragover="allowCreatorDrop(event)" ondrop="dropCreatorItem(event, '${item.id}')">
            <button class="creator-list-select creator-grid-select" type="button" onclick="selectCreatorItem('${item.id}')" aria-label="Mở ${creatorMode === 'quiz' ? 'câu hỏi' : 'thẻ'} ${index + 1}">
                <strong>${index + 1}</strong><span class="creator-validity-dot" aria-hidden="true"></span>
            </button>
            <button class="creator-list-delete creator-grid-delete" type="button" onclick="deleteCreatorItemById('${item.id}', event)" title="Xóa mục ${index + 1}" aria-label="Xóa riêng mục ${index + 1}">×</button>
        </div>`;
    }).join('');

    const rangeStart = startIndex + 1;
    const rangeEnd = Math.min(startIndex + visibleItems.length, items.length);
    const pagination = pageCount > 1
        ? `<div class="creator-list-pagination"><button type="button" onclick="setCreatorListPage(${creatorListPage - 1})" ${creatorListPage <= 0 ? 'disabled' : ''} aria-label="Trang trước">‹</button><span><strong>${creatorListPage + 1} / ${pageCount}</strong><small>${rangeStart}–${rangeEnd} / ${items.length}</small></span><button type="button" onclick="setCreatorListPage(${creatorListPage + 1})" ${creatorListPage >= pageCount - 1 ? 'disabled' : ''} aria-label="Trang sau">›</button></div>`
        : `<div class="creator-list-count">${items.length} ${creatorMode === 'quiz' ? 'câu hỏi' : 'flashcard'}</div>`;
    container.innerHTML = `<div class="creator-number-grid">${tiles}</div>${pagination}`;
}

function beginCreatorDrag(event, id) {
    draggedCreatorId = id;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
    event.currentTarget.classList.add('dragging');
}

function allowCreatorDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function dropCreatorItem(event, targetId) {
    event.preventDefault();
    const sourceId = draggedCreatorId || event.dataTransfer.getData('text/plain');
    draggedCreatorId = null;
    document.querySelectorAll('.creator-list-item.dragging').forEach(item => item.classList.remove('dragging'));
    if (!sourceId || sourceId === targetId) return;
    const items = getCurrentCreatorItems();
    const sourceIndex = items.findIndex(item => item.id === sourceId);
    const targetIndex = items.findIndex(item => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = items.splice(sourceIndex, 1);
    items.splice(targetIndex, 0, moved);
    activeCreatorId = moved.id;
    saveCreatorDrafts(true);
    renderCreator();
    playSound('navigate');
}

function selectCreatorItem(id) {
    activeCreatorId = id;
    focusCreatorListOnActive();
    renderCreator();
    playSound('navigate');
}

function renderCreatorEditor() {
    const item = getActiveCreatorItem();
    const items = getCurrentCreatorItems();
    const index = items.findIndex(entry => entry.id === item.id) + 1;
    const editor = document.getElementById('creator-editor');
    const errors = validateCreatorItem(item);
    const validation = errors.length
        ? `<div class="creator-validation-box"><strong>Cần hoàn thiện ${errors.length} mục</strong><ul>${errors.map(error => `<li>${escapeHTML(error)}</li>`).join('')}</ul></div>`
        : '<div class="creator-validation-box valid"><strong>Đã sẵn sàng để xuất</strong><span>Nội dung hiện tại không có lỗi bắt buộc.</span></div>';
    const moveActions = `<button class="icon-btn small" onclick="moveCreatorItem(-1)" title="Di chuyển lên" ${index <= 1 ? 'disabled' : ''}>↑</button><button class="icon-btn small" onclick="moveCreatorItem(1)" title="Di chuyển xuống" ${index >= items.length ? 'disabled' : ''}>↓</button>`;
    const imageButton = field => `<span class="field-tools"><button type="button" onclick="triggerCreatorImage('${field}')">Chèn ảnh</button></span>`;
    const imageInput = field => `<input id="creator-file-${field}" type="file" accept="image/*" hidden onchange="insertCreatorImage(event, '${field}')">`;

    if (creatorMode === 'quiz') {
        const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
        editor.innerHTML = `<div class="editor-header"><div><span class="section-kicker">Trắc nghiệm</span><h2>Câu hỏi ${index}</h2></div><div class="editor-actions">${moveActions}<button class="icon-btn small" onclick="duplicateCreatorItem()" title="Nhân bản"><svg><use href="#i-copy"></use></svg></button><button class="icon-btn small danger-soft" onclick="deleteCreatorItem()" title="Xóa"><svg><use href="#i-trash"></use></svg></button></div></div>
            ${validation}
            <div class="editor-section"><label><span class="field-label-row"><span>Nội dung câu hỏi</span>${imageButton('question')}</span><textarea class="editor-textarea" rows="5" data-creator-field="question" oninput="updateCreatorField('question', this.value)" onpaste="handleCreatorPaste(event, 'question')" placeholder="Nhập câu hỏi, hỗ trợ công thức $...$">${escapeHTML(stripCreatorMediaMarkup(item.question))}</textarea>${imageInput('question')}${renderCreatorMediaCards(item.question, 'question')}</label></div>
            <div class="editor-section"><div class="field-label-row"><strong>Đáp án</strong><small style="color:var(--text-soft)">Bấm chữ cái để chọn đáp án đúng</small></div><div class="editor-grid">${item.options.map((option, optionIndex) => `<label><span>Đáp án ${optionLetters[optionIndex]}</span><div class="answer-editor"><button class="answer-radio ${item.correct !== null && item.correct !== undefined && Number(item.correct) === optionIndex ? 'selected' : ''}" onclick="setCreatorCorrect(${optionIndex})">${optionLetters[optionIndex]}</button><textarea class="editor-textarea" rows="2" oninput="updateCreatorOption(${optionIndex}, this.value)" onpaste="handleCreatorPaste(event, 'option-${optionIndex}')">${escapeHTML(stripCreatorMediaMarkup(option))}</textarea>${imageInput(`option-${optionIndex}`)}</div>${imageButton(`option-${optionIndex}`)}${renderCreatorMediaCards(option, `option-${optionIndex}`)}</label>`).join('')}</div></div>
            <div class="editor-section"><label><span class="field-label-row"><span>Giải thích sau khi chấm</span>${imageButton('explanation')}</span><textarea class="editor-textarea" rows="4" oninput="updateCreatorField('explanation', this.value)" onpaste="handleCreatorPaste(event, 'explanation')" placeholder="Giải thích vì sao đáp án đúng...">${escapeHTML(stripCreatorMediaMarkup(item.explanation))}</textarea>${imageInput('explanation')}${renderCreatorMediaCards(item.explanation, 'explanation')}</label></div>`;
    } else {
        editor.innerHTML = `<div class="editor-header"><div><span class="section-kicker">Flashcard</span><h2>Thẻ ${index}</h2></div><div class="editor-actions">${moveActions}<button class="icon-btn small" onclick="duplicateCreatorItem()" title="Nhân bản"><svg><use href="#i-copy"></use></svg></button><button class="icon-btn small danger-soft" onclick="deleteCreatorItem()" title="Xóa"><svg><use href="#i-trash"></use></svg></button></div></div>
            ${validation}
            <div class="editor-section"><label><span class="field-label-row"><span>Mặt trước</span>${imageButton('front')}</span><textarea class="editor-textarea" rows="7" oninput="updateCreatorField('front', this.value)" onpaste="handleCreatorPaste(event, 'front')" placeholder="Thuật ngữ, câu hỏi hoặc khái niệm...">${escapeHTML(stripCreatorMediaMarkup(item.front))}</textarea>${imageInput('front')}${renderCreatorMediaCards(item.front, 'front')}</label></div>
            <div class="editor-section"><label><span class="field-label-row"><span>Mặt sau</span>${imageButton('back')}</span><textarea class="editor-textarea" rows="7" oninput="updateCreatorField('back', this.value)" onpaste="handleCreatorPaste(event, 'back')" placeholder="Định nghĩa, đáp án hoặc nội dung cần nhớ...">${escapeHTML(stripCreatorMediaMarkup(item.back))}</textarea>${imageInput('back')}${renderCreatorMediaCards(item.back, 'back')}</label></div>
            <div class="editor-section"><label><span class="field-label-row"><span>Ghi chú bổ sung</span>${imageButton('explanation')}</span><textarea class="editor-textarea" rows="4" oninput="updateCreatorField('explanation', this.value)" onpaste="handleCreatorPaste(event, 'explanation')" placeholder="Ví dụ, mẹo ghi nhớ hoặc giải thích thêm...">${escapeHTML(stripCreatorMediaMarkup(item.explanation))}</textarea>${imageInput('explanation')}${renderCreatorMediaCards(item.explanation, 'explanation')}</label></div>`;
    }
}

function renderCreatorPreview() {
    const item = getActiveCreatorItem();
    const preview = document.getElementById('creator-preview');
    if (creatorMode === 'quiz') {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        preview.innerHTML = `<div class="preview-question">${parseRichText(item.question || 'Nội dung câu hỏi sẽ xuất hiện tại đây.')}</div>${item.options.map((option, index) => `<div class="preview-option ${item.correct !== null && item.correct !== undefined && Number(item.correct) === index ? 'correct' : ''}"><span>${letters[index]}</span><span>${parseRichText(option || `Đáp án ${letters[index]}`)}</span></div>`).join('')}${item.explanation ? `<div class="review-explanation"><small>Giải thích</small>${parseRichText(item.explanation)}</div>` : ''}`;
    } else {
        preview.innerHTML = `<div class="preview-flashcard"><small>Mặt trước</small><strong>${parseRichText(item.front || 'Nội dung mặt trước')}</strong><span style="color:var(--text-soft);font-size:.65rem">Bấm thẻ khi học để xem mặt sau</span></div><div class="preview-flashcard back-preview"><small>Mặt sau</small><strong>${parseRichText(item.back || 'Nội dung mặt sau')}</strong></div>${item.explanation ? `<div class="review-explanation"><small>Ghi chú</small>${parseRichText(item.explanation)}</div>` : ''}`;
    }
    typesetMath(preview);
}

function updateCreatorField(field, value) {
    const item = getActiveCreatorItem();
    item[field] = preserveCreatorMediaMarkup(item[field], value);
    scheduleCreatorSave();
    renderCreatorList();
    renderCreatorPreview();
    renderCreatorValidationState();
}

function updateCreatorOption(index, value) {
    const item = getActiveCreatorItem();
    item.options[index] = preserveCreatorMediaMarkup(item.options[index], value);
    scheduleCreatorSave();
    renderCreatorList();
    renderCreatorPreview();
    renderCreatorValidationState();
}

function setCreatorCorrect(index) {
    getActiveCreatorItem().correct = index;
    saveCreatorDrafts(true);
    renderCreatorEditor();
    renderCreatorList();
    renderCreatorPreview();
    renderCreatorValidationState();
    playSound('select');
}

function addCreatorItem() {
    const item = createBlankCreatorItem(creatorMode);
    creatorDrafts[creatorMode].push(item);
    activeCreatorId = item.id;
    resetCreatorListView();
    creatorListPage = Math.floor((creatorDrafts[creatorMode].length - 1) / CREATOR_LIST_PAGE_SIZE);
    saveCreatorDrafts(true);
    renderCreator();
    playSound('add');
}

function duplicateCreatorItem() {
    const source = clone(getActiveCreatorItem());
    source.id = makeId(creatorMode === 'quiz' ? 'quiz' : 'fc');
    const items = getCurrentCreatorItems();
    const index = items.findIndex(item => item.id === activeCreatorId);
    items.splice(index + 1, 0, source);
    activeCreatorId = source.id;
    resetCreatorListView();
    focusCreatorListOnActive();
    saveCreatorDrafts(true);
    renderCreator();
    playSound('add');
    showToast('Đã nhân bản nội dung.', 'success');
}

function moveCreatorItem(direction) {
    const items = getCurrentCreatorItems();
    const index = items.findIndex(item => item.id === activeCreatorId);
    const target = index + Number(direction);
    if (index < 0 || target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    focusCreatorListOnActive();
    saveCreatorDrafts(true);
    renderCreator();
    playSound('navigate');
}

function deleteCreatorItem() {
    const items = getCurrentCreatorItems();
    if (items.length <= 1) {
        creatorDrafts[creatorMode] = [createBlankCreatorItem(creatorMode)];
        activeCreatorId = creatorDrafts[creatorMode][0].id;
        saveCreatorDrafts(false);
        safeStorageRemove(CREATOR_RECOVERY_KEY);
        renderCreator();
        return;
    }
    const index = items.findIndex(item => item.id === activeCreatorId);
    items.splice(index, 1);
    activeCreatorId = items[Math.max(0, index - 1)].id;
    saveCreatorDrafts(true);
    renderCreator();
    playSound('delete');
}

function deleteCreatorItemById(id, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const items = getCurrentCreatorItems();
    const index = items.findIndex(item => item.id === id);
    if (index < 0) return;
    const item = items[index];
    const label = creatorMode === 'quiz' ? `câu ${index + 1}` : `thẻ ${index + 1}`;
    const hasContent = creatorMode === 'quiz'
        ? Boolean(String(item.question || '').trim() || (item.options || []).some(option => String(option || '').trim()))
        : Boolean(String(item.front || '').trim() || String(item.back || '').trim());

    const remove = () => {
        if (items.length <= 1) {
            creatorDrafts[creatorMode] = [createBlankCreatorItem(creatorMode)];
            activeCreatorId = creatorDrafts[creatorMode][0].id;
        } else {
            items.splice(index, 1);
            if (activeCreatorId === id) activeCreatorId = items[Math.max(0, index - 1)].id;
        }
        saveCreatorDrafts(true);
        renderCreator();
        playSound('delete');
        showToast(`Đã xóa ${label}.`, 'success');
    };

    if (hasContent) {
        openConfirmModal(`Xóa riêng ${label}?`, 'Nội dung của mục này sẽ bị xóa khỏi bản nháp hiện tại.', 'Xóa mục', remove);
    } else {
        remove();
    }
}

function clearCreatorItems() {
    openConfirmModal('Xóa toàn bộ nội dung đang soạn?', `Tất cả ${creatorMode === 'quiz' ? 'câu hỏi trắc nghiệm' : 'flashcard'} trong bản nháp hiện tại sẽ bị xóa.`, 'Xóa toàn bộ', () => {
        creatorDrafts[creatorMode] = [createBlankCreatorItem(creatorMode)];
        activeCreatorId = creatorDrafts[creatorMode][0].id;
        saveCreatorDrafts(false);
        safeStorageRemove(CREATOR_RECOVERY_KEY);
        renderCreator();
        playSound('delete');
    });
}

function openCreatorPreview() {
    const items = getCurrentCreatorItems();
    const container = document.getElementById('creator-full-preview');
    document.getElementById('creator-full-preview-title').textContent = creatorMode === 'quiz' ? `Xem trước ${items.length} câu trắc nghiệm` : `Xem trước ${items.length} flashcard`;
    if (creatorMode === 'quiz') {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        container.innerHTML = items.map((item, index) => {
            const errors = validateCreatorItem(item);
            return `<article class="full-preview-item ${errors.length ? 'invalid' : ''}"><div class="full-preview-head"><strong>Câu ${index + 1}</strong>${errors.length ? `<span>${errors.length} lỗi</span>` : '<span class="valid">Hoàn chỉnh</span>'}</div><div class="preview-question">${parseRichText(item.question || 'Chưa nhập câu hỏi')}</div>${item.options.map((option, optionIndex) => `<div class="preview-option ${item.correct !== null && item.correct !== undefined && Number(item.correct) === optionIndex ? 'correct' : ''}"><span>${letters[optionIndex]}</span><span>${parseRichText(option || 'Chưa nhập đáp án')}</span></div>`).join('')}${item.explanation ? `<div class="review-explanation"><small>Giải thích</small>${parseRichText(item.explanation)}</div>` : ''}</article>`;
        }).join('');
    } else {
        container.innerHTML = items.map((item, index) => {
            const errors = validateCreatorItem(item);
            return `<article class="full-preview-item ${errors.length ? 'invalid' : ''}"><div class="full-preview-head"><strong>Thẻ ${index + 1}</strong>${errors.length ? `<span>${errors.length} lỗi</span>` : '<span class="valid">Hoàn chỉnh</span>'}</div><div class="preview-flashcard"><small>Mặt trước</small><strong>${parseRichText(item.front || 'Chưa nhập mặt trước')}</strong></div><div class="preview-flashcard back-preview"><small>Mặt sau</small><strong>${parseRichText(item.back || 'Chưa nhập mặt sau')}</strong></div>${item.explanation ? `<div class="review-explanation"><small>Ghi chú</small>${parseRichText(item.explanation)}</div>` : ''}</article>`;
        }).join('');
    }
    document.getElementById('creator-preview-modal').hidden = false;
    typesetMath(container);
}

function closeCreatorPreview() {
    document.getElementById('creator-preview-modal').hidden = true;
}

function triggerCreatorImage(field) {
    document.getElementById(`creator-file-${field}`)?.click();
}

async function insertCreatorImage(event, field) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
        const record = await storeCreatorMedia(file);
        insertCreatorImageMarkup(field, record.id);
    } catch (error) {
        showToast(error.message || 'Không thể thêm ảnh.', 'error');
    }
}

async function handleCreatorPaste(event, field) {
    const imageItem = [...(event.clipboardData?.items || [])].find(item => item.type.startsWith('image/'));
    if (!imageItem) return;
    event.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;
    try {
        const record = await storeCreatorMedia(file);
        insertCreatorImageMarkup(field, record.id);
    } catch (error) {
        showToast(error.message || 'Không thể dán ảnh.', 'error');
    }
}

function insertCreatorImageMarkup(field, mediaId) {
    const markup = `\n[media:${mediaId}]\n`;
    const item = getActiveCreatorItem();
    const current = creatorMediaFieldValue(item, field);
    setCreatorMediaFieldValue(item, field, `${current || ''}${markup}`.trim());
    saveCreatorDrafts(true);
    renderCreator();
    playSound('upload');
    showToast('Đã thêm ảnh vào nội dung.', 'success');
}

async function exportCreatorToExcel() {
    const items = getCurrentCreatorItems();
    const validation = getCreatorValidationSummary();
    if (validation.invalid.length) {
        activeCreatorId = validation.invalid[0].item.id;
        renderCreator();
        const noun = creatorMode === 'quiz' ? 'câu hỏi' : 'flashcard';
        showToast(`Không thể xuất: còn ${validation.invalid.length} ${noun} chưa hoàn chỉnh.`, 'error');
        return;
    }
    try {
        const XLSX = await window.EdTechLibraries.loadXLSX();
        const rows = [['Câu hỏi', 'Đáp án 1', 'Đáp án 2', 'Đáp án 3', 'Đáp án 4', 'Đáp án 5', 'Đáp án 6', 'Đáp án đúng', 'Giải thích', 'Nhãn', 'Độ khó', 'Đảo chiều']];
        if (creatorMode === 'quiz') {
            for (const item of items) {
                const options = [];
                for (const option of (item.options || []).slice(0, 6)) options.push(await materializeMediaMarkup(option));
                rows.push([
                    await materializeMediaMarkup(item.question),
                    ...options,
                    ...Array(Math.max(0, 6 - options.length)).fill(''),
                    Number(item.correct) + 1,
                    await materializeMediaMarkup(item.explanation || ''),
                    (item.tags || []).join(', '),
                    item.difficulty || 'medium',
                    ''
                ]);
            }
        } else {
            for (const item of items) rows.push([
                await materializeMediaMarkup(item.front),
                await materializeMediaMarkup(item.back), '', '', '', '', '', 1,
                await materializeMediaMarkup(item.explanation || ''),
                (item.tags || []).join(', '), item.difficulty || 'medium', item.reversible === false ? 'Không' : 'Có'
            ]);
        }
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        worksheet['!cols'] = [{ wch: 48 }, { wch: 32 }, { wch: 32 }, { wch: 32 }, { wch: 32 }, { wch: 32 }, { wch: 32 }, { wch: 14 }, { wch: 48 }, { wch: 24 }, { wch: 14 }, { wch: 12 }];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, creatorMode === 'quiz' ? 'TracNghiem' : 'Flashcard');
        const typeName = creatorMode === 'quiz' ? 'TracNghiem' : 'Flashcard';
        XLSX.writeFile(workbook, `EdTech_LMS_Pro_${typeName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
        await window.EdTechDB?.saveQuestionSet({ name: `Bộ ${typeName} ${new Date().toLocaleDateString('vi-VN')}`, type: creatorMode, rows: clone(rows), source: 'creator' });
        saveCreatorDrafts(false);
        markCreatorDraftComplete();
        playSound('success');
        showToast('Đã xuất Excel và lưu bộ đề trên thiết bị.', 'success');
    } catch (error) {
        showToast(error.message || 'Không thể xuất file Excel.', 'error');
    }
}

function openPromptPanel() {
    document.getElementById('prompt-modal').hidden = false;
    setPromptMode(promptMode || 'new');
    document.getElementById('ai-json-import').value = '';
    resetImportAnalysis();
}

function closePromptPanel() {
    document.getElementById('prompt-modal').hidden = true;
    pendingImportAnalysis = null;
}

function setPromptMode(mode) {
    promptMode = mode === 'existing' ? 'existing' : 'new';
    document.getElementById('prompt-tab-new')?.classList.toggle('active', promptMode === 'new');
    document.getElementById('prompt-tab-existing')?.classList.toggle('active', promptMode === 'existing');
    const newPanel = document.getElementById('prompt-new-panel');
    const existingPanel = document.getElementById('prompt-existing-panel');
    if (newPanel) newPanel.hidden = promptMode !== 'new';
    if (existingPanel) existingPanel.hidden = promptMode !== 'existing';
}

function buildCreatorPrompt() {
    if (promptMode === 'existing') return buildExistingFilePrompt();
    const count = Math.max(1, Math.min(100, Number(document.getElementById('prompt-count').value) || 10));
    const difficulty = document.getElementById('prompt-difficulty').value;
    const source = document.getElementById('prompt-source').value.trim() || '[DÁN TÀI LIỆU HOẶC CHỦ ĐỀ TẠI ĐÂY]';
    const extra = document.getElementById('prompt-extra').value.trim();

    if (creatorMode === 'quiz') {
        return `Bạn là chuyên gia thiết kế câu hỏi giáo dục. Hãy tạo ${count} câu trắc nghiệm 4 lựa chọn ở mức độ ${difficulty} dựa CHỈ trên tài liệu bên dưới.

YÊU CẦU:
- Mỗi câu có đúng 4 phương án, chỉ 1 đáp án đúng.
- Phương án nhiễu phải hợp lý, không quá dễ loại trừ.
- Không dùng các lựa chọn kiểu “tất cả đều đúng”.
- Có giải thích ngắn gọn, chính xác sau mỗi câu.
- Công thức toán đặt trong cặp dấu $...$.
${extra ? `- Yêu cầu bổ sung: ${extra}\n` : ''}
CHỈ TRẢ VỀ JSON THUẦN, KHÔNG markdown, KHÔNG giải thích ngoài JSON, theo đúng schema:
[
  {
    "question": "Nội dung câu hỏi",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correct": 0,
    "explanation": "Giải thích"
  }
]
Trường "correct" là chỉ số 0, 1, 2 hoặc 3.

TÀI LIỆU:
${source}`;
    }

    return `Bạn là chuyên gia thiết kế flashcard học tập. Hãy tạo ${count} flashcard ở mức độ ${difficulty} dựa CHỈ trên tài liệu bên dưới.

YÊU CẦU:
- Mặt trước ngắn gọn, tập trung vào một ý.
- Mặt sau chính xác, dễ nhớ nhưng đủ ngữ cảnh.
- Ghi chú bổ sung ví dụ hoặc mẹo nhớ khi thật sự hữu ích.
- Công thức toán đặt trong cặp dấu $...$.
${extra ? `- Yêu cầu bổ sung: ${extra}\n` : ''}
CHỈ TRẢ VỀ JSON THUẦN, KHÔNG markdown, KHÔNG giải thích ngoài JSON, theo đúng schema:
[
  {
    "front": "Mặt trước",
    "back": "Mặt sau",
    "explanation": "Ghi chú bổ sung"
  }
]

TÀI LIỆU:
${source}`;
}

function buildExistingFilePrompt() {
    const keepWording = document.getElementById('prompt-keep-wording')?.checked;
    const fixSpelling = document.getElementById('prompt-fix-spelling')?.checked;
    const addExplanation = document.getElementById('prompt-add-explanation')?.checked;
    const repairOptions = document.getElementById('prompt-repair-options')?.checked;
    const shared = `Đọc TOÀN BỘ file câu hỏi tôi đã đính kèm trong cuộc trò chuyện này.

NGUYÊN TẮC BẮT BUỘC:
- Không tự ý bỏ câu hỏi. Chỉ loại các câu trùng hoàn toàn về cả nội dung lẫn đáp án.
- Nhận diện đúng nội dung câu hỏi, các đáp án, đáp án đúng và phần giải thích nếu có.
- Giữ nguyên ý nghĩa chuyên môn của từng câu.
${keepWording ? '- Giữ nguyên câu chữ khi nội dung đã rõ ràng; không viết lại theo phong cách khác.\n' : '- Có thể diễn đạt lại rất nhẹ để câu hỏi rõ ràng hơn nhưng không đổi ý nghĩa.\n'}${fixSpelling ? '- Sửa lỗi chính tả, lỗi khoảng trắng và lỗi đánh số nhỏ.\n' : '- Không sửa chính tả trừ khi lỗi làm sai nghĩa.\n'}${addExplanation ? '- Với câu chưa có giải thích, tạo một giải thích ngắn và chính xác.\n' : '- Nếu file không có giải thích thì để chuỗi rỗng.\n'}${repairOptions ? '- Nếu đáp án thiếu hoặc sai định dạng, hãy chuẩn hóa; tự xác định đáp án đúng dựa trên kiến thức đáng tin cậy khi file chưa đánh dấu.\n' : '- Không tự bổ sung đáp án bị thiếu; câu không đủ dữ liệu vẫn phải được giữ và dùng chuỗi rỗng cho trường thiếu.\n'}- Công thức toán đặt trong cặp dấu $...$.
- Chỉ trả JSON thuần. Không dùng khối markdown, không viết lời mở đầu hoặc kết luận.`;

    if (creatorMode === 'quiz') {
        return `${shared}

CHUẨN HÓA THÀNH TRẮC NGHIỆM:
- Mỗi phần tử phải có đúng 4 chuỗi trong "options".
- "correct" là chỉ số của đáp án đúng: 0, 1, 2 hoặc 3.
- Không chèn ký hiệu A/B/C/D vào đầu nội dung phương án.
- Nếu file có nhiều hơn 4 phương án, chọn 4 phương án hợp lý nhất nhưng không đổi đáp án đúng.

SCHEMA DUY NHẤT ĐƯỢC PHÉP:
[
  {
    "question": "Nội dung câu hỏi",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correct": 0,
    "explanation": "Giải thích"
  }
]`;
    }

    return `${shared}

CHUYỂN THÀNH FLASHCARD:
- Mỗi câu hỏi hoặc khái niệm trong file trở thành một flashcard.
- "front" chứa câu hỏi, thuật ngữ hoặc gợi ý.
- "back" chứa đáp án hoặc kiến thức cần nhớ.
- "explanation" chứa ghi chú, lý do hoặc mẹo nhớ; để chuỗi rỗng nếu không có.

SCHEMA DUY NHẤT ĐƯỢC PHÉP:
[
  {
    "front": "Mặt trước",
    "back": "Mặt sau",
    "explanation": "Ghi chú"
  }
]`;
}

async function copyText(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

async function copyCreatorPrompt() {
    try {
        await copyText(buildCreatorPrompt());
        playSound('success');
        showToast(promptMode === 'existing' ? 'Đã copy prompt. Hãy đính kèm file vào AI rồi dán prompt.' : 'Đã copy prompt. Hãy dán vào công cụ AI bạn đang dùng.', 'success');
    } catch (error) {
        showToast('Không thể copy tự động. Hãy thử lại.', 'error');
    }
}

function cleanJSONText(text) {
    return String(text || '')
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '');
}

function normalizeCorrectIndex(value) {
    if (value !== null && value !== undefined && value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 5) return Number(value);
    const letter = String(value || '').trim().toUpperCase();
    if (/^[A-F]$/.test(letter)) return letter.charCodeAt(0) - 65;
    return null;
}

function parseImportEntry(entry, index) {
    const errors = [];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return { index, errors: ['Phần tử không phải một object.'], item: null };
    if (creatorMode === 'quiz') {
        const item = {
            id: makeId('quiz'),
            question: String(entry.question ?? '').trim(),
            options: Array.isArray(entry.options) ? entry.options.slice(0, 6).map(value => String(value ?? '').trim()) : [],
            correct: normalizeCorrectIndex(entry.correct ?? entry.correctAnswer),
            explanation: String(entry.explanation ?? '').trim()
        };
        while (item.options.length < 2) item.options.push('');
        errors.push(...validateCreatorItem(item, 'quiz'));
        return { index, errors, item };
    }
    const item = {
        id: makeId('fc'),
        front: String(entry.front ?? '').trim(),
        back: String(entry.back ?? '').trim(),
        explanation: String(entry.explanation ?? entry.note ?? '').trim(),
        tags: Array.isArray(entry.tags) ? entry.tags.map(value => String(value || '').trim()).filter(Boolean).slice(0, 12) : [],
        difficulty: ['easy', 'medium', 'hard'].includes(entry.difficulty) ? entry.difficulty : 'medium',
        reversible: entry.reversible !== false
    };
    errors.push(...validateCreatorItem(item, 'flashcard'));
    return { index, errors, item };
}

function resetImportAnalysis() {
    pendingImportAnalysis = null;
    const analysis = document.getElementById('import-analysis');
    const commit = document.getElementById('commit-json-import');
    const textarea = document.getElementById('ai-json-import');
    if (analysis) {
        analysis.hidden = true;
        analysis.innerHTML = '';
    }
    if (commit) commit.disabled = !String(textarea?.value || '').trim();
}

function analyzeAIJsonResult({ quiet = false } = {}) {
    const raw = cleanJSONText(document.getElementById('ai-json-import').value);
    if (!raw) {
        showToast('Hãy dán JSON do công cụ AI trả về.', 'error');
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || !parsed.length) throw new Error('JSON phải là một mảng có dữ liệu.');
        const entries = parsed.map((entry, index) => parseImportEntry(entry, index));
        const valid = entries.filter(entry => !entry.errors.length).map(entry => entry.item);
        const invalid = entries.filter(entry => entry.errors.length);
        pendingImportAnalysis = { total: entries.length, valid, invalid };
        const analysis = document.getElementById('import-analysis');
        if (analysis) {
            analysis.hidden = invalid.length === 0;
            analysis.innerHTML = invalid.length
                ? `<div class="import-summary"><strong>Đã đọc ${entries.length} ${creatorMode === 'quiz' ? 'câu' : 'thẻ'}</strong><span>${valid.length} hợp lệ · ${invalid.length} bị bỏ qua</span></div><div class="import-errors"><strong>Các mục không thể nhập</strong>${invalid.slice(0, 8).map(entry => `<div><span>Mục ${entry.index + 1}</span><small>${escapeHTML(entry.errors.join(' '))}</small></div>`).join('')}${invalid.length > 8 ? `<small>Và ${invalid.length - 8} mục khác…</small>` : ''}</div>`
                : '';
        }
        if (!quiet) playSound(valid.length ? 'success' : 'wrong');
        return pendingImportAnalysis;
    } catch (error) {
        pendingImportAnalysis = null;
        const analysis = document.getElementById('import-analysis');
        if (analysis) {
            analysis.hidden = false;
            analysis.innerHTML = `<div class="import-errors"><strong>JSON chưa đúng định dạng</strong><small>${escapeHTML(error.message || 'Không thể đọc dữ liệu.')}</small></div>`;
        }
        showToast(error.message || 'JSON không hợp lệ.', 'error');
        return null;
    }
}

function commitAIJsonImport() {
    const analyzed = pendingImportAnalysis?.valid?.length ? pendingImportAnalysis : analyzeAIJsonResult({ quiet: true });
    if (!analyzed?.valid?.length) {
        showToast('Không tìm thấy dữ liệu hợp lệ để nhập.', 'error');
        return;
    }
    const importMode = document.querySelector('input[name="json-import-mode"]:checked')?.value || 'append';
    const imported = clone(analyzed.valid);
    if (importMode === 'replace') {
        creatorDrafts[creatorMode] = imported;
    } else {
        const current = getCurrentCreatorItems();
        const onlyBlank = current.length === 1 && validateCreatorItem(current[0]).length && !hasMeaningfulCreatorContent({ [creatorMode]: current });
        creatorDrafts[creatorMode] = onlyBlank ? imported : [...current, ...imported];
    }
    const skipped = analyzed.invalid?.length || 0;
    activeCreatorId = imported[0].id;
    resetCreatorListView();
    focusCreatorListOnActive();
    saveCreatorDrafts(true);
    closePromptPanel();
    renderCreator();
    playSound('success');
    showToast(`Đã nhập ${imported.length} ${creatorMode === 'quiz' ? 'câu hỏi' : 'flashcard'}${skipped ? `, tự động bỏ qua ${skipped} mục lỗi` : ''}.`, 'success');
}

function importAIJsonResult() {
    pendingImportAnalysis = null;
    const analysis = analyzeAIJsonResult({ quiet: true });
    if (!analysis?.valid?.length) return;
    commitAIJsonImport();
}

function initAudio() {
    if (audioContext) return audioContext;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    audioContext = new Context();
    return audioContext;
}

async function unlockAudio() {
    soundUnlocked = await (window.EdTechAudio?.unlock?.() ?? Promise.resolve(false));
    if (!window.EdTechAudio) { const context = initAudio(); if (context?.state === 'suspended') await context.resume(); soundUnlocked = Boolean(context); }
}

function tone(frequency, duration, volume, type = 'sine', delay = 0) {
    const context = initAudio();
    if (!context || !preferences.sound || !soundUnlocked) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
}

function sweepTone(fromFrequency, toFrequency, duration, volume, type = 'sine', delay = 0) {
    const context = initAudio();
    if (!context || !preferences.sound || !soundUnlocked) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(1, fromFrequency), start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, toFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
}

function playIntroSequenceSound() {
    if (introSoundPlayed || !preferences.sound || !soundUnlocked) return false;
    introSoundPlayed = true;
    return window.EdTechAudio?.play('intro', { force: true }) || false;
}

function playSound(name) {
    if (!preferences.sound || !soundUnlocked) return;
    if (window.EdTechAudio) {
        window.EdTechAudio.setEnabled(preferences.sound);
        window.EdTechAudio.play(name);
        return;
    }
    tone(420, .05, .015, 'sine');
}

function toggleSound() {
    preferences.sound = !preferences.sound;
    try {
        localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
        window.EdTechDB?.savePreferences(clone(preferences)).catch(() => {});
    } catch (error) {
        console.warn('Không thể lưu tùy chọn âm thanh:', error);
    }
    updateSoundButton();
    if (preferences.sound) {
        unlockAudio();
        playSound('success');
        showToast('Đã bật âm thanh.', 'success');
    } else {
        showToast('Đã tắt âm thanh.', 'info');
    }
}

function updateSoundButton() {
    document.getElementById('sound-toggle')?.classList.toggle('is-muted', !preferences.sound);
}

function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    document.addEventListener('pointermove', event => {
        cursor.style.setProperty('--x', `${event.clientX}px`);
        cursor.style.setProperty('--y', `${event.clientY}px`);
        const interactive = event.target.closest('button, a, label, input, textarea, select, [role="button"]');
        cursor.classList.toggle('is-hovering', Boolean(interactive));
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('is-clicking'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-clicking'));
    document.addEventListener('pointerleave', () => {
        cursor.style.setProperty('--x', '-100px');
        cursor.style.setProperty('--y', '-100px');
    });
}

function initFileDropzone() {
    const input = document.getElementById('excel-file');
    const dropzone = document.getElementById('dropzone');
    input.addEventListener('change', event => handleWorkbookFile(event.target.files?.[0]));
    ['dragenter', 'dragover'].forEach(type => dropzone.addEventListener(type, event => {
        event.preventDefault();
        dropzone.classList.add('dragging');
    }));
    ['dragleave', 'drop'].forEach(type => dropzone.addEventListener(type, event => {
        event.preventDefault();
        dropzone.classList.remove('dragging');
    }));
    dropzone.addEventListener('drop', event => handleWorkbookFile(event.dataTransfer?.files?.[0]));
}

function initPreferenceInputs() {
    document.getElementById('shuffle-questions').checked = preferences.shuffleQuestions !== false;
    document.getElementById('shuffle-options').checked = preferences.shuffleOptions !== false;
    document.getElementById('time-limit').value = Number.isFinite(Number(preferences.timeLimit)) ? preferences.timeLimit : 15;
    document.getElementById('fc-shuffle').checked = preferences.shuffleFlashcards !== false;
    document.getElementById('fc-due-first').checked = preferences.dueFirst !== false;

    ['shuffle-questions', 'shuffle-options', 'time-limit', 'fc-shuffle', 'fc-due-first'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            savePreferences();
            updateSetupSummary();
        });
    });
}

function handleGlobalKeyboard(event) {
    if (event.key === 'Escape') {
        if (!document.getElementById('donate-modal').hidden) closeDonateModal();
        else if (document.body.classList.contains('result-review-open')) closeMobileResultReview();
        else if (document.body.classList.contains('quiz-nav-open')) closeMobileQuizNavigator();
        else if (!document.getElementById('prompt-modal').hidden) closePromptPanel();
        else if (!document.getElementById('creator-preview-modal').hidden) closeCreatorPreview();
        else if (!document.getElementById('confirm-modal').hidden) closeConfirmModal(true);
        return;
    }

    const activeScreen = document.querySelector('.app-screen.active')?.id;
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (typing) return;

    if (activeScreen === 'flashcard-app' && fcState) {
        if (event.code === 'Space') {
            event.preventDefault();
            flipCard();
        } else if (event.key === 'ArrowRight') skipFlashcard();
        else if (event.key === 'ArrowLeft') previousFlashcard();
        else if (fcState.flipped && ['1', '2', '3', '4'].includes(event.key)) {
            const ratingMap = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };
            rateFlashcard(ratingMap[event.key]);
        }
    }
}

function positionIntroDonateGuide() {
    const target = document.getElementById('donate-header-btn');
    const pointer = document.getElementById('intro-guide-pointer');
    if (!target || !pointer) return;
    const targetRect = target.getBoundingClientRect();
    const topbarRect = document.querySelector('.topbar')?.getBoundingClientRect();
    const directTop = targetRect.bottom + 12;
    const pointerTop = window.matchMedia('(max-width: 680px)').matches && topbarRect
        ? Math.max(directTop, topbarRect.bottom + 9)
        : directTop;
    pointer.style.left = `${targetRect.left + targetRect.width / 2}px`;
    pointer.style.top = `${pointerTop}px`;
    pointer.style.setProperty('--guide-line-height', `${Math.max(0, pointerTop - directTop)}px`);
    requestAnimationFrame(() => {
        const pointerRect = pointer.getBoundingClientRect();
        const safe = 12;
        let shift = 0;
        if (pointerRect.left < safe) shift = safe - pointerRect.left;
        else if (pointerRect.right > window.innerWidth - safe) shift = window.innerWidth - safe - pointerRect.right;
        pointer.style.setProperty('--guide-shift', `${shift}px`);
    });
}

function initBrandIntro() {
    const root = document.documentElement;
    const intro = document.getElementById('brand-intro');
    const target = document.getElementById('donate-header-btn');
    const topbar = document.querySelector('.topbar');
    if (!intro) {
        root.classList.remove('intro-pending');
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let finished = false;
    let supportVisible = false;
    let readyToClose = false;
    const timers = [];
    const clearTimers = () => timers.splice(0).forEach(timer => clearTimeout(timer));

    const tryIntroSound = () => {
        if (introSoundPlayed || !preferences.sound) return;
        const context = initAudio();
        if (!context) return;
        const playWhenReady = () => {
            if (context.state !== 'running') return;
            soundUnlocked = true;
            playIntroSequenceSound();
        };
        if (context.state === 'running') playWhenReady();
        else context.resume().then(playWhenReady).catch(() => {});
    };

    const clearGuide = () => {
        root.classList.remove('intro-app-preview');
        topbar?.classList.remove('intro-guide-layer');
        target?.classList.remove('intro-guide-target');
        window.removeEventListener('resize', positionIntroDonateGuide);
    };

    const allowClose = () => {
        if (finished || readyToClose) return;
        readyToClose = true;
        intro.classList.add('is-ready-to-close');
        intro.setAttribute('aria-label', 'Giới thiệu EdTech LMS Pro. Chạm vào vùng trống để tiếp tục.');
    };

    const showSupportStage = () => {
        if (finished || supportVisible) return;
        supportVisible = true;
        intro.classList.add('is-clearing');
        timers.push(window.setTimeout(() => {
            if (finished) return;
            root.classList.add('intro-app-preview');
            intro.classList.add('is-support-stage');
            topbar?.classList.add('intro-guide-layer');
            target?.classList.add('intro-guide-target');
            positionIntroDonateGuide();
            window.addEventListener('resize', positionIntroDonateGuide, { passive: true });
            playSound('soft');
            timers.push(window.setTimeout(allowClose, reduceMotion ? 20 : 240));
        }, reduceMotion ? 30 : 260));
    };

    const finish = ({ instant = false } = {}) => {
        if (finished) return;
        finished = true;
        clearTimers();
        clearGuide();
        root.classList.remove('intro-pending');
        intro.removeEventListener('pointerdown', tryIntroSound);
        intro.removeEventListener('pointerup', handleIntroTap);
        document.removeEventListener('keydown', handleIntroKey);
        intro.classList.add('is-leaving');
        if (instant || reduceMotion) intro.hidden = true;
        else window.setTimeout(() => { intro.hidden = true; }, 320);
    };

    const handleIntroTap = event => {
        if (!readyToClose || event.target.closest('button, a')) return;
        finish();
    };

    const handleIntroKey = event => {
        if (!readyToClose) return;
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
            event.preventDefault();
            finish();
        }
    };

    intro.addEventListener('pointerdown', tryIntroSound, { passive: true });
    intro.addEventListener('pointerup', handleIntroTap);
    document.addEventListener('keydown', handleIntroKey);
    tryIntroSound();

    timers.push(window.setTimeout(showSupportStage, reduceMotion ? 300 : 1350));
}

function openMobileQuizNavigator() {
    if (!window.matchMedia('(max-width: 900px)').matches || !document.body.classList.contains('quiz-screen-active')) return;
    const panel = document.getElementById('quiz-nav-panel');
    const backdrop = document.getElementById('quiz-mobile-nav-backdrop');
    if (!panel || !backdrop) return;
    if (mobileQuizNavTimer) clearTimeout(mobileQuizNavTimer);
    if (panel.parentNode !== document.body) {
        panel.__quizNavHome = panel.parentNode;
        panel.__quizNavNext = panel.nextSibling;
        document.body.appendChild(panel);
    }
    backdrop.hidden = false;
    document.body.classList.add('quiz-nav-open');
    requestAnimationFrame(() => {
        backdrop.classList.add('is-open');
        panel.classList.add('is-mobile-open');
    });
    panel.querySelector('.quiz-mobile-nav-head button')?.focus({ preventScroll: true });
    playSound('navigate');
}

function closeMobileQuizNavigator(instant = false) {
    const panel = document.getElementById('quiz-nav-panel');
    const backdrop = document.getElementById('quiz-mobile-nav-backdrop');
    if (!panel || !backdrop) return;
    if (mobileQuizNavTimer) clearTimeout(mobileQuizNavTimer);
    panel.classList.remove('is-mobile-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('quiz-nav-open');
    const done = () => {
        backdrop.hidden = true;
        if (panel.__quizNavHome) {
            panel.__quizNavHome.insertBefore(panel, panel.__quizNavNext || null);
            panel.__quizNavHome = null;
            panel.__quizNavNext = null;
        }
        mobileQuizNavTimer = null;
    };
    if (instant) done();
    else mobileQuizNavTimer = window.setTimeout(done, 240);
}

function updateMobileQuizProgress(answered, total) {
    const text = document.getElementById('quiz-mobile-progress-text');
    const hud = document.getElementById('quiz-mobile-hud-progress');
    const ring = document.getElementById('quiz-mobile-progress-ring-fill');
    if (text) text.textContent = `${answered} / ${total}`;
    if (hud) hud.textContent = `${answered} / ${total} câu`;
    if (ring) ring.style.setProperty('--quiz-mobile-progress', `${total ? (answered / total) * 100 : 0}%`);
}

function openDonateModal() {
    const modal = document.getElementById('donate-modal');
    if (!modal || !modal.hidden) return;
    unlockAudio();
    playSound('soft');
    modal.getAnimations?.().forEach(animation => animation.cancel());
    document.getElementById('donate-card')?.getAnimations?.().forEach(animation => animation.cancel());
    modal.hidden = false;
    modal.classList.remove('is-closing');
    modal.classList.add('is-open');
    document.body.classList.add('donate-open');
}

function closeDonateModal() {
    const modal = document.getElementById('donate-modal');
    if (!modal || modal.hidden) return;
    modal.getAnimations?.().forEach(animation => animation.cancel());
    document.getElementById('donate-card')?.getAnimations?.().forEach(animation => animation.cancel());
    modal.hidden = true;
    modal.classList.remove('is-open', 'is-closing');
    document.body.classList.remove('donate-open');
}

async function copyDonationAccount() {
    try {
        await navigator.clipboard.writeText('0338192207');
        showToast('Đã sao chép số tài khoản MB.', 'success');
    } catch (error) {
        showToast('Số tài khoản MB: 0338192207', 'info');
    }
}

function setRandomFocusMotivation() {
    const element = document.getElementById('focus-motivation');
    if (!element || !FOCUS_MOTIVATIONS.length) return;
    let previousIndex = -1;
    try { previousIndex = Number(sessionStorage.getItem('edtech_focus_quote_index')); } catch (_) {}
    let index = Math.floor(Math.random() * FOCUS_MOTIVATIONS.length);
    if (FOCUS_MOTIVATIONS.length > 1 && index === previousIndex) {
        index = (index + 1 + Math.floor(Math.random() * (FOCUS_MOTIVATIONS.length - 1))) % FOCUS_MOTIVATIONS.length;
    }
    try { sessionStorage.setItem('edtech_focus_quote_index', String(index)); } catch (_) {}
    element.textContent = FOCUS_MOTIVATIONS[index];
}

async function initApp() {
    initBrandIntro();
    try {
        const persisted = await window.EdTechDB?.bootstrap({ learningKey: STORAGE_KEY, creatorKey: CREATOR_KEY, preferenceKey: PREF_KEY, recoveryKey: CREATOR_RECOVERY_KEY });
        if (persisted?.learning && typeof persisted.learning === 'object') appData = { ...clone(EMPTY_DATA), ...persisted.learning };
        if (persisted?.preferences && typeof persisted.preferences === 'object') preferences = { ...preferences, ...persisted.preferences };
        if (persisted?.creatorDrafts && typeof persisted.creatorDrafts === 'object') {
            creatorDrafts = { quiz: Array.isArray(persisted.creatorDrafts.quiz) ? persisted.creatorDrafts.quiz : [], flashcard: Array.isArray(persisted.creatorDrafts.flashcard) ? persisted.creatorDrafts.flashcard : [] };
        }
    } catch (error) {
        console.warn('IndexedDB bootstrap fallback:', error);
    }
    try {
        await hydrateCreatorMediaCache();
        await migrateEmbeddedCreatorMedia();
    } catch (error) {
        console.warn('Không thể chuẩn bị toàn bộ dữ liệu ảnh:', error);
    }
    setRandomFocusMotivation();
    if (!Array.isArray(appData.history)) appData.history = [];
    if (!appData.flashcards || typeof appData.flashcards !== 'object') appData.flashcards = {};
    if (!Number.isFinite(Number(appData.xp))) appData.xp = 0;
    if (!Number.isFinite(Number(appData.reviewedCards))) appData.reviewedCards = 0;

    initCustomCursor();
    initFileDropzone();
    initPreferenceInputs();
    updateSoundButton();
    selectStudyMode(studyMode, false);
    renderDashboard();

    window.addEventListener('pagehide', () => creatorMediaURLs.forEach(url => URL.revokeObjectURL(url)), { once: true });

    document.addEventListener('keydown', handleGlobalKeyboard);
    document.addEventListener('pointerdown', event => {
        unlockAudio();
        if (event.target.closest('button') && !event.target.closest('.flashcard, .rating')) playSound('select');
    }, { passive: true });

    document.getElementById('prompt-modal').addEventListener('click', event => {
        if (event.target.id === 'prompt-modal') closePromptPanel();
    });
    document.getElementById('creator-preview-modal').addEventListener('click', event => {
        if (event.target.id === 'creator-preview-modal') closeCreatorPreview();
    });
    document.getElementById('confirm-modal').addEventListener('click', event => {
        if (event.target.id === 'confirm-modal') closeConfirmModal(true);
    });
    const donateModal = document.getElementById('donate-modal');
    donateModal?.addEventListener('click', event => {
        if (event.target.id === 'donate-modal') closeDonateModal();
    });
    document.getElementById('fc-typed-input').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkFlashcardTypedAnswer();
        }
    });
    document.addEventListener('dragend', () => {
        draggedCreatorId = null;
        document.querySelectorAll('.creator-list-item.dragging').forEach(item => item.classList.remove('dragging'));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 680 && document.body.classList.contains('result-review-open')) closeMobileResultReview(true);
    });

    window.addEventListener('beforeunload', () => {
        clearInterval(quizTimer);
        clearTimeout(creatorSaveTimer);
        savePreferences();
        saveLearningData();
        saveCreatorDrafts(false);
        window.persistActiveQuizSession?.();
    });

    window.EdTechTheme?.init();
    window.renderLocalQuestionSets?.();
    await window.offerRestoreActiveSession?.();
    window.EdTechRouter?.applyRoute();
    document.documentElement.classList.add('app-ready');
}

document.addEventListener('DOMContentLoaded', initApp);
