'use strict';

(function () {
    const SAFE_MODE_KEY = 'edtech_safe_mode';
    let fatalCount = 0;

    function isSafeMode() {
        const params = new URLSearchParams(location.search);
        return params.get('safeMode') === '1' || localStorage.getItem(SAFE_MODE_KEY) === '1';
    }

    function applySafeMode() {
        const enabled = isSafeMode();
        document.documentElement.dataset.safeMode = String(enabled);
        if (enabled) document.documentElement.classList.add('performance-lite');
        return enabled;
    }

    function openRecovery(reason = 'Ứng dụng gặp lỗi khi khởi động.', details = '') {
        const overlay = document.getElementById('app-recovery-overlay');
        if (!overlay) return;
        overlay.hidden = false;
        const message = overlay.querySelector('[data-recovery-message]');
        const detail = overlay.querySelector('[data-recovery-detail]');
        if (message) message.textContent = reason;
        if (detail) detail.textContent = String(details || '').slice(0, 800);
        document.body.classList.add('modal-open');
    }

    function closeRecovery() {
        const overlay = document.getElementById('app-recovery-overlay');
        if (overlay) overlay.hidden = true;
        document.body.classList.remove('modal-open');
    }

    async function recordError(error, source = '') {
        const normalized = error instanceof Error ? error : new Error(String(error || 'Unknown error'));
        try {
            await window.EdTechDB?.logError({
                message: normalized.message,
                stack: normalized.stack,
                source,
                screen: document.body?.dataset?.screen || ''
            });
        } catch (_) {
            try {
                localStorage.setItem('edtech_last_error', JSON.stringify({ message: normalized.message, source, timestamp: new Date().toISOString() }));
            } catch (_) {}
        }
    }

    async function emergencyBackup() {
        try {
            const payload = await window.EdTechDB.exportAll();
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `EdTech-Emergency-Backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
        } catch (error) {
            openRecovery('Không thể xuất backup khẩn cấp.', error.message);
        }
    }

    async function repairApplication() {
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            }
            const registrations = await navigator.serviceWorker?.getRegistrations?.() || [];
            await Promise.all(registrations.map(item => item.unregister()));
            location.reload();
        } catch (error) {
            openRecovery('Không thể sửa cache tự động.', error.message);
        }
    }

    async function restoreLatestSnapshot() {
        try {
            await window.EdTechDB.restoreLatestMigrationSnapshot();
            localStorage.removeItem(SAFE_MODE_KEY);
            location.reload();
        } catch (error) {
            openRecovery('Không thể khôi phục snapshot.', error.message);
        }
    }

    function startSafeMode() {
        localStorage.setItem(SAFE_MODE_KEY, '1');
        const url = new URL(location.href);
        url.searchParams.set('safeMode', '1');
        location.replace(url.href);
    }

    function leaveSafeMode() {
        localStorage.removeItem(SAFE_MODE_KEY);
        const url = new URL(location.href);
        url.searchParams.delete('safeMode');
        location.replace(url.href);
    }

    applySafeMode();

    window.addEventListener('error', event => {
        fatalCount += 1;
        recordError(event.error || event.message, event.filename || 'window.error');
        const startup = !document.documentElement.classList.contains('app-ready');
        if (startup && (fatalCount >= 2 || !document.querySelector('.app-screen'))) openRecovery('Ứng dụng gặp lỗi JavaScript.', event.message);
    });

    window.addEventListener('unhandledrejection', event => {
        fatalCount += 1;
        recordError(event.reason, 'unhandledrejection');
        const startup = !document.documentElement.classList.contains('app-ready');
        if (startup && fatalCount >= 2) openRecovery('Một tác vụ nền bị lỗi.', event.reason?.message || event.reason);
    });

    window.EdTechRecovery = {
        isSafeMode,
        openRecovery,
        closeRecovery,
        emergencyBackup,
        repairApplication,
        restoreLatestSnapshot,
        startSafeMode,
        leaveSafeMode,
        recordError
    };
    Object.assign(window, { closeRecovery, emergencyBackup, repairApplication, restoreLatestSnapshot, startSafeMode, leaveSafeMode });
})();
