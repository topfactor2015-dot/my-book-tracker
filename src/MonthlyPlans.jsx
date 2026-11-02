import { useState } from 'react';
import { addPlannedBook, planEntryDone } from './monthlyPlans.js';

const monthKey = date => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
export default function MonthlyPlans({ books, plans, onChange, onOpenBook }) {
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [query, setQuery] = useState('');
  const [picking, setPicking] = useState(false);
  const plan = plans[month] || { notes: '', entries: [] };
  const bookFor = entry => books.find(book => String(book.id) === String(entry.bookId));
  const done = plan.entries.filter(entry => planEntryDone(entry, bookFor(entry), month)).length;
  const label = new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const update = change => onChange(prev => ({ ...prev, [month]: change(prev[month] || { notes: '', entries: [] }) }));
  const shift = delta => {
    const date = new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1 + delta, 1);
    if (date.getFullYear() < 1000 || date.getFullYear() > 9999) return;
    setMonth(monthKey(date)); setPicking(false); setQuery('');
  };
  const available = books.filter(book => !plan.entries.some(entry => String(entry.bookId) === String(book.id)) && ((book.title || '') + ' ' + (book.author || '')).toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
  const button = 'px-3 py-2 min-h-11 rounded-xl bg-[var(--inset)] text-[var(--heading)] text-xs font-bold border border-[var(--border)]';
  return <details className="bg-[var(--panel)] border border-[var(--border)] rounded-3xl p-4 md:p-5">
    <summary className="cursor-pointer font-bold text-[var(--heading)]">Планы на месяц</summary>
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button type="button" className={button} aria-label="Предыдущий месяц плана" onClick={() => shift(-1)}>←</button>
        <label className="text-xs text-[var(--secondary)]">Месяц плана <input aria-label="Месяц плана" type="month" min="1000-01" max="9999-12" value={month} onChange={event => { if (/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(event.target.value)) { setMonth(event.target.value); setPicking(false); setQuery(''); } }} className={button + ' block max-w-full'} /></label>
        <button type="button" className={button} aria-label="Следующий месяц плана" onClick={() => shift(1)}>→</button>
      </div>
      <h3 className="font-bold text-[var(--heading)] capitalize">{label}</h3>
      <p role="status" className="text-sm text-[var(--secondary)]">Выполнено {done} из {plan.entries.length}</p>
      <progress aria-label="Выполнение плана месяца" className="w-full" max={Math.max(1, plan.entries.length)} value={done} />
      <p className="text-xs text-[var(--muted)]">Книги, завершённые в этом месяце, отмечаются автоматически. Можно отметить выполнение вручную — например, если планируешь прочитать только часть книги.</p>
      {!plan.entries.length && <p className="text-sm text-[var(--muted)]">Что хочется прочитать в этом месяце? Добавь книги из библиотеки.</p>}
      <ul className="space-y-2">{plan.entries.map(entry => {
        const book = bookFor(entry);
        const complete = planEntryDone(entry, book, month);
        return <li key={entry.bookId} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] p-3">
          <input type="checkbox" aria-label={'Выполнено — ' + entry.title} checked={Boolean(complete)} onChange={event => { const checked = event.target.checked; update(current => ({ ...current, entries: current.entries.map(item => String(item.bookId) === String(entry.bookId) ? { ...item, done: checked } : item) })); }} className="mt-2 h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1 text-sm text-[var(--heading)]">
            <button type="button" disabled={!book} onClick={() => book && onOpenBook(book)} className={'text-left font-bold break-words ' + (complete ? 'line-through opacity-60' : '')}>{book?.title || entry.title}</button>
            <p className="text-xs text-[var(--muted)]">{book?.author || entry.author}{!book ? ' · Книга удалена из библиотеки' : ''}</p>
            {entry.done !== undefined && <button type="button" className="text-xs underline py-2" onClick={() => update(current => ({ ...current, entries: current.entries.map(item => { if (String(item.bookId) !== String(entry.bookId)) return item; const { done: ignored, ...rest } = item; return rest; }) }))}>Отмечать автоматически</button>}
          </div>
          <button type="button" aria-label={'Убрать из плана — ' + entry.title} className={button} onClick={() => update(current => ({ ...current, entries: current.entries.filter(item => String(item.bookId) !== String(entry.bookId)) }))}>×</button>
        </li>;
      })}</ul>
      <button type="button" className={button} aria-expanded={picking} onClick={() => setPicking(!picking)}>{picking ? 'Закрыть выбор книг' : '+ Добавить книги в план'}</button>
      {picking && <div className="space-y-2 rounded-2xl border border-[var(--border)] p-3">
        <input type="search" aria-label="Поиск книги для плана" placeholder="Название или автор" value={query} onChange={event => setQuery(event.target.value)} className="w-full min-w-0 rounded-xl p-3 bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)]" />
        <div className="max-h-72 overflow-y-auto space-y-2">{available.slice(0, 30).map(book => <button type="button" key={book.id} onClick={() => onChange(prev => addPlannedBook(prev, month, book))} className={button + ' w-full text-left break-words'}>+ {book.title} <span className="font-normal">{book.author}</span></button>)}</div>
        {!available.length && <p className="text-xs text-[var(--muted)]">{books.length ? 'Нет подходящих книг. Возможно, они уже в плане.' : 'Сначала добавь книги в библиотеку.'}</p>}
        {available.length > 30 && <p className="text-xs text-[var(--muted)]">Показаны первые 30 книг. Уточни поиск.</p>}
      </div>}
      <label className="block text-sm text-[var(--secondary)]">Заметки и пожелания на месяц<textarea value={plan.notes} onChange={event => { const notes = event.target.value; update(current => ({ ...current, notes })); }} rows={3} placeholder="Например: закончить роман, прочитать сборник рассказов…" className="mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--paper)] p-3 text-[var(--ink)]" /></label>
      <p className="text-xs text-[var(--muted)]">Планы сохраняются отдельно для каждого месяца и входят в бэкап. Добавление книги в план не начинает чтение.</p>
    </div>
  </details>;
}
