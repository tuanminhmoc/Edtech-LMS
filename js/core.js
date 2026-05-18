// ==========================================
// 1. CẤU HÌNH HỆ THỐNG & ÂM THANH
// ==========================================
let isMuted = localStorage.getItem('edtech_muted') === 'true';
const SECURE_KEY = 'EdTech_SecureDB';
const SECRET_SALT = 'EdTech_LMS_2026_TopSecret_@!#';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (isMuted) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(250, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

function toggleMute() {
    isMuted = document.getElementById('mute-toggle').checked;
    localStorage.setItem('edtech_muted', isMuted);
}

// Bắt sự kiện Click nút để phát âm thanh
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('.btn-main, .btn-outline, .btn-danger, .theme-btn, .nav-item, .option-item, .cr-correct-box, .action-card, .lang-switch, .btn-sm-upload, .dict-audio-btn, .tutor-btn, .mini-icon-btn, .clear-cache-btn, .avatar')) {
        playSound('click');
    }
});

// Chống click chuột phải và phím tắt F12
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => { 
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
        e.preventDefault(); 
    }
    // XỬ LÝ PHÍM ESC MƯỢT MÀ
    if (e.key === 'Escape') {
        handleEscKey();
    }
});

// ==========================================
// 2. TỪ ĐIỂN ĐA NGÔN NGỮ (i18n)
// ==========================================
const i18nDict = {
    vi: {
        "mk_title": "Hệ Thống Phân Quyền", "mk_desc": "Vui lòng nhập mã bảo mật để tiếp tục", "mk_btn": "Xác nhận", "mk_ph": "Nhập khóa...",
        "ul_title": "Mừng trở lại!", "ul_acc": "Tài khoản:", "btn_cancel": "Hủy", "btn_login": "Vào học", "ul_ph": "Nhập mật khẩu...",
        "login_sub": "Nền tảng Tự học & Đánh giá", "login_new": "Đăng ký mới", "btn_register": "Tạo tài khoản", "rg_user": "Tên đăng nhập", "rg_pass": "Mật khẩu",
        "login_exist": "Tài khoản hiện có", "btn_reset": "Khôi phục cài đặt gốc",
        "db_days": "ngày", "db_progress": "Tiến độ Level", "btn_start_prac": "Bắt đầu Luyện tập",
        "menu_create": "Soạn đề", "menu_sum": "Tóm tắt", "menu_essay": "Tự luận", "menu_set": "Cài đặt", "menu_guide": "Hướng dẫn", "menu_out": "Đăng xuất khỏi hệ thống", "menu_dict": "Từ điển",
        "hist_title": "Lịch sử hoạt động", "th_time": "Thời gian", "th_type": "Loại", "th_doc": "Tài liệu", "th_score": "Điểm",
        "sum_title": "Tóm Tắt Thông Minh", "sum_desc": "Rút gọn kiến thức trọng tâm bằng AI.", "btn_attach": "Đính kèm file", "btn_sum_do": "Phân tích & Tóm tắt", "res_title": "Kết quả", "ai_ph_doc": "Dán nội dung vào đây...", "ai_ph_opt": "Yêu cầu thêm...",
        "es_title": "Luyện Tự Luận", "es_desc": "AI mô phỏng giáo viên chấm điểm.", "es_step1": "Bước 1: Nguồn tài liệu", "es_create": "Tạo đề", "es_step2": "Đề bài:", "es_submit": "Nộp bài", "es_step3": "Đánh giá từ AI", "es_redo": "Làm bài khác", "lv_basic": "Cơ bản", "lv_adv": "Nâng cao", "lv_mix": "Hỗn hợp", "es_ph_ans": "Nhập câu trả lời...",
        "cr_title": "Công Cụ Soạn Đề", "cr_desc": "Hỗ trợ LaTeX và AI bóc tách.", "btn_save": "Lưu Excel", "quiz": "Trắc nghiệm", "cr_ai": "Tạo tự động bằng AI", "btn_analyze": "Phân tích", "cr_list": "Danh sách câu hỏi", "btn_del_all": "Xóa hết", "btn_add_card": "+ Thêm thẻ trống", "quiz_opt": "Trắc nghiệm (4 Đáp án)",
        "up_title": "Cấu Hình Làm Bài", "up_sq": "Trộn câu hỏi", "up_so": "Trộn đáp án", "up_time": "Thời gian (phút)", "up_sf": "Xáo trộn thẻ", "btn_load": "Nạp file Excel để Bắt đầu",
        "btn_finish": "NỘP BÀI KẾT THÚC", "nav_title": "Mục lục", "nav_title_cr": "Mục lục Câu hỏi",
        "fc_title": "Bộ thẻ ghi nhớ", "fc_fail": "Chưa thuộc", "fc_pass": "Đã thuộc",
        "set_title": "Tùy chỉnh Hệ thống", "btn_close": "Đóng", "set_key": "Lấy Key miễn phí →", "set_theme": "GIAO DIỆN & MÀU SẮC", "set_text": "Chữ:", "set_bg": "HÌNH NỀN & HIỆU ỨNG (GLASS)", "btn_apply": "Lưu", "btn_del": "Xóa", "set_glass": "Bật nền kính", "set_blur1": "Mờ nền", "set_blur2": "Mờ kính", "set_ph_key": "Nhập API Key...", "set_ph_bg": "Link ảnh URL...", "btn_del_acc": "Xóa tài khoản hiện tại", "set_mute": "Tắt âm thanh (Mute)",
        "guide_title": "Hướng dẫn nhanh", "g1": "<b>Làm bài:</b> Chọn mục [Luyện tập ngay], chọn chế độ và nạp file Excel (.xlsx).", "g2": "<b>Soạn đề:</b> Dùng công cụ [Soạn đề]. Hỗ trợ bọc công thức toán trong thẻ $.", "g3": "<b>Dùng AI:</b> Cần lấy API Key miễn phí từ Google Studio nhập vào mục Cài đặt.",
        "cg_title": "Mẹo soạn thảo", "cg1": "Chụp ảnh màn hình và bấm <b>Ctrl + V</b> thẳng vào ô nhập liệu để chèn ảnh.", "cg2": "Khi soạn Flashcard, mặt sau của thẻ chính là nội dung của ô <b>Đáp án A</b>.", "cg3": "Có thể nạp thẳng file PDF đề thi để AI quét.",
        "done": "Hoàn thành!", "btn_back": "Trở về", "timeout": "Hết thời gian!", "timeout_sub": "Hệ thống đã tự động thu bài và chấm điểm.", "btn_view": "Xem kết quả",
        "q_lbl": "Câu", "q_flag": "🚩 Đánh dấu", "q_expl": "💡 Xem giải thích", "fc_round": "Vòng",
        "cr_lbl_q": "Câu hỏi / Nội dung (Dùng $ để gõ Toán)", "cr_lbl_opt": "Đáp án", "cr_lbl_ans": "✅ Đáp án đúng", "cr_lbl_expl": "💡 Giải thích chi tiết", "btn_upload_img": "🖼️ Tải ảnh", "cr_q_num": "📌 Câu hỏi", "ai_tag": "✨ AI Khởi tạo", "manual_tag": "✍️ Soạn thủ công",
        "btn_tutor": "Hỏi Gia sư", "tutor_title": "💬 Gia Sư AI", "tutor_ph": "Hỏi gia sư (VD: Tại sao đáp án B sai?)...", "btn_send": "Gửi",
        "dict_title": "Từ Điển Thông Minh", "dict_desc": "Dịch thuật & Luyện nghe chuẩn giọng bản xứ.", "dict_en_vi": "Anh ➔ Việt", "dict_vi_en": "Việt ➔ Anh", "dict_ph": "Nhập từ hoặc câu cần dịch...", "dict_speed": "Tốc độ", "btn_translate": "Dịch Ngay"
    },
    en: {
        "mk_title": "Security Authorization", "mk_desc": "Please enter Master Key to continue", "mk_btn": "Confirm", "mk_ph": "Enter key...",
        "ul_title": "Welcome back!", "ul_acc": "Account:", "btn_cancel": "Cancel", "btn_login": "Login", "ul_ph": "Enter password...",
        "login_sub": "Self-Learning & Assessment Platform", "login_new": "Register", "btn_register": "Create Account", "rg_user": "Username", "rg_pass": "Password",
        "login_exist": "Existing Accounts", "btn_reset": "Factory Reset",
        "db_days": "days", "db_progress": "Level Progress", "btn_start_prac": "Start Practice",
        "menu_create": "Creator", "menu_sum": "Summarize", "menu_essay": "Essay", "menu_set": "Settings", "menu_guide": "Guide", "menu_out": "Logout Account", "menu_dict": "Dictionary",
        "hist_title": "Activity History", "th_time": "Time", "th_type": "Type", "th_doc": "Document", "th_score": "Score",
        "sum_title": "Smart Summarizer", "sum_desc": "Extract key concepts using AI.", "btn_attach": "Attach File", "btn_sum_do": "Analyze & Summarize", "res_title": "Result", "ai_ph_doc": "Paste content here...", "ai_ph_opt": "Extra prompt...",
        "es_title": "Essay Practice", "es_desc": "AI simulates a teacher's grading.", "es_step1": "Step 1: Source Document", "es_create": "Generate", "es_step2": "Question:", "es_submit": "Submit", "es_step3": "AI Evaluation", "es_redo": "Try Another", "lv_basic": "Basic", "lv_adv": "Advanced", "lv_mix": "Mixed", "es_ph_ans": "Enter your answer...",
        "cr_title": "Creator Tool", "cr_desc": "Supports LaTeX and AI parsing.", "btn_save": "Save Excel", "quiz": "Quiz", "cr_ai": "Auto-generate via AI", "btn_analyze": "Analyze", "cr_list": "Question List", "btn_del_all": "Delete All", "btn_add_card": "+ Add Empty Card", "quiz_opt": "Quiz (4 Options)",
        "up_title": "Practice Config", "up_sq": "Shuffle Questions", "up_so": "Shuffle Options", "up_time": "Time Limit (min)", "up_sf": "Shuffle Cards", "btn_load": "Load Excel File to Start",
        "btn_finish": "SUBMIT & FINISH", "nav_title": "Navigation", "nav_title_cr": "Creator Index",
        "fc_title": "Flashcard Deck", "fc_fail": "Again", "fc_pass": "Got it",
        "set_title": "System Settings", "btn_close": "Close", "set_key": "Get Free Key →", "set_theme": "UI & COLORS", "set_text": "Text:", "set_bg": "BACKGROUND & GLASS EFFECT", "btn_apply": "Save", "btn_del": "Clear", "set_glass": "Enable Glass", "set_blur1": "BG Blur", "set_blur2": "Glass Blur", "set_ph_key": "Enter API Key...", "set_ph_bg": "Image URL...", "btn_del_acc": "Delete Current Account", "set_mute": "Mute Sounds",
        "guide_title": "Quick Guide", "g1": "<b>Practice:</b> Select [Start Practice], choose mode and upload Excel file.", "g2": "<b>Creator:</b> Use [Creator Tool]. Wrap math formulas in $ tags.", "g3": "<b>AI Usage:</b> Get a free API Key from Google Studio and paste in Settings.",
        "cg_title": "Creator Tips", "cg1": "Screenshot and press <b>Ctrl + V</b> to paste images directly.", "cg2": "For Flashcards, the back of the card is the content of <b>Option A</b>.", "cg3": "Upload PDF exams for AI to auto-parse.",
        "done": "Completed!", "btn_back": "Go Back", "timeout": "Time's up!", "timeout_sub": "System has automatically submitted.", "btn_view": "View Result",
        "q_lbl": "Question", "q_flag": "🚩 Flag", "q_expl": "💡 Explanation", "fc_round": "Round",
        "cr_lbl_q": "Question / Content (Use $ for Math)", "cr_lbl_opt": "Option", "cr_lbl_ans": "✅ Correct Answer", "cr_lbl_expl": "💡 Detailed Explanation", "btn_upload_img": "🖼️ Image", "cr_q_num": "📌 Question", "ai_tag": "✨ AI Generated", "manual_tag": "✍️ Manual",
        "btn_tutor": "Ask Tutor", "tutor_title": "💬 AI Tutor", "tutor_ph": "Ask tutor (e.g. Why is B wrong?)...", "btn_send": "Send",
        "dict_title": "Smart Dictionary", "dict_desc": "Translate & Practice listening with native voices.", "dict_en_vi": "English ➔ Vietnamese", "dict_vi_en": "Vietnamese ➔ English", "dict_ph": "Enter word or sentence to translate...", "dict_speed": "Speed", "btn_translate": "Translate"
    }
};

