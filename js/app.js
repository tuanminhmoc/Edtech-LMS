'use strict';

/* Final release integrations for IndexedDB, recovery, scalable editors and GitHub Pages. */

let historyPage = 0;
const HISTORY_PAGE_SIZE = 20;
let activeSessionSaveTimer = null;
let creatorEditSnapshotTimer = null;
let installPromptEvent = window.__edtechInstallPrompt || null;
function captureInstallPrompt(event) {
    event.preventDefault?.();
    installPromptEvent = event;
    window.__edtechInstallPrompt = event;
    updateInstallButtons(true);
}
window.addEventListener('beforeinstallprompt', captureInstallPrompt);
window.addEventListener('edtech-install-ready', () => {
    installPromptEvent = window.__edtechInstallPrompt || installPromptEvent;
    updateInstallButtons(true);
});

function debounceActiveSessionSave(callback) {
    clearTimeout(activeSessionSaveTimer);
    activeSessionSaveTimer = setTimeout(callback, 160);
}

function persistActiveQuizSession() {
    if (!window.EdTechDB || quizSubmitted || !quizData?.length) return;
    debounceActiveSessionSave(() => {
        window.EdTechDB.put('activeSessions', {
            id: 'active-quiz',
            type: 'quiz',
            updatedAt: new Date().toISOString(),
            fileName: currentFileName || 'Bộ đề trắc nghiệm',
            quizData: clone(quizData),
            quizAnswers: clone(quizAnswers),
            flaggedQuestions: [...flaggedQuestions],
            currentQuizIndex,
            quizNavPage,
            quizStartedAt,
            quizDeadline,
            quizTimeLimitSeconds,
            lastQuizSource: lastQuizSource ? clone(lastQuizSource) : null
        }).catch(error => console.warn('Không thể lưu bài đang làm:', error));
    });
}

function clearActiveQuizSession() {
    clearTimeout(activeSessionSaveTimer);
    return window.EdTechDB?.delete('activeSessions', 'active-quiz').catch(() => {});
}

function persistActiveFlashcardSession() {
    if (!window.EdTechDB || !fcState?.cards?.length) return;
    window.EdTechDB.put('activeSessions', {
        id: 'active-flashcards',
        type: 'flashcard',
        updatedAt: new Date().toISOString(),
        fileName: currentFileName || fcState.fileName || 'Bộ Flashcard',
        state: clone(fcState),
        source: lastFlashcardSource ? clone(lastFlashcardSource) : null
    }).catch(error => console.warn('Không thể lưu phiên flashcard:', error));
}

function clearActiveFlashcardSession() {
    return window.EdTechDB?.delete('activeSessions', 'active-flashcards').catch(() => {});
}

async function offerRestoreActiveSession() {
    if (!window.EdTechDB) return;
    const [quizSession, flashcardSession] = await Promise.all([
        window.EdTechDB.get('activeSessions', 'active-quiz').catch(() => null),
        window.EdTechDB.get('activeSessions', 'active-flashcards').catch(() => null)
    ]);
    const session = quizSession || flashcardSession;
    if (!session) return;
    const age = Date.now() - new Date(session.updatedAt || 0).getTime();
    if (!Number.isFinite(age) || age > 14 * 86400000) {
        await window.EdTechDB.delete('activeSessions', session.id).catch(() => {});
        return;
    }
    await new Promise(resolve => {
        openConfirmModal(
            session.type === 'quiz' ? 'Tiếp tục bài trắc nghiệm?' : 'Tiếp tục phiên flashcard?',
            `Phát hiện “${session.fileName || 'Phiên học'}” chưa hoàn thành. Tiến độ đã được lưu tự động trên thiết bị.`,
            'Tiếp tục',
            () => {
                if (session.type === 'quiz') restoreQuizSession(session);
                else restoreFlashcardSession(session);
                resolve();
            },
            'Bỏ phiên',
            async () => {
                await window.EdTechDB.delete('activeSessions', session.id).catch(() => {});
                resolve();
            }
        );
    });
}

function restoreQuizSession(session) {
    quizData = Array.isArray(session.quizData) ? clone(session.quizData) : [];
    if (!quizData.length) return;
    quizAnswers = Array.isArray(session.quizAnswers) ? clone(session.quizAnswers) : Array(quizData.length).fill(null);
    while (quizAnswers.length < quizData.length) quizAnswers.push(null);
    flaggedQuestions = new Set(session.flaggedQuestions || []);
    currentQuizIndex = Math.max(0, Math.min(quizData.length - 1, Number(session.currentQuizIndex) || 0));
    quizNavPage = Math.floor(currentQuizIndex / QUIZ_NAV_PAGE_SIZE);
    quizStartedAt = Number(session.quizStartedAt) || Date.now();
    quizDeadline = Number(session.quizDeadline) || 0;
    quizTimeLimitSeconds = Number(session.quizTimeLimitSeconds) || 0;
    quizSubmitted = false;
    currentFileName = session.fileName || 'Bộ đề trắc nghiệm';
    lastQuizSource = session.lastQuizSource || null;
    document.getElementById('quiz-title').textContent = currentFileName;
    clearInterval(quizTimer);
    renderQuizUI();
    showScreen('quiz-app');
    quizTimer = setInterval(updateQuizTimer, 500);
    updateQuizTimer();
    showToast('Đã khôi phục bài đang làm.', 'success');
}

