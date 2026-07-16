'use strict';

(function () {
    let context = null;
    let unlocked = false;
    let enabled = true;
    const recent = new Map();
    const active = new Set();
    const MAX_ACTIVE = 12;

    function init() {
        if (context) return context;
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        context = new Context();
        return context;
    }

    async function unlock() {
        const ctx = init();
        if (!ctx) return false;
        if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
        unlocked = ctx.state === 'running';
        return unlocked;
    }

    function oscillator({ frequency, endFrequency = null, duration = .1, volume = .02, type = 'sine', delay = 0 }) {
        const ctx = init();
        if (!ctx || !enabled || !unlocked || document.hidden || active.size >= MAX_ACTIVE) return;
        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(Math.max(1, frequency), start);
        if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        active.add(osc);
        osc.onended = () => active.delete(osc);
        osc.start(start);
        osc.stop(start + duration + .04);
    }

    const patterns = {
        navigate: [[330, .06, .014, 'sine', 0], [430, .08, .012, 'sine', .035]],
        select: [[520, .055, .014, 'sine', 0]],
        flag: [[420, .08, .015, 'triangle', 0], [620, .07, .012, 'triangle', .05]],
        flip: [[240, .08, .015, 'sine', 0], [480, .08, .013, 'sine', .04]],
        upload: [[380, .08, .016, 'triangle', 0], [570, .1, .014, 'triangle', .06]],
        add: [[460, .06, .015, 'sine', 0], [690, .08, .013, 'sine', .035]],
        wrong: [[280, .13, .018, 'triangle', 0], [210, .16, .014, 'triangle', .08]],
        delete: [[330, .08, .014, 'triangle', 0], [220, .11, .012, 'triangle', .05]],
        start: [[587, .14, .018, 'sine', 0], [740, .16, .017, 'sine', .09], [988, .18, .015, 'sine', .18]],
        success: [[392, .12, .02, 'sine', 0], [523, .13, .018, 'sine', .08], [659, .18, .016, 'sine', .16]],
        complete: [[440, .12, .018, 'sine', 0], [554, .14, .016, 'sine', .09], [698, .22, .014, 'sine', .19]],
        soft: [[420, .05, .011, 'sine', 0]],
        themeDark: [[330, .09, .017, 'triangle', 0, 300], [494, .12, .016, 'sine', .07], [659, .15, .014, 'sine', .15]],
        themeLight: [[392, .08, .015, 'sine', 0], [523, .1, .013, 'sine', .06], [784, .12, .012, 'triangle', .14]],
        owl: [[240, .22, .02, 'triangle', 0, 180], [310, .18, .016, 'triangle', .18, 260]],
        intro: [
            [190, .24, .018, 'triangle', 0, 160],
            [260, .16, .014, 'triangle', .14, 220],
            [420, .08, .014, 'sine', .34],
            [560, .1, .013, 'sine', .42],
            [740, .14, .012, 'triangle', .51],
            [988, .18, .012, 'sine', .64],
            [1318, .2, .011, 'sine', .78]
        ]
    };

    function play(name, { force = false } = {}) {
        if (!enabled || !unlocked || document.hidden) return false;
        const now = performance.now();
        const cooldown = name === 'select' ? 45 : 90;
        if (!force && now - (recent.get(name) || 0) < cooldown) return false;
        recent.set(name, now);
        const pattern = patterns[name] || patterns.soft;
        pattern.forEach(([frequency, duration, volume, type, delay, endFrequency]) => oscillator({ frequency, endFrequency, duration, volume, type, delay }));
        return true;
    }

    function setEnabled(value) {
        enabled = Boolean(value);
        if (!enabled) active.forEach(osc => { try { osc.stop(); } catch (_) {} });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) active.forEach(osc => { try { osc.stop(); } catch (_) {} });
    });

    window.EdTechAudio = { init, unlock, play, setEnabled, get enabled() { return enabled; }, get unlocked() { return unlocked; } };
})();
