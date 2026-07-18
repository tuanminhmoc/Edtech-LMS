'use strict';

(function () {
    const DB_NAME = 'EdTechLMSPro_DB';
    const DB_VERSION = 5;
    const DATA_SCHEMA_VERSION = 4;
    const STORES = {
        kv: { keyPath: 'key' },
        questionSets: { keyPath: 'id', indexes: [['updatedAt', 'updatedAt'], ['type', 'type']] },
        drafts: { keyPath: 'id', indexes: [['updatedAt', 'updatedAt'], ['type', 'type']] },
        history: { keyPath: 'id', indexes: [['timestamp', 'timestamp'], ['mode', 'mode']] },
        flashcardProgress: { keyPath: 'id', indexes: [['deckKey', 'deckKey'], ['dueAt', 'dueAt']] },
        media: { keyPath: 'id', indexes: [['updatedAt', 'updatedAt']] },
        activeSessions: { keyPath: 'id', indexes: [['updatedAt', 'updatedAt'], ['type', 'type']] },
        migrationSnapshots: { keyPath: 'id', indexes: [['createdAt', 'createdAt'], ['toVersion', 'toVersion']] },
        errorLogs: { keyPath: 'id', indexes: [['timestamp', 'timestamp'], ['level', 'level']] }
    };

    let dbPromise = null;

    function requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
        });
    }

    function transactionDone(transaction) {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed'));
            transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'));
        });
    }

    function open() {
        if (!('indexedDB' in window)) return Promise.reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'));
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = event => {
                const database = request.result;
                const transaction = request.transaction;
                Object.entries(STORES).forEach(([name, config]) => {
                    let store;
                    if (!database.objectStoreNames.contains(name)) {
                        store = database.createObjectStore(name, { keyPath: config.keyPath });
                    } else {
                        store = transaction.objectStore(name);
                    }
                    (config.indexes || []).forEach(([indexName, keyPath]) => {
                        if (!store.indexNames.contains(indexName)) store.createIndex(indexName, keyPath, { unique: false });
                    });
                });
                if (event.oldVersion < 4 && database.objectStoreNames.contains('sessions') && !database.objectStoreNames.contains('activeSessions')) {
                    // Kept for compatibility with experimental builds; no destructive migration is performed.
                }
            };
            request.onsuccess = () => {
                const database = request.result;
                database.onversionchange = () => database.close();
                resolve(database);
            };
            request.onerror = () => reject(request.error || new Error('Không thể mở IndexedDB.'));
            request.onblocked = () => console.warn('IndexedDB upgrade is blocked by another tab.');
        });
        return dbPromise;
    }

    async function get(storeName, key) {
        const db = await open();
        const tx = db.transaction(storeName, 'readonly');
        return requestToPromise(tx.objectStore(storeName).get(key));
    }

    async function put(storeName, value) {
        const db = await open();
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        await transactionDone(tx);
        return value;
    }

    async function bulkPut(storeName, values) {
        const items = Array.isArray(values) ? values : [];
        if (!items.length) return [];
        const db = await open();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach(value => store.put(value));
        await transactionDone(tx);
        return items;
    }

    async function remove(storeName, key) {
        const db = await open();
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(key);
        await transactionDone(tx);
    }

    async function clear(storeName) {
        const db = await open();
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        await transactionDone(tx);
    }

    async function getAll(storeName) {
        const db = await open();
        const tx = db.transaction(storeName, 'readonly');
        return requestToPromise(tx.objectStore(storeName).getAll());
    }

    async function count(storeName) {
        const db = await open();
        const tx = db.transaction(storeName, 'readonly');
        return requestToPromise(tx.objectStore(storeName).count());
    }

    async function getAllByIndex(storeName, indexName, query = null) {
        const db = await open();
        const tx = db.transaction(storeName, 'readonly');
        const index = tx.objectStore(storeName).index(indexName);
        return requestToPromise(index.getAll(query));
    }

    async function setKV(key, value) {
        return put('kv', { key, value, updatedAt: new Date().toISOString() });
    }

    async function getKV(key, fallback = null) {
        const record = await get('kv', key);
        return record ? record.value : fallback;
    }

    async function migrateLegacy(keys = {}) {
        const migrationFlag = await getKV('migration.localStorage.v1', false).catch(() => false);
        if (migrationFlag) return;
        const learningKey = keys.learningKey;
        const creatorKey = keys.creatorKey;
        const preferenceKey = keys.preferenceKey;
        const recoveryKey = keys.recoveryKey;
        try {
            if (learningKey) {
                const raw = localStorage.getItem(learningKey);
                if (raw) {
                    const learning = JSON.parse(raw);
                    await setKV('learning', learning);
                    if (Array.isArray(learning.history)) await bulkPut('history', learning.history.filter(item => item && item.id));
                }
            }
            if (creatorKey) {
                const raw = localStorage.getItem(creatorKey);
                if (raw) await setKV('creatorDrafts', JSON.parse(raw));
            }
            if (preferenceKey) {
                const raw = localStorage.getItem(preferenceKey);
                if (raw) await setKV('preferences', JSON.parse(raw));
            }
            if (recoveryKey) {
                const raw = localStorage.getItem(recoveryKey);
                if (raw !== null) await setKV('creatorRecovery', raw === '1');
            }
            await setKV('migration.localStorage.v1', true);
        } catch (error) {
            console.warn('Không thể di chuyển toàn bộ dữ liệu cũ:', error);
        }
    }


    function estimateJSONSize(value) {
        try { return new Blob([JSON.stringify(value)]).size; } catch (_) { return 0; }
    }

    async function createMigrationSnapshot(fromVersion, toVersion) {
        const payload = {};
        for (const storeName of ['kv', 'questionSets', 'drafts', 'history', 'flashcardProgress', 'activeSessions']) {
            payload[storeName] = await getAll(storeName).catch(() => []);
        }
        const snapshot = {
            id: `migration-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fromVersion: Number(fromVersion) || 0,
            toVersion: Number(toVersion) || DATA_SCHEMA_VERSION,
            createdAt: new Date().toISOString(),
            payload
        };
        await put('migrationSnapshots', snapshot);
        const snapshots = (await getAll('migrationSnapshots')).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
        await Promise.all(snapshots.slice(5).map(item => remove('migrationSnapshots', item.id)));
        return snapshot;
    }

    function normalizeQuestionSet(record) {
        const rows = Array.isArray(record?.rows) ? record.rows : [];
        return {
            ...record,
            id: record?.id || `set-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: String(record?.name || 'Bộ đề chưa đặt tên'),
            type: record?.type === 'flashcard' ? 'flashcard' : 'quiz',
            rows,
            count: Number.isFinite(Number(record?.count)) ? Math.max(0, Number(record.count)) : Math.max(0, rows.length - 1),
            createdAt: record?.createdAt || new Date().toISOString(),
            updatedAt: record?.updatedAt || new Date().toISOString(),
            source: record?.source || 'local',
            favorite: Boolean(record?.favorite),
            pinned: Boolean(record?.pinned),
            archived: Boolean(record?.archived),
            playCount: Math.max(0, Number(record?.playCount) || 0),
            bestScore: Math.max(0, Number(record?.bestScore) || 0),
            wrongCount: Math.max(0, Number(record?.wrongCount) || 0),
            lastPlayed: record?.lastPlayed || '',
            sizeBytes: Math.max(0, Number(record?.sizeBytes) || estimateJSONSize(rows))
        };
    }

    async function ensureDataSchema() {
        const currentVersion = Number(await getKV('dataSchemaVersion', 1).catch(() => 1)) || 1;
        if (currentVersion >= DATA_SCHEMA_VERSION) return { migrated: false, version: currentVersion };
        await createMigrationSnapshot(currentVersion, DATA_SCHEMA_VERSION);
        const sets = await getAll('questionSets').catch(() => []);
        if (sets.length) await bulkPut('questionSets', sets.map(normalizeQuestionSet));
        const history = await getAll('history').catch(() => []);
        if (history.length) {
            await bulkPut('history', history.map(item => ({
                ...item,
                mode: item?.mode === 'flashcard' ? 'flashcard' : 'quiz',
                timestamp: item?.timestamp || new Date().toISOString()
            })));
        }
        await setKV('dataSchemaVersion', DATA_SCHEMA_VERSION);
        await setKV('lastMigrationAt', new Date().toISOString());
        return { migrated: true, fromVersion: currentVersion, version: DATA_SCHEMA_VERSION };
    }

    async function listMigrationSnapshots() {
        return (await getAll('migrationSnapshots')).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    }

    async function restoreLatestMigrationSnapshot() {
        const snapshot = (await listMigrationSnapshots())[0];
        if (!snapshot?.payload) throw new Error('Không có snapshot migration để khôi phục.');
        for (const storeName of ['kv', 'questionSets', 'drafts', 'history', 'flashcardProgress', 'activeSessions']) {
            await clear(storeName);
            const records = Array.isArray(snapshot.payload[storeName]) ? snapshot.payload[storeName] : [];
            if (records.length) await bulkPut(storeName, records);
        }
        return snapshot;
    }

    async function logError(entry = {}) {
        const normalized = {
            id: entry.id || `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            level: entry.level || 'error',
            message: String(entry.message || 'Unknown error').slice(0, 1200),
            source: String(entry.source || '').slice(0, 500),
            stack: String(entry.stack || '').slice(0, 4000),
            screen: String(entry.screen || '').slice(0, 120),
            appVersion: window.EDTECH_APP_VERSION || '',
            timestamp: entry.timestamp || new Date().toISOString()
        };
        await put('errorLogs', normalized);
        const logs = (await getAll('errorLogs')).sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
        await Promise.all(logs.slice(50).map(item => remove('errorLogs', item.id)));
        return normalized;
    }

    async function listErrorLogs(limit = 20) {
        const logs = (await getAll('errorLogs')).sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
        return logs.slice(0, Math.max(1, Number(limit) || 20));
    }

    async function bootstrap(keys = {}) {
        await open();
        await migrateLegacy(keys);
        const migration = await ensureDataSchema();
        const [learning, creatorDrafts, preferences, creatorRecovery] = await Promise.all([
            getKV('learning', null),
            getKV('creatorDrafts', null),
            getKV('preferences', null),
            getKV('creatorRecovery', null)
        ]);
        return { learning, creatorDrafts, preferences, creatorRecovery, migration };
    }

    async function syncLearning(learning) {
        await setKV('learning', learning);
        if (Array.isArray(learning?.history)) {
            await clear('history');
            await bulkPut('history', learning.history.filter(item => item && item.id));
        }
        return learning;
    }

    async function saveCreatorDrafts(drafts, recovery = true) {
        await Promise.all([
            setKV('creatorDrafts', drafts),
            setKV('creatorRecovery', Boolean(recovery)),
            put('drafts', { id: 'creator-main', type: 'creator', payload: drafts, updatedAt: new Date().toISOString() })
        ]);
    }

    async function savePreferences(preferences) {
        return setKV('preferences', preferences);
    }

    async function saveQuestionSet(record) {
        const rows = Array.isArray(record.rows) ? record.rows : [];
        const estimatedSize = Number(record.sizeBytes) || new Blob([JSON.stringify(rows)]).size;
        const normalized = normalizeQuestionSet({ ...record, rows, sizeBytes: estimatedSize, updatedAt: new Date().toISOString() });
        await put('questionSets', normalized);
        return normalized;
    }

    async function listQuestionSets() {
        const items = await getAll('questionSets');
        return items.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    }

    async function storageEstimate() {
        if (!navigator.storage?.estimate) return { usage: null, quota: null, persisted: false };
        const [estimate, persisted] = await Promise.all([
            navigator.storage.estimate(),
            navigator.storage.persisted ? navigator.storage.persisted() : Promise.resolve(false)
        ]);
        return { usage: estimate.usage || 0, quota: estimate.quota || 0, persisted };
    }

    async function requestPersistence() {
        if (!navigator.storage?.persist) return false;
        return navigator.storage.persist();
    }

    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
        });
    }

    function dataURLToBlob(dataURL) {
        const [header, body] = String(dataURL || '').split(',');
        const type = /data:([^;]+)/.exec(header || '')?.[1] || 'application/octet-stream';
        const bytes = atob(body || '');
        const array = new Uint8Array(bytes.length);
        for (let index = 0; index < bytes.length; index += 1) array[index] = bytes.charCodeAt(index);
        return new Blob([array], { type });
    }


    async function saveMedia(record) {
        const normalized = {
            id: record.id || `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: String(record.name || 'image.webp'),
            type: String(record.type || record.blob?.type || 'image/webp'),
            size: Number(record.size || record.blob?.size || 0),
            width: Number(record.width || 0),
            height: Number(record.height || 0),
            blob: record.blob instanceof Blob ? record.blob : null,
            createdAt: record.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (!(normalized.blob instanceof Blob)) throw new Error('Dữ liệu ảnh không hợp lệ.');
        await put('media', normalized);
        return normalized;
    }

    async function getMedia(id) {
        return get('media', id);
    }

    async function listMedia() {
        return getAll('media');
    }

    async function deleteMedia(id) {
        return remove('media', id);
    }

    async function exportAll() {
        const stores = {};
        for (const storeName of Object.keys(STORES)) {
            const records = await getAll(storeName);
            if (storeName === 'media') {
                stores[storeName] = await Promise.all(records.map(async record => ({
                    ...record,
                    blob: undefined,
                    dataURL: record.blob instanceof Blob ? await blobToDataURL(record.blob) : record.dataURL || null
                })));
            } else stores[storeName] = records;
        }
        return {
            format: 'EdTechLMSProBackup',
            schemaVersion: DATA_SCHEMA_VERSION,
            databaseVersion: DB_VERSION,
            appVersion: window.EDTECH_APP_VERSION || '1.0.0',
            exportedAt: new Date().toISOString(),
            stores
        };
    }

    async function importAll(backup, mode = 'merge') {
        if (!backup || backup.format !== 'EdTechLMSProBackup' || !backup.stores) throw new Error('File sao lưu không đúng định dạng EdTech LMS Pro.');
        const storeNames = Object.keys(STORES);
        if (mode === 'replace') {
            for (const storeName of storeNames) await clear(storeName);
        }
        for (const storeName of storeNames) {
            let records = Array.isArray(backup.stores[storeName]) ? backup.stores[storeName] : [];
            if (storeName === 'media') records = records.map(record => ({ ...record, blob: record.dataURL ? dataURLToBlob(record.dataURL) : record.blob, dataURL: undefined }));
            if (records.length) await bulkPut(storeName, records);
        }
        return true;
    }

    async function clearApplicationData() {
        for (const storeName of Object.keys(STORES)) await clear(storeName);
    }

    async function clearLearningData() {
        for (const storeName of ['questionSets', 'drafts', 'history', 'flashcardProgress', 'media', 'activeSessions']) await clear(storeName);
        await setKV('learning', { history: [], xp: 0, reviewedCards: 0, flashcards: {} });
        await setKV('creatorDrafts', { quiz: [], flashcard: [] });
        await setKV('creatorRecovery', false);
    }


    window.EdTechDB = {
        DB_NAME,
        DB_VERSION,
        DATA_SCHEMA_VERSION,
        STORES: Object.keys(STORES),
        open,
        get,
        put,
        bulkPut,
        delete: remove,
        clear,
        getAll,
        count,
        getAllByIndex,
        setKV,
        getKV,
        bootstrap,
        syncLearning,
        saveCreatorDrafts,
        savePreferences,
        saveQuestionSet,
        listQuestionSets,
        saveMedia,
        getMedia,
        listMedia,
        deleteMedia,
        storageEstimate,
        requestPersistence,
        exportAll,
        importAll,
        clearApplicationData,
        clearLearningData,
        ensureDataSchema,
        createMigrationSnapshot,
        listMigrationSnapshots,
        restoreLatestMigrationSnapshot,
        logError,
        listErrorLogs
    };
})();
