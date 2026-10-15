import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBDatabase } from 'fake-indexeddb';
import { createLibraryStorage, readLegacyLibrary, LIBRARY_KEY, BACKEND_KEY } from './src/libraryStorage.js';

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}
const library = (books = [{ id: 1, title: 'Старая книга', readPages: 10 }]) => ({ books, goals: { yearly: 20, monthly: 2 }, manualStreakBonus: -1 });
const legacy = data => memoryStorage({
  warm_readingTrackerBooks_v21: JSON.stringify(data.books),
  warm_readingTrackerGoals_v21: JSON.stringify(data.goals),
  warm_readingTrackerStreakBonus_v21: String(data.manualStreakBonus),
});
const unavailableIDB = { open() { throw new Error('Storage disabled'); } };

test('migrates the complete legacy library once and leaves its original copy intact', async () => {
  const old = library();
  const localStorage = legacy(old);
  const indexedDB = new IDBFactory();
  const repository = createLibraryStorage({ localStorage, indexedDB });
  const record = await repository.initialize();
  assert.deepEqual(record.data, old);
  assert.equal(record.backend, 'indexeddb');
  assert.equal(localStorage.getItem('warm_readingTrackerBooks_v21'), JSON.stringify(old.books));
  const updated = library([...old.books, { id: 2, title: 'Граф Аверин', readPages: 80 }]);
  await repository.save(updated);
  assert.deepEqual((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data, updated);
});

test('a library larger than localStorage capacity survives reopening in IndexedDB', async () => {
  const localStorage = legacy(library());
  const normalSet = localStorage.setItem;
  localStorage.setItem = (key, value) => {
    if (value.length > 1024) throw new DOMException('Quota exceeded', 'QuotaExceededError');
    normalSet(key, value);
  };
  const indexedDB = new IDBFactory();
  const repository = createLibraryStorage({ localStorage, indexedDB });
  await repository.initialize();
  const large = library([{ id: 2, title: 'Граф Аверин', readPages: 123, coverUrl: 'data:image/jpeg;base64,' + 'a'.repeat(6_000_000) }]);
  await repository.save(large);
  assert.deepEqual((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data, large);
});

test('a stale tab cannot remove a book saved by another tab', async () => {
  const localStorage = legacy(library());
  const indexedDB = new IDBFactory();
  const first = createLibraryStorage({ localStorage, indexedDB });
  await first.initialize();
  const second = createLibraryStorage({ localStorage, indexedDB });
  await second.initialize();
  const updated = library([{ id: 1, title: 'Старая книга' }, { id: 2, title: 'Новая книга' }]);
  await first.save(updated);
  await assert.rejects(second.save(library()), { name: 'LibraryConflictError' });
  assert.deepEqual((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data, updated);
});

test('rapid progress changes are committed in order', async () => {
  const localStorage = legacy(library());
  const indexedDB = new IDBFactory();
  const repository = createLibraryStorage({ localStorage, indexedDB });
  await repository.initialize();
  await Promise.all([20, 40, 80].map(readPages => repository.save(library([{ id: 1, readPages }]))));
  assert.equal((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data.books[0].readPages, 80);
});

test('failed IDB commit rejects and preserves the last successfully saved library', async () => {
  const localStorage = legacy(library());
  const indexedDB = new IDBFactory();
  const repository = createLibraryStorage({ localStorage, indexedDB });
  await repository.initialize();
  const transaction = IDBDatabase.prototype.transaction;
  IDBDatabase.prototype.transaction = function (stores, mode, ...args) {
    if (mode === 'readwrite') throw new DOMException('Disk full', 'QuotaExceededError');
    return transaction.call(this, stores, mode, ...args);
  };
  try {
    await assert.rejects(repository.save(library([{ id: 2 }])), { name: 'QuotaExceededError' });
  } finally { IDBDatabase.prototype.transaction = transaction; }
  assert.deepEqual((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data, library());
  await repository.save(library([{ id: 2, readPages: 55 }]));
  assert.equal((await createLibraryStorage({ localStorage, indexedDB }).initialize()).data.books[0].readPages, 55);
});

test('unavailable primary storage never falls back to a stale legacy library', async () => {
  const localStorage = legacy(library());
  localStorage.setItem(BACKEND_KEY, 'indexeddb');
  await assert.rejects(createLibraryStorage({ localStorage, indexedDB: unavailableIDB }).initialize());
  assert.equal(localStorage.getItem(LIBRARY_KEY), null);
});

test('corrupt legacy input is not replaced by an empty library', async () => {
  const localStorage = memoryStorage({ warm_readingTrackerBooks_v21: '{broken' });
  assert.throws(() => readLegacyLibrary(localStorage));
  await assert.rejects(createLibraryStorage({ localStorage, indexedDB: new IDBFactory() }).initialize());
  assert.equal(localStorage.getItem('warm_readingTrackerBooks_v21'), '{broken');
  assert.equal(localStorage.getItem(BACKEND_KEY), null);
});

test('fallback localStorage failures propagate, and successful fallback data can migrate later', async () => {
  const localStorage = legacy(library());
  const repository = createLibraryStorage({ localStorage, indexedDB: unavailableIDB });
  await repository.initialize();
  const set = localStorage.setItem;
  localStorage.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  await assert.rejects(repository.save(library([{ id: 2 }])), { name: 'QuotaExceededError' });
  localStorage.setItem = set;
  const updated = library([{ id: 2, readPages: 77 }]);
  await repository.save(updated);
  assert.deepEqual((await createLibraryStorage({ localStorage, indexedDB: new IDBFactory() }).initialize()).data, updated);
});
