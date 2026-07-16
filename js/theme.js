'use strict';

(function () {
    const STORAGE_KEY = 'edtech_lms_pro_theme';
    let currentTheme = 'light';

    function resolveStoredTheme() {
        try { const stored = localStorage.getItem(STORAGE_KEY); return stored === 'dark' ? 'dark' : 'light'; } catch (_) { return 'light'; }
    }

    function updateMeta(theme) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = theme === 'dark' ? '#111a22' : '#f4f7f2';
    }

    function updateButton(theme) {
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        button.dataset.theme = theme;
        button.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
        button.title = theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối';
        const label = button.querySelector('.theme-toggle-label');
        if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }

    function applyTheme(theme, { animate = false, origin = null } = {}) {
        const next = theme === 'dark' ? 'dark' : 'light';
        const root = document.documentElement;
        const change = () => {
            root.dataset.theme = next;
            root.style.colorScheme = next;
            currentTheme = next;
            try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
            updateMeta(next);
            updateButton(next);
            window.EdTechDB?.setKV('theme', next).catch(() => {});
        };

        if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            change();
            return Promise.resolve();
        }

        const x = origin?.x ?? window.innerWidth - 48;
        const y = origin?.y ?? 48;
        root.style.setProperty('--theme-x', `${x}px`);
        root.style.setProperty('--theme-y', `${y}px`);

        if (document.startViewTransition) {
            const transition = document.startViewTransition(change);
            return transition.finished.catch(() => {});
        }

        const veil = document.createElement('div');
        veil.className = 'theme-transition-veil';
        veil.style.setProperty('--theme-x', `${x}px`);
        veil.style.setProperty('--theme-y', `${y}px`);
        document.body.appendChild(veil);
        requestAnimationFrame(() => veil.classList.add('active'));
        return new Promise(resolve => {
            setTimeout(() => {
                change();
                veil.classList.add('finish');
                setTimeout(() => {
                    veil.remove();
                    resolve();
                }, 380);
            }, 220);
        });
    }

    function toggleTheme(event) {
        const rect = event?.currentTarget?.getBoundingClientRect?.();
        const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
        const next = currentTheme === 'dark' ? 'light' : 'dark';
        window.playSound?.('navigate');
        return applyTheme(next, { animate: true, origin });
    }

    function init() {
        currentTheme = resolveStoredTheme();
        document.documentElement.dataset.theme = currentTheme;
        document.documentElement.style.colorScheme = currentTheme;
        updateMeta(currentTheme);
        updateButton(currentTheme);
    }

    init();
    window.EdTechTheme = { init, applyTheme, toggleTheme, get current() { return currentTheme; } };
    window.toggleTheme = toggleTheme;
})();
