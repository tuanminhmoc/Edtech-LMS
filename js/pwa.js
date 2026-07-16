'use strict';

(function () {
    let registration = null;

    function showUpdateBanner(worker) {
        const banner = document.getElementById('app-update-banner');
        if (!banner) return;
        banner.hidden = false;
        banner.querySelector('[data-update-now]')?.addEventListener('click', () => worker.postMessage({ type: 'SKIP_WAITING' }), { once: true });
        banner.querySelector('[data-update-later]')?.addEventListener('click', () => { banner.hidden = true; }, { once: true });
    }

    async function register() {
        if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
        try {
            registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
            if (registration.waiting) showUpdateBanner(registration.waiting);
            registration.addEventListener('updatefound', () => {
                const installing = registration.installing;
                installing?.addEventListener('statechange', () => {
                    if (installing.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(installing);
                });
            });
            navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
        } catch (error) {
            console.warn('Không thể đăng ký PWA:', error);
        }
    }

    window.addEventListener('load', register, { once: true });
    window.EdTechPWA = { register, get registration() { return registration; } };
})();