function restoreFlashcardSession(session) {
    if (!session.state?.cards?.length) return;
    fcState = clone(session.state);
    currentFileName = session.fileName || fcState.fileName || 'Bộ Flashcard';
    lastFlashcardSource = session.source || null;
    document.getElementById('fc-title').textContent = currentFileName;
    showScreen('flashcard-app');
    renderFlashcard();
    showToast('Đã khôi phục phiên flashcard.', 'success');
}

async function renderLocalQuestionSets() {
    const container = document.getElementById('local-question-set-list');
    if (!container || !window.EdTechDB) return;
    container.innerHTML = '<span class="empty-inline">Đang đọc thư viện…</span>';
    try {
        const items = (await window.EdTechDB.listQuestionSets()).slice(0, 12);
        if (!items.length) {
            container.innerHTML = '<span class="empty-inline">Chưa có bộ đề được lưu.</span>';
            return;
        }
        container.innerHTML = items.map(item => `<article class="local-set-item">
            <button type="button" class="local-set-main" onclick="loadLocalQuestionSet('${escapeHTML(item.id)}')">
                <span class="local-set-icon ${item.type}"><svg><use href="#${item.type === 'flashcard' ? 'i-cards' : 'i-quiz'}"></use></svg></span>
                <span><strong>${escapeHTML(item.name)}</strong><small>${item.count || Math.max(0, (item.rows?.length || 1) - 1)} mục · ${timeAgo(item.updatedAt)}</small></span>
            </button>
            <button type="button" class="local-set-delete" onclick="deleteLocalQuestionSet('${escapeHTML(item.id)}', event)" aria-label="Xóa bộ đề"><svg><use href="#i-trash"></use></svg></button>
        </article>`).join('');
    } catch (error) {
        container.innerHTML = '<span class="empty-inline">Không thể đọc thư viện trên thiết bị.</span>';
    }
}

async function loadLocalQuestionSet(id) {
    const item = await window.EdTechDB.get('questionSets', id).catch(() => null);
    if (!item?.rows?.length) {
        showToast('Bộ đề này không còn dữ liệu.', 'error');
        return;
    }
    selectedWorkbookData = clone(item.rows);
    currentFileName = item.name || 'Bộ đề';
    selectStudyMode(item.type || studyMode, false);
    const pill = document.getElementById('selected-file-pill');
    if (pill) {
        pill.hidden = false;
        pill.textContent = currentFileName;
    }
    document.getElementById('drop-title').textContent = 'Đã chọn bộ đề trên thiết bị';
    document.getElementById('drop-subtitle').textContent = `${item.count || Math.max(0, item.rows.length - 1)} mục sẵn sàng`;
    updateSetupSummary();
    playSound('navigate');
}

function deleteLocalQuestionSet(id, event) {
    event?.stopPropagation();
    openConfirmModal('Xóa bộ đề đã lưu?', 'Bộ đề sẽ bị xóa khỏi thư viện trên thiết bị. Lịch sử học tập không bị ảnh hưởng.', 'Xóa', async () => {
        await window.EdTechDB.delete('questionSets', id).catch(() => {});
        renderLocalQuestionSets();
        showToast('Đã xóa bộ đề khỏi thiết bị.', 'success');
    });
}

function creatorSnapshot() {
    return { drafts: clone(creatorDrafts), mode: creatorMode, activeId: activeCreatorId };
}

function pushCreatorHistory() {
    if (creatorHistoryLock) return;
    creatorUndoStack.push(creatorSnapshot());
    if (creatorUndoStack.length > 30) creatorUndoStack.shift();
    creatorRedoStack = [];
    updateCreatorHistoryButtons();
}

function scheduleCreatorHistorySnapshot() {
    if (creatorEditSnapshotTimer) return;
    pushCreatorHistory();
    creatorEditSnapshotTimer = setTimeout(() => { creatorEditSnapshotTimer = null; }, 900);
}

function applyCreatorSnapshot(snapshot) {
    if (!snapshot) return;
    creatorHistoryLock = true;
    creatorDrafts = clone(snapshot.drafts);
    creatorMode = snapshot.mode === 'flashcard' ? 'flashcard' : 'quiz';
    activeCreatorId = snapshot.activeId;
    ensureCreatorItems();
    renderCreator();
    saveCreatorDrafts(true);
    creatorHistoryLock = false;
}