let currentLang = localStorage.getItem('edtech_lang') || 'vi';

function t(key) { 
    return i18nDict[currentLang][key] || key; 
}

function applyTranslations() { 
    try { 
        document.querySelectorAll('[data-i18n]').forEach(el => { 
            const key = el.getAttribute('data-i18n'); 
            if (i18nDict[currentLang][key]) el.innerHTML = i18nDict[currentLang][key]; 
        }); 
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { 
            const key = el.getAttribute('data-i18n-placeholder'); 
            if (i18nDict[currentLang][key]) el.setAttribute('placeholder', i18nDict[currentLang][key]); 
        }); 
        document.getElementById('lang-text').innerText = currentLang === 'vi' ? 'EN' : 'VN'; 
    } catch(e) {} 
}

function toggleLanguage() { 
    document.body.style.opacity = 0; 
    setTimeout(() => { 
        currentLang = currentLang === 'vi' ? 'en' : 'vi'; 
        localStorage.setItem('edtech_lang', currentLang); 
        applyTranslations(); 
        document.body.style.opacity = 1; 
    }, 300); 
}

// ==========================================
// 3. QUẢN LÝ APP STATE & USER DATA
// ==========================================
let usersData = {}; 
let currentUser = null; 
let currentFileName = ""; 
let studyMode = 'quiz'; 
let quizData = []; 
let flaggedQuestions = new Set(); 
let totalQuestions = 0; 
let isSubmitted = false; 
let timerInterval; 
let timeElapsed = 0; 
let fcDeckOriginal = []; 
let fcCurrentDeck = []; 
let fcNextRoundDeck = []; 
let fcCurrentIndex = 0; 
let fcRound = 1; 
let fcStats = { firstTry: 0, struggled: new Set(), totalMastered: 0 }; 
let creatorQuestionsCount = 0; 
const originalTitle = document.title; 
let currentCreatorMode = 'quiz'; 
let tempLoginUser = "";
var aiAttachedFile = null; 
var summarizerAttachedFile = null; 
var essayAttachedFile = null; 
let currentEssayGeneratedQuestions = "";

// LƯU TRỮ VĨNH VIỄN (Bỏ mã hóa để tránh lỗi tàng hình)
try { 
    const savedData = localStorage.getItem(SECURE_KEY); 
    if (savedData) { 
        usersData = JSON.parse(savedData); 
    } else {
        throw new Error("No Data");
    }
} catch (e) { 
    usersData = {}; 
}

function saveDB() { 
    try { 
        localStorage.setItem(SECURE_KEY, JSON.stringify(usersData)); 
    } catch(e) { 
        console.error("Storage Error", e); 
    } 
}

function generateHash(str) { 
    let h = 0; 
    for (let i = 0; i < str.length; i++) { 
        h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; 
    } 
    return h.toString(16); 
}

function parseText(t_) { 
    if (!t_) return ""; 
    t_ = t_.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>'); 
    t_ = t_.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    return t_.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (m, u) => { 
        let c = u.trim().replace(/\s/g, ''); 
        if (c.startsWith('http') || c.startsWith('data:image')) return `<img src="${c}" class="rendered-img">`; 
        return '[Ảnh lỗi]'; 
    }); 
}

function shuffleArray(a) { 
    for (let i = a.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [a[i], a[j]] = [a[j], a[i]]; 
    } 
}

// Khởi chạy App
window.addEventListener('DOMContentLoaded', () => {
    applyTranslations(); 
    initTTSVoices();
    
    if (localStorage.getItem('edtech_unlocked') !== 'true') { 
        document.getElementById('master-key-overlay').style.display = 'flex'; 
        setTimeout(() => document.getElementById('master-key-input').focus(), 100); 
    }
    
    // Nạp API Key
    const k = localStorage.getItem('ai_api_key'); 
    const m = localStorage.getItem('ai_model'); 
    if (k) document.getElementById('ai-api-key').value = k; 
    if (m) document.getElementById('ai-model').value = m;
    
    // Nạp Giao diện Glassmorphism
    const savedBgUrl = localStorage.getItem('quizBgUrl'); 
    if (savedBgUrl) { 
        setBackground(savedBgUrl); 
        const inputBg = document.getElementById('custom-bg-url'); 
        if (inputBg) inputBg.value = savedBgUrl; 
    }
    
    const isGlass = localStorage.getItem('quizGlass') === 'true'; 
    if (isGlass) { 
        document.documentElement.setAttribute('data-glass', 'true'); 
        const glassToggle = document.getElementById('glass-toggle'); 
        if (glassToggle) glassToggle.checked = true; 
    }
    
    const savedGlassBlur = localStorage.getItem('quizGlassBlur') || '20'; 
    document.documentElement.style.setProperty('--glass-blur', savedGlassBlur + 'px'); 
    const sliderGlass = document.getElementById('glass-blur-slider'); 
    if(sliderGlass) sliderGlass.value = savedGlassBlur;
    
    const savedBgBlur = localStorage.getItem('quizBgBlur') || '15'; 
    document.documentElement.style.setProperty('--bg-blur', savedBgBlur + 'px'); 
    const sliderBg = document.getElementById('bg-blur-slider'); 
    if(sliderBg) sliderBg.value = savedBgBlur;
    
    const savedTextColor = localStorage.getItem('quizTextColor'); 
    if(savedTextColor) { 
        document.documentElement.style.setProperty('--text-main', savedTextColor); 
        const tColorPicker = document.getElementById('text-color-picker'); 
        if(tColorPicker) tColorPicker.value = savedTextColor; 
    }
    
    if(isMuted) { 
        const mt = document.getElementById('mute-toggle'); 
        if(mt) mt.checked = true; 
    }
});

function verifyMasterKey() { 
    const val = document.getElementById('master-key-input').value; 
    let s = ""; 
    for(let i=0; i<val.length; i++) {
        s += String.fromCharCode(val.charCodeAt(i) + 5); 
    }
    if (s === "JiYjhmKwjj") { 
        playSound('success'); 
        localStorage.setItem('edtech_unlocked', 'true'); 
        document.getElementById('master-key-overlay').style.display = 'none'; 
    } else { 
        playSound('error'); 
        alert("❌ Lỗi: Sai mã bảo mật!"); 
    } 
}

// ==========================================
// 4. ĐIỀU HƯỚNG (NAVIGATION)
// ==========================================
function switchScreen(id) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active')); 
    const t_ = document.getElementById(id); 
    if (t_) t_.classList.add('active');
    
    const top = document.getElementById('top-bar');
    const btnBack = document.getElementById('btn-back');
    
    if (id === 'quiz-app' || id === 'flashcard-app') { 
        top.style.display = 'flex'; 
        btnBack.style.display = 'flex'; 
    } else if (id === 'upload-screen' || id === 'creator-screen' || id === 'summarizer-screen' || id === 'essay-screen' || id === 'dict-screen') { 
        top.style.display = 'none'; 
        btnBack.style.display = 'flex'; 
    } else { 
        top.style.display = 'none'; 
        btnBack.style.display = 'none'; 
    }
}

