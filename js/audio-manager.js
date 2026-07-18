'use strict';

(function () {
    let context = null;
    let unlocked = false;
    let effectsEnabled = true;
    let musicEnabled = true;
    let musicVolume = .18;
    let currentScreen = 'dashboard-screen';
    const recent = new Map();
    const active = new Set();
    const MAX_ACTIVE = 16;
    const musicTracks = [
        'assets/audio/parts/calm-piano-00.webm',
        'assets/audio/parts/calm-piano-01.webm',
        'assets/audio/parts/calm-piano-02.webm',
        'assets/audio/parts/calm-piano-03.webm'
    ];
    let musicTrackIndex = 0;
    const music = new Audio(musicTracks[musicTrackIndex]);
    music.preload = 'auto';
    music.setAttribute('playsinline', '');
    music.setAttribute('webkit-playsinline', '');
    music.volume = musicVolume;
    music.playsInline = true;

    function loadMusicTrack(index, { preservePlayback = false } = {}) {
        const normalized = ((Number(index) || 0) % musicTracks.length + musicTracks.length) % musicTracks.length;
        const wasPlaying = preservePlayback && !music.paused;
        musicTrackIndex = normalized;
        music.src = musicTracks[musicTrackIndex];
        music.load();
        music.volume = Math.max(0, Math.min(1, musicVolume));
        if (wasPlaying) syncMusic();
    }

    function advanceMusicTrack() {
        loadMusicTrack((musicTrackIndex + 1) % musicTracks.length);
        syncMusic();
    }

    music.addEventListener('ended', advanceMusicTrack);

    function init() {
        if (context) return context;
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        context = new Context();
        return context;
    }

    function isStudyScreen(screen = currentScreen) {
        return screen === 'quiz-app' || screen === 'flashcard-app';
    }

    function introOpen() {
        const intro = document.getElementById('brand-intro');
        return Boolean(intro && !intro.hidden && !intro.classList.contains('is-leaving'));
    }

    async function syncMusic() {
        music.volume = Math.max(0, Math.min(1, musicVolume));
        const shouldPlay = unlocked && musicEnabled && !document.hidden && !isStudyScreen() && !introOpen();
        if (!shouldPlay) {
            if (!music.paused) music.pause();
            return false;
        }
        try {
            await music.play();
            return true;
        } catch (_) {
            return false;
        }
    }

    function unlockFromGesture() {
        const ctx = init();
        try { ctx?.resume?.(); } catch (_) {}
        unlocked = true;
        music.volume = Math.max(0, Math.min(1, musicVolume));
        const canPlay = musicEnabled && !document.hidden && !isStudyScreen() && !introOpen();
        if (canPlay) {
            const attempt = music.play();
            attempt?.catch?.(() => {});
        }
        return true;
    }

    async function unlock() {
        const ctx = init();
        if (ctx?.state === 'suspended') await ctx.resume().catch(() => {});
        unlocked = !ctx || ctx.state === 'running';
        await syncMusic();
        return unlocked;
    }

    function oscillator({ frequency, endFrequency = null, duration = .1, volume = .02, type = 'sine', delay = 0 }) {
        const ctx = init();
        if (!ctx || !effectsEnabled || !unlocked || document.hidden || active.size >= MAX_ACTIVE) return;
        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 16;
        compressor.ratio.value = 4;
        compressor.attack.value = .003;
        compressor.release.value = .12;
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(1, frequency), start);
        if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        osc.connect(gain);
        gain.connect(compressor);
        compressor.connect(ctx.destination);
        active.add(osc);
        osc.onended = () => active.delete(osc);
        osc.start(start);
        osc.stop(start + duration + .04);
    }

    const patterns = {
        press: [[112, .055, .032, 'triangle', 0, 88], [460, .045, .014, 'sine', .012]],
        navigate: [[150, .06, .024, 'triangle', 0, 118], [430, .075, .013, 'sine', .025]],
        select: [[124, .05, .027, 'triangle', 0, 96], [520, .05, .013, 'sine', .018]],
        flag: [[180, .075, .026, 'triangle', 0, 150], [620, .07, .012, 'triangle', .04]],
        flip: [[138, .08, .025, 'triangle', 0, 108], [480, .075, .014, 'sine', .035]],
        upload: [[160, .08, .027, 'triangle', 0, 126], [570, .1, .014, 'triangle', .055]],
        add: [[146, .06, .026, 'triangle', 0, 116], [690, .08, .013, 'sine', .03]],
        wrong: [[170, .13, .028, 'sawtooth', 0, 112], [210, .14, .015, 'triangle', .07]],
        delete: [[132, .08, .028, 'triangle', 0, 92], [220, .1, .012, 'triangle', .045]],
        start: [[104, .12, .026, 'triangle', 0, 82], [587, .14, .018, 'sine', .05], [740, .16, .017, 'sine', .14], [988, .18, .014, 'sine', .23]],
        success: [[120, .07, .024, 'triangle', 0, 95], [392, .12, .02, 'sine', .035], [523, .13, .018, 'sine', .11], [659, .18, .016, 'sine', .19]],
        complete: [[105, .08, .027, 'triangle', 0, 82], [440, .12, .018, 'sine', .04], [554, .14, .016, 'sine', .13], [698, .22, .014, 'sine', .23]],
        soft: [[120, .045, .018, 'triangle', 0, 100], [420, .05, .01, 'sine', .01]],
        themeDark: [[132, .09, .025, 'triangle', 0, 96], [494, .12, .016, 'sine', .06], [659, .15, .014, 'sine', .14]],
        themeLight: [[148, .08, .023, 'triangle', 0, 120], [523, .1, .013, 'sine', .055], [784, .12, .012, 'triangle', .13]],
        owl: [[118, .18, .027, 'triangle', 0, 82], [240, .22, .018, 'triangle', .1, 180], [310, .18, .015, 'triangle', .26, 260]],
        intro: [[96, .22, .022, 'triangle', 0, 72], [190, .24, .018, 'triangle', .12, 160], [260, .16, .014, 'triangle', .28, 220], [420, .08, .014, 'sine', .48], [560, .1, .013, 'sine', .58], [740, .14, .012, 'triangle', .72], [988, .18, .012, 'sine', .9], [1318, .2, .011, 'sine', 1.08]]
    };

    function play(name, { force = false } = {}) {
        if (!effectsEnabled || !unlocked || document.hidden) return false;
        const now = performance.now();
        const cooldown = name === 'press' || name === 'select' ? 38 : 85;
        if (!force && now - (recent.get(name) || 0) < cooldown) return false;
        recent.set(name, now);
        (patterns[name] || patterns.soft).forEach(([frequency, duration, volume, type, delay, endFrequency]) => oscillator({ frequency, endFrequency, duration, volume, type, delay }));
        return true;
    }

    function setEffectsEnabled(value) {
        effectsEnabled = Boolean(value);
        if (!effectsEnabled) active.forEach(osc => { try { osc.stop(); } catch (_) {} });
    }

    function setMusicEnabled(value) {
        musicEnabled = Boolean(value);
        syncMusic();
    }

    function setMusicVolume(value) {
        const numeric = Number(value);
        musicVolume = Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : .18;
        music.volume = musicVolume;
    }

    function setScreen(screenId) {
        currentScreen = screenId || 'dashboard-screen';
        syncMusic();
    }

    document.addEventListener('visibilitychange', syncMusic);
    window.addEventListener('pagehide', () => music.pause());

    window.EdTechAudio = {
        init,
        unlock,
        unlockFromGesture,
        play,
        syncMusic,
        setScreen,
        setEffectsEnabled,
        setMusicEnabled,
        setMusicVolume,
        setEnabled: setEffectsEnabled,
        get effectsEnabled() { return effectsEnabled; },
        get musicEnabled() { return musicEnabled; },
        get musicVolume() { return musicVolume; },
        get unlocked() { return unlocked; },
        get musicCurrentTime() { return music.currentTime || 0; },
        get musicTrackIndex() { return musicTrackIndex; },
        get musicTrackCount() { return musicTracks.length; }
    };
})();
