// Reading pages belong to the month of the diary entry, regardless of book status.
// For older completed books, assign only progress missing from dated logs to completion.
export function getMonthlyReadingStats(books) {
  const stats = new Map();
  const monthFor = value => {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(String(value ?? ''));
    if (!match) return null;
    const [, year, month, day] = match.map(Number);
    if (year < 1000 || month < 1 || month > 12 || day < 1 || day > new Date(year, month, 0).getDate()) return null;
    return `${match[1]}-${match[2]}`;
  };
  const pagesOf = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  const getMonth = key => {
    if (!stats.has(key)) {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      stats.set(key, { key, label: date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), books: [], activityBooks: [], pages: 0, sortKey: date.getTime() });
    }
    return stats.get(key);
  };
  const addPages = (key, book, pages) => {
    const month = getMonth(key);
    month.pages += pages;
    if (!month.activityBooks.includes(book)) month.activityBooks.push(book);
  };
  books.forEach(book => {
    let loggedPages = 0;
    (Array.isArray(book.log) ? book.log : []).forEach(entry => {
      const key = monthFor(entry?.date);
      const pages = pagesOf(entry?.pages);
      if (!key || !pages) return;
      addPages(key, book, pages);
      loggedPages += pages;
    });
    const finishedMonth = book.status === 'read' && monthFor(book.dateFinished);
    if (finishedMonth) {
      const month = getMonth(finishedMonth);
      month.books.push(book);
      if (!month.activityBooks.includes(book)) month.activityBooks.push(book);
      const unloggedPages = Math.max(0, (pagesOf(book.totalPages) || pagesOf(book.readPages)) - loggedPages);
      if (unloggedPages) addPages(finishedMonth, book, unloggedPages);
    }
  });
  return [...stats.values()].sort((a, b) => b.sortKey - a.sortKey);
}

export function pagesToLog(book, input, mode = 'page') {
  const current = Number(book.readPages) || 0;
  const total = Number(book.totalPages) || 0;
  if (input === '' || input == null) return 0;
  const value = Number(input);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('Введите целое неотрицательное число страниц.');
  const pages = mode === 'page' ? value - current : value;
  if (mode === 'page' && pages <= 0) {
    throw new Error(`Сейчас прочитано ${current} стр. Введите страницу больше ${current}.`);
  }
  if (total > 0 && current + pages > total) throw new Error(`В книге ${total} стр. Номер страницы не может быть больше объёма книги.`);
  return pages;
}

export function recordReadingProgress(book, input, mode, minutesInput, date) {
  const pages = pagesToLog(book, input, mode);
  const minutes = minutesInput === '' || minutesInput == null ? Math.round(pages * 1.5) : Number(minutesInput);
  if (!Number.isSafeInteger(minutes) || minutes < 0) throw new Error('Введите целое неотрицательное число минут.');
  if (!pages && !minutes) return book;
  const readPages = (Number(book.readPages) || 0) + pages;
  const finished = Number(book.totalPages) > 0 && readPages >= Number(book.totalPages);
  return {
    ...book, readPages,
    log: [...(book.log || []), { date, pages, minutes }],
    status: finished ? 'read' : book.status,
    dateFinished: finished ? (book.dateFinished || date) : book.dateFinished,
  };
}
