import { useId, useState } from 'react';
import './starRating.css';

function Star({ filled }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={filled ? 'rating-star is-filled' : 'rating-star'}><path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96Z" /></svg>;
}
export default function StarRating({ value, onChange, compact = false }) {
  const id = useId();
  const [hover, setHover] = useState(0);
  const score = Math.max(0, Math.min(5, Number(value) || 0));
  if (!onChange) return <span className={'rating-display' + (compact ? ' is-compact' : '')} role="img" aria-label={'Оценка ' + score + ' из 5'}>{[1,2,3,4,5].map(star => <Star key={star} filled={star <= score} />)}</span>;
  return <fieldset className="rating-picker">
    <legend className="rating-legend">Моя оценка</legend>
    <div className="rating-options" onMouseLeave={() => setHover(0)}>{[1,2,3,4,5].map(star => <label key={star} className="rating-option" onMouseEnter={() => setHover(star)}>
      <input type="radio" name={id} value={star} checked={score === star} onChange={() => onChange(star)} aria-label={star + ' из 5 звёзд'} />
      <Star filled={star <= (hover || score)} />
    </label>)}</div>
    <div className="rating-caption"><span>{score ? score + ' из 5' : 'Без оценки'}</span>{score > 0 && <button type="button" onClick={() => { setHover(0); onChange(0); }}>Сбросить</button>}</div>
  </fieldset>;
}