function creatorUndo() {
    const snapshot = creatorUndoStack.pop();
    if (!snapshot) return;
    creatorRedoStack.push(creatorSnapshot());
    applyCreatorSnapshot(snapshot);
    updateCreatorHistoryButtons();
    showToast('Đã hoàn tác thao tác gần nhất.', 'info');
}

function creatorRedo() {
    const snapshot = creatorRedoStack.pop();
    if (!snapshot) return;
    creatorUndoStack.push(creatorSnapshot());
    applyCreatorSnapshot(snapshot);
    updateCreatorHistoryButtons();
    showToast('Đã làm lại thao tác.', 'info');
}

function updateCreatorHistoryButtons() {
    const undo = document.getElementById('creator-undo-btn');
    const redo = document.getElementById('creator-redo-btn');
    if (undo) undo.disabled = !creatorUndoStack.length;
    if (redo) redo.disabled = !creatorRedoStack.length;
}

function toggleCreatorMultiSelect() {
    creatorMultiSelect = !creatorMultiSelect;
    if (!creatorMultiSelect) creatorSelectedIds.clear();
    document.getElementById('creator-multiselect-btn')?.classList.toggle('active', creatorMultiSelect);
    document.getElementById('creator-bulk-toolbar').hidden = !creatorMultiSelect;
    renderCreatorList();
    updateCreatorSelectedCount();
}

function toggleCreatorSelection(id, event) {
    event?.stopPropagation();
    if (creatorSelectedIds.has(id)) creatorSelectedIds.delete(id);
    else creatorSelectedIds.add(id);
    renderCreatorList();
    updateCreatorSelectedCount();
}

function updateCreatorSelectedCount() {
    const label = document.getElementById('creator-selected-count');
    if (label) label.textContent = `${creatorSelectedIds.size} mục đã chọn`;
}

function selectAllCreatorVisible() {
    const items = getFilteredCreatorItems();
    const start = creatorListPage * CREATOR_LIST_PAGE_SIZE;
    items.slice(start, start + CREATOR_LIST_PAGE_SIZE).forEach(item => creatorSelectedIds.add(item.id));
    renderCreatorList();
    updateCreatorSelectedCount();
}

function deleteSelectedCreatorItems() {
    if (!creatorSelectedIds.size) return;
    openConfirmModal('Xóa các mục đã chọn?', `${creatorSelectedIds.size} mục sẽ bị xóa khỏi bộ đề.`, 'Xóa đã chọn', () => {
        pushCreatorHistory();
        creatorDrafts[creatorMode] = getCurrentCreatorItems().filter(item => !creatorSelectedIds.has(item.id));
        creatorSelectedIds.clear();
        activeCreatorId = creatorDrafts[creatorMode][0]?.id || null;
        ensureCreatorItems();
        saveCreatorDrafts(true);
        renderCreator();
        updateCreatorSelectedCount();
    });
}

function addCreatorOption() {
    showToast('Trắc nghiệm được cố định 4 đáp án A–D.', 'info');
}

function removeCreatorOption() {
    showToast('Trắc nghiệm được cố định 4 đáp án A–D.', 'info');
}

function updateCreatorTags(value) {
    const item = getActiveCreatorItem();
    scheduleCreatorHistorySnapshot();
    item.tags = String(value || '').split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 12);
    scheduleCreatorSave();
}

async function optimizeImageFile(file) {
    if (!file || !file.type.startsWith('image/')) throw new Error('Tệp đã chọn không phải hình ảnh.');
    if (file.size > 18 * 1024 * 1024) throw new Error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 18 MB.');
    let source;
    if ('createImageBitmap' in window) source = await createImageBitmap(file);
    else {
        const url = URL.createObjectURL(file);
        source = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Không thể đọc hình ảnh.'));
            image.src = url;
        });
        source.__objectURL = url;
    }
    const sourceWidth = source.width || source.naturalWidth;
    const sourceHeight = source.height || source.naturalHeight;
    const maxDimension = 1600;
    const ratio = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * ratio));
    const height = Math.max(1, Math.round(sourceHeight * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    source.close?.();
    if (source.__objectURL) URL.revokeObjectURL(source.__objectURL);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .82));
    if (!blob) throw new Error('Không thể tối ưu hình ảnh.');
    const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await window.EdTechDB?.put('media', { id, blob, type: blob.type, width, height, originalName: file.name, updatedAt: new Date().toISOString() });
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

