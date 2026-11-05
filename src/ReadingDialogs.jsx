import { useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, Check, Keyboard, X } from 'lucide-react';
import './readingDialogs.css';

function ReadingDialog({ label, onClose, className, children }) {
  const dialog = useRef(null);
  useLayoutEffect(() => { const element = dialog.current; element.showModal(); return () => element.close(); }, []);
  return <dialog ref={dialog} aria-label={label} className={'reading-dialog ' + className}
    onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {children}
  </dialog>;
}

const rowHeight = 44;
const percent = (page, total) => (Math.min(100, page / total * 100)).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%';

export function PageWheel({ book, mode, initial, onSelect, onClose }) {
  const current = Math.max(0, Number(book.readPages) || 0);
  const total = Math.max(0, Number(book.totalPages) || 0);
  const delta = mode === 'delta';
  const min = delta ? 0 : Math.floor(current) + 1;
  const max = total ? Math.floor(delta ? total - current : total) : undefined;
  const canScroll = Number.isSafeInteger(max) && max >= min && max - min <= 200000;
  const [keyboard, setKeyboard] = useState(!canScroll);
  const [value, setValue] = useState(() => initial === '' || initial == null ? min : initial);
  const wheel = useRef(null);
  const clamp = number => Math.max(min, Math.min(max ?? Number.MAX_SAFE_INTEGER, number));
  const selected = clamp(Math.round(Number(value) || min));
  const valid = value !== '' && Number.isSafeInteger(Number(value)) && Number(value) >= min && (max === undefined || Number(value) <= max);
  const destination = number => delta ? current + number : number;
  useLayoutEffect(() => {
    if (!keyboard && wheel.current) wheel.current.scrollTop = (selected - min) * rowHeight;
  }, [keyboard]);
  const scrollTo = number => {
    const next = clamp(number);
    wheel.current.scrollTop = (next - min) * rowHeight;
    setValue(next);
  };
  const first = Math.max(min, selected - 8);
  const last = Math.min(max ?? selected, selected + 8);
  return <ReadingDialog label="Сколько прочитано?" onClose={onClose} className="page-dialog">
    <form onSubmit={event => { event.preventDefault(); if (valid) onSelect(Number(value)); }}>
      <header className="reading-dialog-header"><div><h2>Сколько прочитано?</h2><p>{book.title}</p></div><button type="button" aria-label="Закрыть" onClick={onClose}><X size={20}/></button></header>
      {canScroll && <button type="button" className="reading-mode" onClick={() => { if (keyboard) setValue(selected); setKeyboard(!keyboard); }}><Keyboard size={16}/> {keyboard ? 'Выбрать на колесе' : 'Ввести с клавиатуры'}</button>}
      {keyboard ? <label className="reading-number">{delta ? 'Добавить страниц' : 'Дочитал до страницы'}
        <input type="number" inputMode="numeric" min={min} max={max} step="1" value={value} onChange={event => setValue(event.target.value)} /></label>
        : <div className="page-wheel-frame">
          <div className="page-wheel-highlight" aria-hidden="true"/>
          <div className="page-wheel" ref={wheel} tabIndex={0} role="spinbutton" aria-label={delta ? 'Добавить страниц' : 'Дочитал до страницы'} aria-valuemin={min} aria-valuemax={max} aria-valuenow={selected}
            onScroll={event => setValue(clamp(min + Math.round(event.currentTarget.scrollTop / rowHeight)))}
            onKeyDown={event => { const next = { ArrowUp: selected - 1, ArrowDown: selected + 1, PageUp: selected - 10, PageDown: selected + 10, Home: min, End: max }[event.key]; if (next !== undefined) { event.preventDefault(); scrollTo(next); } }}>
            <div className="page-wheel-track" style={{ height: (max - min + 5) * rowHeight }}>
              {Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
                const number = first + index;
                return <div key={number} aria-hidden="true" onClick={() => scrollTo(number)} className={'page-wheel-row' + (number === selected ? ' selected' : '')} style={{ top: (number - min + 2) * rowHeight }}>
                  {delta ? `+${number} стр.` : `с. ${number}`} <small>{percent(destination(number), total)}</small>
                </div>;
              })}
            </div>
          </div>
        </div>}
      <p className="reading-preview">{valid && total > 0 ? `${destination(Number(value))} из ${total} стр. · ${percent(destination(Number(value)), total)}` : `Прочитано ${current} стр.`}</p>
      <button type="submit" className="reading-confirm" disabled={!valid}><Check size={19}/> Выбрать</button>
    </form>
  </ReadingDialog>;
}

const confettiColors = ['#efbd47', '#fff4dd', '#8dc6df', '#d2856a'];
export function ReadingCelebration({ book, onClose }) {
  const [coverFailed, setCoverFailed] = useState(false);
  return <ReadingDialog label="Книга прочитана" onClose={onClose} className="reading-celebration">
    <div className="confetti" aria-hidden="true">{Array.from({ length: 70 }, (_, i) => <span key={i} style={{ left: `${i * 37 % 100}%`, background: confettiColors[i % confettiColors.length], '--fall-delay': `${(i % 19) * 0.055}s`, '--fall-time': `${1.65 + (i % 7) * 0.19}s`, '--drift': `${i * 19 % 160 - 80}px` }} />)}</div>
    <button type="button" className="celebration-close" aria-label="Закрыть поздравление" onClick={onClose}><X size={23}/></button>
    <div className="celebration-content">
      <p>Последняя страница</p><h2>Поздравляем!</h2>
      <div className="celebration-cover">{book.coverUrl && !coverFailed ? <img src={book.coverUrl} alt="" onError={() => setCoverFailed(true)}/> : <BookOpen size={60}/>}</div>
      <h3>{book.title}</h3>{book.author && <p>{book.author}</p>}
      <button type="button" className="reading-confirm" onClick={onClose}><Check size={19}/> Готово</button>
    </div>
  </ReadingDialog>;
}
