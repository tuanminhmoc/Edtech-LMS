'use strict';

(function () {
    let context = null;
    let unlocked = false;
    let enabled = true;
    const recent = new Map();
    const active = new Set();
    const MAX_ACTIVE = 10;

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
        navigate: [[330, .07, .02, 'sine', 0], [440, .09, .016, 'sine', .04]],
        select: [[520, .065, .018, 'sine', 0]],
        flag: [[420, .08, .018, 'triangle', 0], [620, .08, .016, 'triangle', .05]],
        flip: [[240, .08, .018, 'sine', 0], [480, .1, .016, 'sine', .04]],
        upload: [[380, .08, .022, 'triangle', 0], [570, .1, .018, 'triangle', .06]],
        add: [[460, .06, .019, 'sine', 0], [690, .08, .016, 'sine', .035]],
        wrong: [[280, .13, .022, 'triangle', 0], [210, .16, .018, 'triangle', .08]],
        delete: [[330, .08, .018, 'triangle', 0], [220, .12, .016, 'triangle', .05]],
        start: [[330, .1, .02, 'sine', 0], [440, .1, .02, 'sine', .07], [660, .14, .017, 'sine', .14]],
        success: [[392, .12, .023, 'sine', 0], [523, .13, .021, 'sine', .08], [659, .18, .019, 'sine', .16]],
        complete: [[330, .12, .02, 'sine', 0], [440, .15, .018, 'sine', .09]],
        soft: [[420, .05, .014, 'sine', 0]],
        intro: [[155, .28, .048, 'sine', 0, 360], [480, .11, .038, 'triangle', .19], [420, .24, .043, 'sine', .38, 820], [980, .18, .03, 'sine', .54]]
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