function handleEscKey() {
    playSound('click');
    const modals = ['master-key-overlay', 'user-login-modal', 'settings-modal', 'guide-modal', 'creator-guide-modal', 'fc-result-modal', 'time-up-modal', 'tutor-modal', 'crop-modal'];
    let modalClosed = false;
    modals.forEach(id => { 
        const el = document.getElementById(id); 
        if(el && el.style.display === 'flex' && id !== 'master-key-overlay' && id !== 'user-login-modal') { 
            el.style.display = 'none'; 
            modalClosed = true; 
        } 
    });
    
    if(modalClosed) return;
    
    const activeScreen = document.querySelector('.app-screen.active'); 
    if(!activeScreen) return; 
    
    const id = activeScreen.id;
    if(id === 'quiz-app' || id === 'flashcard-app') { 
        showUploadScreen(); 
    } else if(id !== 'dashboard-screen' && id !== 'login-screen') { 
        showDashboard(); 
    }
}

// ==========================================
// 5. CÀI ĐẶT & UI THEME
// ==========================================
function openSettings() { document.getElementById('settings-modal').style.display = 'flex'; } 
function closeSettings() { document.getElementById('settings-modal').style.display = 'none'; }
function openGuide() { document.getElementById('guide-modal').style.display = 'flex'; } 
function closeGuide() { document.getElementById('guide-modal').style.display = 'none'; }
function openCreatorGuide() { document.getElementById('creator-guide-modal').style.display = 'flex'; } 
function closeCreatorGuide() { document.getElementById('creator-guide-modal').style.display = 'none'; }

function applyBackground() { 
    const url = document.getElementById('custom-bg-url').value.trim(); 
    if (!url) return; 
    setBackground(url); 
    localStorage.setItem('quizBgUrl', url); 
}
function clearBackground() { 
    document.getElementById('custom-bg-url').value = ''; 
    const bgDiv = document.getElementById('app-bg'); 
    if(bgDiv) { bgDiv.classList.remove('active'); bgDiv.style.backgroundImage = ''; } 
    document.body.classList.remove('has-bg'); 
    localStorage.removeItem('quizBgUrl'); 
}
function setBackground(url) { 
    const bgDiv = document.getElementById('app-bg'); 
    if(bgDiv) { 
        bgDiv.style.backgroundImage = `url('${url}')`; 
        bgDiv.classList.add('active'); 
        document.body.classList.add('has-bg'); 
    } 
}

function toggleGlassMode() { 
    const toggle = document.getElementById('glass-toggle'); 
    if (toggle && toggle.checked) { 
        document.documentElement.setAttribute('data-glass', 'true'); 
        localStorage.setItem('quizGlass', 'true'); 
    } else { 
        document.documentElement.removeAttribute('data-glass'); 
        localStorage.setItem('quizGlass', 'false'); 
    } 
}
function updateGlassBlur(val) { document.documentElement.style.setProperty('--glass-blur', val + 'px'); localStorage.setItem('quizGlassBlur', val); } 
function updateBgBlur(val) { document.documentElement.style.setProperty('--bg-blur', val + 'px'); localStorage.setItem('quizBgBlur', val); } 
function setTextColor(c) { document.documentElement.style.setProperty('--text-main', c); localStorage.setItem('quizTextColor', c); }
function setTheme(t_) { document.documentElement.setAttribute('data-theme', t_); document.documentElement.style.removeProperty('--primary'); document.documentElement.style.removeProperty('--bg-color'); localStorage.setItem('quizTheme', t_); }
function setCustomTheme(c) { document.documentElement.setAttribute('data-theme', 'custom'); document.documentElement.style.setProperty('--primary', c); document.documentElement.style.setProperty('--bg-color', c + '11'); localStorage.setItem('quizTheme', 'custom'); localStorage.setItem('quizColor', c); }

// ==========================================
// 6. QUẢN LÝ USER TÀI KHOẢN
// ==========================================
function initLogin() {
    const list = document.getElementById('user-list-render'); 
    list.innerHTML = ''; 
    const names = Object.keys(usersData);
    
    if (names.length === 0) {
        list.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem; padding: 15px; text-align:center;">Trống</div>';
    }
    
    names.forEach(n => { 
        const u = usersData[n]; 
        list.innerHTML += `<div class="user-card" onclick="loginUser('${n}')"><span>👤 ${n}</span> <span style="color:var(--primary); font-size:0.8rem;">LVL ${u.level} | 🔥 ${u.streak}</span></div>`; 
    });
    
    const th = localStorage.getItem('quizTheme') || 'light'; 
    const c = localStorage.getItem('quizColor'); 
    if (th === 'custom' && c) setCustomTheme(c); else setTheme(th); 
    
    switchScreen('login-screen');
}

function createNewUser() { 
    const n = document.getElementById('new-username').value.trim(); 
    const p = document.getElementById('new-password').value; 
    
    if (!n) return alert("Vui lòng nhập Tên!"); 
    if (!p) return alert("Vui lòng thiết lập Mật khẩu!"); 
    
    if (usersData[n]) { 
        playSound('error'); return alert("Tài khoản đã tồn tại."); 
    } 
    
    playSound('success'); 
    usersData[n] = { 
        passwordHash: generateHash(p), 
        exp: 0, 
        level: 1, 
        streak: 1, 
        lastLogin: new Date().toDateString(), 
        history: [], 
        avatar: null 
    }; 
    saveDB(); 
    document.getElementById('new-password').value = ""; 
    directLogin(n); 
}

function loginUser(n) { 
    tempLoginUser = n; 
    if (!usersData[n].passwordHash) { 
        directLogin(n); 
        return; 
    } 
    document.getElementById('login-username-display').innerText = n; 
    document.getElementById('login-password-input').value = ""; 
    document.getElementById('user-login-modal').style.display = 'flex'; 
    setTimeout(() => document.getElementById('login-password-input').focus(), 100); 
}

function confirmUserLogin() { 
    const p = document.getElementById('login-password-input').value; 
    const expectedHash = usersData[tempLoginUser].passwordHash; 
    
    if (generateHash(p) === expectedHash) { 
        playSound('success'); 
        document.getElementById('user-login-modal').style.display = 'none'; 
        directLogin(tempLoginUser); 
    } else { 
        playSound('error'); 
        alert("❌ Sai mật khẩu!"); 
    } 
}

function directLogin(n) { 
    currentUser = n; 
    let u = usersData[n]; 
    const today = new Date().toDateString(); 
    
    if (u.lastLogin !== today) { 
        const y = new Date(); 
        y.setDate(y.getDate() - 1); 
        if (u.lastLogin === y.toDateString()) {
            u.streak += 1; 
        } else {
            u.streak = 1; 
        }
        u.lastLogin = today; 
        saveDB(); 
    } 
    showDashboard(); 
}

function logout() { 
    currentUser = null; 
    initLogin(); 
} 

function clearCache() { 
    if (confirm("XÓA TOÀN BỘ dữ liệu trên trình duyệt này?")) { 
        localStorage.clear(); location.reload(); 
    } 
}

function deleteAccount() { 
    if (confirm(`⚠️ CẢNH BÁO: Xóa tài khoản '${currentUser}' sẽ mất hết dữ liệu học tập. BẠN CÓ CHẮC CHẮN?`)) { 
        delete usersData[currentUser]; 
        saveDB(); 
        closeSettings(); 
        logout(); 
    } 
}

function showDashboard() {
    switchScreen('dashboard-screen'); 
    let u = usersData[currentUser]; 
    
    document.getElementById('avt-img').src = u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser}&backgroundColor=transparent`; 
    document.getElementById('prof-name').innerText = currentUser; 
    document.getElementById('prof-level').innerText = `LVL ${u.level}`; 
    document.getElementById('prof-streak').innerText = u.streak; 
    
    let isMax = u.level >= 100; 
    let cExp = isMax ? 100 : (u.exp % 100); 
    document.getElementById('prof-exp').innerText = cExp; 
    document.getElementById('prof-next-exp').innerText = isMax ? "MAX" : 100; 
    document.getElementById('exp-bar').style.width = `${(cExp / 100) * 100}%`; 
    
    const tbody = document.getElementById('history-tbody'); 
    tbody.innerHTML = ''; 
    
    if (!u.history || u.history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">Trống</td></tr>`; 
    }
    
    [...u.history].reverse().slice(0, 10).forEach(h => { 
        let m = h.mode === 'flashcard' ? '📇 FC' : '📝 Quiz'; 
        tbody.innerHTML += `<tr><td>${h.date}</td><td style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${m}</td><td><b>${h.file}</b></td><td style="color:var(--result-correct); font-weight:700;">${h.score}</td><td style="color:var(--primary); font-weight:700;">+${h.expGained}</td></tr>`; 
    }); 
    applyTranslations();
}

// ==========================================
// 7. CROP AVATAR (CROPPER.JS)
// ==========================================
let cropper;
function handleAvatarSelect(e) {
    const file = e.target.files[0]; 
    if(!file) return; 
    const reader = new FileReader();
    
    reader.onload = (ev) => {
        document.getElementById('crop-image').src = ev.target.result;
        document.getElementById('crop-modal').style.display = 'flex';
        if(cropper) cropper.destroy();
        cropper = new Cropper(document.getElementById('crop-image'), { 
            aspectRatio: 1, 
            viewMode: 1, 
            background: false, 
            minCropBoxWidth: 100, 
            minCropBoxHeight: 100 
        });
    }; 
    reader.readAsDataURL(file); 
    e.target.value = '';
}

function closeCropModal() { 
    document.getElementById('crop-modal').style.display = 'none'; 
    if(cropper) { cropper.destroy(); cropper = null; } 
}

function saveAvatar() {
    if(!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 150, height: 150 }); 
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    usersData[currentUser].avatar = base64; 
    saveDB(); 
    document.getElementById('avt-img').src = base64; 
    playSound('success'); 
    closeCropModal();
}

// ==========================================
// 8. TÍNH NĂNG LÀM BÀI TRẮC NGHIỆM & THẺ GHI NHỚ
// ==========================================
function showUploadScreen() { 
    switchScreen('upload-screen'); 
    if (window.timerInterval) clearInterval(window.timerInterval); 
    document.getElementById('excel-file').value = ""; 
}

