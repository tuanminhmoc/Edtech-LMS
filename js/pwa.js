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
            navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
            return registration;
        } catch (error) {
            console.warn('Không thể đăng ký PWA:', error);
            return null;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', register, { once: true });
    else register();
    window.EdTechPWA = { register, get registration() { return registration; } };
})();
