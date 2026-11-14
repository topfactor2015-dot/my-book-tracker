import { useEffect, useRef, useState } from 'react';
import { Palette, X } from 'lucide-react';
import './appearance.css';
import { FeedbackSettings } from './InteractionFeedback.jsx';

const palettes = [
  { id: 'beige', name: 'Тёплый беж', colors: ['#806047', '#c7b299', '#fcf9f2'] },
  { id: 'lilac', name: 'Сирень и графит', colors: ['#704b87', '#c9b5d5', '#f7f3ed'] },
  { id: 'burgundy', name: 'Бордо и пергамент', colors: ['#853d53', '#be9cab', '#faf3e7'] },
];

export default function AppearancePicker() {
  const [palette, setPalette] = useState(() => {
    const saved = document.documentElement.dataset.palette;
    return palettes.some(item => item.id === saved) ? saved : 'beige';
  });
  const dialog = useRef(null);
  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    try { localStorage.setItem('librimori_palette', palette); } catch { /* Selection works for this session. */ }
  }, [palette]);
  return <>
    <button type="button" aria-label="Оформление" title="Оформление" onClick={() => dialog.current.showModal()} className="theme-toggle bg-[var(--inset)] hover:bg-[var(--border)] text-[var(--accent)] p-2.5 rounded-2xl border border-[var(--border-strong)] shadow-sm"><Palette size={18} /></button>
    <dialog ref={dialog} aria-labelledby="appearance-title" className="appearance-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <header><div><h2 id="appearance-title">Оформление</h2><p>Выбери настроение своего дневника</p></div><button type="button" aria-label="Закрыть оформление" onClick={() => dialog.current.close()}><X size={22}/></button></header>
      <fieldset><legend>Цветовая палитра</legend>{palettes.map(item => <label key={item.id} className="appearance-option">
        <span className="appearance-swatches" aria-hidden="true">{item.colors.map(color => <span key={color} style={{ background: color }} />)}</span>
        <span>{item.name}</span><input type="radio" name="appearance-palette" value={item.id} checked={palette === item.id} onChange={() => setPalette(item.id)} />
      </label>)}</fieldset>
      <FeedbackSettings />
      <p className="appearance-note">Светлый и тёмный режим переключаются кнопкой солнца или луны. Выбор оформления сохраняется на этом устройстве.</p>
      <button type="button" className="appearance-done" onClick={() => dialog.current.close()}>Готово</button>
    </dialog>
  </>;
}