async function analyzeAIJsonResultFinal({ quiet = false } = {}) {
    const raw = cleanJSONText(document.getElementById('ai-json-import').value);
    if (!raw) {
        showToast('Hãy dán JSON do công cụ AI trả về.', 'error');
        return null;
    }
    try {
        let result;
        try {
            result = await window.EdTechWorker.analyzeImport(raw, creatorMode);
        } catch (workerError) {
            console.warn('Worker JSON fallback:', workerError);
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || !parsed.length) throw new Error('JSON phải là một mảng có dữ liệu.');
            const entries = parsed.map((entry, index) => parseImportEntry(entry, index));
            result = {
                total: entries.length,
                valid: entries.filter(entry => !entry.errors.length).map(entry => entry.item),
                invalid: entries.filter(entry => entry.errors.length)
            };
        }
        result.valid = result.valid.map(item => ({ ...item, id: item.id || makeId(creatorMode === 'quiz' ? 'quiz' : 'fc') }));
        pendingImportAnalysis = result;
        const analysis = document.getElementById('import-analysis');
        if (analysis) {
            analysis.hidden = false;
            analysis.innerHTML = `<div class="import-summary"><strong>Tìm thấy ${result.total} ${creatorMode === 'quiz' ? 'câu' : 'thẻ'}</strong><span>${result.valid.length} hợp lệ · ${result.invalid.length} bị bỏ qua</span></div>
                ${result.invalid.length ? `<div class="import-errors"><strong>Các mục cần kiểm tra</strong>${result.invalid.slice(0, 8).map(entry => `<div><span>Mục ${entry.index + 1}</span><small>${escapeHTML(entry.errors.join(' '))}</small></div>`).join('')}</div>` : '<small>Tất cả dữ liệu đều hợp lệ.</small>'}`;
        }
        if (!quiet) playSound(result.valid.length ? 'success' : 'wrong');
        return result;
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

async function importAIJsonResultFinal() {
    const analysis = await analyzeAIJsonResultFinal({ quiet: true });
    if (!analysis?.valid?.length) return;
    const message = `Tìm thấy ${analysis.total} mục: ${analysis.valid.length} hợp lệ${analysis.invalid.length ? `, ${analysis.invalid.length} bị bỏ qua` : ''}.`;
    openConfirmModal('Nhập dữ liệu hợp lệ?', message, `Nhập ${analysis.valid.length} mục`, () => {
        pushCreatorHistory();
        commitAIJsonImport();
    });
}

function renderHistoryTablePaged() {
    const history = Array.isArray(appData.history) ? [...appData.history] : [];
    const filter = document.getElementById('history-filter')?.value || 'all';
    const query = (document.getElementById('history-search')?.value || '').trim().toLowerCase();
    const filtered = history.filter(item => filter === 'all' || item.mode === filter).filter(item => !query || String(item.file || '').toLowerCase().includes(query)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const pages = Math.max(1, Math.ceil(filtered.length / HISTORY_PAGE_SIZE));
    historyPage = Math.max(0, Math.min(pages - 1, historyPage));
    document.getElementById('history-total-sessions').textContent = history.length;
    document.getElementById('history-total-quizzes').textContent = history.filter(item => item.mode === 'quiz').length;
    document.getElementById('history-total-flashcards').textContent = history.filter(item => item.mode === 'flashcard').length;
    document.getElementById('history-total-xp').textContent = `${Number(appData.xp) || 0} XP`;
    const tbody = document.getElementById('history-table-body');
    const pageItems = filtered.slice(historyPage * HISTORY_PAGE_SIZE, (historyPage + 1) * HISTORY_PAGE_SIZE);
    if (!pageItems.length) tbody.innerHTML = '<tr><td colspan="7" class="history-empty-cell">Không có hoạt động phù hợp.</td></tr>';
    else tbody.innerHTML = pageItems.map(item => {
        const isQuiz = item.mode === 'quiz';
        const result = isQuiz ? `${item.correct || 0}/${item.total || 0} (${item.accuracy || 0}%)` : `${item.good || 0}/${item.total || 0} nhớ tốt`;
        const hasSource = Array.isArray(item.sourceRows) && item.sourceRows.length > 1;
        const hasFocusRows = isQuiz ? Array.isArray(item.wrongRows) && item.wrongRows.length > 1 : Array.isArray(item.hardRows) && item.hardRows.length > 1;
        return `<tr><td>${formatDate(item.timestamp)}</td><td><span class="history-mode-chip ${item.mode}">${isQuiz ? 'Trắc nghiệm' : 'Flashcard'}</span></td><td><strong>${escapeHTML(item.file || 'Không tên')}</strong></td><td>${escapeHTML(result)}</td><td>${formatLongDuration(item.duration || 0)}</td><td><strong>+${Number(item.xp) || 0} XP</strong></td><td><div class="history-actions"><button ${hasSource ? '' : 'disabled'} onclick="repeatHistorySession('${item.id}')">${isQuiz ? 'Làm lại' : 'Ôn lại'}</button>${isQuiz && Array.isArray(item.review) ? `<button onclick="reviewHistoryQuiz('${item.id}')">Xem lại</button>` : ''}<button ${hasFocusRows ? '' : 'disabled'} onclick="repeatHistorySession('${item.id}', true)">${isQuiz ? 'Câu sai' : 'Thẻ khó'}</button><button class="danger" onclick="deleteHistoryItem('${item.id}')">Xóa</button></div></td></tr>`;
    }).join('');
    let pager = document.getElementById('history-pagination');
    if (!pager) {
        pager = document.createElement('div');
        pager.id = 'history-pagination';
        pager.className = 'history-pagination';
        tbody.closest('.table-wrap')?.after(pager);
    }
    pager.hidden = filtered.length <= HISTORY_PAGE_SIZE;
    pager.innerHTML = `<button type="button" onclick="changeHistoryPage(-1)" ${historyPage <= 0 ? 'disabled' : ''}>‹</button><span>Trang <strong>${historyPage + 1}</strong> / ${pages}</span><button type="button" onclick="changeHistoryPage(1)" ${historyPage >= pages - 1 ? 'disabled' : ''}>›</button>`;
}

function changeHistoryPage(delta) {
    historyPage += Number(delta) || 0;
    renderHistoryTablePaged();
}

function updateInstallButtons(visible = true) {
    ['install-app-btn', 'install-shortcut-btn', 'install-hero-btn'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.hidden = !visible;
    });
}

function isStandaloneApp() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function initInstallPrompt() {
    installPromptEvent = window.__edtechInstallPrompt || installPromptEvent;
    updateInstallButtons(!isStandaloneApp());
    window.addEventListener('edtech-app-installed', () => {
        installPromptEvent = null;
        updateInstallButtons(false);
        showToast('EdTech đã được cài lên thiết bị này.', 'success');
    });
    window.addEventListener('appinstalled', () => {
        installPromptEvent = null;
        window.__edtechInstallPrompt = null;
        updateInstallButtons(false);
        showToast('EdTech đã được cài lên thiết bị này.', 'success');
    });
}

function getPublicAppUrl() {
    try {
        if (/^https?:$/.test(location.protocol)) return new URL('./#home', location.href).href;
        return new URL(window.EDTECH_PUBLIC_URL || 'https://tuanminhmoc.github.io/Edtech-LMS/').href.replace(/#.*$/, '') + '#home';
    } catch (_) {
        return 'https://tuanminhmoc.github.io/Edtech-LMS/#home';
    }
}

function waitForNativeInstallPrompt(timeout = 1600) {
    installPromptEvent = window.__edtechInstallPrompt || installPromptEvent;
    if (installPromptEvent) return Promise.resolve(installPromptEvent);
    return new Promise(resolve => {
        let settled = false;
        const finish = value => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            window.removeEventListener('edtech-install-ready', handleReady);
            resolve(value || null);
        };
        const handleReady = () => finish(window.__edtechInstallPrompt || installPromptEvent);
        const timer = setTimeout(() => finish(null), timeout);
        window.addEventListener('edtech-install-ready', handleReady, { once: true });
    });
}

function downloadWindowsInstaller() {
    const link = document.createElement('a');
    link.href = new URL('./downloads/Install%20EdTech%20LMS%20Pro.cmd', location.href).href;
    link.download = 'Install EdTech LMS Pro.cmd';
    document.body.appendChild(link);
    link.click();
    link.remove();
}

async function promptNativeInstall(prompt) {
    try {
        await prompt.prompt();
        const choice = await prompt.userChoice.catch(() => null);
        if (choice?.outcome === 'accepted') {
            installPromptEvent = null;
            window.__edtechInstallPrompt = null;
            updateInstallButtons(false);
            return true;
        }
        updateInstallButtons(true);
        return false;
    } catch (error) {
        console.warn('Không thể mở hộp cài ứng dụng:', error);
        return false;
    }
}

async function installApp() {
    if (isStandaloneApp()) {
        showToast('EdTech đang chạy ở chế độ ứng dụng.', 'success');
        return;
    }

    let prompt = window.__edtechInstallPrompt || installPromptEvent;
    if (!prompt) {
        await window.EdTechPWA?.register?.();
        if ('serviceWorker' in navigator) await navigator.serviceWorker.ready.catch(() => null);
        prompt = await waitForNativeInstallPrompt(1800);
    }

    if (prompt) {
        await promptNativeInstall(prompt);
        return;
    }

    const ua = navigator.userAgent || '';
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isMacSafari = /macintosh|mac os x/i.test(ua) && /safari/i.test(ua) && !/chrome|crios|edg|opr|brave/i.test(ua);
    const isWindows = /windows/i.test(ua);

    if (isWindows) {
        downloadWindowsInstaller();
        showToast('Đã tải bộ cài Windows. Mở file để tạo app trên Desktop và Start Menu.', 'success');
    } else if (isIOS) {
        showToast('iPhone/iPad: bấm Chia sẻ rồi chọn “Thêm vào Màn hình chính”.', 'info');
    } else if (isMacSafari) {
        showToast('Safari trên Mac: mở File rồi chọn “Add to Dock”.', 'info');
    } else {
        showToast('Mở menu trình duyệt và chọn “Cài ứng dụng” hoặc “Add to Home screen”.', 'info');
    }
}

// Wrap core mutations with history and persistence.
const coreRenderCreatorList = renderCreatorList;
renderCreatorList = function renderCreatorListEnhanced() {
    coreRenderCreatorList();
    const allItems = getCurrentCreatorItems();
    document.querySelectorAll('.creator-grid-tile').forEach(tile => {
        const button = tile.querySelector('.creator-grid-select');
        const index = Number(button?.textContent?.trim()) - 1;
        const item = allItems[index];
        if (!item) return;
        tile.classList.toggle('multi-select-mode', creatorMultiSelect);
        tile.classList.toggle('selected-multi', creatorSelectedIds.has(item.id));
        if (creatorMultiSelect) {
            button.onclick = event => toggleCreatorSelection(item.id, event);
            const mark = document.createElement('span');
            mark.className = 'creator-multi-check';
            mark.textContent = creatorSelectedIds.has(item.id) ? '✓' : '';
            tile.appendChild(mark);
        }
    });
    updateCreatorHistoryButtons();
    updateCreatorSelectedCount();
};

createBlankCreatorItem = function createBlankCreatorItemEnhanced(mode) {
    if (mode === 'flashcard') return { id: makeId('fc'), front: '', back: '', explanation: '', tags: [], difficulty: 'medium', reversible: true };
    return { id: makeId('quiz'), question: '', options: ['', '', '', ''], correct: null, explanation: '', tags: [], difficulty: 'medium' };
};

validateCreatorItem = function validateCreatorItemEnhanced(item, mode = creatorMode) {
    const errors = [];
    if (mode === 'quiz') {
        const question = String(item?.question || '').trim();
        const options = Array.isArray(item?.options) ? item.options.slice(0, 4).map(value => String(value || '').trim()) : [];
        const nonEmpty = options.filter(Boolean);
        if (!question) errors.push('Câu hỏi đang để trống.');
        if (options.length !== 4) errors.push('Câu trắc nghiệm phải có đúng 4 đáp án.');
        if (nonEmpty.length !== 4) errors.push(`Cần nhập đủ 4 đáp án, hiện có ${nonEmpty.length}.`);
        const normalized = nonEmpty.map(value => normalizeAnswerText(value));
        if (new Set(normalized).size !== normalized.length) errors.push('Có đáp án bị trùng nhau.');
        const correct = Number(item?.correct);
        if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) errors.push('Chưa chọn đáp án đúng.');
        else if (!options[correct]) errors.push('Đáp án đúng đang để trống.');
    } else {
        if (!String(item?.front || '').trim()) errors.push('Mặt trước đang để trống.');
        if (!String(item?.back || '').trim()) errors.push('Mặt sau đang để trống.');
    }
    return errors;
};

