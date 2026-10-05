const DB_NAME = 'librimori-snapshots-v1';
const STORE = 'snapshots';
let database;

export function validateLibrary(data) {
  if (!data || !Array.isArray(data.books) || data.books.some(book =>
    !book || typeof book !== 'object' || Array.isArray(book) || book.id == null
  )) throw new Error('В файле нет корректной библиотеки книг.');
  if (data.goals != null && (typeof data.goals !== 'object' || Array.isArray(data.goals) ||
    !['yearly', 'monthly'].every(key => Number.isFinite(data.goals[key])))) {
    throw new Error('В файле некорректные цели чтения.');
  }
  if (data.manualStreakBonus != null && !Number.isFinite(data.manualStreakBonus)) {
    throw new Error('В файле некорректная серия чтения.');
  }
  return data;
}

export function snapshotDay(now) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function planSnapshot(records, data, kind = 'daily', now = new Date()) {
  validateLibrary(data);
  const day = snapshotDay(now);
  const sorted = [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (kind === 'daily') {
    if (records.some(item => item.kind === 'daily' && item.day === day)) return null;
    const previous = sorted[0];
    if (previous && JSON.stringify(previous.data) === JSON.stringify(data)) return null;
    if (!previous && !data.books.length && !data.goals.yearly && !data.goals.monthly && !data.manualStreakBonus) return null;
  }
  const createdAt = now.toISOString();
  const record = { id: `${kind}-${createdAt}-${Math.random().toString(36).slice(2)}`, kind, day, createdAt, data };
  const next = [record, ...sorted];
  const daily = next.filter(item => item.kind === 'daily').slice(0, 7);
  const safety = next.filter(item => item.kind !== 'daily').slice(0, 3);
  const keep = new Set([...daily, ...safety].map(item => item.id));
  return { record, remove: records.filter(item => !keep.has(item.id)).map(item => item.id) };
}

function openDatabase() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); database = undefined; };
      resolve(db);
    };
    request.onerror = () => { database = undefined; reject(request.error); };
    request.onblocked = () => { database = undefined; reject(new Error('Закройте другие вкладки LibriMori и попробуйте снова.')); };
  });
  return database;
}

export async function listSnapshots() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAll();
    tx.oncomplete = () => resolve(request.result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveSnapshot(data, kind = 'daily') {
  // Freeze the caller's state before waiting for the database.
  const copy = JSON.parse(JSON.stringify(data));
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.getAll();
    let record = null;
    request.onsuccess = () => {
      try {
        const plan = planSnapshot(request.result, copy, kind);
        if (plan) {
          record = plan.record;
          store.put(record);
          plan.remove.forEach(id => store.delete(id));
        }
      } catch (error) { reject(error); tx.abort(); }
    };
    tx.oncomplete = () => resolve(record);
    tx.onabort = () => reject(tx.error || new Error('Не удалось сохранить снимок.'));
    tx.onerror = () => reject(tx.error);
  });
}

export function libraryFilename(kind = 'бэкап', date = new Date()) {
  const time = `${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
  return `LibriMori-${kind}-${snapshotDay(date)}_${time}.json`;
}

export function downloadLibrary(data, filename) {
  const blob = new Blob([JSON.stringify({ ...data, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