function selectMode(m) { 
    studyMode = m; 
    document.getElementById('btn-mode-quiz').className = m === 'quiz' ? 'mode-btn active' : 'mode-btn'; 
    document.getElementById('btn-mode-fc').className = m === 'flashcard' ? 'mode-btn active' : 'mode-btn'; 
    document.getElementById('config-quiz').style.display = m === 'quiz' ? 'flex' : 'none'; 
    document.getElementById('config-fc').style.display = m === 'flashcard' ? 'flex' : 'none'; 
}

document.getElementById('excel-file').addEventListener('change', function(e) { 
    const f = e.target.files[0]; 
    if (!f) return; 
    currentFileName = f.name; 
    const r = new FileReader(); 
    
    r.onload = function(ev) { 
        const d = new Uint8Array(ev.target.result); 
        const j = XLSX.utils.sheet_to_json(XLSX.read(d, { type: 'array' }).Sheets[XLSX.read(d, { type: 'array' }).SheetNames[0]], { header: 1 }); 
        studyMode === 'quiz' ? startQuizMode(j) : startFlashcardMode(j); 
    }; 
    r.readAsArrayBuffer(f); 
});

function startQuizMode(d) {
    const sQ = document.getElementById('shuffle-questions').checked; 
    const sO = document.getElementById('shuffle-options').checked; 
    const tL = parseInt(document.getElementById('time-limit').value); 
    quizData = [];
    
    for (let i = 1; i < d.length; i++) { 
        const r = d[i]; 
        if (!r[0]) continue; 
        const oC = (parseInt(r[5]) || 1) - 1; 
        let o = []; 
        [r[1], r[2], r[3], r[4]].forEach((t_, x) => { 
            if (t_) o.push({ t: t_, i: x === oC }); 
        }); 
        if (sO) shuffleArray(o); 
        quizData.push({ q: r[0], opts: o.map(x => x.t), correct: o.findIndex(x => x.i), expl: r[6] || "" }); 
    }
    
    if (sQ) shuffleArray(quizData); 
    isSubmitted = false; 
    flaggedQuestions.clear(); 
    timeElapsed = 0; 
    
    switchScreen('quiz-app'); 
    document.getElementById('quiz-title').innerText = currentFileName; 
    document.getElementById('score-board').style.display = 'none'; 
    document.getElementById('avg-time-board').style.display = 'none'; 
    document.getElementById('btn-submit').innerText = t('btn_finish'); 
    document.getElementById('btn-submit').setAttribute('onclick', 'gradeQuiz(false)'); 
    
    renderQuizUI(); 
    applyTranslations();
    
    if (window.timerInterval) clearInterval(window.timerInterval); 
    let lS = (isNaN(tL) || tL <= 0) ? -1 : tL * 60;
    
    window.timerInterval = setInterval(() => { 
        if (isSubmitted) return; 
        timeElapsed++; 
        if (lS > 0) { 
            let rm = lS - timeElapsed; 
            document.getElementById('timer-display').innerText = `${Math.floor(rm / 60).toString().padStart(2, '0')}:${(rm % 60).toString().padStart(2, '0')}`; 
            if (rm <= 0) gradeQuiz(true); 
        } else {
            document.getElementById('timer-display').innerText = `${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`; 
        }
    }, 1000);
}

function renderQuizUI() {
    const c = document.getElementById('questions-container'); 
    const n = document.getElementById('nav-grid'); 
    totalQuestions = quizData.length; 
    c.innerHTML = ''; 
    n.innerHTML = ''; 
    const a = ['A', 'B', 'C', 'D', 'E'];
    
    quizData.forEach((i, x) => {
        let ho = ''; 
        i.opts.forEach((o, y) => { 
            ho += `<label class="option-item" id="opt-${x}-${y}"><input type="radio" name="q${x}" value="${y}" onchange="updateQuizUI(${x})"><div class="radio-custom"></div><span class="option-text" style="flex:1;"><b>${a[y]}.</b> ${parseText(o)}</span></label>`; 
        });
        
        let he = i.expl ? `<button class="btn-expl-toggle" id="btn-expl-${x}" onclick="document.getElementById('expl-${x}').style.display='block'; this.style.display='none'"><span data-i18n="q_expl">${t('q_expl')}</span></button><div class="expl-box" id="expl-${x}"><b>💡 <span data-i18n="cr_lbl_expl">${t('cr_lbl_expl')}</span>:</b><br>${parseText(i.expl)}</div>` : '';
        
        c.innerHTML += `<div class="question-card" id="card-${x}">
            <div class="q-header">
                <div class="q-title-row">
                    <span class="q-num"><span data-i18n="q_lbl">${t('q_lbl')}</span> ${x + 1}:</span>
                    <div>
                        <button class="tutor-btn" onclick="openTutor(${x})">💬 <span data-i18n="btn_tutor">${t('btn_tutor')}</span></button>
                        <button class="flag-btn" style="margin-left:5px;" id="flag-${x}" onclick="toggleQuizFlag(${x})"><span data-i18n="q_flag">${t('q_flag')}</span></button>
                    </div>
                </div>
                <div class="q-content">${parseText(i.q)}</div>
            </div>
            <div class="options-list">${ho}</div>${he}
        </div>`;
        
        n.innerHTML += `<button class="nav-item" id="nav-${x}" onclick="window.scrollTo({top: document.getElementById('card-${x}').offsetTop - 80, behavior:'smooth'})">${x + 1}</button>`;
    }); 
    
    updateQuizUI(-1); 
    if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
}

function toggleQuizFlag(i) { 
    if (isSubmitted) return; 
    flaggedQuestions.has(i) ? flaggedQuestions.delete(i) : flaggedQuestions.add(i); 
    updateQuizUI(i); 
}

function updateQuizUI(i) { 
    if (isSubmitted) return; 
    if (i !== -1) { 
        const n = document.getElementById(`nav-${i}`); 
        n.className = 'nav-item'; 
        if (flaggedQuestions.has(i)) n.classList.add('flagged'); 
        else if (document.querySelector(`input[name="q${i}"]:checked`)) n.classList.add('done'); 
    } 
    const a = document.querySelectorAll('input[type="radio"]:checked').length; 
    document.getElementById('progress-bar').style.width = `${(a / totalQuestions) * 100}%`; 
    document.getElementById('progress-text').innerText = `${a} / ${totalQuestions}`; 
}

function gradeQuiz(f) {
    if (isSubmitted) return; 
    const a = document.querySelectorAll('input[type="radio"]:checked').length; 
    if (!f && a < totalQuestions && !confirm(`Làm ${a}/${totalQuestions}. Nộp luôn?`)) return;
    
    isSubmitted = true; 
    clearInterval(window.timerInterval); 
    document.title = originalTitle; 
    document.getElementById('timer-display').innerText = "Đã nộp bài"; 
    let s = 0; 
    playSound('success');
    
    quizData.forEach((q, i) => {
        document.getElementsByName(`q${i}`).forEach(r => r.disabled = true); 
        const sl = document.querySelector(`input[name="q${i}"]:checked`); 
        const uA = sl ? parseInt(sl.value) : -1;
        const n = document.getElementById(`nav-${i}`); 
        const eb = document.getElementById(`expl-${i}`); 
        const ebn = document.getElementById(`btn-expl-${i}`);
        
        if (uA === q.correct) { 
            s++; n.className = 'nav-item correct'; 
            if (sl) document.getElementById(`opt-${i}-${uA}`).classList.add('correct-ans'); 
            if (ebn) ebn.style.display = 'block'; 
        } else { 
            n.className = 'nav-item wrong'; 
            if (sl) document.getElementById(`opt-${i}-${uA}`).classList.add('wrong-ans'); 
            document.getElementById(`opt-${i}-${q.correct}`).classList.add('correct-ans'); 
            if (eb) { eb.style.display = 'block'; if (ebn) ebn.style.display = 'none'; } 
        }
    });
    
    const eg = s * 10; 
    let u = usersData[currentUser]; 
    if (u.level < 100) { 
        u.exp += eg; 
        u.level = Math.min(100, Math.floor(u.exp / 100) + 1); 
    } 
    
    if (!u.history) u.history = []; 
    let d = new Date(); 
    u.history.push({ date: `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`, mode: 'quiz', file: currentFileName, score: `${s}/${totalQuestions}`, expGained: eg, avgTime: totalQuestions > 0 ? (timeElapsed / totalQuestions).toFixed(1) : 0 }); 
    saveDB();
    
    document.getElementById('score-board').style.display = 'block'; 
    document.getElementById('score-board').innerText = `${s}/${totalQuestions} (+${eg} XP)`; 
    document.getElementById('avg-time-board').style.display = 'block'; 
    document.getElementById('avg-time-board').innerText = `⏱ ${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s`; 
    document.getElementById('btn-submit').innerText = t('btn_back'); 
    document.getElementById('btn-submit').setAttribute('onclick', 'showDashboard()');
    
    if (f) {
        document.getElementById('time-up-modal').style.display = 'flex'; 
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Flashcard
function startFlashcardMode(d) {
    const sF = document.getElementById('fc-shuffle').checked; 
    fcDeckOriginal = [];
    
    for (let i = 1; i < d.length; i++) { 
        const r = d[i]; 
        if (!r[0]) continue; 
        let f = r[0]; 
        let b = ""; let e = ""; 
        let ansIdx = parseInt(r[5]); 
        if (!isNaN(ansIdx) && ansIdx >= 1 && ansIdx <= 4) { 
            b = r[ansIdx] || ""; 
        } else { 
            b = r[1] || ""; 
        } 
        b = b.toString().replace(/<br><br><span.*?>💡 Giải thích:.*?<\/span>/g, ''); 
        b = b.toString().replace(/&lt;br&gt;&lt;br&gt;&lt;span.*?>💡 Giải thích:.*?&lt;\/span&gt;/g, ''); 
        if (r[6]) e = r[6]; 
        fcDeckOriginal.push({ id: i, front: f, back: b, expl: e }); 
    }
    
    if (fcDeckOriginal.length === 0) return alert("Không có thẻ!"); 
    if (sF) shuffleArray(fcDeckOriginal);
    
    fcCurrentDeck = [...fcDeckOriginal]; 
    fcNextRoundDeck = []; 
    fcCurrentIndex = 0; 
    fcRound = 1; 
    fcStats = { firstTry: 0, struggled: new Set(), totalMastered: 0 }; 
    timeElapsed = 0; 
    
    switchScreen('flashcard-app'); 
    document.getElementById('progress-bar').style.width = '0%'; 
    document.getElementById('progress-text').innerText = `0 / ${fcDeckOriginal.length}`;
    
    if (window.timerInterval) clearInterval(window.timerInterval); 
    window.timerInterval = setInterval(() => { 
        timeElapsed++; 
        document.getElementById('timer-display').innerText = `${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`; 
    }, 1000); 
    renderFcCard();
}

function renderFcCard() {
    if (fcCurrentIndex >= fcCurrentDeck.length) { 
        if (fcNextRoundDeck.length > 0) { 
            fcCurrentDeck = [...fcNextRoundDeck]; 
            shuffleArray(fcCurrentDeck); 
            fcNextRoundDeck = []; 
            fcCurrentIndex = 0; 
            fcRound++; 
        } else {
            return finishFlashcardMode(); 
        }
    }
    let c = fcCurrentDeck[fcCurrentIndex]; 
    document.getElementById('fc-card').classList.remove('flipped');
    
    setTimeout(() => { 
        document.getElementById('fc-front-text').innerHTML = parseText(c.front); 
        let backHtml = `<div class="fc-back-title">${parseText(c.back)}</div>`; 
        if(c.expl) { 
            backHtml += `<div class="fc-expl-box"><b style="color: var(--primary);">💡 <span data-i18n="cr_lbl_expl">${t('cr_lbl_expl')}</span>:</b><br>${parseText(c.expl)}</div>`; 
        } 
        document.getElementById('fc-back-text').innerHTML = backHtml; 
        document.getElementById('fc-round-text').innerText = `${t('fc_round')} ${fcRound} (${fcCurrentIndex + 1} / ${fcCurrentDeck.length})`; 
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err)); 
        applyTranslations();
    }, 200);
}

