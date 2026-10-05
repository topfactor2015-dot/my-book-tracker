import { useEffect, useRef, useState } from 'react';
import { downloadLibrary, libraryFilename, listSnapshots, saveSnapshot } from './snapshots.js';

const labels = { daily: 'Ежедневный снимок', import: 'Перед импортом', restore: 'Перед восстановлением' };
const buttonClass = 'rounded-xl border border-[#E2D5C3] bg-[#EFE7D8] px-3 py-2 text-sm font-bold text-[#564B41] disabled:opacity-50';

export function useLibrarySnapshots(data) {
  const latest = useRef(data);
  latest.current = data;
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    saveSnapshot(data).then(() => { if (active) setError(''); }).catch(() => {
      if (active) setError('Не удалось сохранить автоматический снимок. Скачайте JSON-бэкап.');
    });
    return () => { active = false; };
  }, [data]);
  useEffect(() => {
    const check = () => saveSnapshot(latest.current).then(() => setError('')).catch(() => {
      setError('Не удалось сохранить автоматический снимок. Скачайте JSON-бэкап.');
    });
    const timer = setInterval(check, 60_000);
    const visible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', visible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visible); };
  }, []);
  return error;
}

export default function SnapshotPanel({ data, onRestore, onClose }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  useEffect(() => {
    let active = true;
    // Wait for a pending daily save before reading the list.
    saveSnapshot(data).then(listSnapshots).then(items => { if (active) setRecords(items); })
      .catch(() => { if (active) setError('Не удалось открыть снимки. Проверьте, разрешено ли хранение данных в браузере.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [data]);
  useEffect(() => {
    const escape = event => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('button:not(:disabled)')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [busy, onClose]);
  const restore = async () => {
    setBusy(true);
    setError('');
    try {
      await saveSnapshot(data, 'restore');
      onRestore(selected.data);
      onClose();
    } catch {
      setError('Не удалось сохранить текущую библиотеку перед восстановлением. Данные не заменены. Скачайте JSON-бэкап и попробуйте снова.');
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="snapshot-title">
      <div className="absolute inset-0 bg-[#4A4238]/60 backdrop-blur-sm" onClick={() => { if (!busy) onClose(); }} />
      <div ref={dialog} className="relative w-full max-w-xl max-h-[85dvh] overflow-y-auto rounded-3xl border border-[#EADFCF] bg-[#F7F2E8] p-5 text-[#4A4238] shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 id="snapshot-title" className="text-xl font-bold">Снимки библиотеки</h2>
          <button autoFocus onClick={onClose} disabled={busy} aria-label="Закрыть снимки" className={buttonClass}>✕</button>
        </div>
        <p className="text-sm mb-2">Сохраняем первую версию за день, если библиотека изменилась с прошлого снимка: до 7 ежедневных снимков и 3 копий перед импортом или восстановлением.</p>
        <p className="text-sm mb-4 text-[#74675B]">Снимки хранятся только в этом браузере. При очистке его данных они исчезнут. Продолжайте скачивать JSON-бэкап на устройство.</p>
        {error && <p role="alert" className="text-sm text-[#9B493B] mb-3">{error}</p>}
        {loading ? <p>Загрузка снимков…</p> : !records.length && <p className="text-sm py-4">Снимков пока нет. Первый появится после добавления книги или изменения целей.</p>}
        {!selected && <div className="space-y-3">{records.map(record => (
          <div key={record.id} className="rounded-2xl border border-[#E2D5C3] bg-[#FCF9F2] p-3">
            <p className="font-bold text-sm">{new Date(record.createdAt).toLocaleString('ru-RU')}</p>
            <p className="text-sm mt-1 mb-3">{labels[record.kind] || 'Снимок'} · Книг: {record.data.books.length}</p>
            <div className="flex flex-wrap gap-2">
              <button className={buttonClass} onClick={() => setSelected(record)}>Восстановить</button>
              <button className={buttonClass} onClick={() => downloadLibrary(record.data, libraryFilename('снимок', new Date(record.createdAt)))}>Скачать JSON</button>
            </div>
          </div>
        ))}</div>}
        {selected && <div className="rounded-2xl border border-[#E2D5C3] bg-[#FCF9F2] p-4">
          <p className="font-bold mb-2">Восстановить снимок от {new Date(selected.createdAt).toLocaleString('ru-RU')}?</p>
          <p className="text-sm mb-4">Текущие книги, цели и серия чтения будут заменены. Сначала сохраним текущую библиотеку отдельным снимком, чтобы можно было вернуться к ней.</p>
          <div className="flex flex-wrap gap-2">
            <button className={buttonClass} disabled={busy} onClick={() => setSelected(null)}>Отмена</button>
            <button className={buttonClass} disabled={busy} onClick={restore}>{busy ? 'Сохранение…' : 'Подтвердить восстановление'}</button>
          </div>
        </div>}
      </div>
    </div>
  );
}