const coreRenderCreatorEditor = renderCreatorEditor;
renderCreatorEditor = function renderCreatorEditorEnhanced() {
    const item = getActiveCreatorItem();
    if (item) {
        item.tags = Array.isArray(item.tags) ? item.tags : [];
        item.difficulty = ['easy', 'medium', 'hard'].includes(item.difficulty) ? item.difficulty : 'medium';
        if (creatorMode === 'quiz') {
            item.options = Array.isArray(item.options) ? item.options.slice(0, 4) : ['', '', '', ''];
            while (item.options.length < 4) item.options.push('');
            if (!Number.isInteger(Number(item.correct)) || Number(item.correct) < 0 || Number(item.correct) > 3) item.correct = null;
        } else if (item.reversible === undefined) item.reversible = true;
    }
    coreRenderCreatorEditor();
    const editor = document.getElementById('creator-editor');
    if (!editor || !item) return;
    if (creatorMode === 'quiz') {
        const answerGrid = editor.querySelector('.editor-grid');
        if (answerGrid) {
            answerGrid.innerHTML = item.options.map((option, optionIndex) => {
                const letter = String.fromCharCode(65 + optionIndex);
                return `<label><span>Đáp án ${letter}</span><div class="answer-editor answer-editor-fixed"><button class="answer-radio ${Number(item.correct) === optionIndex ? 'selected' : ''}" onclick="setCreatorCorrect(${optionIndex})">${letter}</button><textarea class="editor-textarea" rows="2" oninput="updateCreatorOption(${optionIndex}, this.value)" onpaste="handleCreatorPaste(event, 'option-${optionIndex}')">${escapeHTML(stripCreatorMediaMarkup(option))}</textarea><input id="creator-file-option-${optionIndex}" type="file" accept="image/*" hidden onchange="insertCreatorImage(event, 'option-${optionIndex}')"></div><span class="field-tools"><button onclick="triggerCreatorImage('option-${optionIndex}')">Chèn ảnh vào đáp án ${letter}</button></span>${renderCreatorMediaCards(option, `option-${optionIndex}`)}</label>`;
            }).join('');
        }
    }
    const meta = document.createElement('div');
    meta.className = 'editor-section creator-meta-grid';
    meta.innerHTML = `<label>Nhãn phân loại<input type="text" value="${escapeHTML((item.tags || []).join(', '))}" oninput="updateCreatorTags(this.value)" placeholder="Ví dụ: sinh học, chương 2"></label>
        <label>Độ khó<select onchange="updateCreatorField('difficulty', this.value)"><option value="easy" ${item.difficulty === 'easy' ? 'selected' : ''}>Dễ</option><option value="medium" ${item.difficulty === 'medium' ? 'selected' : ''}>Trung bình</option><option value="hard" ${item.difficulty === 'hard' ? 'selected' : ''}>Khó</option></select></label>
        ${creatorMode === 'flashcard' ? `<label class="creator-inline-toggle"><input type="checkbox" ${item.reversible !== false ? 'checked' : ''} onchange="updateCreatorField('reversible', this.checked)"><span>Cho phép học đảo chiều riêng thẻ này</span></label>` : ''}`;
    editor.appendChild(meta);
};

