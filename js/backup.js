'use strict';

(function () {
    let pendingBackup = null;
    let pendingSummary = null;

    function downloadJSON(value, filename) {
        const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    function formatBytes(bytes) {
        if (!Number.isFinite(Number(bytes))) return 'Không rõ';
        const units = ['B', 'KB', 'MB', 'GB'];
        let value = Number(bytes);
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit += 1;
        }
        return `${value.toFixed(unit ? 1 : 0)} ${units[unit]}`;
    }


    async function refreshDiagnostics() {
        const totalEl = document.getElementById('diag-total-storage');
        const mediaEl = document.getElementById('diag-media-storage');
        const largestEl = document.getElementById('diag-largest-set');
        const lastBackupEl = document.getElementById('diag-last-backup');
        const cleanableEl = document.getElementById('diag-cleanable');
        if (!totalEl && !mediaEl && !largestEl && !lastBackupEl && !cleanableEl) return;
        try {
            const [estimate, questionSets, media] = await Promise.all([
                window.EdTechDB.storageEstimate(),
                window.EdTechDB.listQuestionSets(),
                window.EdTechDB.listMedia ? window.EdTechDB.listMedia() : Promise.resolve([])
            ]);
            const totalUsage = Number(estimate.usage) || 0;
            const mediaBytes = (media || []).reduce((sum, item) => sum + (Number(item.size) || Number(item.blob?.size) || 0), 0);
            const largestSet = (questionSets || []).slice().sort((a, b) => Number(b.sizeBytes || 0) - Number(a.sizeBytes || 0))[0];
            const cleanable = mediaBytes * 0.15;
            if (totalEl) totalEl.textContent = formatBytes(totalUsage);
            if (mediaEl) mediaEl.textContent = formatBytes(mediaBytes);
            if (largestEl) largestEl.textContent = largestSet ? `${largestSet.name} · ${formatBytes(largestSet.sizeBytes || 0)}` : 'Chưa có';
            if (lastBackupEl) lastBackupEl.textContent = localStorage.getItem('edtech_last_backup_at') || 'Chưa có';
            if (cleanableEl) cleanableEl.textContent = formatBytes(cleanable);
        } catch (error) {
            if (totalEl) totalEl.textContent = 'Không đọc được';
            if (mediaEl) mediaEl.textContent = 'Không đọc được';
            if (largestEl) largestEl.textContent = 'Không đọc được';
            if (cleanableEl) cleanableEl.textContent = 'Không đọc được';
        }
    }

    async function optimizeStoredImages() {
        if (!window.EdTechDB?.listMedia) return window.showToast?.('Chưa hỗ trợ tối ưu ảnh trên trình duyệt này.', 'info');
        try {
            const items = await window.EdTechDB.listMedia();
            if (!items.length) {
                window.showToast?.('Không có ảnh nào để tối ưu.', 'info');
                return;
            }
            let saved = 0;
            for (const item of items) {
                if (!(item.blob instanceof Blob) || !/^image\//.test(item.type || '')) continue;
                const bitmap = await createImageBitmap(item.blob);
                const canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(bitmap, 0, 0);
                const nextBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.82));
                bitmap.close?.();
                if (nextBlob && nextBlob.size && nextBlob.size < item.blob.size * 0.96) {
                    saved += item.blob.size - nextBlob.size;
                    await window.EdTechDB.saveMedia({ ...item, blob: nextBlob, type: 'image/webp', size: nextBlob.size, width: canvas.width, height: canvas.height, createdAt: item.createdAt });
                }
            }
            window.showToast?.(saved > 0 ? `Đã tối ưu ảnh cũ, tiết kiệm ${formatBytes(saved)}.` : 'Ảnh hiện tại đã khá tối ưu.', saved > 0 ? 'success' : 'info');
            refreshStorageStatus();
            refreshDiagnostics();
        } catch (error) {
            window.showToast?.('Không thể tối ưu ảnh cũ.', 'error');
        }
    }

    async function clearAppCachesKeepData() {
        try {
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            }
            window.showToast?.('Đã xóa cache ứng dụng, dữ liệu học vẫn được giữ lại.', 'success');
            refreshStorageStatus();
            refreshDiagnostics();
        } catch (error) {
            window.showToast?.('Không thể xóa cache ứng dụng.', 'error');
        }
    }

    async function refreshStorageStatus() {
        const usage = document.getElementById('data-storage-usage');
        const persistent = document.getElementById('data-storage-persistent');
        const bar = document.getElementById('data-storage-bar');
        if (!usage || !persistent || !bar) return;
        try {
            const estimate = await window.EdTechDB.storageEstimate();
            usage.textContent = estimate.quota ? `${formatBytes(estimate.usage)} / ${formatBytes(estimate.quota)}` : formatBytes(estimate.usage);
            persistent.textContent = estimate.persisted ? 'Đã được trình duyệt bảo vệ tốt hơn' : 'Có thể bị trình duyệt thu hồi khi thiếu dung lượng';
            const percent = estimate.quota ? Math.min(100, (estimate.usage / estimate.quota) * 100) : 0;
            bar.style.width = `${percent}%`;
            document.getElementById('request-storage-persistence').hidden = estimate.persisted;
        } catch (error) {
            usage.textContent = 'Không thể đọc dung lượng';
            persistent.textContent = error.message;
        }
        refreshDiagnostics();
    }

    function openDataCenter() {
        const modal = document.getElementById('data-center-modal');
        if (!modal) return;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        resetRestorePreview();
        refreshStorageStatus();
        window.EdTechDiagnostics?.refreshDiagnosticPanel?.();
        setTimeout(() => modal.querySelector('button, input')?.focus(), 20);
    }

    function closeDataCenter() {
        const modal = document.getElementById('data-center-modal');
        if (!modal) return;
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        pendingBackup = null;
        pendingSummary = null;
    }

    async function exportFullBackup() {
        try {
            const backup = await window.EdTechDB.exportAll();
            const date = new Date().toISOString().slice(0, 10);
            downloadJSON(backup, `EdTech-LMS-Pro-Backup-${date}.json`);
            try { localStorage.setItem('edtech_last_backup_at', new Date().toLocaleString('vi-VN')); } catch (_) {}
            window.playSound?.('success');
            window.showToast?.('Đã xuất bản sao lưu toàn bộ dữ liệu.', 'success');
        } catch (error) {
            window.showToast?.(error.message || 'Không thể tạo bản sao lưu.', 'error');
        }
    }

    function resetRestorePreview() {
        pendingBackup = null;
        pendingSummary = null;
        const preview = document.getElementById('restore-preview');
        const button = document.getElementById('restore-confirm-btn');
        if (preview) {
            preview.hidden = true;
            preview.innerHTML = '';
        }
        if (button) button.disabled = true;
        const input = document.getElementById('restore-file-input');
        if (input) input.value = '';
    }

    async function handleRestoreFile(file) {
        if (!file) return;
        if (!/\.json$/i.test(file.name)) {
            window.showToast?.('Vui lòng chọn file sao lưu .json.', 'error');
            return;
        }
        try {
            const text = await file.text();
            const backup = JSON.parse(text);
            const summary = window.EdTechWorker
                ? await window.EdTechWorker.analyzeBackup(backup)
                : {
                    questionSets: backup.stores?.questionSets?.length || 0,
                    questions: (backup.stores?.questionSets || []).reduce((sum, item) => sum + (item.count || 0), 0),
                    history: backup.stores?.history?.length || 0,
                    media: backup.stores?.media?.length || 0,
                    appVersion: backup.appVersion || 'không rõ'
                };
            pendingBackup = backup;
            pendingSummary = summary;
            const preview = document.getElementById('restore-preview');
            preview.hidden = false;
            preview.innerHTML = `<strong>Đã đọc bản sao lưu</strong>
                <div class="restore-summary-grid">
                    <span><b>${summary.questionSets}</b><small>Bộ đề</small></span>
                    <span><b>${summary.questions}</b><small>Câu/thẻ</small></span>
                    <span><b>${summary.history}</b><small>Phiên học</small></span>
                    <span><b>${summary.media}</b><small>Hình ảnh</small></span>
                </div>
                <small>Phiên bản ứng dụng khi xuất: ${String(summary.appVersion)}</small>`;
            document.getElementById('restore-confirm-btn').disabled = false;
        } catch (error) {
            resetRestorePreview();
            window.showToast?.(error.message || 'Không thể đọc file sao lưu.', 'error');
        }
    }

    async function confirmRestore() {
        if (!pendingBackup) return;
        const mode = document.querySelector('input[name="restore-mode"]:checked')?.value || 'merge';
        const action = async () => {
            try {
                await window.EdTechDB.importAll(pendingBackup, mode);
                window.showToast?.('Đã khôi phục dữ liệu. Trang sẽ tải lại.', 'success');
                setTimeout(() => location.reload(), 700);
            } catch (error) {
                window.showToast?.(error.message || 'Không thể khôi phục dữ liệu.', 'error');
            }
        };
        if (mode === 'replace' && typeof window.openConfirmModal === 'function') {
            window.openConfirmModal('Thay thế toàn bộ dữ liệu?', 'Dữ liệu hiện có trên thiết bị sẽ được thay bằng bản sao lưu đã chọn.', 'Thay thế', action);
        } else action();
    }

    async function requestStoragePersistence() {
        try {
            const granted = await window.EdTechDB.requestPersistence();
            window.showToast?.(granted ? 'Trình duyệt đã cấp chế độ lưu trữ bền vững.' : 'Trình duyệt chưa cấp lưu trữ bền vững.', granted ? 'success' : 'info');
            refreshStorageStatus();
        } catch (error) {
            window.showToast?.('Không thể yêu cầu lưu trữ bền vững.', 'error');
        }
    }

    window.EdTechBackup = {
        openDataCenter,
        closeDataCenter,
        exportFullBackup,
        handleRestoreFile,
        confirmRestore,
        requestStoragePersistence,
        refreshStorageStatus,
        resetRestorePreview,
        refreshDiagnostics,
        optimizeStoredImages,
        clearAppCachesKeepData
    };
    Object.assign(window, { openDataCenter, closeDataCenter, exportFullBackup, handleRestoreFile, confirmRestore, requestStoragePersistence, optimizeStoredImages, clearAppCachesKeepData });
})();
