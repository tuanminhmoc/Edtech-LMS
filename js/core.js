document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => { if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) e.preventDefault(); });
setInterval(function() { const b = new Date().getTime(); debugger; const a = new Date().getTime(); if (a - b > 100) { document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:20%;font-family:sans-serif;'>🚨 PHÁT HIỆN CAN THIỆP MÃ NGUỒN 🚨</h1>"; window.location.reload(); } }, 1000);

const SECURE_KEY = 'EdTech_SecureDB'; const SECRET_SALT = 'EdTech_LMS_2026_TopSecret_@!#';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(250, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

document.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' || e.target.closest('.btn-main, .btn-outline, .btn-danger, .theme-btn, .nav-item, .option-item, .cr-correct-box, .btn-action')) { playSound('click'); }
});

function generateHash(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; } return h.toString(16); }

let usersData = {}; let currentUser = null; let currentFileName = ""; let studyMode = 'quiz';
let quizData = []; let flaggedQuestions = new Set(); let totalQuestions = 0; let isSubmitted = false; let timerInterval; let timeElapsed = 0;
let fcDeckOriginal = []; let fcCurrentDeck = []; let fcNextRoundDeck = []; let fcCurrentIndex = 0; let fcRound = 1; let fcStats = { firstTry: 0, struggled: new Set(), totalMastered: 0 };
let creatorQuestionsCount = 0; const originalTitle = document.title;
let currentCreatorMode = 'quiz'; let tempLoginUser = "";

// CÁC BIẾN CHỨA FILE ĐÍNH KÈM CHO AI (DÙNG VAR ĐỂ TRÁNH LỖI SCOPE)
var aiAttachedFile = null; 
var summarizerAttachedFile = null; 
var essayAttachedFile = null; 
let currentEssayGeneratedQuestions = "";

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('edtech_unlocked') !== 'true') {
        document.getElementById('master-key-overlay').style.display = 'flex';
        setTimeout(()=> document.getElementById('master-key-input').focus(), 100);
    }

    const k = localStorage.getItem('ai_api_key'); const m = localStorage.getItem('ai_model');
    if (k) document.getElementById('ai-api-key').value = k;
    if (m) document.getElementById('ai-model').value = m;
    const savedBgUrl = localStorage.getItem('quizBgUrl');
    if (savedBgUrl) { setBackground(savedBgUrl); const inputBg = document.getElementById('custom-bg-url'); if (inputBg) inputBg.value = savedBgUrl; }
    const isGlass = localStorage.getItem('quizGlass') === 'true';
    if (isGlass) { document.documentElement.setAttribute('data-glass', 'true'); const glassToggle = document.getElementById('glass-toggle'); if (glassToggle) glassToggle.checked = true; }
    const savedGlassBlur = localStorage.getItem('quizGlassBlur') || '20';
    document.documentElement.style.setProperty('--glass-blur', savedGlassBlur + 'px');
    const sliderGlass = document.getElementById('glass-blur-slider'); if(sliderGlass) sliderGlass.value = savedGlassBlur;
    const savedBgBlur = localStorage.getItem('quizBgBlur') || '15';
    document.documentElement.style.setProperty('--bg-blur', savedBgBlur + 'px');
    const sliderBg = document.getElementById('bg-blur-slider'); if(sliderBg) sliderBg.value = savedBgBlur;
    const savedTextColor = localStorage.getItem('quizTextColor');
    if(savedTextColor) { document.documentElement.style.setProperty('--text-main', savedTextColor); const tColorPicker = document.getElementById('text-color-picker'); if(tColorPicker) tColorPicker.value = savedTextColor; }
});

function verifyMasterKey() {
    const val = document.getElementById('master-key-input').value; let s = "";
    for(let i=0; i<val.length; i++) s += String.fromCharCode(val.charCodeAt(i) + 5);
    if (s === "JiYjhmKwjj") { 
        playSound('success'); localStorage.setItem('edtech_unlocked', 'true'); document.getElementById('master-key-overlay').style.display = 'none';
    } else { playSound('error'); alert("❌ Mã Khởi Động không chính xác!"); }
}

function openSettings() { document.getElementById('settings-modal').style.display = 'flex'; }
function closeSettings() { document.getElementById('settings-modal').style.display = 'none'; showDashboard(); }
function openGuide() { document.getElementById('guide-modal').style.display = 'flex'; }
function closeGuide() { document.getElementById('guide-modal').style.display = 'none'; showDashboard(); }
function openCreatorGuide() { document.getElementById('creator-guide-modal').style.display = 'flex'; }
function closeCreatorGuide() { document.getElementById('creator-guide-modal').style.display = 'none'; }
function applyBackground() { const url = document.getElementById('custom-bg-url').value.trim(); if (!url) return alert("Vui lòng nhập link ảnh/GIF hợp lệ!"); setBackground(url); localStorage.setItem('quizBgUrl', url); }
function clearBackground() { document.getElementById('custom-bg-url').value = ''; const bgDiv = document.getElementById('app-bg'); if(bgDiv) { bgDiv.classList.remove('active'); bgDiv.style.backgroundImage = ''; } document.body.classList.remove('has-bg'); localStorage.removeItem('quizBgUrl'); }
function setBackground(url) { const bgDiv = document.getElementById('app-bg'); if(bgDiv) { bgDiv.style.backgroundImage = `url('${url}')`; bgDiv.classList.add('active'); document.body.classList.add('has-bg'); } }
function toggleGlassMode() { const toggle = document.getElementById('glass-toggle'); if (toggle && toggle.checked) { document.documentElement.setAttribute('data-glass', 'true'); localStorage.setItem('quizGlass', 'true'); } else { document.documentElement.removeAttribute('data-glass'); localStorage.setItem('quizGlass', 'false'); } }
function updateGlassBlur(val) { document.documentElement.style.setProperty('--glass-blur', val + 'px'); localStorage.setItem('quizGlassBlur', val); }
function updateBgBlur(val) { document.documentElement.style.setProperty('--bg-blur', val + 'px'); localStorage.setItem('quizBgBlur', val); }
function setTextColor(c) { document.documentElement.style.setProperty('--text-main', c); localStorage.setItem('quizTextColor', c); }

