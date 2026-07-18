'use strict';

(function () {
    function browserLabel() {
        const ua = navigator.userAgent;
        const match = ua.match(/(Edg|OPR|Chrome|CriOS|Firefox|FxiOS|Version)\/([\d.]+)/);
        const nameMap = { Edg: 'Edge', OPR: 'Opera', CriOS: 'Chrome iOS', FxiOS: 'Firefox iOS', Version: /Safari/.test(ua) ? 'Safari' : 'Browser' };
        return match ? `${nameMap[match[1]] || match[1]} ${match[2]}` : 'Không xác định';
    }

    async function collect() {
        const [estimate, logs] = await Promise.all([
            window.EdTechDB?.storageEstimate?.().catch(() => ({ usage: 0, quota: 0, persisted: false })),
            window.EdTechDB?.listErrorLogs?.(1).catch(() => [])
        ]);
        const registration = await navigator.serviceWorker?.getRegistration?.().catch(() => null);
        let indexedDBStatus = 'Hoạt động';
        try { await window.EdTechDB?.open?.(); } catch (_) { indexedDBStatus = 'Lỗi'; }
        return {
            version: window.EDTECH_APP_VERSION || 'unknown',
            browser: browserLabel(),
            serviceWorker: registration?.active ? 'Hoạt động' : registration?.waiting ? 'Chờ cập nhật' : 'Chưa hoạt động',
            indexedDB: indexedDBStatus,
            storage: Number(estimate?.usage) || 0,
            quota: Number(estimate?.quota) || 0,
            persisted: Boolean(estimate?.persisted),
            safeMode: Boolean(window.EdTechRecovery?.isSafeMode?.()),
            lastError: logs?.[0] || null,
            screen: document.body?.dataset?.screen || 'unknown',
            online: navigator.onLine
        };
    }

    function formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let value = Math.max(0, Number(bytes) || 0);
        let index = 0;
        while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
        return `${value.toFixed(index ? 1 : 0)} ${units[index]}`;
    }

    async function refreshDiagnosticPanel() {
        const report = await collect();
        const values = {
            'diagnostic-app-version': report.version,
            'diagnostic-browser': report.browser,
            'diagnostic-service-worker': report.serviceWorker,
            'diagnostic-indexeddb': report.indexedDB,
            'diagnostic-schema': String(window.EdTechDB?.DATA_SCHEMA_VERSION || 4),
            'diagnostic-storage': `${formatBytes(report.storage)} / ${formatBytes(report.quota)}`,
            'diagnostic-last-error': report.lastError ? `${report.lastError.message} · ${new Date(report.lastError.timestamp).toLocaleString('vi-VN')}` : 'Không có lỗi gần đây'
        };
        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        const safeButton = document.getElementById('safe-mode-toggle');
        if (safeButton) safeButton.textContent = report.safeMode ? 'Thoát Safe Mode' : 'Bật Safe Mode';
        return report;
    }

    function toggleSafeModeFromSettings() {
        if (window.EdTechRecovery?.isSafeMode?.()) window.EdTechRecovery.leaveSafeMode();
        else window.EdTechRecovery?.startSafeMode?.();
    }

    async function copyDiagnosticReport() {
        const report = await collect();
        const safeReport = {
            appVersion: report.version,
            browser: report.browser,
            serviceWorker: report.serviceWorker,
            indexedDB: report.indexedDB,
            storage: `${formatBytes(report.storage)} / ${formatBytes(report.quota)}`,
            persisted: report.persisted,
            safeMode: report.safeMode,
            screen: report.screen,
            online: report.online,
            lastError: report.lastError ? { message: report.lastError.message, source: report.lastError.source, timestamp: report.lastError.timestamp } : null
        };
        const content = JSON.stringify(safeReport, null, 2);
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(content);
        else {
            const textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
        window.showToast?.('Đã sao chép báo cáo chẩn đoán.', 'success');
    }

    window.EdTechDiagnostics = { collect, refreshDiagnosticPanel, copyDiagnosticReport, toggleSafeModeFromSettings };
    Object.assign(window, { refreshDiagnosticPanel, copyDiagnosticReport, toggleSafeModeFromSettings });
})();