const originalUpdateCreatorField = updateCreatorField;
updateCreatorField = function updateCreatorFieldTracked(field, value) {
    scheduleCreatorHistorySnapshot();
    originalUpdateCreatorField(field, value);
};
const originalUpdateCreatorOption = updateCreatorOption;
updateCreatorOption = function updateCreatorOptionTracked(index, value) {
    scheduleCreatorHistorySnapshot();
    originalUpdateCreatorOption(index, value);
};
const originalSetCreatorCorrect = setCreatorCorrect;
setCreatorCorrect = function setCreatorCorrectTracked(index) { pushCreatorHistory(); originalSetCreatorCorrect(index); };
['addCreatorItem', 'duplicateCreatorItem', 'moveCreatorItem', 'deleteCreatorItem', 'clearCreatorItems'].forEach(name => {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function trackedCreatorMutation(...args) { pushCreatorHistory(); return original(...args); };
});
window.fileToDataURL = optimizeImageFile;
analyzeAIJsonResult = analyzeAIJsonResultFinal;
importAIJsonResult = importAIJsonResultFinal;
renderHistoryTable = renderHistoryTablePaged;

const coreFinalizeQuiz = finalizeQuiz;
finalizeQuiz = function finalizeQuizEnhanced() {
    coreFinalizeQuiz();
    clearActiveQuizSession();
};
const coreStartFlashcards = startFlashcardMode;
startFlashcardMode = function startFlashcardsEnhanced(rows) {
    coreStartFlashcards(rows);
    persistActiveFlashcardSession();
};
const coreRateFlashcard = rateFlashcard;
rateFlashcard = function rateFlashcardEnhanced(rating) {
    coreRateFlashcard(rating);
    persistActiveFlashcardSession();
};
const coreUndoFlashcard = undoFlashcardRating;
undoFlashcardRating = function undoFlashcardEnhanced() {
    coreUndoFlashcard();
    persistActiveFlashcardSession();
};
const coreFinishFlashcards = finishFlashcardSession;
finishFlashcardSession = function finishFlashcardsEnhanced() {
    coreFinishFlashcards();
    clearActiveFlashcardSession();
};

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    if (!/AbortError/i.test(String(event.reason))) showToast('Có thao tác chưa hoàn tất. Dữ liệu đã được giữ an toàn.', 'error');
});
window.addEventListener('error', event => console.error('Application error:', event.error || event.message));

