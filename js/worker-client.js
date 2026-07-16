'use strict';

(function () {
    let worker = null;
    let sequence = 0;
    const pending = new Map();

    function getWorker() {
        if (!('Worker' in window)) return null;
        if (worker) return worker;
        try { worker = new Worker('js/workers/data-worker.js'); } catch (error) { console.warn('Không thể tạo Web Worker:', error); return null; }
        worker.onmessage = event => {
            const { id, ok, result, error, progress } = event.data || {};
            if (progress && pending.has(id)) {
                pending.get(id).onProgress?.(progress);
                return;
            }
            const task = pending.get(id);
            if (!task) return;
            pending.delete(id);
            if (ok) task.resolve(result);
            else task.reject(new Error(error || 'Worker task failed'));
        };
        worker.onerror = error => {
            console.warn('Data worker error:', error);
            pending.forEach(task => task.reject(new Error('Web Worker không thể xử lý tác vụ.')));
            pending.clear();
            worker?.terminate();
            worker = null;
        };
        return worker;
    }

    function run(type, payload, options = {}) {
        const instance = getWorker();
        if (!instance) return Promise.reject(new Error('Web Worker không được hỗ trợ.'));
        const id = `task-${Date.now()}-${++sequence}`;
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                pending.delete(id);
                reject(new Error('Tác vụ nền mất quá nhiều thời gian.'));
            }, options.timeout || 45000);
            pending.set(id, {
                resolve: value => { clearTimeout(timeout); resolve(value); },
                reject: error => { clearTimeout(timeout); reject(error); },
                onProgress: options.onProgress
            });
            instance.postMessage({ id, type, payload }, options.transfer || []);
        });
    }

    async function parseExcel(arrayBuffer, onProgress) {
        return run('parseExcel', { arrayBuffer }, { onProgress });
    }

    async function analyzeImport(raw, mode) {
        return run('analyzeImport', { raw, mode });
    }

    async function analyzeBackup(backup) {
        return run('analyzeBackup', { backup });
    }

    window.EdTechWorker = { run, parseExcel, analyzeImport, analyzeBackup };
})();
