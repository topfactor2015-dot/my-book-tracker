export const normalizeIsbn = (value) => String(value ?? '').replace(/[\s-]/g, '').toUpperCase();

export function toIsbn13(value) {
  const isbn = normalizeIsbn(value);
  if (/^\d{9}[\dX]$/.test(isbn)) {
    const sum = [...isbn].reduce((n, digit, i) => n + (digit === 'X' ? 10 : Number(digit)) * (10 - i), 0);
    if (sum % 11) return null;
    const base = `978${isbn.slice(0, 9)}`;
    const check = (10 - [...base].reduce((n, digit, i) => n + Number(digit) * (i % 2 ? 3 : 1), 0) % 10) % 10;
    return `${base}${check}`;
  }
  if (!/^97[89]\d{10}$/.test(isbn)) return null;
  return [...isbn].reduce((n, digit, i) => n + Number(digit) * (i % 2 ? 3 : 1), 0) % 10 === 0 ? isbn : null;
}

async function getJson(url, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  signal.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 10000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abort);
  }
}

function plainText(value) {
  if (!value) return '';
  return new DOMParser().parseFromString(String(value).replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/p>/gi, '\n'), 'text/html').body.textContent.trim();
}

async function googleBook(isbn, signal) {
  const data = await getJson(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=5`, signal);
  const info = data.items?.map(item => item.volumeInfo).find(volume =>
    volume?.industryIdentifiers?.some(identifier => toIsbn13(identifier.identifier) === isbn));
  if (!info?.title) return null;
  return {
    title: info.title, author: (info.authors || []).join(', '),
    annotation: plainText(info.description), totalPages: info.pageCount || '',
    coverUrl: (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '').replace(/^http:/, 'https:'),
  };
}

async function openLibraryBook(isbn, signal) {
  const data = await getJson(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`, signal);
  const book = data[`ISBN:${isbn}`];
  if (!book?.title) return null;
  let annotation = '';
  try {
    const edition = await getJson(`https://openlibrary.org/isbn/${isbn}.json`, signal);
    let description = edition.description;
    if (!description && /^\/works\/OL\d+W$/.test(edition.works?.[0]?.key || '')) {
      const work = await getJson(`https://openlibrary.org${edition.works[0].key}.json`, signal);
      description = work.description;
    }
    annotation = plainText(typeof description === 'string' ? description : description?.value);
  } catch { /* Basic edition information is still useful without a description. */ }
  return {
    title: book.title, author: (book.authors || []).map(author => author.name).join(', '),
    totalPages: book.number_of_pages || '', annotation,
    coverUrl: (book.cover?.large || book.cover?.medium || '').replace(/^http:/, 'https:'),
  };
}

export async function lookupIsbn(value, signal) {
  const isbn = toIsbn13(value);
  if (!isbn) throw new Error('Введите корректный ISBN: 10 или 13 символов.');
  const results = await Promise.allSettled([googleBook(isbn, signal), openLibraryBook(isbn, signal)]);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  const found = results.filter(result => result.status === 'fulfilled' && result.value).map(result => result.value);
  if (!found.length) {
    if (results.some(result => result.status === 'rejected')) throw new Error('Не удалось проверить все каталоги. Проверьте интернет и повторите поиск или заполните карточку вручную.');
    throw new Error('Книга не найдена в каталогах. Проверьте ISBN или заполните карточку вручную.');
  }
  const merged = { isbn };
  for (const field of ['title', 'author', 'annotation', 'totalPages', 'coverUrl']) {
    merged[field] = found.find(book => book[field])?.[field] || '';
  }
  return merged;
}