function flipCard() { 
    document.getElementById('fc-card').classList.toggle('flipped'); 
}

function markFlashcard(isM) { 
    if(isM) playSound('success'); 
    let c = fcCurrentDeck[fcCurrentIndex]; 
    if (isM) { 
        fcStats.totalMastered++; 
        if (!fcStats.struggled.has(c.id)) fcStats.firstTry++; 
    } else { 
        fcStats.struggled.add(c.id); 
        fcNextRoundDeck.push(c); 
    } 
    document.getElementById('progress-bar').style.width = `${(fcStats.totalMastered / fcDeckOriginal.length) * 100}%`; 
    document.getElementById('progress-text').innerText = `${fcStats.totalMastered} / ${fcDeckOriginal.length}`; 
    fcCurrentIndex++; 
    renderFcCard(); 
}

function finishFlashcardMode() { 
    playSound('success'); 
    clearInterval(window.timerInterval); 
    const eg = fcDeckOriginal.length * 10; 
    let u = usersData[currentUser]; 
    if (u.level < 100) { 
        u.exp += eg; 
        u.level = Math.min(100, Math.floor(u.exp / 100) + 1); 
    } 
    if (!u.history) u.history = []; 
    let d = new Date(); 
    u.history.push({ date: `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`, mode: 'flashcard', file: currentFileName, score: `${fcStats.firstTry}`, expGained: eg, avgTime: '-' }); 
    saveDB(); 
    
    document.getElementById('fc-total-mastered').innerText = fcStats.totalMastered; 
    document.getElementById('fc-first-try').innerText = fcStats.firstTry; 
    document.getElementById('fc-exp-gained').innerText = eg; 
    document.getElementById('fc-result-modal').style.display = 'flex'; 
}

function closeFcModal() { 
    document.getElementById('fc-result-modal').style.display = 'none'; 
    showDashboard(); 
}

// ==========================================
// 9. QUẢN LÝ API (GEMINI CHUNG) & UPLOAD FILE
// ==========================================
function ensureApiKey() { 
    const k = document.getElementById('ai-api-key').value.trim(); 
    if (!k) { 
        playSound('error'); 
        alert("⚠️ Bạn chưa cài đặt API Key Gemini!"); 
        window.open("https://aistudio.google.com/app/apikey?hl=vi", "_blank"); 
        openSettings(); 
        return false; 
    } 
    return k; 
}

// Bắt lỗi Quota 429 Tiếng Việt
function handleAIError(e, loadingElementId, buttonElementId) { 
    console.error(e); 
    playSound('error'); 
    
    if (loadingElementId) document.getElementById(loadingElementId).style.display = 'none'; 
    if (buttonElementId) { 
        const btn = document.getElementById(buttonElementId); 
        btn.disabled = false; 
        if(btn.dataset.originalText) btn.innerText = btn.dataset.originalText; 
    } 
    
    const errText = e.message ? e.message.toLowerCase() : "";
    if (errText.includes('quota') || errText.includes('429')) {
        alert("⚠️ HẾT HẠN MỨC DÙNG THỬ (QUOTA EXCEEDED)\n\nGoogle Gemini chỉ cho phép dùng miễn phí 1 số lượng nhỏ mỗi ngày. API Key hiện tại của bạn đã bị khóa tạm thời.\n\n💡 GIẢI PHÁP 1: Chờ đến ngày mai để được mở khóa.\n💡 GIẢI PHÁP 2: Lấy một tài khoản Gmail khác, vào Google AI Studio tạo API Key mới và dán vào phần Cài Đặt.");
    } else if (errText.includes('not found') || errText.includes('deprecated')) { 
        alert("⚠️ Model AI này đã bị Google xóa. Vào phần Cài đặt chọn Model khác."); 
    } else { 
        alert(`❌ Lỗi phát sinh: ${e.message}`); 
    } 
}

async function saveAndTestApiKey() { 
    const k = document.getElementById('ai-api-key').value.trim(); 
    const m = document.getElementById('ai-model').value; 
    if (!k) return alert("Vui lòng nhập API Key!"); 
    
    try { 
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] }) 
        }); 
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Key Gemini sai hoặc lỗi mạng."); 
        } 
        
        localStorage.setItem('ai_api_key', k); 
        localStorage.setItem('ai_model', m); 
        playSound('success'); 
        alert("✅ KẾT NỐI THÀNH CÔNG! Đã lưu Key."); 
    } catch (e) { 
        handleAIError(e, null, null); 
    } 
}

function processAIAttachment(e, loadingId, statusId, contextId, targetType) { 
    const f = e.target.files[0]; 
    if (!f) return; 
    
    if(f.size > 5 * 1024 * 1024) { 
        alert("⚠️ Tài liệu quá lớn (>5MB). Hãy chia nhỏ file ra để AI đọc không bị lỗi nhé!"); 
        e.target.value = ""; 
        return; 
    }
    
    const ext = f.name.split('.').pop().toLowerCase(); 
    const ld = document.getElementById(loadingId); 
    const statusBox = document.getElementById(statusId);
    
    ld.style.display = 'block'; 
    ld.innerText = "🔄 Đang trích xuất..."; 
    
    if (['png', 'jpg', 'jpeg', 'pdf'].includes(ext)) { 
        const r = new FileReader(); 
        r.onload = ev => { 
            const base64 = ev.target.result.split(',')[1]; 
            const fileObj = { inlineData: { data: base64, mimeType: f.type } }; 
            
            if(targetType === 'ai') aiAttachedFile = fileObj; 
            else if(targetType === 'sum') summarizerAttachedFile = fileObj; 
            else if(targetType === 'essay') essayAttachedFile = fileObj; 
            
            statusBox.innerText = `📎 Đã đính kèm: ${f.name}`; 
            statusBox.style.display = 'block'; 
            ld.style.display = 'none'; 
        }; 
        r.readAsDataURL(f); 
    } 
    else if (ext === 'txt') { 
        const r = new FileReader(); 
        r.onload = ev => { 
            document.getElementById(contextId).value = ev.target.result; 
            ld.style.display = 'none'; 
        }; 
        r.readAsText(f); 
    } 
    else if (ext === 'docx') { 
        const r = new FileReader(); 
        r.onload = ev => { 
            mammoth.extractRawText({ arrayBuffer: ev.target.result }).then(res => { 
                document.getElementById(contextId).value = res.value; 
                ld.style.display = 'none'; 
            }).catch(err => { 
                alert("Lỗi: " + err.message); 
                ld.style.display = 'none'; 
            }); 
        }; 
        r.readAsArrayBuffer(f); 
    } 
    else { 
        alert("Chỉ hỗ trợ .txt, .docx, .pdf hoặc ảnh"); 
        ld.style.display = 'none'; 
    } 
    e.target.value = ""; 
}

function startCooldown(btnId, seconds, originalText) { 
    const btn = document.getElementById(btnId); 
    if (!btn) return; 
    
    btn.dataset.originalText = originalText; 
    btn.disabled = true; 
    let timeLeft = seconds; 
    btn.innerText = `⏳ Chờ ${timeLeft}s...`; 
    
    const timer = setInterval(() => { 
        timeLeft--; 
        if (timeLeft <= 0) { 
            clearInterval(timer); 
            btn.disabled = false; 
            btn.innerText = originalText; 
        } else { 
            btn.innerText = `⏳ Chờ ${timeLeft}s...`; 
        } 
    }, 1000); 
}

