import React, { useEffect, useRef, useState } from 'react';
import { lookupIsbn, toIsbn13 } from './isbn.js';

export default function IsbnLookup({ book, books, onFound }) {
  const [isbn, setIsbn] = useState(book.isbn || '');
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const requestRef = useRef(null);
  const mountedRef = useRef(true);
  const onFoundRef = useRef(onFound);
  onFoundRef.current = onFound;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; requestRef.current?.abort(); };
  }, []);

  async function search(value) {
    if (requestRef.current) return;
    const normalized = toIsbn13(value);
    if (!normalized) { setMessage('Введите корректный ISBN: 10 или 13 символов.'); return; }
    setScanning(false);
    setIsbn(normalized);
    onFoundRef.current({ isbn: normalized });
    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    setMessage('Ищем книгу в каталогах…');
    try {
      const details = await lookupIsbn(normalized, controller.signal);
      if (!mountedRef.current || controller.signal.aborted) return;
      onFoundRef.current(details);
      const duplicate = books.some(item => item.id !== book.id && toIsbn13(item.isbn) === normalized);
      setMessage(duplicate
        ? 'Книга с этим ISBN уже есть в библиотеке. Проверьте карточку перед сохранением.'
        : 'Данные найдены. Заполнены пустые поля — проверьте карточку и нажмите «Сохранить». Недостающие данные можно добавить вручную.');
    } catch (error) {
      if (mountedRef.current && !controller.signal.aborted) setMessage(error.message);
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (mountedRef.current) setBusy(false);
    }
  }

  useEffect(() => {
    if (!scanning) return;
    let cancelled = false;
    let stream;
    let controls;
    let detected = false;
    const stop = () => { controls?.stop(); stream?.getTracks().forEach(track => track.stop()); };
    async function start() {
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Камера недоступна. Откройте сайт по HTTPS или введите ISBN вручную.');
        }
        const { BrowserMultiFormatOneDReader } = await import('@zxing/browser');
        if (cancelled) return;
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {
          facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 },
        } });
        if (cancelled) { stop(); return; }
        const reader = new BrowserMultiFormatOneDReader();
        controls = await reader.decodeFromStream(stream, videoRef.current, (result, error, scanControls) => {
          if (cancelled || detected || !result) return;
          const value = toIsbn13(result.getText());
          if (!value) { setMessage('Это не книжный ISBN. Наведите камеру на основной штрих-код книги.'); return; }
          detected = true;
          scanControls.stop();
          stream?.getTracks().forEach(track => track.stop());
          void search(value);
        });
        if (cancelled || detected) stop();
      } catch (error) {
        stop();
        if (cancelled) return;
        setScanning(false);
        setMessage(error.name === 'NotAllowedError'
          ? 'Разрешите доступ к камере в настройках браузера или введите ISBN вручную.'
          : error.name === 'NotFoundError'
            ? 'Камера не найдена. Введите ISBN вручную.'
            : 'Не удалось открыть камеру. Проверьте доступ к ней и HTTPS или введите ISBN вручную.');
      }
    }
    void start();
    return () => { cancelled = true; stop(); };
    // Each scan session keeps the book and callback it started with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const buttonStyle = 'rounded-xl px-3 py-2.5 text-xs font-bold disabled:opacity-50 disabled:cursor-wait';
  const validIsbn = toIsbn13(isbn);
  const imageQuery = validIsbn ? `isbn:${validIsbn}` : !isbn.trim() && book.title?.trim()
    ? `${book.title.trim()} ${book.author || ''} обложка` : '';
  const imageSearchUrl = imageQuery ? `https://www.google.com/search?${new URLSearchParams({ q: imageQuery, udm: '2', hl: 'ru' })}` : '';
  return (
    <div className="bg-[#EFE7D8] border border-[#EADFCF] rounded-2xl p-3 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[#564B41]">Добавить данные по ISBN</h3>
        <button type="button" disabled={busy} onClick={() => {
          setScanning(value => !value);
          setMessage(scanning ? 'Сканирование остановлено.' : 'Наведите камеру на штрих-код. Держите книгу неподвижно при хорошем освещении.');
        }} className={`${buttonStyle} bg-[#806047] text-white`}>
          {scanning ? 'Закрыть камеру' : 'Сканировать штрих-код'}
        </button>
      </div>
      {scanning && (
        <div className="rounded-xl overflow-hidden bg-[#352B24]">
          <video ref={videoRef} autoPlay muted playsInline aria-label="Камера для сканирования ISBN" className="w-full max-h-64 object-contain" />
        </div>
      )}
      <label htmlFor="book-isbn" className="block text-xs text-[#564B41]">ISBN под штрих-кодом — можно ввести вручную</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input id="book-isbn" type="text" autoCapitalize="characters" spellCheck={false} value={isbn} disabled={busy}
          placeholder="Например, 978-5-…" onChange={event => setIsbn(event.target.value)}
          onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); if (!busy) void search(isbn); } }}
          className="min-w-0 flex-1 rounded-xl border-2 border-[#D5C6B4] bg-[#FCF9F2] p-2.5 text-sm text-[#4A4238] outline-none focus:border-[#A68970]" />
        <button type="button" disabled={busy || !isbn.trim()} onClick={() => void search(isbn)} className={`${buttonStyle} bg-[#806047] text-white`}>
          {busy ? 'Поиск…' : 'Найти книгу'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-xs leading-relaxed text-[#564B41]">
        {message || 'Данные и обложка загружаются из Google Books и Open Library. Для поиска нужен интернет.'}
      </p>
      <div className="border-t border-[#D5C6B4] pt-3 space-y-2">
        {imageSearchUrl ? (
          <a href={imageSearchUrl} target="_blank" rel="noopener noreferrer" onClick={() => {
            setScanning(false);
            if (validIsbn) onFoundRef.current({ isbn: validIsbn });
          }} className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-bold border border-[#D5C6B4] text-[#564B41] bg-[#FCF9F2] hover:bg-white">
            {validIsbn ? 'Найти обложку в Google Картинках' : 'Найти обложку по названию'} ↗
          </a>
        ) : (
          <button type="button" disabled className="rounded-xl px-3 py-2.5 text-xs font-bold border border-[#D5C6B4] text-[#564B41] bg-[#FCF9F2] opacity-50">Найти обложку в Google Картинках ↗</button>
        )}
        <p className="text-xs leading-relaxed text-[#564B41]">
          {imageSearchUrl ? 'Поиск откроется в новой вкладке. Выберите обложку и скопируйте адрес самого изображения, затем вернитесь и нажмите «По ссылке». Или сохраните картинку на телефон и выберите «С устройства».'
            : 'Для поиска обложки введите корректный ISBN. Можно также заполнить название книги и оставить ISBN пустым.'}
        </p>
      </div>
    </div>
  );
}