function setTheme(t) { document.documentElement.setAttribute('data-theme', t); document.documentElement.style.removeProperty('--primary'); document.documentElement.style.removeProperty('--bg-color'); localStorage.setItem('quizTheme', t); }
function setCustomTheme(c) { document.documentElement.setAttribute('data-theme', 'custom'); document.documentElement.style.setProperty('--primary', c); document.documentElement.style.setProperty('--bg-color', c + '11'); localStorage.setItem('quizTheme', 'custom'); localStorage.setItem('quizColor', c); }

try {
    if (localStorage.getItem('quizUsersData')) localStorage.removeItem('quizUsersData');
    const savedData = localStorage.getItem(SECURE_KEY);
    if (savedData) {
        const parts = savedData.split('|');
        if (parts.length === 2) {
            const dataBase64 = parts[0]; const signature = parts[1];
            if (generateHash(dataBase64 + SECRET_SALT) !== signature) throw new Error("Tampered");
            usersData = JSON.parse(decodeURIComponent(atob(dataBase64)));
        } else throw new Error("Invalid");
    }
} catch (e) { usersData = {}; localStorage.removeItem(SECURE_KEY); }

function saveDB() { const db64 = btoa(encodeURIComponent(JSON.stringify(usersData))); localStorage.setItem(SECURE_KEY, db64 + "|" + generateHash(db64 + SECRET_SALT)); }

function parseText(t) {
    if (!t) return ""; t = t.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>'); t = t.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    return t.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (m, u) => { let c = u.trim().replace(/\s/g, ''); if (c.startsWith('http') || c.startsWith('data:image')) return `<img src="${c}" class="rendered-img">`; return '[Ảnh không an toàn]'; });
}

function shuffleArray(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } }

function switchScreen(id) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
    const t = document.getElementById(id); if (t) t.classList.add('active');
    const btn = document.getElementById('btn-back'); const top = document.getElementById('top-bar');
    if (id === 'quiz-app' || id === 'flashcard-app') { top.style.display = 'flex'; btn.style.display = 'flex'; document.getElementById('back-text').innerText = "Về cấu hình"; btn.onclick = () => showUploadScreen(); } 
    else if (id === 'upload-screen' || id === 'creator-screen' || id === 'summarizer-screen' || id === 'essay-screen') { top.style.display = 'none'; btn.style.display = 'flex'; document.getElementById('back-text').innerText = "Trang chủ"; btn.onclick = () => showDashboard(); } 
    else { top.style.display = 'none'; btn.style.display = 'none'; }
}

function initLogin() {
    const list = document.getElementById('user-list-render'); list.innerHTML = ''; const names = Object.keys(usersData);
    if (names.length === 0) list.innerHTML = '<div style="color:var(--text-muted); font-size:0.95rem; padding: 15px;">Chưa có dữ liệu.</div>';
    names.forEach(n => { const u = usersData[n]; list.innerHTML += `<div class="user-card" onclick="loginUser('${n}')"><span>👤 ${n}</span> <span style="color:var(--primary); font-size:0.85rem;">LVL ${u.level} | 🔥 ${u.streak}</span></div>`; });
    const th = localStorage.getItem('quizTheme') || 'light'; const c = localStorage.getItem('quizColor');
    if (th === 'custom' && c) setCustomTheme(c); else setTheme(th);
    switchScreen('login-screen');
}

function createNewUser() { 
    const n = document.getElementById('new-username').value.trim(); const p = document.getElementById('new-password').value;
    if (!n) return alert("Vui lòng nhập Tên tài khoản!"); if (!p) return alert("Vui lòng thiết lập Mật khẩu!"); 
    if (usersData[n]) { playSound('error'); return alert("Tên tài khoản đã tồn tại, vui lòng chọn tên khác."); }
    playSound('success'); usersData[n] = { passwordHash: generateHash(p), exp: 0, level: 1, streak: 1, lastLogin: new Date().toDateString(), history: [] }; 
    saveDB(); document.getElementById('new-password').value = ""; directLogin(n); 
}

function loginUser(n) { 
    tempLoginUser = n;
    if (!usersData[n].passwordHash) { directLogin(n); return; }
    document.getElementById('login-username-display').innerText = n; document.getElementById('login-password-input').value = ""; document.getElementById('user-login-modal').style.display = 'flex';
    setTimeout(() => document.getElementById('login-password-input').focus(), 100);
}

function confirmUserLogin() {
    const p = document.getElementById('login-password-input').value; const expectedHash = usersData[tempLoginUser].passwordHash;
    if (generateHash(p) === expectedHash) { playSound('success'); document.getElementById('user-login-modal').style.display = 'none'; directLogin(tempLoginUser); } 
    else { playSound('error'); alert("❌ Mật khẩu không chính xác!"); }
}

function directLogin(n) {
    currentUser = n; let u = usersData[n]; const today = new Date().toDateString(); 
    if (u.lastLogin !== today) { const y = new Date(); y.setDate(y.getDate() - 1); if (u.lastLogin === y.toDateString()) u.streak += 1; else u.streak = 1; u.lastLogin = today; saveDB(); } 
    showDashboard();
}

function logout() { currentUser = null; initLogin(); }
function deleteAccount() { if (confirm(`Xóa tài khoản '${currentUser}'?`)) { delete usersData[currentUser]; saveDB(); logout(); } }
function clearCache() { if (confirm("XÓA TOÀN BỘ dữ liệu người dùng? (Bao gồm cả cài đặt)")) { localStorage.clear(); location.reload(); } }

function showDashboard() {
    switchScreen('dashboard-screen'); let u = usersData[currentUser];
    document.getElementById('avt-img').src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser}&backgroundColor=transparent`;
    document.getElementById('prof-name').innerText = currentUser; document.getElementById('prof-level').innerText = `LVL ${u.level}`; document.getElementById('prof-streak').innerText = u.streak;
    let isMax = u.level >= 100; let cExp = isMax ? 100 : (u.exp % 100); document.getElementById('prof-exp').innerText = cExp; document.getElementById('prof-next-exp').innerText = isMax ? "MAX" : 100; document.getElementById('exp-bar').style.width = `${(cExp / 100) * 100}%`;
    const tbody = document.getElementById('history-tbody'); tbody.innerHTML = '';
    if (!u.history || u.history.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">Chưa có lịch sử.</td></tr>';
    [...u.history].reverse().slice(0, 10).forEach(h => { let m = h.mode === 'flashcard' ? '📇 FC' : '📝 Quiz'; tbody.innerHTML += `<tr><td>${h.date}</td><td style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">${m}</td><td><b>${h.file}</b></td><td style="color:var(--result-correct); font-weight:700;">${h.score}</td><td style="color:var(--primary); font-weight:700;">+${h.expGained}</td></tr>`; });
}