function parseCustomTextFormat(text) { 
    const results = []; 
    const blocks = text.split('==='); 
    for (let block of blocks) { 
        block = block.trim(); 
        if (!block) continue; 
        
        const getTagContent = (currentTag, nextTag) => { 
            const start = block.indexOf(`[${currentTag}]`); 
            if (start === -1) return ""; 
            const startPos = start + `[${currentTag}]`.length; 
            if (!nextTag) return block.substring(startPos).trim(); 
            const end = block.indexOf(`[${nextTag}]`, startPos); 
            if (end === -1) return block.substring(startPos).trim(); 
            return block.substring(startPos, end).trim(); 
        }; 
        
        const q = getTagContent('Q', 'O1'); 
        if (q) { 
            results.push({ 
                q: q, 
                o1: getTagContent('O1', 'O2'), 
                o2: getTagContent('O2', 'O3'), 
                o3: getTagContent('O3', 'O4'), 
                o4: getTagContent('O4', 'A'), 
                a: parseInt(getTagContent('A', 'E')) || 1, 
                e: getTagContent('E', null) 
            }); 
        } 
    } 
    return results; 
}

// ==========================================
// 10. GIA SƯ AI (CHATBOX THEO NGỮ CẢNH)
// ==========================================
let currentTutorQ = null;

function openTutor(index) {
    currentTutorQ = quizData[index];
    document.getElementById('tutor-chat-log').innerHTML = `<div class="chat-bubble chat-ai">Xin chào! Mình là Gia sư AI. Bạn có thắc mắc gì về câu hỏi số ${index + 1} này không?</div>`;
    document.getElementById('tutor-input').value = ''; 
    document.getElementById('tutor-modal').style.display = 'flex';
}

function openTutorFC() {
    if (fcCurrentIndex >= fcCurrentDeck.length) return;
    currentTutorQ = { 
        q: fcCurrentDeck[fcCurrentIndex].front, 
        opts: [], 
        correct: 0, 
        expl: fcCurrentDeck[fcCurrentIndex].back + " | " + fcCurrentDeck[fcCurrentIndex].expl 
    };
    document.getElementById('tutor-chat-log').innerHTML = `<div class="chat-bubble chat-ai">Xin chào! Mình là Gia sư AI. Bạn có thắc mắc gì về thẻ ghi nhớ này không?</div>`;
    document.getElementById('tutor-input').value = ''; 
    document.getElementById('tutor-modal').style.display = 'flex';
}

async function askTutor() {
    const k = ensureApiKey(); 
    if(!k) return; 
    
    const m = document.getElementById('ai-model').value;
    const input = document.getElementById('tutor-input'); 
    const query = input.value.trim(); 
    if(!query) return;
    
    const log = document.getElementById('tutor-chat-log');
    
    log.innerHTML += `<div class="chat-bubble chat-user">${parseText(query)}</div>`; 
    input.value = '';
    
    const loadingId = `loading-${Date.now()}`; 
    log.innerHTML += `<div class="chat-bubble chat-ai" id="${loadingId}">...</div>`; 
    log.scrollTop = log.scrollHeight;

    const optsText = currentTutorQ.opts && currentTutorQ.opts.length > 0 
        ? `\nCác đáp án: ${currentTutorQ.opts.join(" | ")}\nĐáp án đúng: ${currentTutorQ.opts[currentTutorQ.correct]}` 
        : `\nMặt sau thẻ: ${currentTutorQ.expl}`;
        
    const sys = `Đóng vai một gia sư tận tâm. Học sinh đang hỏi về nội dung sau:
Câu hỏi: ${currentTutorQ.q}
${optsText}
Giải thích của hệ thống: ${currentTutorQ.expl}
Nhiệm vụ: Trả lời ngắn gọn, dễ hiểu, thân thiện bằng ngôn ngữ ${currentLang === 'vi' ? 'Tiếng Việt' : 'English'}. Bọc công thức toán trong $.`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                system_instruction: { parts: [{ text: sys }] }, 
                contents: [{ parts: [{text: query}] }], 
                generationConfig: { temperature: 0.5 } 
            }) 
        });
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Lỗi API"); 
        }
        
        const data = await res.json(); 
        document.getElementById(loadingId).innerHTML = parseText(data.candidates[0].content.parts[0].text);
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
        
    } catch(e) { 
        handleAIError(e, loadingId, null); 
    }
    
    log.scrollTop = log.scrollHeight;
}

// ==========================================
// 11. TỪ ĐIỂN DỊCH THUẬT DOUBLE-FETCH
// ==========================================
let currentDictAudioText = ""; 
let currentDictAudioLang = "en-US";

function initTTSVoices() {
    if(!window.speechSynthesis) return;
    const populate = () => {
        const voices = speechSynthesis.getVoices(); 
        const select = document.getElementById('dict-voice-select'); 
        select.innerHTML = '';
        
        voices.forEach(v => { 
            if(v.lang.includes('en') || v.lang.includes('vi')) { 
                const opt = document.createElement('option'); 
                opt.value = v.voiceURI; 
                opt.innerText = `${v.name} (${v.lang})`; 
                select.appendChild(opt); 
            } 
        });
        
        // Ưu tiên chọn Google Voice
        const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
        if(googleVoice) select.value = googleVoice.voiceURI;
    };
    populate(); 
    if(speechSynthesis.onvoiceschanged !== undefined) { 
        speechSynthesis.onvoiceschanged = populate; 
    }
}

