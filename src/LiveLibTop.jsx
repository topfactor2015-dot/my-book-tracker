import { useMemo, useState } from 'react';
import { LIVE_LIB_TOP, findTopBook, isTopBookRead, normalizeTopText } from './liveLibTop.js';

const statuses = { wishlist: 'Хочу прочитать', reading: 'Читаю', rereading: 'Перечитываю', read: 'Прочитано', dropped: 'Брошено' };

export default function LiveLibTop({ books, onOpenBook }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const entries = useMemo(() => LIVE_LIB_TOP.books.map(entry => ({ ...entry, book: findTopBook(entry, books) })), [books]);
  const readCount = entries.filter(entry => isTopBookRead(entry.book)).length;
  const inLibrary = entries.filter(entry => entry.book).length;
  const filtered = entries.filter(entry => {
    const searchMatches = normalizeTopText(`${entry.title} ${entry.author}`).includes(normalizeTopText(search));
    return searchMatches && (filter === 'all' || (filter === 'read' && isTopBookRead(entry.book)) ||
      (filter === 'unread' && !isTopBookRead(entry.book)) || (filter === 'library' && entry.book));
  });

  return (
    <section className="space-y-5" aria-labelledby="livelib-title">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <p className="text-xs font-bold text-[var(--accent)] mb-1">Читательский маршрут</p>
            <h1 id="livelib-title" className="text-2xl sm:text-3xl font-black text-[var(--heading)]">Топ-100 LiveLib</h1>
            <p className="text-sm text-[var(--secondary)] mt-2">Знакомые книги и новые открытия — сколько уже на вашей полке?</p>
          </div>
          <a href={LIVE_LIB_TOP.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--accent)] underline py-2">Рейтинг на LiveLib ↗</a>
        </div>
        <div className="rounded-2xl bg-[var(--inset)] p-4 space-y-2">
          <div className="flex justify-between items-baseline gap-3">
            <p className="text-sm font-bold">Прочитано позиций: {readCount} из {entries.length}</p>
            <span className="font-black text-[var(--accent)]">{Math.round(readCount / entries.length * 100)}%</span>
          </div>
          <progress aria-label="Прогресс чтения списка LiveLib" value={readCount} max={entries.length} className="w-full h-2 accent-[var(--green-bar)]" />
          <p className="text-xs text-[var(--secondary)]">В вашей библиотеке: {inLibrary}. Прочитанные книги учитываются автоматически.</p>
        </div>
        <p className="text-xs leading-relaxed text-[var(--secondary)]">Список за 19 октября 2026 года. На странице «Топ-100» доступны {entries.length} позиций, включая отдельные тома, сборники и разные издания. Сохранён порядок источника. LiveLib пересчитывает рейтинг ежедневно; здесь показана сохранённая версия.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="livelib-search" className="sr-only">Поиск в Топ-100 LiveLib</label>
          <input id="livelib-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Название книги или автор" className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] p-3 text-sm outline-none focus:border-[var(--focus)]" />
        </div>
        <div>
          <label htmlFor="livelib-filter" className="sr-only">Фильтр списка LiveLib</label>
          <select id="livelib-filter" value={filter} onChange={event => setFilter(event.target.value)} className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] p-3 text-sm">
            <option value="all">Все книги</option>
            <option value="unread">Ещё не прочитано</option>
            <option value="read">Прочитано</option>
            <option value="library">В моей библиотеке</option>
          </select>
        </div>
      </div>
      <p role="status" className="text-xs text-[var(--secondary)]">Показано: {filtered.length} из {entries.length}</p>
      <ol className="space-y-3" aria-label="Книги рейтинга LiveLib">
        {filtered.map(entry => (
          <li key={entry.id} value={entry.rank} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5 flex gap-3 sm:gap-5">
            <span aria-label={`Место ${entry.rank}`} className="text-lg sm:text-2xl font-black text-[var(--muted)] w-9 sm:w-12 shrink-0 pt-1">{String(entry.rank).padStart(2, '0')}</span>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[var(--heading)] break-words">{entry.title}</h2>
                <p className="text-xs sm:text-sm text-[var(--secondary)] mt-1 break-words">{entry.author}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <span className="font-bold text-[var(--gold-ink)]" aria-label={`Оценка LiveLib ${entry.rating} из 5`}>★ {entry.rating} <span className="font-normal text-[var(--secondary)]">LiveLib</span></span>
                {entry.book && <span className={`font-bold ${isTopBookRead(entry.book) ? 'text-[var(--green-ink)]' : 'text-[var(--accent)]'}`}>{isTopBookRead(entry.book) ? '✓ ' : ''}{statuses[entry.book.status] || 'В библиотеке'}</span>}
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">О книге ↗</a>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => onOpenBook(entry)} aria-label={`${entry.book ? 'Открыть' : 'Добавить'}: ${entry.title}`} className="rounded-xl bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-2 text-xs font-bold">{entry.book ? 'Открыть в библиотеке' : '+ Хочу прочитать'}</button>
                {!entry.book && <button type="button" onClick={() => onOpenBook(entry, 'read')} aria-label={`Уже прочитано: ${entry.title}`} className="rounded-xl border border-[var(--border-strong)] text-[var(--accent)] hover:bg-[var(--inset)] px-3 py-2 text-xs font-bold">Уже прочитано</button>}
              </div>
            </div>
          </li>
        ))}
      </ol>
      {!filtered.length && <p className="rounded-2xl border border-[var(--border)] p-8 text-center text-sm text-[var(--secondary)]">Книги не найдены. Попробуйте другой запрос или фильтр.</p>}
    </section>
  );
}
