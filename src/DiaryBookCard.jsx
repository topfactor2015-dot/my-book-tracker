import { useRef } from 'react';

export default function DiaryBookCard({ book, onReturn, children }) {
  const gesture = useRef(null);
  return <div className="bg-[var(--panel)] rounded-3xl p-4 md:p-5 shadow-sm border border-[var(--border)]"
    onTouchStart={event => {
      gesture.current = null;
      if (event.touches.length !== 1 || event.target.closest('button, input, textarea, select, a')) return;
      const touch = event.touches[0];
      gesture.current = { x: touch.clientX, y: touch.clientY };
    }}
    onTouchMove={event => {
      if (!gesture.current) return;
      if (event.touches.length !== 1 || Math.abs(event.touches[0].clientY - gesture.current.y) > 35) gesture.current = null;
    }}
    onTouchCancel={() => { gesture.current = null; }}
    onTouchEnd={event => {
      const start = gesture.current;
      gesture.current = null;
      const touch = event.changedTouches[0];
      if (!start || !touch) return;
      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);
      if (dx >= 100 && dy < 35 && dx > dy * 3) onReturn();
    }}>
    {children}
    <div className="mt-3 border-t border-[var(--border)] pt-3">
      <button type="button" aria-label={`Вернуть в виш-лист — ${book.title}`} onClick={onReturn}
        className="min-h-11 px-3 py-2 rounded-xl text-xs font-bold text-[var(--secondary)] hover:bg-[var(--inset)]">↩ Вернуть в виш-лист</button>
      <p className="text-[10px] text-[var(--muted)]">Или смахните карточку вправо или влево</p>
    </div>
  </div>;
}
