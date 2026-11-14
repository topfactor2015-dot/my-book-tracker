import { useEffect, useState } from 'react';
import { configureFeedback, feedbackPreferences, playFeedback, unlockFeedback } from './feedback.js';
import './interaction.css';

export function useInteractionFeedback() {
  useEffect(() => {
    configureFeedback(feedbackPreferences());
    const unlock = () => unlockFeedback();
    const click = event => {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const control = event.target.closest('button, summary, input[type="checkbox"], input[type="radio"], select');
      if (!control || control.disabled || control.getAttribute('aria-disabled') === 'true' || control.closest('[data-sound="off"]')) return;
      unlockFeedback();
      const page = control.closest('nav') || /месяц|Дневник|Библиотека|Аналитика|Топ-100|Турнир|Рулетка/.test(control.getAttribute('aria-label') || control.textContent);
      playFeedback(page ? 'page' : 'tap');
    };
    document.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('keydown', unlock);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('click', click);
    };
  }, []);
}

export function FeedbackSettings() {
  const [preferences, setPreferences] = useState(feedbackPreferences);
  const update = change => {
    const next = { ...preferences, ...change };
    configureFeedback(next);
    setPreferences(next);
  };
  return <fieldset className="feedback-settings">
    <legend>Звуки и движение</legend>
    <label><span>Мягкие звуки нажатий</span><input type="checkbox" checked={preferences.enabled} onChange={event => { update({ enabled: event.target.checked }); if (event.target.checked) { unlockFeedback(); playFeedback(); } }}/></label>
    <label><span>Громкость</span><input aria-label="Громкость звуков" type="range" min="0" max="0.5" step="0.05" value={preferences.volume} disabled={!preferences.enabled} onChange={event => update({ volume: Number(event.target.value) })} onPointerUp={() => { unlockFeedback(); playFeedback(); }}/></label>
    <label><span>Анимации интерфейса</span><input type="checkbox" checked={preferences.motion} onChange={event => update({ motion: event.target.checked })}/></label>
    <p>Щелчки колеса страниц и короткий аккорд после завершения книги. Системная настройка уменьшения движения учитывается автоматически.</p>
  </fieldset>;
}