function showUploadScreen() { switchScreen('upload-screen'); if (window.timerInterval) clearInterval(window.timerInterval); document.getElementById('excel-file').value = ""; }
function selectMode(m) { studyMode = m; document.getElementById('btn-mode-quiz').className = m === 'quiz' ? 'mode-btn active' : 'mode-btn'; document.getElementById('btn-mode-fc').className = m === 'flashcard' ? 'mode-btn active' : 'mode-btn'; document.getElementById('config-quiz').style.display = m === 'quiz' ? 'flex' : 'none'; document.getElementById('config-fc').style.display = m === 'flashcard' ? 'flex' : 'none'; }

document.getElementById('excel-file').addEventListener('change', function(e) {
    const f = e.target.files[0]; if (!f) return; currentFileName = f.name;
    const r = new FileReader(); r.onload = function(ev) { const d = new Uint8Array(ev.target.result); const j = XLSX.utils.sheet_to_json(XLSX.read(d, { type: 'array' }).Sheets[XLSX.read(d, { type: 'array' }).SheetNames[0]], { header: 1 }); studyMode === 'quiz' ? startQuizMode(j) : startFlashcardMode(j); }; r.readAsArrayBuffer(f);
});

function startQuizMode(d) {
    const sQ = document.getElementById('shuffle-questions').checked; const sO = document.getElementById('shuffle-options').checked; const tL = parseInt(document.getElementById('time-limit').value); quizData = [];
    for (let i = 1; i < d.length; i++) { const r = d[i]; if (!r[0]) continue; const oC = (parseInt(r[5]) || 1) - 1; let o = []; [r[1], r[2], r[3], r[4]].forEach((t, x) => { if (t) o.push({ t: t, i: x === oC }); }); if (sO) shuffleArray(o); quizData.push({ q: r[0], opts: o.map(x => x.t), correct: o.findIndex(x => x.i), expl: r[6] || "" }); }
    if (sQ) shuffleArray(quizData); isSubmitted = false; flaggedQuestions.clear(); timeElapsed = 0; switchScreen('quiz-app');
    document.getElementById('quiz-title').innerText = currentFileName; document.getElementById('score-board').style.display = 'none'; document.getElementById('avg-time-board').style.display = 'none'; document.getElementById('btn-submit').innerText = "NỘP BÀI KẾT THÚC"; document.getElementById('btn-submit').setAttribute('onclick', 'gradeQuiz(false)');
    renderQuizUI();
    if (window.timerInterval) clearInterval(window.timerInterval); let lS = (isNaN(tL) || tL <= 0) ? -1 : tL * 60;
    window.timerInterval = setInterval(() => {
        if (isSubmitted) return; timeElapsed++;
        if (lS > 0) { let rm = lS - timeElapsed; document.getElementById('timer-display').innerText = `⏱ ${Math.floor(rm / 60).toString().padStart(2, '0')}:${(rm % 60).toString().padStart(2, '0')}`; if (rm <= 0) gradeQuiz(true); } 
        else document.getElementById('timer-display').innerText = `⏱ ${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`;
    }, 1000);
}

function renderQuizUI() {
    const c = document.getElementById('questions-container'); const n = document.getElementById('nav-grid'); totalQuestions = quizData.length; c.innerHTML = ''; n.innerHTML = ''; const a = ['A', 'B', 'C', 'D', 'E'];
    quizData.forEach((i, x) => {
        let ho = ''; i.opts.forEach((o, y) => { ho += `<label class="option-item" id="opt-${x}-${y}"><input type="radio" name="q${x}" value="${y}" onchange="updateQuizUI(${x})"><div class="radio-custom"></div><span class="option-text" style="flex:1;"><b>${a[y]}.</b> ${parseText(o)}</span></label>`; });
        let he = i.expl ? `<button class="btn-expl-toggle" id="btn-expl-${x}" onclick="document.getElementById('expl-${x}').style.display='block'; this.style.display='none'">💡 Xem giải thích</button><div class="expl-box" id="expl-${x}"><b>💡 Giải thích:</b><br>${parseText(i.expl)}</div>` : '';
        c.innerHTML += `<div class="question-card" id="card-${x}"><div class="q-header"><div class="q-title-text"><span class="q-num">Câu ${x + 1}:</span> ${parseText(i.q)}</div><button class="flag-btn" id="flag-${x}" onclick="toggleQuizFlag(${x})">🚩 Đánh dấu</button></div><div class="options-list">${ho}</div>${he}</div>`;
        n.innerHTML += `<button class="nav-item" id="nav-${x}" onclick="window.scrollTo({top: document.getElementById('card-${x}').offsetTop - 80, behavior:'smooth'})">${x + 1}</button>`;
    }); updateQuizUI(-1); if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
}

function toggleQuizFlag(i) { if (isSubmitted) return; flaggedQuestions.has(i) ? flaggedQuestions.delete(i) : flaggedQuestions.add(i); updateQuizUI(i); }
function updateQuizUI(i) {
    if (isSubmitted) return;
    if (i !== -1) { const n = document.getElementById(`nav-${i}`); n.className = 'nav-item'; if (flaggedQuestions.has(i)) n.classList.add('flagged'); else if (document.querySelector(`input[name="q${i}"]:checked`)) n.classList.add('done'); }
    const a = document.querySelectorAll('input[type="radio"]:checked').length; document.getElementById('progress-bar').style.width = `${(a / totalQuestions) * 100}%`; document.getElementById('progress-text').innerText = `${a} / ${totalQuestions}`;
}

