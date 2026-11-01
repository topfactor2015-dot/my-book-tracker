export const GARDEN_STAGES = [
  { title: 'Семечко истории', pages: 0, days: 0, message: 'Внутри уже прячется маленькая история.', story: 'Между страницами старого атласа нашлось семечко в бумажном конверте. На конверте было написано: «Посади там, где читают». Ты поставил горшок у книжной полки. Кажется, земля тихонько зашуршала.' },
  { title: 'Первый росток', pages: 10, days: 1, message: 'Смотри: первая история пустила корни.', story: 'Утром из земли показался зелёный крючок. К вечеру он развернул два листочка, похожих на раскрытую книгу. Когда ты начал читать, росток наклонился ближе. Он слушал.' },
  { title: 'Тёплый цветок', pages: 60, days: 2, message: 'Твои страницы превращаются в свет.', story: 'На стебле раскрылся цветок цвета лампового света. В его чашечке лежала крошечная закладка. «Ещё одну главу?» — было выведено на ней неровным почерком. Рядом никто не сидел. Пока.' },
  { title: 'Маленькая тыква', pages: 150, days: 3, message: 'На грядке появился будущий хранитель.', story: 'Цветок уступил место круглой оранжевой тыковке. Теперь по вечерам от горшка пахло осенью и бумажными страницами. Однажды рядом с ним обнаружилась стопка самых маленьких книг. Кто-то явно собирался устроиться надолго.' },
  { title: 'Тыквик проснулся', pages: 300, days: 5, message: 'Теперь у твоего чтения есть слушатель.', story: 'Ты перевернул страницу — и тыква открыла глаза. «Я всё слышал», — прошептал Тыквик. Он поправил листочек на макушке и попросил место поближе к лампе. Оказалось, больше всего ему нравятся истории, которые читают не торопясь.' },
  { title: 'Хранитель историй', pages: 600, days: 7, message: 'Твой книжный уголок обрёл хранителя.', story: 'Внутри Тыквика зажёгся мягкий свет. На полке стало легче находить нужную книгу, а потерянные закладки начали возвращаться сами. «Я побуду здесь», — сказал хранитель. И придвинул тебе следующую историю.' },
];

const validDay = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  return y >= 1000 && m >= 1 && m <= 12 && d >= 1 && d <= new Date(y, m, 0).getDate();
};

export function validateGarden(garden) {
  if (garden == null) return;
  if (typeof garden !== 'object' || Array.isArray(garden) || garden.version !== 1 || garden.character !== 'pumpkin' ||
    typeof garden.plantedAt !== 'string' || !Number.isFinite(Date.parse(garden.plantedAt)) || !validDay(garden.plantedDay) ||
    typeof garden.name !== 'string' || !garden.name.trim() || garden.name.length > 24 ||
    !Array.isArray(garden.baseline) || !garden.baseline.every(row => Array.isArray(row) && row.length === 3 &&
      typeof row[0] === 'string' && validDay(row[1]) && Number.isSafeInteger(row[2]) && row[2] >= 0)) {
    throw new Error('В файле некорректные данные сада историй.');
  }
}

// Aggregate per book/day, so editing or deleting an entry recalculates progress
// instead of granting a second reward for the same pages.
export function readingLedger(books) {
  const ledger = new Map();
  books.forEach(book => {
    (Array.isArray(book.log) ? book.log : []).forEach(entry => {
      const day = typeof entry?.date === 'string' ? entry.date.slice(0, 10) : '';
      const pages = Number(entry?.pages);
      if (!validDay(day) || !Number.isSafeInteger(pages) || pages <= 0) return;
      const bookId = String(book.id);
      const key = JSON.stringify([bookId, day]);
      const old = ledger.get(key);
      ledger.set(key, [bookId, day, (old?.[2] || 0) + pages]);
    });
  });
  return [...ledger.values()];
}

export function plantGarden(books, day, now = new Date()) {
  if (!validDay(day)) throw new Error('Не удалось определить дату посадки.');
  return {
    version: 1, character: 'pumpkin', name: 'Тыквик',
    plantedAt: now.toISOString(), plantedDay: day,
    baseline: readingLedger(books).filter(row => row[1] >= day),
  };
}

export function getGardenProgress(garden, books, today) {
  validateGarden(garden);
  if (!garden || !validDay(today)) return null;
  const baseline = new Map(garden.baseline.map(([id, day, pages]) => [JSON.stringify([id, day]), pages]));
  const days = new Set();
  let pages = 0;
  readingLedger(books).forEach(([id, day, count]) => {
    if (day < garden.plantedDay || day > today) return;
    const added = Math.max(0, count - (baseline.get(JSON.stringify([id, day])) || 0));
    if (added) { pages += added; days.add(day); }
  });
  let stageIndex = 0;
  GARDEN_STAGES.forEach((stage, index) => {
    if (pages >= stage.pages && days.size >= stage.days) stageIndex = index;
  });
  const next = GARDEN_STAGES[stageIndex + 1] || null;
  return { pages, days: days.size, stageIndex, stage: GARDEN_STAGES[stageIndex], next,
    percent: next ? Math.min(100, Math.round(Math.min(pages / next.pages, days.size / next.days) * 100)) : 100 };
}