async function translateText() {
    const input = document.getElementById('dict-input').value.trim(); 
    if(!input) return;
    
    const dir = document.getElementById('dict-lang-dir').value.split('|'); 
    const sourceLang = dir[0]; 
    const targetLang = dir[1];
    
    const btn = document.getElementById('btn-translate'); 
    const ld = document.getElementById('dict-loading'); 
    
    btn.disabled = true; 
    ld.style.display = 'block'; 
    document.getElementById('dict-ipa-display').innerText = ''; 
    document.getElementById('dict-result-display').innerText = '';
    
    try {
        let translatedText = "";
        try {
            // MyMemory (Fallback nếu Google chặn)
            const fbRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${sourceLang}|${targetLang}`);
            const fbData = await fbRes.json(); 
            translatedText = fbData.responseData.translatedText;
        } catch(e) {
            // Google Translate (Public)
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(input)}`;
            const res = await fetch(url); 
            if(res.ok) { 
                const data = await res.json(); 
                if(data && data[0]) { 
                    data[0].forEach(part => { if(part[0]) translatedText += part[0]; }); 
                } 
            } else {
                throw new Error();
            }
        }
        
        if(!translatedText) throw new Error("Blank translation");
        
        document.getElementById('dict-result-display').innerText = translatedText;
        
        if(sourceLang === 'en' && !input.includes(" ")) {
            try { 
                const ipaRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`); 
                if(ipaRes.ok) { 
                    const ipaData = await ipaRes.json(); 
                    if(ipaData[0] && ipaData[0].phonetics && ipaData[0].phonetics.length > 0) { 
                        const phonetics = ipaData[0].phonetics.find(p => p.text); 
                        if(phonetics) document.getElementById('dict-ipa-display').innerText = phonetics.text; 
                    } 
                } 
            } catch(e) {}
        }
        
        currentDictAudioText = sourceLang === 'en' ? input : translatedText; 
        currentDictAudioLang = sourceLang === 'en' ? 'en-US' : 'en-US'; 
        playSound('success'); 
        
    } catch(e) { 
        alert("Lỗi dịch thuật. Vui lòng kiểm tra kết nối mạng."); 
        playSound('error'); 
    } finally { 
        ld.style.display = 'none'; 
        startCooldown('btn-translate', 2, t('btn_translate')); 
    }
}

function playDictAudio() {
    if(!window.speechSynthesis) return alert("Trình duyệt không hỗ trợ Web Speech API.");
    
    const textToRead = currentDictAudioText || document.getElementById('dict-result-display').innerText;
    if(!textToRead) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = parseFloat(document.getElementById('dict-speed').value) || 1;
    
    const voiceSelect = document.getElementById('dict-voice-select');
    if(voiceSelect.value) { 
        const voices = speechSynthesis.getVoices(); 
        const selectedVoice = voices.find(v => v.voiceURI === voiceSelect.value); 
        if(selectedVoice) utterance.voice = selectedVoice; 
    } else { 
        const dir = document.getElementById('dict-lang-dir').value; 
        utterance.lang = dir === 'en|vi' ? 'en-US' : 'vi-VN'; 
    }
    
    window.speechSynthesis.speak(utterance);
}

// ==========================================
// 12. CÔNG CỤ SOẠN ĐỀ (CREATOR)
// ==========================================
function updateCreatorNav() {
    const nav = document.getElementById('creator-nav-grid'); 
    nav.innerHTML = ''; 
    const sidebar = document.getElementById('creator-sidebar'); 
    const cards = document.querySelectorAll('.creator-card');
    
    if (cards.length > 0) { 
        sidebar.style.display = 'block'; 
        cards.forEach((c, i) => { 
            const id = c.id; 
            nav.innerHTML += `<button class="nav-item done" style="background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-light);" onclick="window.scrollTo({top: document.getElementById('${id}').offsetTop - 20, behavior:'smooth'})">${i + 1}</button>`; 
        }); 
    } else { 
        sidebar.style.display = 'none'; 
    }
}

function showCreatorScreen() { 
    switchScreen('creator-screen'); 
    if (creatorQuestionsCount === 0) { addCreatorQuestion(); } 
    updateCreatorNav(); 
}

function updateQuestionNumbers() { 
    document.querySelectorAll('.creator-card').forEach((c, i) => { 
        const t_ = c.querySelector('.q-number-text'); 
        if (t_) t_.innerHTML = `<span data-i18n="cr_q_num">${t('cr_q_num')}</span> ${i + 1}`; 
    }); 
    updateCreatorNav(); 
}

function deleteCreatorQuestion(id) { 
    const c = document.getElementById(`cr-card-${id}`); 
    if (c) { c.remove(); updateQuestionNumbers(); } 
}

function clearAllCreatorQuestions() { 
    if(creatorQuestionsCount === 0) return alert("Trống!"); 
    if(confirm("Xóa toàn bộ câu hỏi đang soạn?")) { 
        document.getElementById('creator-questions-container').innerHTML = ''; 
        creatorQuestionsCount = 0; 
        updateCreatorNav(); 
    } 
}

function setCreatorMode(m) { 
    currentCreatorMode = m; 
    document.getElementById('btn-cr-quiz').className = m === 'quiz' ? 'mode-btn active' : 'mode-btn'; 
    document.getElementById('btn-cr-fc').className = m === 'flashcard' ? 'mode-btn active' : 'mode-btn'; 
    const container = document.getElementById('creator-questions-container'); 
    if(m === 'flashcard') { 
        container.classList.add('fc-mode-active'); 
    } else { 
        container.classList.remove('fc-mode-active'); 
    } 
}

function handleAIFileUpload(e) { processAIAttachment(e, 'ai-loading', 'ai-file-status', 'ai-context', 'ai'); }

function addCreatorQuestionWithReturn(isAI = false) {
    creatorQuestionsCount++; 
    const id = Date.now().toString() + Math.floor(Math.random() * 1000); 
    const c = document.createElement('div'); 
    c.className = 'creator-card'; 
    c.id = `cr-card-${id}`;
    
    const badgeHtml = isAI ? `<span style="font-size:0.75rem; background:rgba(139,92,246,0.15); color:var(--primary); padding:4px 10px; border-radius:12px; margin-left:10px; border: 1px solid var(--primary);" data-i18n="ai_tag">${t('ai_tag')}</span>` : `<span style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:#10b981; padding:4px 10px; border-radius:12px; margin-left:10px; border: 1px solid #10b981;" data-i18n="manual_tag">${t('manual_tag')}</span>`;
    
    c.innerHTML = `
        <div class="cr-header"><div class="cr-title"><span class="q-number-text"><span data-i18n="cr_q_num">${t('cr_q_num')}</span> ${creatorQuestionsCount}</span> ${badgeHtml}</div><button class="btn-danger" style="width: auto; padding: 6px 14px; font-size: 0.8rem; box-shadow: none;" onclick="deleteCreatorQuestion('${id}')" data-i18n="btn_del">${t('btn_del')}</button></div>
        <div class="cr-field"><div class="cr-field-header"><label class="lbl-q" data-i18n="cr_lbl_q">${t('cr_lbl_q')}</label><button class="btn-sm-upload" onclick="document.getElementById('file-q-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-q-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-q-${id}')"></div><textarea class="cr-textarea" id="cr-q-${id}" rows="2"></textarea></div>
        <div class="cr-grid">
            <div class="cr-field"><div class="cr-field-header"><label class="lbl-opt1"><span data-i18n="cr_lbl_opt">${t('cr_lbl_opt')}</span> A</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt1-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-opt1-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt1-${id}')"></div><textarea class="cr-textarea" id="cr-opt1-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label><span data-i18n="cr_lbl_opt">${t('cr_lbl_opt')}</span> B</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt2-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-opt2-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt2-${id}')"></div><textarea class="cr-textarea" id="cr-opt2-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label><span data-i18n="cr_lbl_opt">${t('cr_lbl_opt')}</span> C</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt3-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-opt3-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt3-${id}')"></div><textarea class="cr-textarea" id="cr-opt3-${id}" rows="1"></textarea></div>
            <div class="cr-field fc-hide"><div class="cr-field-header"><label><span data-i18n="cr_lbl_opt">${t('cr_lbl_opt')}</span> D</label><button class="btn-sm-upload" onclick="document.getElementById('file-opt4-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-opt4-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-opt4-${id}')"></div><textarea class="cr-textarea" id="cr-opt4-${id}" rows="1"></textarea></div>
        </div>
        <div class="cr-bottom-row"><div class="cr-correct-box fc-hide"><label data-i18n="cr_lbl_ans">${t('cr_lbl_ans')}</label><select id="cr-ans-${id}" class="cr-select"><option value="1">A</option><option value="2">B</option><option value="3">C</option><option value="4">D</option></select></div><div class="cr-field" style="flex: 1; margin: 0;"><div class="cr-field-header"><label data-i18n="cr_lbl_expl">${t('cr_lbl_expl')}</label><button class="btn-sm-upload" onclick="document.getElementById('file-expl-${id}').click()"><span data-i18n="btn_upload_img">${t('btn_upload_img')}</span></button><input type="file" id="file-expl-${id}" hidden accept="image/*" onchange="handleFileUpload(event, 'cr-expl-${id}')"></div><textarea class="cr-textarea" id="cr-expl-${id}" rows="2"></textarea></div></div>`;
    
    document.getElementById('creator-questions-container').appendChild(c); 
    updateQuestionNumbers(); 
    c.querySelectorAll('textarea').forEach(t_ => t_.addEventListener('paste', handleImagePaste)); 
    return id;
}

function addCreatorQuestion() { 
    addCreatorQuestionWithReturn(false); 
    applyTranslations(); 
}

function processAndInsertImage(f, tId, tgt = null) { 
    const r = new FileReader(); 
    r.onload = function(ev) { 
        const i = new Image(); 
        i.src = ev.target.result; 
        i.onload = function() { 
            const c = document.createElement('canvas'); 
            const MAX_W = 400; 
            let w = i.width; 
            let h = i.height; 
            if (w > MAX_W) { h = Math.round((h * MAX_W) / w); w = MAX_W; } 
            c.width = w; c.height = h; 
            const ctx = c.getContext('2d'); 
            ctx.drawImage(i, 0, 0, w, h); 
            const b64 = c.toDataURL('image/jpeg', 0.7); 
            const tag = `[img]${b64}[/img]`; 
            const t_ = tgt || document.getElementById(tId); 
            const sP = t_.selectionStart; 
            const eP = t_.selectionEnd; 
            t_.value = t_.value.substring(0, sP) + tag + t_.value.substring(eP, t_.value.length); 
        } 
    }; 
    r.readAsDataURL(f); 
}

function handleFileUpload(e, id) { 
    const f = e.target.files[0]; 
    if (!f) return; 
    processAndInsertImage(f, id); 
    e.target.value = ""; 
}

function handleImagePaste(e) { 
    const i = (e.clipboardData || e.originalEvent.clipboardData).items; 
    for (let x in i) { 
        const item = i[x]; 
        if (item.kind === 'file') { 
            processAndInsertImage(item.getAsFile(), null, e.target); 
            e.preventDefault(); 
        } 
    } 
}

function exportCreatorToExcel() { 
    const cs = document.querySelectorAll('.creator-card'); 
    if (cs.length === 0) return alert("Trống!"); 
    let w_d = [["Câu hỏi", "Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4", "Đáp án đúng", "Giải thích"]]; 
    cs.forEach(c => { 
        const id = c.id.replace('cr-card-', ''); 
        const q = document.getElementById(`cr-q-${id}`).value.trim(); 
        const o1 = document.getElementById(`cr-opt1-${id}`).value.trim(); 
        const o2 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt2-${id}`).value.trim(); 
        const o3 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt3-${id}`).value.trim(); 
        const o4 = currentCreatorMode === 'flashcard' ? "" : document.getElementById(`cr-opt4-${id}`).value.trim(); 
        const a = currentCreatorMode === 'flashcard' ? "1" : document.getElementById(`cr-ans-${id}`).value; 
        const e = document.getElementById(`cr-expl-${id}`).value.trim(); 
        if (q) w_d.push([q, o1, o2, o3, o4, a, e]); 
    }); 
    if (w_d.length === 1) return alert("Vui lòng điền nội dung!"); 
    const ws = XLSX.utils.aoa_to_sheet(w_d); 
    const wb = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, "NganHangCauHoi"); 
    XLSX.writeFile(wb, `BoDe_LMS_${new Date().getTime()}.xlsx`); 
}

async function generateWithAI() {
    const k = ensureApiKey(); 
    if (!k) return;
    
    const m = document.getElementById('ai-model').value; 
    const t_val = document.getElementById('ai-context').value.trim(); 
    const md = document.getElementById('ai-mode').value; 
    const customInstruction = document.getElementById('ai-custom-prompt').value.trim(); 
    const btn = document.getElementById('btn-ai-generate'); 
    const ld = document.getElementById('ai-loading');
    
    if (!t_val && !aiAttachedFile) return alert("Vui lòng dán văn bản, hoặc đính kèm file!"); 
    
    document.getElementById('creator-questions-container').innerHTML = ''; 
    creatorQuestionsCount = 0; 
    setCreatorMode(md);

    const sys = `Bạn là chuyên gia tạo đề trắc nghiệm và thẻ nhớ. Phân tích tài liệu và tạo bộ câu hỏi.
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
- Nếu Flashcard: Bỏ trống [O2], [O3], [O4]. Ghi đáp án thẳng vào [O1], và [A] luôn là 1.
- Công thức toán học BẮT BUỘC bọc trong cặp dấu $ (VD: $\\int x^2 dx$).`;

    let usr = `CHẾ ĐỘ YÊU CẦU: ${md.toUpperCase()}`; 
    if (t_val) usr += `\nNỘI DUNG CẦN PHÂN TÍCH:\n${t_val}`; 
    if (customInstruction) usr += `\n\n--- YÊU CẦU ĐẶC BIỆT TỪ NGƯỜI DÙNG ---\n${customInstruction}`;
    
    const promptParts = [{ text: usr }]; 
    if (aiAttachedFile) promptParts.push(aiAttachedFile); 
    
    btn.disabled = true; 
    ld.style.display = 'block';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                system_instruction: { parts: [{ text: sys }] }, 
                contents: [{ parts: promptParts }], 
                generationConfig: { temperature: 0.3 } 
            }) 
        });
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); 
        }
        
        const data = await res.json(); 
        const txt = data.candidates[0].content.parts[0].text; 
        const arr = parseCustomTextFormat(txt);
        
        if(arr.length === 0) throw new Error("AI trả về kết quả rỗng hoặc vi phạm cấu trúc.");
        
        arr.forEach(i => { 
            const id = addCreatorQuestionWithReturn(true); 
            document.getElementById(`cr-q-${id}`).value = i.q || ""; 
            document.getElementById(`cr-opt1-${id}`).value = i.o1 || ""; 
            document.getElementById(`cr-opt2-${id}`).value = i.o2 || ""; 
            document.getElementById(`cr-opt3-${id}`).value = i.o3 || ""; 
            document.getElementById(`cr-opt4-${id}`).value = i.o4 || ""; 
            document.getElementById(`cr-ans-${id}`).value = i.a || 1; 
            document.getElementById(`cr-expl-${id}`).value = i.e || ""; 
        });
        
        playSound('success'); 
        alert(`Tạo thành công ${arr.length} câu hỏi mới!`); 
        document.getElementById('ai-context').value = ""; 
        document.getElementById('ai-custom-prompt').value = ""; 
        aiAttachedFile = null; 
        document.getElementById('ai-file-status').style.display = 'none'; 
        updateCreatorNav(); 
        applyTranslations();
        
    } catch (e) { 
        handleAIError(e, 'ai-loading', 'btn-ai-generate'); 
    } finally { 
        document.getElementById('ai-loading').style.display = 'none'; 
        startCooldown('btn-ai-generate', 10, t('btn_analyze')); 
    }
}

