export function validateMonthlyPlans(plans) {
  if (plans == null) return;
  const invalid = () => { throw new Error('В файле некорректные планы чтения.'); };
  if (typeof plans !== 'object' || Array.isArray(plans)) invalid();
  for (const [month, plan] of Object.entries(plans)) {
    if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(month) || !plan || typeof plan.notes !== 'string' || !Array.isArray(plan.entries)) invalid();
    const ids = new Set();
    for (const entry of plan.entries) {
      if (!entry || !['string', 'number'].includes(typeof entry.bookId) || typeof entry.title !== 'string' || typeof entry.author !== 'string' || (entry.done !== undefined && typeof entry.done !== 'boolean') || ids.has(String(entry.bookId))) invalid();
      ids.add(String(entry.bookId));
    }
  }
}

export function planEntryDone(entry, book, month) {
  return entry.done ?? (book?.status === 'read' && String(book.dateFinished || '').slice(0, 7) === month);
}

export function addPlannedBook(plans, month, book) {
  const plan = plans[month] || { notes: '', entries: [] };
  if (plan.entries.some(entry => String(entry.bookId) === String(book.id))) return plans;
  return { ...plans, [month]: { ...plan, entries: [...plan.entries, { bookId: book.id, title: book.title || 'Без названия', author: book.author || '' }] } };
}