function trapActiveModalFocus(event) {
    if (event.key !== 'Tab') return;
    const modal = [...document.querySelectorAll('.modal-overlay:not([hidden])')].pop();
    if (!modal) return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const version = document.getElementById('app-version-label');
    if (version) version.textContent = `v${window.EDTECH_APP_VERSION || '1.2.2'}`;
    initInstallPrompt();
    initQuickSettings();
    initMobileViewportPolish();
    initMobileHaptics();
    initMobileSwipeGestures();
    initMobileNavAutoHide();
    document.getElementById('data-center-modal')?.addEventListener('click', event => { if (event.target.id === 'data-center-modal') closeDataCenter(); });
    document.addEventListener('keydown', event => {
        trapActiveModalFocus(event);
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && document.querySelector('.app-screen.active')?.id === 'creator-screen') {
            event.preventDefault();
            event.shiftKey ? creatorRedo() : creatorUndo();
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y' && document.querySelector('.app-screen.active')?.id === 'creator-screen') {
            event.preventDefault();
            creatorRedo();
        }
    });
    updateCreatorHistoryButtons();
});

Object.assign(window, {
    persistActiveQuizSession,
    clearActiveQuizSession,
    persistActiveFlashcardSession,
    clearActiveFlashcardSession,
    offerRestoreActiveSession,
    renderLocalQuestionSets,
    loadLocalQuestionSet,
    deleteLocalQuestionSet,
    creatorUndo,
    creatorRedo,
    toggleCreatorMultiSelect,
    toggleCreatorSelection,
    selectAllCreatorVisible,
    deleteSelectedCreatorItems,
    addCreatorOption,
    removeCreatorOption,
    updateCreatorTags,
    changeHistoryPage,
    installApp
});


