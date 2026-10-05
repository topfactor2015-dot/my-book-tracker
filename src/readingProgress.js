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