function gradeQuiz(f) {
    if (isSubmitted) return; const a = document.querySelectorAll('input[type="radio"]:checked').length; if (!f && a < totalQuestions && !confirm(`Làm ${a}/${totalQuestions}. Nộp luôn?`)) return;
    isSubmitted = true; clearInterval(window.timerInterval); document.title = originalTitle; document.getElementById('timer-display').innerText = "Đã nộp bài"; let s = 0; playSound('success');
    quizData.forEach((q, i) => {
        document.getElementsByName(`q${i}`).forEach(r => r.disabled = true); const sl = document.querySelector(`input[name="q${i}"]:checked`); const uA = sl ? parseInt(sl.value) : -1;
        const n = document.getElementById(`nav-${i}`); const eb = document.getElementById(`expl-${i}`); const ebn = document.getElementById(`btn-expl-${i}`);
        if (uA === q.correct) { s++; n.className = 'nav-item correct'; if (sl) document.getElementById(`opt-${i}-${uA}`).classList.add('correct-ans'); if (ebn) ebn.style.display = 'block'; } 
        else { n.className = 'nav-item wrong'; if (sl) document.getElementById(`opt-${i}-${uA}`).classList.add('wrong-ans'); document.getElementById(`opt-${i}-${q.correct}`).classList.add('correct-ans'); if (eb) { eb.style.display = 'block'; if (ebn) ebn.style.display = 'none'; } }
    });
    const eg = s * 10; let u = usersData[currentUser]; if (u.level < 100) { u.exp += eg; u.level = Math.min(100, Math.floor(u.exp / 100) + 1); } 
    if (!u.history) u.history = []; let d = new Date(); u.history.push({ date: `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`, mode: 'quiz', file: currentFileName, score: `${s}/${totalQuestions}`, expGained: eg, avgTime: totalQuestions > 0 ? (timeElapsed / totalQuestions).toFixed(1) : 0 }); saveDB();
    document.getElementById('score-board').style.display = 'block'; document.getElementById('score-board').innerText = `Kết quả: ${s}/${totalQuestions} (+${eg} EXP)`; document.getElementById('avg-time-board').style.display = 'block'; document.getElementById('avg-time-board').innerText = `⏱ Thời gian: ${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s`; document.getElementById('btn-submit').innerText = "VỀ DASHBOARD"; document.getElementById('btn-submit').setAttribute('onclick', 'showDashboard()');
    if (f) document.getElementById('time-up-modal').style.display = 'flex'; else window.scrollTo({ top: 0, behavior: 'smooth' });
}

// BỘ TẨY RỬA LỖI FLASHCARD HTML CŨ
function startFlashcardMode(d) {
    const sF = document.getElementById('fc-shuffle').checked; fcDeckOriginal = [];
    for (let i = 1; i < d.length; i++) {
        const r = d[i]; if (!r[0]) continue; let f = r[0]; let b = ""; let e = ""; let ansIdx = parseInt(r[5]);
        if (!isNaN(ansIdx) && ansIdx >= 1 && ansIdx <= 4) { b = r[ansIdx] || ""; } else { b = r[1] || ""; }
        b = b.toString().replace(/<br><br><span.*?>💡 Giải thích:.*?<\/span>/g, '');
        b = b.toString().replace(/&lt;br&gt;&lt;br&gt;&lt;span.*?>💡 Giải thích:.*?&lt;\/span&gt;/g, '');
        if (r[6]) e = r[6]; fcDeckOriginal.push({ id: i, front: f, back: b, expl: e });
    }
    if (fcDeckOriginal.length === 0) return alert("Không có thẻ!"); if (sF) shuffleArray(fcDeckOriginal);
    fcCurrentDeck = [...fcDeckOriginal]; fcNextRoundDeck = []; fcCurrentIndex = 0; fcRound = 1; fcStats = { firstTry: 0, struggled: new Set(), totalMastered: 0 }; timeElapsed = 0;
    switchScreen('flashcard-app'); document.getElementById('progress-bar').style.width = '0%'; document.getElementById('progress-text').innerText = `Thuộc: 0 / ${fcDeckOriginal.length}`;
    if (window.timerInterval) clearInterval(window.timerInterval); window.timerInterval = setInterval(() => { timeElapsed++; document.getElementById('timer-display').innerText = `⏱ ${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`; }, 1000); renderFcCard();
}

function renderFcCard() {
    if (fcCurrentIndex >= fcCurrentDeck.length) { if (fcNextRoundDeck.length > 0) { fcCurrentDeck = [...fcNextRoundDeck]; shuffleArray(fcCurrentDeck); fcNextRoundDeck = []; fcCurrentIndex = 0; fcRound++; } else return finishFlashcardMode(); }
    let c = fcCurrentDeck[fcCurrentIndex]; document.getElementById('fc-card').classList.remove('flipped');
    setTimeout(() => { 
        document.getElementById('fc-front-text').innerHTML = parseText(c.front); 
        let backHtml = `<div style="font-size: 1.8rem; font-weight: 800; margin-bottom: 10px;">${parseText(c.back)}</div>`;
        if(c.expl) { backHtml += `<div class="fc-expl-box"><b style="color: var(--primary);">💡 Giải thích:</b><br>${parseText(c.expl)}</div>`; }
        document.getElementById('fc-back-text').innerHTML = backHtml; document.getElementById('fc-round-text').innerText = `Vòng ${fcRound} (Đang học ${fcCurrentIndex + 1} / ${fcCurrentDeck.length})`; 
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
    }, 150);
}

function flipCard() { document.getElementById('fc-card').classList.toggle('flipped'); }
function markFlashcard(isM) { 
    if(isM) playSound('success'); 
    let c = fcCurrentDeck[fcCurrentIndex]; if (isM) { fcStats.totalMastered++; if (!fcStats.struggled.has(c.id)) fcStats.firstTry++; } else { fcStats.struggled.add(c.id); fcNextRoundDeck.push(c); } 
    document.getElementById('progress-bar').style.width = `${(fcStats.totalMastered / fcDeckOriginal.length) * 100}%`; document.getElementById('progress-text').innerText = `Thuộc: ${fcStats.totalMastered} / ${fcDeckOriginal.length}`; fcCurrentIndex++; renderFcCard(); 
}
function finishFlashcardMode() { playSound('success'); clearInterval(window.timerInterval); const eg = fcDeckOriginal.length * 10; let u = usersData[currentUser]; if (u.level < 100) { u.exp += eg; u.level = Math.min(100, Math.floor(u.exp / 100) + 1); } if (!u.history) u.history = []; let d = new Date(); u.history.push({ date: `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`, mode: 'flashcard', file: currentFileName, score: `${fcStats.firstTry} Nhớ ngay`, expGained: eg, avgTime: '-' }); saveDB(); document.getElementById('fc-total-mastered').innerText = fcStats.totalMastered; document.getElementById('fc-first-try').innerText = fcStats.firstTry; document.getElementById('fc-exp-gained').innerText = eg; document.getElementById('fc-result-modal').style.display = 'flex'; }
function closeFcModal() { document.getElementById('fc-result-modal').style.display = 'none'; showDashboard(); }