function closeQuickSettings() {
    const menu = document.getElementById('quick-settings-menu');
    const toggle = document.getElementById('settings-toggle');
    if (!menu) return;
    menu.hidden = true;
    menu.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
}

function openQuickSettings() {
    const menu = document.getElementById('quick-settings-menu');
    const toggle = document.getElementById('settings-toggle');
    if (!menu) return;
    menu.hidden = false;
    menu.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
}

function toggleQuickSettings(event) {
    event?.stopPropagation?.();
    const menu = document.getElementById('quick-settings-menu');
    if (!menu || !menu.hidden) {
        closeQuickSettings();
        return;
    }
    openQuickSettings();
}

function initQuickSettings() {
    const menu = document.getElementById('quick-settings-menu');
    const toggle = document.getElementById('settings-toggle');
    if (!menu || !toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    document.addEventListener('click', event => {
        if (menu.hidden) return;
        if (!menu.contains(event.target) && !toggle.contains(event.target)) closeQuickSettings();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeQuickSettings();
    });
    menu.addEventListener('click', event => {
        const actionButton = event.target.closest('.quick-settings-btn');
        if (actionButton && !actionButton.classList.contains('install-shortcut-btn')) {
            setTimeout(closeQuickSettings, 60);
        }
    });
}


function initMobileViewportPolish() {
    const viewport = window.visualViewport;
    const updateViewport = () => {
        const height = viewport?.height || window.innerHeight;
        document.documentElement.style.setProperty('--visual-viewport-height', `${Math.round(height)}px`);
        const keyboardOpen = Boolean(viewport && window.innerHeight - viewport.height > 120);
        document.body.classList.toggle('keyboard-open', keyboardOpen);
    };
    updateViewport();
    viewport?.addEventListener('resize', updateViewport, { passive: true });
    viewport?.addEventListener('scroll', updateViewport, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updateViewport, 180), { passive: true });

    document.addEventListener('focusin', event => {
        if (!window.matchMedia('(max-width: 900px), (max-width: 1180px) and (pointer: coarse)').matches) return;
        if (!event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
        setTimeout(() => event.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 260);
    });
}

function mobileHaptic(pattern = 8) {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    try { navigator.vibrate?.(pattern); } catch (_) {}
}

function initMobileHaptics() {
    document.addEventListener('click', event => {
        if (!window.matchMedia('(pointer: coarse)').matches) return;
        const target = event.target.closest('button, .option-item, .mode-card');
        if (!target) return;
        if (target.matches('.danger, .danger-soft, .text-danger-btn, .creator-index-delete')) mobileHaptic([12, 30, 12]);
        else if (target.matches('.rating, .option-item, .mode-card')) mobileHaptic(8);
        else mobileHaptic(5);
    }, { passive: true });
}

function initMobileSwipeGestures() {
    if (!window.matchMedia('(pointer: coarse), (max-width: 900px)').matches) return;
    const bindSwipe = (element, handlers) => {
        if (!element || element.dataset.swipeBound === '1') return;
        element.dataset.swipeBound = '1';
        let startX = 0;
        let startY = 0;
        let startedAt = 0;
        element.addEventListener('touchstart', event => {
            if (event.touches.length !== 1 || event.target.closest('input, textarea, select, button')) return;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            startedAt = performance.now();
        }, { passive: true });
        element.addEventListener('touchend', event => {
            if (!startedAt || !event.changedTouches?.length) return;
            const dx = event.changedTouches[0].clientX - startX;
            const dy = event.changedTouches[0].clientY - startY;
            const elapsed = performance.now() - startedAt;
            startedAt = 0;
            if (elapsed > 650 || Math.abs(dx) < 72 || Math.abs(dy) > 46) return;
            if (dx < 0) handlers.left?.();
            else handlers.right?.();
        }, { passive: true });
    };

    bindSwipe(document.getElementById('questions-container'), {
        left: () => { window.moveQuizQuestion?.(1); mobileHaptic(6); },
        right: () => { window.moveQuizQuestion?.(-1); mobileHaptic(6); }
    });
    bindSwipe(document.getElementById('fc-card'), {
        left: () => { window.skipFlashcard?.(); mobileHaptic(6); },
        right: () => { window.undoFlashcardRating?.(); mobileHaptic(6); }
    });
}

function initMobileNavAutoHide() {
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!window.matchMedia('(max-width: 900px), (max-width: 1180px) and (pointer: coarse)').matches || document.body.classList.contains('keyboard-open')) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const currentY = window.scrollY;
            const delta = currentY - lastY;
            nav.classList.toggle('is-hidden-by-scroll', delta > 12 && currentY > 160);
            if (delta < -8 || currentY < 80) nav.classList.remove('is-hidden-by-scroll');
            lastY = currentY;
            ticking = false;
        });
    }, { passive: true });
}
