import { useState } from 'react';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const pad = value => String(value).padStart(2, '0');

function CalendarBook({ book, onOpen }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const rating = Math.min(5, Math.max(0, Math.round(Number(book.rating) || 0)));
  return <button type="button" aria-label={`Открыть книгу «${book.title}»`} title={book.title}
    onClick={() => onOpen(book)} className="mx-auto block w-full max-w-16 rounded-md focus-visible:outline-2 focus-visible:outline-[var(--focus)]">
    <span className="relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-md bg-[var(--cover)] text-[var(--ink)] shadow-sm">
      {book.coverUrl && book.coverUrl !== failedUrl
        ? <img src={book.coverUrl} alt="" onError={() => setFailedUrl(book.coverUrl)} className="absolute inset-0 h-full w-full object-contain" />
        : <span className="p-0.5 text-[8px] font-bold leading-tight [overflow-wrap:anywhere] line-clamp-4">{book.title || <BookOpen size={15} />}</span>}
    </span>
    {rating > 0 && <span role="img" aria-label={`Оценка ${rating} из 5`} className="mt-0.5 flex justify-center text-[clamp(6px,2.1vw,12px)] leading-none text-[#d69c12]">
      <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
    </span>}
  </button>;
}

export default function BookCalendar({ books, today, dateKey, onBack, onOpenBook }) {
  const [month, setMonth] = useState(() => new Date(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, 1));
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const prefix = `${year}-${pad(monthIndex + 1)}-`;
  const length = new Date(year, monthIndex + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const cellCount = Math.ceil((offset + length) / 7) * 7;
  const completed = new Map();
  for (const book of books) {
    if (book.status !== 'read' || !book.dateFinished) continue;
    const key = dateKey(book.dateFinished);
    if (!key.startsWith(prefix)) continue;
    const day = Number(key.slice(-2));
    if (day < 1 || day > length || key !== prefix + pad(day)) continue;
    const group = completed.get(day) || [];
    group.push(book);
    completed.set(day, group);
  }
  const count = [...completed.values()].reduce((sum, group) => sum + group.length, 0);
  const navigation = 'grid h-11 w-11 place-items-center rounded-xl bg-[var(--inset)] text-[var(--heading)] hover:bg-[var(--border)]';
  return <section aria-labelledby="book-calendar-title" className="mx-auto max-w-3xl pb-8 text-[var(--heading)]">
    <button type="button" onClick={onBack} className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold"><ChevronLeft size={18} /> Дневник</button>
    <header className="mb-5">
      <h2 id="book-calendar-title" className="flex items-center gap-2 text-2xl font-black sm:text-3xl"><CalendarDays className="shrink-0 text-[var(--accent)]" />Книжный календарь</h2>
      <p className="mt-2 text-sm text-[var(--secondary)]">Обложки книг в день, когда ты их дочитал.</p>
    </header>
    <div className="mb-3 flex items-center justify-between gap-2">
      <div aria-live="polite"><h3 className="text-lg font-black capitalize sm:text-2xl">{month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
        <p className="text-xs text-[var(--secondary)]">Книг прочитано: {count}</p></div>
      <div className="flex gap-2">
        <button type="button" aria-label="Предыдущий месяц" className={navigation} onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}><ChevronLeft size={20} /></button>
        <button type="button" aria-label="Следующий месяц" className={navigation} onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}><ChevronRight size={20} /></button>
      </div>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="grid grid-cols-7 bg-[var(--inset)] text-center text-xs font-bold text-[var(--secondary)]">
        {weekdays.map((day, i) => <span key={day} className={'py-2 ' + (i === 6 ? 'text-[var(--danger-ink)]' : '')}>{day}</span>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: cellCount }, (_, i) => {
          const day = i - offset + 1;
          const valid = day > 0 && day <= length;
          return <div key={i} className="min-h-20 min-w-0 border-t border-[var(--border)] px-0.5 pb-1.5 pt-1 text-center sm:min-h-28 sm:px-1.5">
            {valid && <>
              <time dateTime={prefix + pad(day)} aria-current={prefix + pad(day) === today ? 'date' : undefined}
                className={'mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ' + (prefix + pad(day) === today ? 'bg-[var(--button)] text-white' : i % 7 === 6 ? 'text-[var(--danger-ink)]' : '')}>{day}</time>
              <div className="space-y-1.5">{completed.get(day)?.map(book => <CalendarBook key={book.id} book={book} onOpen={onOpenBook} />)}</div>
            </>}
          </div>;
        })}
      </div>
    </div>
    {!count && <p className="mt-3 text-center text-sm text-[var(--secondary)]">Здесь появятся книги, завершённые в этом месяце.</p>}
  </section>;
}
