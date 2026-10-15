import { useEffect, useRef, useState } from 'react';
import { createLibraryStorage } from './libraryStorage.js';

const initial = { books: [], goals: { yearly: 0, monthly: 0 }, manualStreakBonus: 0 };
export default function useLibraryStorage(normalizeBooks) {
  const [repository] = useState(() => createLibraryStorage());
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState({ ready: false, error: '', saving: false, backend: '' });
  const saved = useRef('');
  const dirty = useRef(false);
  const latest = useRef(data);
  latest.current = data;
  if (status.ready && JSON.stringify(data) !== saved.current) dirty.current = true;

  useEffect(() => {
    let active = true;
    repository.initialize().then(record => {
      if (!active) return;
      saved.current = JSON.stringify(record.data);
      setData({ ...record.data, books: normalizeBooks(record.data.books) });
      setStatus({ ready: true, error: '', saving: false, backend: record.backend });
    }).catch(() => {
      if (active) setStatus({ ready: false, saving: false, backend: '', error: 'Не удалось открыть сохранённую библиотеку. Данные не заменены. Закройте лишние вкладки и попробуйте ещё раз.' });
    });
    return () => { active = false; };
  }, [repository, normalizeBooks]);

  useEffect(() => {
    if (!status.ready || JSON.stringify(data) === saved.current) return;
    let active = true;
    dirty.current = true;
    setStatus(prev => ({ ...prev, saving: true }));
    repository.save(data).then(() => {
      saved.current = JSON.stringify(data);
      if (JSON.stringify(latest.current) === saved.current) dirty.current = false;
      if (active) setStatus(prev => ({ ...prev, saving: false, error: '' }));
    }).catch(error => {
      if (active) setStatus(prev => ({ ...prev, saving: false, error: error.name === 'LibraryConflictError' ? error.message : 'Изменения НЕ сохранены на устройстве. Не закрывайте страницу: скачайте бэкап или повторите сохранение.' }));
    });
    return () => { active = false; };
  }, [data, repository, status.ready]);

  useEffect(() => {
    const warn = event => {
      if (dirty.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const update = (key, value) => setData(prev => ({ ...prev, [key]: typeof value === 'function' ? value(prev[key]) : value }));
  const retry = () => setData(prev => ({ ...prev }));
  return { data, update, status, retry };
}