// -----------------------------------------------------
// AI & API QUẢN LÝ (VỚI COOLDOWN CHỐNG SPAM)
// -----------------------------------------------------
function ensureApiKey() {
    const k = document.getElementById('ai-api-key').value.trim();
    if (!k) { playSound('error'); alert("⚠️ Bạn chưa cài đặt API Key Gemini!\nHệ thống sẽ tự động mở trang lấy Key. Vui lòng copy Key và dán vào mục [Tùy chỉnh] hoặc khung soạn thảo."); window.open("https://aistudio.google.com/app/apikey?hl=vi", "_blank"); openSettings(); return false; }
    return k;
}

function handleAIError(e, loadingElementId, buttonElementId) {
    console.error(e); playSound('error');
    if (loadingElementId) document.getElementById(loadingElementId).style.display = 'none';
    if (buttonElementId) {
        const btn = document.getElementById(buttonElementId); btn.disabled = false;
        if(btn.dataset.originalText) btn.innerText = btn.dataset.originalText;
    }
    if (e.message && (e.message.toLowerCase().includes('not found') || e.message.toLowerCase().includes('deprecated'))) { 
        alert("⚠️ Model AI này hiện tại đã bị Google xóa hoặc ngừng hỗ trợ.\nVui lòng vào phần [Tùy chỉnh] để chọn Model khác (Khuyên dùng: Gemini 2.5 Flash)."); 
    } 
    else { alert(`❌ Lỗi phát sinh: ${e.message}\n(Gợi ý: Thử lại 1 lần nữa hoặc kiểm tra mạng)`); }
}

async function saveAndTestApiKey() {
    const k = document.getElementById('ai-api-key').value.trim(); const m = document.getElementById('ai-model').value; 
    if (!k) return alert("Vui lòng nhập API Key!"); 
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] }) });
        if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error ? errData.error.message : "Key Gemini sai hoặc lỗi mạng."); }
        localStorage.setItem('ai_api_key', k); localStorage.setItem('ai_model', m); playSound('success'); alert("✅ KẾT NỐI THÀNH CÔNG! Đã lưu Key.");
    } catch (e) { handleAIError(e, null, null); }
}

function processAIAttachment(e, loadingId, statusId, contextId, targetType) {
    const f = e.target.files[0]; if (!f) return; const ext = f.name.split('.').pop().toLowerCase(); 
    const ld = document.getElementById(loadingId); const statusBox = document.getElementById(statusId);
    ld.style.display = 'block'; ld.innerText = "🔄 Đang trích xuất dữ liệu từ file...";
    
    if (['png', 'jpg', 'jpeg', 'pdf'].includes(ext)) {
        const r = new FileReader();
        r.onload = ev => { 
            const base64 = ev.target.result.split(',')[1]; 
            const fileObj = { inlineData: { data: base64, mimeType: f.type } };
            if(targetType === 'ai') aiAttachedFile = fileObj;
            else if(targetType === 'sum') summarizerAttachedFile = fileObj;
            else if(targetType === 'essay') essayAttachedFile = fileObj;
            statusBox.innerText = `📎 Đã đính kèm: ${f.name} (Sẵn sàng quét AI OCR)`; 
            statusBox.style.display = 'block'; 
            document.getElementById(contextId).placeholder = "Đã nạp file đính kèm. Bạn có thể gõ thêm chỉ dẫn hoặc để trống..."; 
            ld.style.display = 'none'; 
        }; 
        r.readAsDataURL(f);
    } else if (ext === 'txt') { const r = new FileReader(); r.onload = ev => { document.getElementById(contextId).value = ev.target.result; ld.style.display = 'none'; }; r.readAsText(f); } 
    else if (ext === 'docx') { const r = new FileReader(); r.onload = ev => { mammoth.extractRawText({ arrayBuffer: ev.target.result }).then(res => { document.getElementById(contextId).value = res.value; ld.style.display = 'none'; }).catch(err => { alert("Lỗi: " + err.message); ld.style.display = 'none'; }); }; r.readAsArrayBuffer(f); } 
    else { alert("Chỉ hỗ trợ .txt, .docx, .pdf hoặc file ảnh"); ld.style.display = 'none'; } e.target.value = "";
}

function startCooldown(btnId, seconds, originalText) {
    const btn = document.getElementById(btnId); if (!btn) return;
    btn.dataset.originalText = originalText; btn.disabled = true; let timeLeft = seconds; btn.innerText = `⏳ Chờ ${timeLeft}s...`;
    const timer = setInterval(() => { timeLeft--; if (timeLeft <= 0) { clearInterval(timer); btn.disabled = false; btn.innerText = originalText; } else { btn.innerText = `⏳ Chờ ${timeLeft}s...`; } }, 1000);
}

// -----------------------------------------------------
// BỘ PARSER VĂN BẢN TỪ AI (KHÔI PHỤC)
// -----------------------------------------------------
function parseCustomTextFormat(text) {
    const results = []; const blocks = text.split('===');
    for (let block of blocks) {
        block = block.trim(); if (!block) continue;
        const getTagContent = (currentTag, nextTag) => {
            const start = block.indexOf(`[${currentTag}]`); if (start === -1) return "";
            const startPos = start + `[${currentTag}]`.length;
            if (!nextTag) return block.substring(startPos).trim();
            const end = block.indexOf(`[${nextTag}]`, startPos);
            if (end === -1) return block.substring(startPos).trim();
            return block.substring(startPos, end).trim();
        };
        const q = getTagContent('Q', 'O1');
        if (q) {
            results.push({
                q: q, o1: getTagContent('O1', 'O2'), o2: getTagContent('O2', 'O3'),
                o3: getTagContent('O3', 'O4'), o4: getTagContent('O4', 'A'),
                a: parseInt(getTagContent('A', 'E')) || 1, e: getTagContent('E', null)
            });
        }
    }
    return results;
}

