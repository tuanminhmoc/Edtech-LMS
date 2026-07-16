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
    }

    function openDataCenter() {
        const modal = document.getElementById('data-center-modal');
        if (!modal) return;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        resetRestorePreview();
        refreshStorageStatus();
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
        resetRestorePreview
    };
    Object.assign(window, { openDataCenter, closeDataCenter, exportFullBackup, handleRestoreFile, confirmRestore, requestStoragePersistence });
})();
