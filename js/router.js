'use strict';

(function () {
    const SCREEN_TO_ROUTE = {
        'dashboard-screen': 'home',
        'upload-screen': 'practice',
        'quiz-app': 'quiz',
        'quiz-result-screen': 'result',
        'flashcard-app': 'flashcards',
        'flashcard-result-screen': 'flashcard-result',
        'creator-screen': 'creator',
        'history-screen': 'history'
    };
    const ROUTE_TO_SCREEN = Object.fromEntries(Object.entries(SCREEN_TO_ROUTE).map(([screen, route]) => [route, screen]));
    let suppress = false;

    function currentRoute() {
        return location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
    }

    function syncScreen(screenId, { replace = false } = {}) {
        if (suppress) return;
        const route = SCREEN_TO_ROUTE[screenId] || 'home';
        const hash = `#${route}`;
        if (location.hash === hash) return;
        if (replace) history.replaceState(null, '', hash);
        else history.pushState(null, '', hash);
    }

    function applyRoute() {
        if (typeof window.showScreen !== 'function') return;
        const route = currentRoute();
        const screen = ROUTE_TO_SCREEN[route] || 'dashboard-screen';
        suppress = true;
        try {
            if (screen === 'creator-screen' && typeof window.openCreator === 'function') window.openCreator();
            else if (screen === 'history-screen' && typeof window.showHistoryScreen === 'function') window.showHistoryScreen();
            else if (screen === 'upload-screen' && typeof window.openPracticeSetup === 'function') window.openPracticeSetup();
            else if (['quiz-app', 'flashcard-app'].includes(screen)) {
                // Active study screens are restored from IndexedDB; do not open an empty shell.
                const active = document.querySelector('.app-screen.active')?.id;
                if (!['quiz-app', 'flashcard-app'].includes(active)) window.showScreen('dashboard-screen', { skipRoute: true });
            } else window.showScreen(screen, { skipRoute: true });
        } finally {
            suppress = false;
        }
    }

    window.addEventListener('hashchange', applyRoute);
    window.EdTechRouter = { SCREEN_TO_ROUTE, ROUTE_TO_SCREEN, currentRoute, syncScreen, applyRoute };
})();