// -----------------------------------------------------
// CREATOR TOOL (SOẠN ĐỀ)
// -----------------------------------------------------
function showCreatorScreen() { switchScreen('creator-screen'); if (creatorQuestionsCount === 0) { addCreatorQuestion(); } }
function updateQuestionNumbers() { document.querySelectorAll('.creator-card').forEach((c, i) => { const t = c.querySelector('.q-number-text'); if (t) t.innerText = `📌 Câu hỏi ${i + 1}`; }); }
function deleteCreatorQuestion(id) { const c = document.getElementById(`cr-card-${id}`); if (c) { c.remove(); updateQuestionNumbers(); } }
function clearAllCreatorQuestions() { if(creatorQuestionsCount === 0) return alert("Danh sách đang trống!"); if(confirm("Bạn có chắc chắn muốn xóa sạch toàn bộ câu hỏi đang soạn không?")) { document.getElementById('creator-questions-container').innerHTML = ''; creatorQuestionsCount = 0; } }

function setCreatorMode(m) {
    currentCreatorMode = m; document.getElementById('btn-cr-quiz').className = m === 'quiz' ? 'mode-btn active' : 'mode-btn'; document.getElementById('btn-cr-fc').className = m === 'flashcard' ? 'mode-btn active' : 'mode-btn';
    const container = document.getElementById('creator-questions-container'); if(m === 'flashcard') { container.classList.add('fc-mode-active'); } else { container.classList.remove('fc-mode-active'); }
}

function handleAIFileUpload(e) { processAIAttachment(e, 'ai-loading', 'ai-file-status', 'ai-context', 'ai'); }

function addCreatorQuestionWithReturn(isAI = false) {
    creatorQuestionsCount++; const id = Date.now().toString() + Math.floor(Math.random() * 1000); const c = document.createElement('div'); c.className = 'creator-card'; c.id = `cr-card-${id}`;
    const badgeHtml = isAI ? `<span style="font-size:0.75rem; background:rgba(139,92,246,0.15); color:var(--primary); padding:4px 10px; border-radius:12px; margin-left:10px; border: 1px solid var(--primary); vertical-align: middle;">✨ AI Khởi tạo</span>` : `<span style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:#10b981; padding:4px 10px; border-radius:12px; margin-left:10px; border: 1px solid #10b981; vertical-align: middle;">✍️ Soạn thủ công</span>`;
    c.innerHTML = `
        <div class="cr-header"><div class="cr-title"><span class="q-number-text">📌 Câu hỏi ${creatorQuestionsCount}</span> ${badgeHtml}</div><button class="btn-danger" style="width: auto; padding: 8px 16px; font-size: 0.85rem;" onclick="deleteCreatorQuestion('${id}')">🗑️ Xóa</button></div>
        <div class="cr-field"><div class="cr-field-header"><label class="lbl-q">Câu hỏi / Nội dung (Dùng $ để gõ Toán)</label><button class="btn-sm-upload" onclick="document.getElementById('file-q-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-q-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-q-${id}')"></div><textarea class="cr-textarea" id="cr-q-${id}" rows="2"></textarea></div>
        <div class="cr-grid">
            <div class="cr-field"><div class="cr-field-header"><label class="lbl-opt1">A. Đáp án 1</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt1-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-opt1-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt1-${id}')"></div><textarea class="cr-textarea" id="cr-opt1-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label>B. Đáp án 2</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt2-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-opt2-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt2-${id}')"></div><textarea class="cr-textarea" id="cr-opt2-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label>C. Đáp án 3</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt3-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-opt3-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt3-${id}')"></div><textarea class="cr-textarea" id="cr-opt3-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label>D. Đáp án 4</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt4-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-opt4-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt4-${id}')"></div><textarea class="cr-textarea" id="cr-opt4-${id}" rows="1"></textarea></div>
        </div>
        <div class="cr-bottom-row"><div class="cr-correct-box fc-hide"><label>✅ Đáp án đúng</label><select id="cr-ans-${id}" class="cr-select"><option value="1">1 (A)</option><option value="2">2 (B)</option><option value="3">3 (C)</option><option value="4">4 (D)</option></select></div><div class="cr-field" style="flex: 1; margin: 0;"><div class="cr-field-header"><label>💡 Giải thích chi tiết</label><button class="btn-sm-upload" onclick="document.getElementById('file-expl-${id}').click()">🖼️ Tải ảnh</button><input type="file" id="file-expl-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-expl-${id}')"></div><textarea class="cr-textarea" id="cr-expl-${id}" rows="2"></textarea></div></div>`;
    document.getElementById('creator-questions-container').appendChild(c); updateQuestionNumbers(); c.querySelectorAll('textarea').forEach(t => t.addEventListener('paste', handleImagePaste)); return id;
}
function addCreatorQuestion() { addCreatorQuestionWithReturn(false); }

function processAndInsertImage(f, tId, tgt = null) {
    const r = new FileReader();
    r.onload = function(ev) { const i = new Image(); i.src = ev.target.result; i.onload = function() { const c = document.createElement('canvas'); const MAX_W = 400; let w = i.width; let h = i.height; if (w > MAX_W) { h = Math.round((h * MAX_W) / w); w = MAX_W; } c.width = w; c.height = h; const ctx = c.getContext('2d'); ctx.drawImage(i, 0, 0, w, h); const b64 = c.toDataURL('image/jpeg', 0.7); const tag = `[img]${b64}[/img]`; const t = tgt || document.getElementById(tId); const sP = t.selectionStart; const eP = t.selectionEnd; t.value = t.value.substring(0, sP) + tag + t.value.substring(eP, t.value.length); } }; r.readAsDataURL(f);
}
function handleFileUpload(e, id) { const f = e.target.files[0]; if (!f) return; processAndInsertImage(f, id); e.target.value = ""; }
function handleImagePaste(e) { const i = (e.clipboardData || e.originalEvent.clipboardData).items; for (let x in i) { const item = i[x]; if (item.kind === 'file') { processAndInsertImage(item.getAsFile(), null, e.target); e.preventDefault(); } } }

