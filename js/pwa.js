'use strict';

(function () {
    let registration = null;
    let waitingWorker = null;
    let reloadRequested = false;

    function isStudyActive() {
        return ['quiz-app', 'flashcard-app'].includes(document.body?.dataset?.screen || '');
    }

    async function persistStudySession() {
        try {
            if (document.body?.dataset?.screen === 'quiz-app') await window.persistActiveQuizSession?.(true);
            if (document.body?.dataset?.screen === 'flashcard-app') await window.persistActiveFlashcardSession?.();
        } catch (error) {
            console.warn('Không thể lưu phiên trước cập nhật:', error);
        }
    }

    function showUpdateBanner(worker) {
        waitingWorker = worker;
        const banner = document.getElementById('app-update-banner');
        if (!banner) return;
        banner.hidden = false;
        banner.dataset.studyActive = String(isStudyActive());
        const description = banner.querySelector('p, small');
        if (description) {
            description.textContent = isStudyActive()
                ? 'Bản mới đã sẵn sàng. Phiên học sẽ được lưu trước khi cập nhật.'
                : 'Bản mới đã sẵn sàng. Bạn chủ động chọn thời điểm cập nhật.';
        }
        const updateNow = banner.querySelector('[data-update-now]');
        const updateLater = banner.querySelector('[data-update-later]');
        if (updateNow) updateNow.onclick = applyUpdate;
        if (updateLater) updateLater.onclick = () => { banner.hidden = true; };
    }

    async function applyUpdate() {
        if (!waitingWorker) return;
        await persistStudySession();
        reloadRequested = true;
        sessionStorage.setItem('edtech_restore_after_update', document.body?.dataset?.screen || 'dashboard-screen');
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }

    async function checkForUpdates() {
        const current = registration || await register();
        await current?.update?.();
        if (current?.waiting) showUpdateBanner(current.waiting);
        return current;
    }

    async function repair() {
        await persistStudySession();
        if (isStudyActive()) sessionStorage.setItem('edtech_restore_after_update', document.body?.dataset?.screen || 'dashboard-screen');
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
        }
        const registrations = await navigator.serviceWorker?.getRegistrations?.() || [];
        await Promise.all(registrations.map(item => item.unregister()));
        reloadRequested = true;
        location.reload();
    }

    async function register() {
        if (registration) return registration;
        if (!('serviceWorker' in navigator) || location.protocol === 'file:') return null;
        try {
            registration = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
            if (registration.waiting) showUpdateBanner(registration.waiting);
            registration.addEventListener('updatefound', () => {
                const installing = registration.installing;
                installing?.addEventListener('statechange', () => {
                    if (installing.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(installing);
                });
            });
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (reloadRequested) location.reload();
                else if (registration?.waiting) showUpdateBanner(registration.waiting);
            });
            window.addEventListener('online', () => registration?.update?.().catch(() => {}));
            return registration;
        } catch (error) {
            console.warn('Không thể đăng ký PWA:', error);
            window.EdTechRecovery?.recordError?.(error, 'pwa.register');
            return null;
        }
    }

    register();
    window.EdTechPWA = { register, checkForUpdates, applyUpdate, repair, get registration() { return registration; } };
    window.repairApplication = repair;
})();
