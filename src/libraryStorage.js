import { validateLibrary } from './snapshots.js';

export const LIBRARY_KEY = 'librimori_library_v1';
export const BACKEND_KEY = 'librimori_library_backend_v1';
const DB_NAME = 'librimori-library-v1';
const STORE = 'library';
const emptyLibrary = () => ({ books: [], goals: { yearly: 0, monthly: 0 }, manualStreakBonus: 0 });
const revision = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export class LibraryConflictError extends Error {
  constructor() {
    super('Библиотека изменилась в другой вкладке. Скачайте бэкап текущих изменений, затем обновите страницу.');
    this.name = 'LibraryConflictError';
  }
}

export function readLegacyLibrary(storage) {
  const envelope = storage.getItem(LIBRARY_KEY);
  if (envelope) {
    const parsed = JSON.parse(envelope);
    validateLibrary(parsed.data);
    return parsed;
  }
  const books = storage.getItem('warm_readingTrackerBooks_v21');
  const goals = storage.getItem('warm_readingTrackerGoals_v21');
  const bonus = storage.getItem('warm_readingTrackerStreakBonus_v21');
  const data = {
    books: books ? JSON.parse(books) : [],
    goals: goals ? JSON.parse(goals) : { yearly: 0, monthly: 0 },
    manualStreakBonus: bonus ? Number(bonus) : 0,
  };
  validateLibrary(data);
  return { data, revision: null };
}

// Each tab owns its expected revision. The read/check/write is a single IDB
// transaction, so a stale tab cannot silently replace a newer library.
export function createLibraryStorage(options = {}) {
  const getStorage = () => options.localStorage ?? globalThis.localStorage;
  const getIDB = () => options.indexedDB ?? globalThis.indexedDB;
  let database;
  let backend;
  let expectedRevision = null;
  let localBaseline;
  let initialPromise;
  let queue = Promise.resolve();

  const open = () => {
    if (!database) database = new Promise((resolve, reject) => {
      const idb = getIDB();
      if (!idb) { reject(new Error('IndexedDB недоступен.')); return; }
      let settled = false;
      const timer = setTimeout(() => { settled = true; reject(new Error('Хранилище не отвечает.')); }, 5000);
      let request;
      try { request = idb.open(DB_NAME, 1); }
      catch (error) { clearTimeout(timer); reject(error); return; }
      const fail = () => { clearTimeout(timer); settled = true; reject(request.error || new Error('Хранилище заблокировано.')); };
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onerror = fail;
      request.onblocked = fail;
      request.onsuccess = () => {
        clearTimeout(timer);
        if (settled) { request.result.close(); return; }
        const db = request.result;
        db.onversionchange = () => { db.close(); database = undefined; };
        resolve(db);
      };
    }).catch(error => { database = undefined; throw error; });
    return database;
  };

  const transaction = async (mode, operation) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      const request = store.get('current');
      let result;
      let failure;
      request.onsuccess = () => {
        try { result = operation(store, request.result); }
        catch (error) { failure = error; tx.abort(); }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure || tx.error || new Error('Запись отменена.'));
      tx.onerror = () => { failure ||= tx.error; };
    });
  };

  const rememberBackend = () => {
    try { getStorage().setItem(BACKEND_KEY, backend); } catch { /* IDB is already committed. */ }
  };

  const commit = async data => {
    validateLibrary(data);
    const envelope = { data, revision: revision(), savedAt: new Date().toISOString() };
    if (backend === 'indexeddb') {
      await transaction('readwrite', (store, current) => {
        if ((current?.revision ?? null) !== expectedRevision) throw new LibraryConflictError();
        store.put(envelope, 'current');
      });
    } else {
      const storage = getStorage();
      // localStorage fallback is only used when IDB has never held this library.
      // Recheck the exact baseline before replacing it.
      if (JSON.stringify(readLegacyLibrary(storage)) !== localBaseline) throw new LibraryConflictError();
      storage.setItem(LIBRARY_KEY, JSON.stringify(envelope));
      localBaseline = JSON.stringify(envelope);
    }
    expectedRevision = envelope.revision;
    rememberBackend();
    return envelope;
  };

  return {
    initialize() {
      if (!initialPromise) initialPromise = (async () => {
        let current;
        try {
          current = await transaction('readonly', (_, record) => record);
          backend = 'indexeddb';
        } catch (error) {
          // Never revive an old localStorage copy if the primary IDB cannot open.
          if (getStorage().getItem(BACKEND_KEY) === 'indexeddb') throw error;
          backend = 'localStorage';
        }
        if (current) {
          validateLibrary(current.data);
          expectedRevision = current.revision;
          rememberBackend();
          return { ...current, backend };
        }
        const legacy = readLegacyLibrary(getStorage());
        if (backend === 'localStorage') {
          localBaseline = JSON.stringify(legacy);
          expectedRevision = legacy.revision;
          // Do not duplicate the old, potentially full localStorage on startup.
          return { ...legacy, backend };
        }
        expectedRevision = null;
        const migrated = await commit(legacy.data || emptyLibrary());
        return { ...migrated, backend };
      })();
      return initialPromise;
    },
    save(data) {
      // Freeze at enqueue time; serialize writes even during quick repeated edits.
      const copy = JSON.parse(JSON.stringify(data));
      const pending = queue.then(() => commit(copy));
      queue = pending.catch(() => {});
      return pending;
    },
  };
}