function exportCreatorToExcel() {
    const cs = document.querySelectorAll('.creator-card'); if (cs.length === 0) return alert("Trống!");
    let w_d = [["Câu hỏi", "Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4", "Đáp án đúng", "Giải thích"]];
    cs.forEach(c => { const id = c.id.replace('cr-card-', ''); const q = document.getElementById(`cr-q-${id}`).value.trim(); const o1 = document.getElementById(`cr-opt1-${id}`).value.trim(); const o2 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt2-${id}`).value.trim(); const o3 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt3-${id}`).value.trim(); const o4 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt4-${id}`).value.trim(); const a = currentCreatorMode === 'flashcard' ? "1" : document.getElementById(`cr-ans-${id}`).value; const e = document.getElementById(`cr-expl-${id}`).value.trim(); if (q) w_d.push([q, o1, o2, o3, o4, a, e]); });
    if (w_d.length === 1) return alert("Vui lòng điền nội dung!");
    const ws = XLSX.utils.aoa_to_sheet(w_d); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "NganHangCauHoi"); XLSX.writeFile(wb, `BoDe_LMS_${new Date().getTime()}.xlsx`);
}

async function generateWithAI() {
    const k = ensureApiKey(); if (!k) return;
    const m = document.getElementById('ai-model').value; const t = document.getElementById('ai-context').value.trim(); const md = document.getElementById('ai-mode').value; const customInstruction = document.getElementById('ai-custom-prompt').value.trim(); const btn = document.getElementById('btn-ai-generate'); const ld = document.getElementById('ai-loading');
    if (!t && !aiAttachedFile) return alert("Vui lòng dán văn bản, hoặc đính kèm một file Ảnh/PDF!");
    document.getElementById('creator-questions-container').innerHTML = ''; creatorQuestionsCount = 0; setCreatorMode(md);

    const sys = `Bạn là chuyên gia tạo đề trắc nghiệm và thẻ nhớ. Phân tích văn bản (hoặc hình ảnh đính kèm) và tạo bộ câu hỏi.
TUYỆT ĐỐI KHÔNG SỬ DỤNG JSON. Trả về kết quả bằng văn bản thuần túy theo ĐÚNG CẤU TRÚC 1-SHOT DƯỚI ĐÂY.
Mỗi câu hỏi ngăn cách nhau bằng đúng 3 dấu bằng: ===

[CẤU TRÚC MẪU BẮT BUỘC]
[Q] Quốc gia nào có diện tích lớn nhất thế giới?
[O1] Mỹ
[O2] Nga
[O3] Trung Quốc
[O4] Việt Nam
[A] 2
[E] Liên bang Nga là quốc gia lớn nhất thế giới về diện tích.
===
[Q] Câu hỏi số 2...

LƯU Ý QUAN TRỌNG: 
- Nếu người dùng yêu cầu Flashcard: Bỏ trống hoàn toàn [O2], [O3], [O4]. Ghi đáp án (mặt sau thẻ) thẳng vào [O1], và [A] luôn luôn là 1.
- Công thức toán học BẮT BUỘC bọc trong cặp dấu $ (VD: $\\int x^2 dx$).`;

    let usr = `CHẾ ĐỘ YÊU CẦU: ${md.toUpperCase()}`; if (t) usr += `\nNỘI DUNG CẦN PHÂN TÍCH:\n${t}`; if (customInstruction) usr += `\n\n--- YÊU CẦU ĐẶC BIỆT TỪ NGƯỜI DÙNG ---\n${customInstruction}`;
    const promptParts = [{ text: usr }]; if (aiAttachedFile) promptParts.push(aiAttachedFile);

    btn.disabled = true; ld.style.display = 'block';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ parts: promptParts }], generationConfig: { temperature: 0.3 } }) });
        if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); }
        const data = await res.json(); const txt = data.candidates[0].content.parts[0].text;
        const arr = parseCustomTextFormat(txt);
        if(arr.length === 0) throw new Error("AI trả về kết quả rỗng hoặc vi phạm cấu trúc.");

        arr.forEach(i => {
            const id = addCreatorQuestionWithReturn(true);
            document.getElementById(`cr-q-${id}`).value = i.q || ""; document.getElementById(`cr-opt1-${id}`).value = i.o1 || ""; document.getElementById(`cr-opt2-${id}`).value = i.o2 || ""; document.getElementById(`cr-opt3-${id}`).value = i.o3 || ""; document.getElementById(`cr-opt4-${id}`).value = i.o4 || ""; document.getElementById(`cr-ans-${id}`).value = i.a || 1; document.getElementById(`cr-expl-${id}`).value = i.e || "";
        });
        playSound('success'); alert(`Tạo thành công ${arr.length} câu hỏi mới!`); 
        document.getElementById('ai-context').value = ""; document.getElementById('ai-context').placeholder = "AI sẽ đọc nội dung ở đây..."; document.getElementById('ai-custom-prompt').value = ""; aiAttachedFile = null; document.getElementById('ai-file-status').style.display = 'none';

    } catch (e) { handleAIError(e, 'ai-loading', 'btn-ai-generate'); } 
    finally { document.getElementById('ai-loading').style.display = 'none'; startCooldown('btn-ai-generate', 10, '🚀 BẮT ĐẦU TẠO BẰNG AI'); }
}

function handleSumFileUpload(e) { processAIAttachment(e, 'sum-loading', 'sum-file-status', 'sum-context', 'sum'); }
async function generateSummary() {
    const k = ensureApiKey(); if (!k) return;
    const m = document.getElementById('ai-model').value; const t = document.getElementById('sum-context').value.trim(); const customPrompt = document.getElementById('sum-custom-prompt').value.trim(); const btn = document.getElementById('btn-sum-generate'); const ld = document.getElementById('sum-loading'); const resultBox = document.getElementById('sum-result-box'); const resultContent = document.getElementById('sum-result-content');
    if (!t && !summarizerAttachedFile) return alert("Vui lòng dán văn bản hoặc nạp tài liệu để AI tóm tắt!");

    const sys = `Bạn là một Giáo sư Học thuật chuyên nghiệp. Nhiệm vụ của bạn là đọc hiểu và tóm tắt tài liệu một cách súc tích, dễ hiểu, nhắm đúng trọng tâm để học sinh ôn thi.
- Dùng thẻ Markdown (**chữ đậm**) để nhấn mạnh các từ khóa.
- Trình bày rõ ràng bằng các gạch đầu dòng (bullet points).
- Công thức toán học BẮT BUỘC bọc trong cặp dấu $ (VD: $\\int x^2 dx$).`;

    let usr = "HÃY TÓM TẮT TÀI LIỆU SAU ĐÂY:\n"; if(t) usr += t; if(customPrompt) usr += `\n\n--- LƯU Ý ĐẶC BIỆT ---\n${customPrompt}`;
    const promptParts = [{ text: usr }]; if (summarizerAttachedFile) promptParts.push(summarizerAttachedFile);

    btn.disabled = true; ld.style.display = 'block'; resultBox.style.display = 'none';

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ parts: promptParts }], generationConfig: { temperature: 0.2 } }) });
        if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); }
        const data = await res.json(); 
        playSound('success'); resultContent.innerHTML = parseText(data.candidates[0].content.parts[0].text); resultBox.style.display = 'block';
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
    } catch (e) { handleAIError(e, 'sum-loading', 'btn-sum-generate'); } 
    finally { document.getElementById('sum-loading').style.display = 'none'; startCooldown('btn-sum-generate', 10, '🚀 BẮT ĐẦU TÓM TẮT MỌI THỨ'); }
}

function handleEssayFileUpload(e) { processAIAttachment(e, 'essay-loading-1', 'essay-file-status', 'essay-context', 'essay'); }
async function generateEssayQuestions() {
    const k = ensureApiKey(); if (!k) return;
    const m = document.getElementById('ai-model').value; const t = document.getElementById('essay-context').value.trim(); const diff = document.getElementById('essay-difficulty').value; const btn = document.getElementById('btn-essay-generate'); const ld = document.getElementById('essay-loading-1');
    if (!t && !essayAttachedFile) return alert("Vui lòng dán văn bản hoặc nạp tài liệu để AI tạo câu hỏi!");

    const sys = `Đóng vai Giáo viên ra đề thi Tự luận (Short Answer/Essay). Dựa trên tài liệu được cung cấp, hãy tạo ra 1 đến 3 câu hỏi tự luận theo yêu cầu độ khó của người dùng.
- Trả về câu hỏi trực tiếp, KHÔNG kèm theo đáp án.
- Câu hỏi phải rõ ràng, kích thích tư duy người học.
- Nếu có công thức toán, bọc trong cặp dấu $...$`;

    let usr = `MỨC ĐỘ YÊU CẦU: ${diff.toUpperCase()}\nTÀI LIỆU:\n`; if(t) usr += t;
    const promptParts = [{ text: usr }]; if (essayAttachedFile) promptParts.push(essayAttachedFile);

    btn.disabled = true; ld.style.display = 'block';

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ parts: promptParts }], generationConfig: { temperature: 0.5 } }) });
        if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); }
        const data = await res.json(); currentEssayGeneratedQuestions = data.candidates[0].content.parts[0].text;
        playSound('success'); document.getElementById('essay-step-1').style.display = 'none'; document.getElementById('essay-step-2').style.display = 'block'; document.getElementById('essay-question-display').innerHTML = parseText(currentEssayGeneratedQuestions); document.getElementById('essay-user-answer').value = "";
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
    } catch (e) { handleAIError(e, 'essay-loading-1', 'btn-essay-generate'); } 
    finally { document.getElementById('essay-loading-1').style.display = 'none'; startCooldown('btn-essay-generate', 5, '🚀 TẠO CÂU HỎI TỰ LUẬN'); }
}

async function gradeEssay() {
    const k = ensureApiKey(); if (!k) return;
    const m = document.getElementById('ai-model').value; const t = document.getElementById('essay-context').value.trim(); const userAnswer = document.getElementById('essay-user-answer').value.trim(); const btn = document.getElementById('btn-essay-grade'); const ld = document.getElementById('essay-loading-2');
    if (!userAnswer) return alert("Bạn chưa nhập câu trả lời nào cả!");

    const sys = `Đóng vai Giáo viên chấm thi Tự luận chuyên nghiệp, khắt khe nhưng tận tâm.
Nhiệm vụ: Dựa vào TÀI LIỆU GỐC, CÂU HỎI ĐÃ RA và CÂU TRẢ LỜI CỦA HỌC SINH. Hãy đánh giá bài làm theo cấu trúc:
1. ĐIỂM SỐ: Chấm theo thang điểm 10 (Ví dụ: 8/10).
2. NHẬN XÉT: Nêu rõ ưu điểm, khuyết điểm hoặc những ý học sinh trả lời sai/thiếu.
3. ĐÁP ÁN CHUẨN: Đưa ra câu trả lời mẫu hoàn hảo và xúc tích nhất.
Dùng thẻ Markdown (**chữ đậm**) để làm nổi bật. Công thức toán bọc trong $...$`;

    let usr = `--- CÂU HỎI TỪ GIÁO VIÊN ---\n${currentEssayGeneratedQuestions}\n\n--- CÂU TRẢ LỜI CỦA HỌC SINH ---\n${userAnswer}`; if (t) usr = `--- TÀI LIỆU GỐC ---\n${t}\n\n` + usr;
    const promptParts = [{ text: usr }]; if (essayAttachedFile) promptParts.push(essayAttachedFile);

    btn.disabled = true; ld.style.display = 'block';

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ parts: promptParts }], generationConfig: { temperature: 0.3 } }) });
        if (!res.ok) { const errData = await res.json().catch(()=>({})); throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); }
        const data = await res.json(); 
        playSound('success'); document.getElementById('essay-step-2').style.display = 'none'; document.getElementById('essay-step-3').style.display = 'block'; document.getElementById('essay-grading-result').innerHTML = parseText(data.candidates[0].content.parts[0].text);
        let u = usersData[currentUser]; if (u.level < 100) { u.exp += 15; u.level = Math.min(100, Math.floor(u.exp / 100) + 1); saveDB(); }
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
    } catch (e) { handleAIError(e, 'essay-loading-2', 'btn-essay-grade'); } 
    finally { document.getElementById('essay-loading-2').style.display = 'none'; startCooldown('btn-essay-grade', 10, 'NỘP BÀI CHẤM ĐIỂM'); }
}

function resetEssay() {
    document.getElementById('essay-step-3').style.display = 'none'; document.getElementById('essay-step-2').style.display = 'none'; document.getElementById('essay-step-1').style.display = 'block';
    essayAttachedFile = null; document.getElementById('essay-file-status').style.display = 'none'; document.getElementById('essay-context').value = ""; document.getElementById('essay-context').placeholder = "Dán tài liệu học tập vào đây...";
}

initLogin();