// ==========================================
// 13. TÓM TẮT & TỰ LUẬN BẰNG AI
// ==========================================
function handleSumFileUpload(e) { 
    processAIAttachment(e, 'sum-loading', 'sum-file-status', 'sum-context', 'sum'); 
}

async function generateSummary() {
    const k = ensureApiKey(); 
    if (!k) return; 
    
    const m = document.getElementById('ai-model').value; 
    const t_val = document.getElementById('sum-context').value.trim(); 
    const customPrompt = document.getElementById('sum-custom-prompt').value.trim(); 
    const btn = document.getElementById('btn-sum-generate'); 
    const ld = document.getElementById('sum-loading'); 
    const resultBox = document.getElementById('sum-result-box'); 
    const resultContent = document.getElementById('sum-result-content');
    
    if (!t_val && !summarizerAttachedFile) return alert("Vui lòng dán văn bản hoặc nạp tài liệu để AI tóm tắt!");
    
    const sys = `Bạn là một Giáo sư Học thuật chuyên nghiệp. Nhiệm vụ của bạn là đọc hiểu và tóm tắt tài liệu một cách súc tích, dễ hiểu, nhắm đúng trọng tâm để học sinh ôn thi.\n- Dùng thẻ Markdown (**chữ đậm**) để nhấn mạnh các từ khóa.\n- Trình bày rõ ràng bằng các gạch đầu dòng (bullet points).\n- Công thức toán học BẮT BUỘC bọc trong cặp dấu $ (VD: $\\int x^2 dx$).`;
    let usr = "HÃY TÓM TẮT TÀI LIỆU SAU ĐÂY:\n"; 
    if(t_val) usr += t_val; 
    if(customPrompt) usr += `\n\n--- LƯU Ý ĐẶC BIỆT ---\n${customPrompt}`;
    
    const promptParts = [{ text: usr }]; 
    if (summarizerAttachedFile) promptParts.push(summarizerAttachedFile); 
    
    btn.disabled = true; 
    ld.style.display = 'block'; 
    resultBox.style.display = 'none';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                system_instruction: { parts: [{ text: sys }] }, 
                contents: [{ parts: promptParts }], 
                generationConfig: { temperature: 0.2 } 
            }) 
        });
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); 
        }
        
        const data = await res.json(); 
        playSound('success'); 
        resultContent.innerHTML = parseText(data.candidates[0].content.parts[0].text); 
        resultBox.style.display = 'block'; 
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
        
    } catch (e) { 
        handleAIError(e, 'sum-loading', 'btn-sum-generate'); 
    } finally { 
        document.getElementById('sum-loading').style.display = 'none'; 
        startCooldown('btn-sum-generate', 10, t('btn_sum_do')); 
    }
}

function handleEssayFileUpload(e) { 
    processAIAttachment(e, 'essay-loading-1', 'essay-file-status', 'essay-context', 'essay'); 
}

async function generateEssayQuestions() {
    const k = ensureApiKey(); 
    if (!k) return; 
    
    const m = document.getElementById('ai-model').value; 
    const t_val = document.getElementById('essay-context').value.trim(); 
    const diff = document.getElementById('essay-difficulty').value; 
    const btn = document.getElementById('btn-essay-generate'); 
    const ld = document.getElementById('essay-loading-1');
    
    if (!t_val && !essayAttachedFile) return alert("Vui lòng dán văn bản hoặc nạp tài liệu!");
    
    const sys = `Đóng vai Giáo viên ra đề thi Tự luận. Dựa trên tài liệu cung cấp, hãy tạo ra 1 đến 3 câu hỏi tự luận theo độ khó người dùng yêu cầu.\n- Trả về câu hỏi trực tiếp, KHÔNG kèm đáp án.\n- Câu hỏi phải kích thích tư duy người học.\n- Nếu có công thức toán, bọc trong cặp dấu $...$`;
    let usr = `MỨC ĐỘ YÊU CẦU: ${diff.toUpperCase()}\nTÀI LIỆU:\n`; 
    if(t_val) usr += t_val;
    
    const promptParts = [{ text: usr }]; 
    if (essayAttachedFile) promptParts.push(essayAttachedFile); 
    
    btn.disabled = true; 
    ld.style.display = 'block';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                system_instruction: { parts: [{ text: sys }] }, 
                contents: [{ parts: promptParts }], 
                generationConfig: { temperature: 0.5 } 
            }) 
        });
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); 
        }
        
        const data = await res.json(); 
        currentEssayGeneratedQuestions = data.candidates[0].content.parts[0].text; 
        playSound('success'); 
        
        document.getElementById('essay-step-1').style.display = 'none'; 
        document.getElementById('essay-step-2').style.display = 'block'; 
        document.getElementById('essay-question-display').innerHTML = parseText(currentEssayGeneratedQuestions); 
        document.getElementById('essay-user-answer').value = ""; 
        
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
        
    } catch (e) { 
        handleAIError(e, 'essay-loading-1', 'btn-essay-generate'); 
    } finally { 
        document.getElementById('essay-loading-1').style.display = 'none'; 
        startCooldown('btn-essay-generate', 5, t('es_create')); 
    }
}

async function gradeEssay() {
    const k = ensureApiKey(); 
    if (!k) return; 
    
    const m = document.getElementById('ai-model').value; 
    const t_val = document.getElementById('essay-context').value.trim(); 
    const userAnswer = document.getElementById('essay-user-answer').value.trim(); 
    const btn = document.getElementById('btn-essay-grade'); 
    const ld = document.getElementById('essay-loading-2');
    
    if (!userAnswer) return alert("Bạn chưa nhập câu trả lời nào cả!");
    
    const sys = `Đóng vai Giáo viên chấm thi Tự luận chuyên nghiệp, khắt khe nhưng tận tâm.\nNhiệm vụ: Dựa vào TÀI LIỆU GỐC, CÂU HỎI ĐÃ RA và CÂU TRẢ LỜI CỦA HỌC SINH. Hãy đánh giá theo:\n1. ĐIỂM SỐ: Chấm theo thang điểm 10 (Ví dụ: 8/10).\n2. NHẬN XÉT: Nêu rõ ưu điểm, khuyết điểm, ý trả lời sai/thiếu.\n3. ĐÁP ÁN CHUẨN: Đưa ra câu trả lời mẫu hoàn hảo và xúc tích.\nDùng thẻ Markdown (**chữ đậm**) để làm nổi bật. Công thức toán bọc trong $...$`;
    let usr = `--- CÂU HỎI TỪ GIÁO VIÊN ---\n${currentEssayGeneratedQuestions}\n\n--- CÂU TRẢ LỜI CỦA HỌC SINH ---\n${userAnswer}`; 
    if (t_val) usr = `--- TÀI LIỆU GỐC ---\n${t_val}\n\n` + usr;
    
    const promptParts = [{ text: usr }]; 
    if (essayAttachedFile) promptParts.push(essayAttachedFile); 
    
    btn.disabled = true; 
    ld.style.display = 'block';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                system_instruction: { parts: [{ text: sys }] }, 
                contents: [{ parts: promptParts }], 
                generationConfig: { temperature: 0.3 } 
            }) 
        });
        
        if (!res.ok) { 
            const errData = await res.json().catch(()=>({})); 
            throw new Error(errData.error ? errData.error.message : "Lỗi kết nối Gemini."); 
        }
        
        const data = await res.json(); 
        playSound('success'); 
        
        document.getElementById('essay-step-2').style.display = 'none'; 
        document.getElementById('essay-step-3').style.display = 'block'; 
        document.getElementById('essay-grading-result').innerHTML = parseText(data.candidates[0].content.parts[0].text); 
        
        let u = usersData[currentUser]; 
        if (u.level < 100) { 
            u.exp += 15; 
            u.level = Math.min(100, Math.floor(u.exp / 100) + 1); 
            saveDB(); 
        } 
        if (window.MathJax) MathJax.typesetPromise().catch(err => console.log(err));
        
    } catch (e) { 
        handleAIError(e, 'essay-loading-2', 'btn-essay-grade'); 
    } finally { 
        document.getElementById('essay-loading-2').style.display = 'none'; 
        startCooldown('btn-essay-grade', 10, t('es_submit')); 
    }
}

function resetEssay() { 
    document.getElementById('essay-step-3').style.display = 'none'; 
    document.getElementById('essay-step-2').style.display = 'none'; 
    document.getElementById('essay-step-1').style.display = 'block'; 
    essayAttachedFile = null; 
    document.getElementById('essay-file-status').style.display = 'none'; 
    document.getElementById('essay-context').value = ""; 
}

// Khởi chạy
initLogin();