// Snapshot of publicly displayed bibliographic metadata; descriptions and covers are not copied.
export const normalizeTopText = value => String(value ?? '').normalize('NFC')
  .toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\(сборник\)/g, '')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

const authorKey = name => normalizeTopText(name).split(' ').sort().join(' ');

export function findTopBook(entry, books) {
  const authors = entry.author.split(',').map(authorKey).filter(Boolean);
  const matches = books.filter(book => String(book.liveLibId ?? '') === entry.id || (
    normalizeTopText(book.title) === normalizeTopText(entry.title) &&
    book.author && book.author.split(',').some(author => authors.includes(authorKey(author)))
  ));
  // A completed copy takes precedence over a wish-listed copy of the same book.
  return matches.find(book => ['read', 'rereading'].includes(book.status)) || matches[0];
}

export const isTopBookRead = book => Boolean(book && ['read', 'rereading'].includes(book.status));

export function createTopBook(entry, status = 'wishlist') {
  return {
    id: Date.now(), liveLibId: entry.id, title: entry.title, author: entry.author,
    genre: 'Проза', seriesName: '', seriesIndex: '', seriesTotal: '',
    status, format: 'paper', totalPages: '', readPages: 0, rating: 0,
    annotation: '', summary: '', quotes: '', coverUrl: '', sketchnoteUrl: '',
    tags: ['Топ-100 LiveLib'], dateStarted: '', dateFinished: '', log: [],
  };
}

export const LIVE_LIB_TOP = {
  "sourceUrl": "https://www.livelib.ru/books/top",
  "checkedAt": "2026-10-19",
  "books": [
    {
      "author": "Джоан Роулинг",
      "id": "1010785139",
      "rank": 1,
      "rating": "4,8",
      "title": "Гарри Поттер и узник Азкабана",
      "url": "https://www.livelib.ru/book/1010785139-garri-potter-i-uznik-azkabana-dzhoan-rouling"
    },
    {
      "author": "Мишель Пейвер, Джоан Роулинг",
      "id": "1000186331",
      "rank": 2,
      "rating": "4,8",
      "title": "Гарри Поттер и Принц-полукровка. Брат Волк (комплект из 2 книг) (сборник)",
      "url": "https://www.livelib.ru/book/1000186331-garri-potter-i-printspolukrovka-brat-volk-komplekt-iz-2-knig-mishel-pejver"
    },
    {
      "author": "Маргарет Митчелл",
      "id": "1015851475",
      "rank": 3,
      "rating": "4,8",
      "title": "Унесенные ветром. Том 2",
      "url": "https://www.livelib.ru/book/1015851475-unesennye-vetrom-tom-2-margaret-mitchell"
    },
    {
      "author": "Маргарет Митчелл",
      "id": "1009203985",
      "rank": 4,
      "rating": "4,7",
      "title": "Унесенные ветром",
      "url": "https://www.livelib.ru/book/1009203985-unesennye-vetrom-margaret-mitchell"
    },
    {
      "author": "Стивен Кинг",
      "id": "1002724724",
      "rank": 5,
      "rating": "4,7",
      "title": "Зеленая миля",
      "url": "https://www.livelib.ru/book/1002724724-zelenaya-milya-stiven-king"
    },
    {
      "author": "Артур Конан Дойл",
      "id": "1012375946",
      "rank": 6,
      "rating": "4,8",
      "title": "Все приключения Шерлока Холмса (сборник)",
      "url": "https://www.livelib.ru/book/1012375946-vse-priklyucheniya-sherloka-holmsa-artur-konan-dojl"
    },
    {
      "author": "Александр Дюма",
      "id": "1012822978",
      "rank": 7,
      "rating": "4,7",
      "title": "Граф Монте-Кристо. Том II",
      "url": "https://www.livelib.ru/book/1012822978-graf-montekristo-tom-ii-aleksandr-dyuma"
    },
    {
      "author": "Евгения Гинзбург",
      "id": "1008547489",
      "rank": 8,
      "rating": "4,8",
      "title": "Крутой маршрут",
      "url": "https://www.livelib.ru/book/1008547489-krutoj-marshrut-evgeniya-ginzburg"
    },
    {
      "author": "Кэтрин Стокетт",
      "id": "1001569364",
      "rank": 9,
      "rating": "4,7",
      "title": "Прислуга",
      "url": "https://www.livelib.ru/book/1001569364-prisluga-ketrin-stokett"
    },
    {
      "author": "Борис Васильев",
      "id": "1010081047",
      "rank": 10,
      "rating": "4,7",
      "title": "В списках не значился",
      "url": "https://www.livelib.ru/book/1010081047-v-spiskah-ne-znachilsya-boris-vasilev"
    },
    {
      "author": "Джон Р. Р. Толкин",
      "id": "1005584599",
      "rank": 11,
      "rating": "4,7",
      "title": "Властелин Колец: Возвращение короля",
      "url": "https://www.livelib.ru/book/1005584599-vlastelin-kolets-vozvraschenie-korolya-dzhon-r-r-tolkin"
    },
    {
      "author": "Александр Дюма",
      "id": "1013202307",
      "rank": 12,
      "rating": "4,7",
      "title": "Граф Монте-Кристо",
      "url": "https://www.livelib.ru/book/1013202307-graf-montekristo-aleksandr-dyuma"
    },
    {
      "author": "Александр Дюма",
      "id": "1015322557",
      "rank": 13,
      "rating": "4,7",
      "title": "Граф Монте-Кристо. Том 1",
      "url": "https://www.livelib.ru/book/1015322557-graf-montekristo-tom-1-aleksandr-dyuma"
    },
    {
      "author": "Джордж Мартин",
      "id": "1005628018",
      "rank": 14,
      "rating": "4,7",
      "title": "Буря мечей",
      "url": "https://www.livelib.ru/book/1005628018-burya-mechej-dzhordzh-martin"
    },
    {
      "author": "Борис Васильев",
      "id": "1016983744",
      "rank": 15,
      "rating": "4,7",
      "title": "А зори здесь тихие. ..",
      "url": "https://www.livelib.ru/book/1016983744-a-zori-zdes-tihie-boris-vasilev"
    },
    {
      "author": "Борис Васильев",
      "id": "1010925299",
      "rank": 16,
      "rating": "4,7",
      "title": "Завтра была война",
      "url": "https://www.livelib.ru/book/1010925299-zavtra-byla-vojna-boris-vasilev"
    },
    {
      "author": "Джонатан Страуд",
      "id": "1002756364",
      "rank": 17,
      "rating": "4,7",
      "title": "Пустая могила",
      "url": "https://www.livelib.ru/book/1002756364-pustaya-mogila-dzhonatan-straud"
    },
    {
      "author": "Ли Бардуго",
      "id": "1002773007",
      "rank": 18,
      "rating": "4,7",
      "title": "Продажное королевство",
      "url": "https://www.livelib.ru/book/1002773007-prodazhnoe-korolevstvo-li-bardugo"
    },
    {
      "author": "Сара Дж. Маас",
      "id": "1006852459",
      "rank": 19,
      "rating": "4,8",
      "title": "Королевство пепла",
      "url": "https://www.livelib.ru/book/1006852459-korolevstvo-pepla-sara-dzh-maas"
    },
    {
      "author": "Джеймс Хэрриот",
      "id": "1006976599",
      "rank": 20,
      "rating": "4,7",
      "title": "О всех созданиях – больших и малых",
      "url": "https://www.livelib.ru/book/1006976599-o-vseh-sozdaniyah-bolshih-i-malyh-dzhejms-herriot"
    },
    {
      "author": "Робин Хобб",
      "id": "1002225089",
      "rank": 21,
      "rating": "4,7",
      "title": "Безумный корабль",
      "url": "https://www.livelib.ru/book/1002225089-bezumnyj-korabl-robin-hobb"
    },
    {
      "author": "Людмила Петрановская",
      "id": "1001496707",
      "rank": 22,
      "rating": "4,7",
      "title": "Тайная опора. Привязанность в жизни ребенка",
      "url": "https://www.livelib.ru/book/1001496707-tajnaya-opora-privyazannost-v-zhizni-rebenka-lyudmila-petranovskaya"
    },
    {
      "author": "Фредрик Бакман",
      "id": "1005586864",
      "rank": 23,
      "rating": "4,6",
      "title": "Вторая жизнь Уве",
      "url": "https://www.livelib.ru/book/1005586864-vtoraya-zhizn-uve-fredrik-bakman"
    },
    {
      "author": "Джон Р. Р. Толкин",
      "id": "1008338995",
      "rank": 24,
      "rating": "4,6",
      "title": "Властелин колец",
      "url": "https://www.livelib.ru/book/1008338995-vlastelin-kolets-dzhon-r-r-tolkin"
    },
    {
      "author": "Брендон Сандерсон",
      "id": "1002225088",
      "rank": 25,
      "rating": "4,8",
      "title": "Архив Буресвета. Книга 2. Слова сияния",
      "url": "https://www.livelib.ru/book/1002225088-arhiv-buresveta-kniga-2-slova-siyaniya-brendon-sanderson"
    },
    {
      "author": "Артур Конан Дойл",
      "id": "1007051965",
      "rank": 26,
      "rating": "4,7",
      "title": "Приключения Шерлока Холмса (сборник)",
      "url": "https://www.livelib.ru/book/1007051965-priklyucheniya-sherloka-holmsa-artur-konan-dojl"
    },
    {
      "author": "Марио Пьюзо",
      "id": "1018208560",
      "rank": 27,
      "rating": "4,6",
      "title": "Крестный отец",
      "url": "https://www.livelib.ru/book/1018208560-krestnyj-otets-mario-pyuzo"
    },
    {
      "author": "Робин Хобб",
      "id": "1002050577",
      "rank": 28,
      "rating": "4,7",
      "title": "Ученик убийцы. Королевский убийца (сборник)",
      "url": "https://www.livelib.ru/book/1002050577-uchenik-ubijtsy-korolevskij-ubijtsa-robin-hobb"
    },
    {
      "author": "Виктор Дашкевич",
      "id": "1017709096",
      "rank": 29,
      "rating": "4,6",
      "title": "Императорский Див. Колдун Российской империи",
      "url": "https://www.livelib.ru/book/1017709096-imperatorskij-div-koldun-rossijskoj-imperii-viktor-dashkevich"
    },
    {
      "author": "Роберт Гэлбрейт",
      "id": "1010742584",
      "rank": 30,
      "rating": "4,8",
      "title": "Бегущая могила",
      "url": "https://www.livelib.ru/book/1010742584-beguschaya-mogila-robert-gelbrejt"
    },
    {
      "author": "Михаил Булгаков",
      "id": "1005579736",
      "rank": 31,
      "rating": "4,7",
      "title": "Записки юного врача (сборник)",
      "url": "https://www.livelib.ru/book/1005579736-zapiski-yunogo-vracha-mihail-bulgakov"
    },
    {
      "author": "Агата Кристи",
      "id": "1006756468",
      "rank": 32,
      "rating": "4,6",
      "title": "Десять негритят",
      "url": "https://www.livelib.ru/book/1006756468-desyat-negrityat-agata-kristi"
    },
    {
      "author": "Дэниел Киз",
      "id": "1010776136",
      "rank": 33,
      "rating": "4,6",
      "title": "Цветы для Элджернона",
      "url": "https://www.livelib.ru/book/1010776136-tsvety-dlya-eldzhernona-deniel-kiz"
    },
    {
      "author": "Халед Хоссейни",
      "id": "1000750889",
      "rank": 34,
      "rating": "4,6",
      "title": "Тысяча сияющих солнц",
      "url": "https://www.livelib.ru/book/1000750889-tysyacha-siyayuschih-solnts-haled-hossejni"
    },
    {
      "author": "Мария Заботина",
      "id": "1011217952",
      "rank": 35,
      "rating": "4,8",
      "title": "Маяк потерянной надежды. Исповедь человека, победившего панические атаки и депрессию",
      "url": "https://www.livelib.ru/book/1011217952-mayak-poteryannoj-nadezhdy-ispoved-cheloveka-pobedivshego-panicheskie-ataki-i-depressiyu-zabotina-mariya-dmitrievna"
    },
    {
      "author": "Эдит Ева Эгер, Швалль-Вейганд Э.",
      "id": "1009349701",
      "rank": 36,
      "rating": "4,6",
      "title": "Выбор. О свободе и внутренней силе человека",
      "url": "https://www.livelib.ru/book/1009349701-vybor-o-svobode-i-vnutrennej-sile-cheloveka-edit-eva-eger"
    },
    {
      "author": "Эрих Мария Ремарк",
      "id": "1016947531",
      "rank": 37,
      "rating": "4,6",
      "title": "Искра жизни",
      "url": "https://www.livelib.ru/book/1016947531-iskra-zhizni-erih-mariya-remark"
    },
    {
      "author": "Наталья Щерба",
      "id": "1001080581",
      "rank": 38,
      "rating": "4,7",
      "title": "Часодеи. Часовая битва",
      "url": "https://www.livelib.ru/book/1001080581-chasodei-chasovaya-bitva-natalya-scherba"
    },
    {
      "author": "Джон Стейнбек",
      "id": "1010078512",
      "rank": 39,
      "rating": "4,6",
      "title": "К востоку от Эдема",
      "url": "https://www.livelib.ru/book/1010078512-k-vostoku-ot-edema-dzhon-stejnbek"
    },
    {
      "author": "Маркус Зусак",
      "id": "1010774984",
      "rank": 40,
      "rating": "4,6",
      "title": "Книжный вор",
      "url": "https://www.livelib.ru/book/1010774984-knizhnyj-vor-markus-zusak"
    },
    {
      "author": "Алексей Пехов",
      "id": "1018228318",
      "rank": 41,
      "rating": "4,7",
      "title": "Проклятый горн",
      "url": "https://www.livelib.ru/book/1018228318-proklyatyj-gorn-aleksej-pehov"
    },
    {
      "author": "Ирвинг Стоун",
      "id": "1003186837",
      "rank": 42,
      "rating": "4,6",
      "title": "Жажда жизни",
      "url": "https://www.livelib.ru/book/1003186837-zhazhda-zhizni-irving-stoun"
    },
    {
      "author": "Екатерина Казакова, Алена Харитонова",
      "id": "1008445836",
      "rank": 43,
      "rating": "4,7",
      "title": "Ходящие в ночи. Книга 3. Пленники раздора",
      "url": "https://www.livelib.ru/book/1008445836-hodyaschie-v-nochi-kniga-3-plenniki-razdora-ekaterina-kazakova-alena-haritonova"
    },
    {
      "author": "Стивен Кинг",
      "id": "1001445982",
      "rank": 44,
      "rating": "4,6",
      "title": "Побег из Шоушенка",
      "url": "https://www.livelib.ru/book/1001445982-pobeg-iz-shoushenka-stiven-king"
    },
    {
      "author": "Виктор Гюго",
      "id": "1004565601",
      "rank": 45,
      "rating": "4,6",
      "title": "Отверженные",
      "url": "https://www.livelib.ru/book/1004565601-otverzhennye-viktor-gyugo"
    },
    {
      "author": "Сара Дж. Маас",
      "id": "1005562174",
      "rank": 46,
      "rating": "4,6",
      "title": "Королевство гнева и тумана",
      "url": "https://www.livelib.ru/book/1005562174-korolevstvo-gneva-i-tumana-sara-dzh-maas"
    },
    {
      "author": "Эрих Мария Ремарк",
      "id": "1008956917",
      "rank": 47,
      "rating": "4,6",
      "title": "На Западном фронте без перемен",
      "url": "https://www.livelib.ru/book/1008956917-na-zapadnom-fronte-bez-peremen-erih-mariya-remark"
    },
    {
      "author": "Илья Ильф, Евгений Петров",
      "id": "1012628185",
      "rank": 48,
      "rating": "4,6",
      "title": "Двенадцать стульев  и  Золотой теленок (комплект из 2-х книг) (сборник)",
      "url": "https://www.livelib.ru/book/1012628185-dvenadtsat-stulev-i-zolotoj-telenok-komplekt-iz-2h-knig"
    },
    {
      "author": "Артур Конан Дойл",
      "id": "1018166602",
      "rank": 49,
      "rating": "4,7",
      "title": "Приключения Шерлока Холмса",
      "url": "https://www.livelib.ru/book/1018166602-priklyucheniya-sherloka-holmsa-artur-konan-dojl"
    },
    {
      "author": "Вениамин Каверин",
      "id": "1010152678",
      "rank": 50,
      "rating": "4,6",
      "title": "Два капитана",
      "url": "https://www.livelib.ru/book/1010152678-dva-kapitana-veniamin-kaverin"
    },
    {
      "author": "Арчибальд Кронин",
      "id": "1008421858",
      "rank": 51,
      "rating": "4,6",
      "title": "Замок Броуди",
      "url": "https://www.livelib.ru/book/1008421858-zamok-broudi-archibald-kronin"
    },
    {
      "author": "Леонид Филатов",
      "id": "1000432960",
      "rank": 52,
      "rating": "4,7",
      "title": "Про Федота-стрельца, удалого молодца (сборник)",
      "url": "https://www.livelib.ru/book/1000432960-pro-fedotastreltsa-udalogo-molodtsa-leonid-filatov"
    },
    {
      "author": "Артур Конан Дойл",
      "id": "1001401495",
      "rank": 53,
      "rating": "4,7",
      "title": "Записки о Шерлоке Холмсе (сборник)",
      "url": "https://www.livelib.ru/book/1001401495-zapiski-o-sherloke-holmse-artur-konan-dojl"
    },
    {
      "author": "Харпер Ли",
      "id": "1018217740",
      "rank": 54,
      "rating": "4,6",
      "title": "Убить пересмешника…",
      "url": "https://www.livelib.ru/book/1018217740-ubit-peresmeshnika-harper-li"
    },
    {
      "author": "Астрид Линдгрен",
      "id": "1008892645",
      "rank": 55,
      "rating": "4,7",
      "title": "Эмиль из Лённеберги",
      "url": "https://www.livelib.ru/book/1008892645-emil-iz-ljonnebergi-astrid-lindgren"
    },
    {
      "author": "Макс Фрай",
      "id": "1008873001",
      "rank": 56,
      "rating": "4,6",
      "title": "Лабиринт Менина (сборник)",
      "url": "https://www.livelib.ru/book/1008873001-labirint-menina-maks-fraj"
    },
    {
      "author": "Артур Конан Дойл",
      "id": "1018156192",
      "rank": 57,
      "rating": "4,6",
      "title": "Собака Баскервилей",
      "url": "https://www.livelib.ru/book/1018156192-sobaka-baskervilej-artur-konan-dojl"
    },
    {
      "author": "Мари-Од Мюрай",
      "id": "1008273178",
      "rank": 58,
      "rating": "4,7",
      "title": "Мисс Черити",
      "url": "https://www.livelib.ru/book/1008273178-miss-cheriti-mariod-myuraj"
    },
    {
      "author": "Михаил Булгаков",
      "id": "1000730276",
      "rank": 59,
      "rating": "4,6",
      "title": "Записки юного врача (сборник)",
      "url": "https://www.livelib.ru/book/1000730276-zapiski-yunogo-vracha-mihail-bulgakov"
    },
    {
      "author": "Гавриил Троепольский",
      "id": "1012237580",
      "rank": 60,
      "rating": "4,6",
      "title": "Белый Бим Чёрное ухо",
      "url": "https://www.livelib.ru/book/1012237580-belyj-bim-chernoe-uho-gavriil-troepolskij"
    },
    {
      "author": "Арчибальд Кронин",
      "id": "1002513813",
      "rank": 61,
      "rating": "4,6",
      "title": "Цитадель",
      "url": "https://www.livelib.ru/book/1002513813-tsitadel-archibald-kronin"
    },
    {
      "author": "Люси Мод Монтгомери",
      "id": "1012557788",
      "rank": 62,
      "rating": "4,6",
      "title": "Аня из Зеленых Мезонинов",
      "url": "https://www.livelib.ru/book/1012557788-anya-iz-zelenyh-mezoninov-lyusi-mod-montgomeri"
    },
    {
      "author": "Лия Арден",
      "id": "1012698871",
      "rank": 63,
      "rating": "4,6",
      "title": "Плетущая",
      "url": "https://www.livelib.ru/book/1012698871-pletuschaya-liya-arden"
    },
    {
      "author": "Макс Фрай",
      "id": "1008478174",
      "rank": 64,
      "rating": "4,6",
      "title": "Темная сторона (Вершитель) (сборник)",
      "url": "https://www.livelib.ru/book/1008478174-temnaya-storona-vershitel-maks-fraj"
    },
    {
      "author": "Анджей Сапковский",
      "id": "1016094979",
      "rank": 65,
      "rating": "4,6",
      "title": "Меч предназначения",
      "url": "https://www.livelib.ru/book/1016094979-mech-prednaznacheniya-andzhej-sapkovskij"
    },
    {
      "author": "Джордж Мартин",
      "id": "1000996148",
      "rank": 66,
      "rating": "4,6",
      "title": "Танец с драконами. Искры над пеплом",
      "url": "https://www.livelib.ru/book/1000996148-tanets-s-drakonami-iskry-nad-peplom-dzhordzh-martin"
    },
    {
      "author": "Аннетт Мари",
      "id": "1003189038",
      "rank": 67,
      "rating": "4,7",
      "title": "Бессмертный огонь",
      "url": "https://www.livelib.ru/book/1003189038-bessmertnyj-ogon-annett-mari"
    },
    {
      "author": "Михаил Булгаков",
      "id": "1018128325",
      "rank": 68,
      "rating": "4,5",
      "title": "Мастер и Маргарита",
      "url": "https://www.livelib.ru/book/1018128325-master-i-margarita-mihail-bulgakov"
    },
    {
      "author": "Алан Мур, Дэйв Гиббонс",
      "id": "1008918100",
      "rank": 69,
      "rating": "4,7",
      "title": "Хранители. Абсолютное издание",
      "url": "https://www.livelib.ru/book/1008918100-hraniteli-absolyutnoe-izdanie-alan-mur-dejv-gibbons"
    },
    {
      "author": "Кир Булычёв",
      "id": "1012391492",
      "rank": 70,
      "rating": "4,6",
      "title": "Поселок",
      "url": "https://www.livelib.ru/book/1012391492-poselok-kir-bulychjov"
    },
    {
      "author": "Софи Анри",
      "id": "1009920865",
      "rank": 71,
      "rating": "4,7",
      "title": "Король Ардена",
      "url": "https://www.livelib.ru/book/1009920865-korol-ardena-sofi-anri"
    },
    {
      "author": "О. Генри",
      "id": "1010753069",
      "rank": 72,
      "rating": "4,6",
      "title": "Дары волхвов",
      "url": "https://www.livelib.ru/book/1010753069-dary-volhvov-o-genri"
    },
    {
      "author": "Хадзимэ Исаяма",
      "id": "1001478063",
      "rank": 73,
      "rating": "4,7",
      "title": "Атака на Титанов. Книга 1",
      "url": "https://www.livelib.ru/book/1001478063-ataka-na-titanov-kniga-1-hadzime-isayama"
    },
    {
      "author": "Александр Волков",
      "id": "1016999989",
      "rank": 74,
      "rating": "4,6",
      "title": "Волшебник Изумрудного города. Рис. Л. Владимирского",
      "url": "https://www.livelib.ru/book/1016999989-volshebnik-izumrudnogo-goroda-aleksandr-volkov"
    },
    {
      "author": "Джек Лондон",
      "id": "1012765963",
      "rank": 75,
      "rating": "4,6",
      "title": "Белый клык",
      "url": "https://www.livelib.ru/book/1012765963-belyj-klyk"
    },
    {
      "author": "Агата Кристи",
      "id": "1008483198",
      "rank": 76,
      "rating": "4,5",
      "title": "Убийство в \"Восточном экспрессе\". Murder on the Orient Express (сборник)",
      "url": "https://www.livelib.ru/book/1008483198-ubijstvo-v-vostochnom-ekspresse-murder-on-the-orient-express-agata-kristi"
    },
    {
      "author": "Кристин Ханна",
      "id": "1001514718",
      "rank": 77,
      "rating": "4,6",
      "title": "Соловей",
      "url": "https://www.livelib.ru/book/1001514718-solovej-kristin-hanna"
    },
    {
      "author": "Макс Фрай",
      "id": "1008480872",
      "rank": 78,
      "rating": "4,6",
      "title": "Власть несбывшегося (сборник)",
      "url": "https://www.livelib.ru/book/1008480872-vlast-nesbyvshegosya-maks-fraj"
    },
    {
      "author": "Терри Пратчетт",
      "id": "1007496565",
      "rank": 79,
      "rating": "4,6",
      "title": "К оружию! К оружию!",
      "url": "https://www.livelib.ru/book/1007496565-k-oruzhiyu-k-oruzhiyu-terri-pratchett"
    },
    {
      "author": "Джей Кристофф",
      "id": "1002950803",
      "rank": 80,
      "rating": "4,6",
      "title": "Годсгрейв",
      "url": "https://www.livelib.ru/book/1002950803-godsgrejv-dzhej-kristoff"
    },
    {
      "author": "Ольга Громыко",
      "id": "1002737695",
      "rank": 81,
      "rating": "4,6",
      "title": "Ведьма-хранительница",
      "url": "https://www.livelib.ru/book/1002737695-vedmahranitelnitsa-olga-gromyko"
    },
    {
      "author": "Элинор Портер",
      "id": "1013125234",
      "rank": 82,
      "rating": "4,6",
      "title": "Поллианна",
      "url": "https://www.livelib.ru/book/1013125234-pollianna-per-batischevoj"
    },
    {
      "author": "Джо Аберкромби",
      "id": "1004187547",
      "rank": 83,
      "rating": "4,6",
      "title": "Первый Закон. Прежде чем их повесят",
      "url": "https://www.livelib.ru/book/1004187547-pervyj-zakon-prezhde-chem-ih-povesyat-dzho-aberkrombi"
    },
    {
      "author": "Макс Фрай",
      "id": "1008480870",
      "rank": 84,
      "rating": "4,6",
      "title": "Наваждения (сборник)",
      "url": "https://www.livelib.ru/book/1008480870-navazhdeniya-maks-fraj"
    },
    {
      "author": "Эрих Мария Ремарк",
      "id": "1016758387",
      "rank": 85,
      "rating": "4,5",
      "title": "Три товарища",
      "url": "https://www.livelib.ru/book/1016758387-tri-tovarischa-erih-mariya-remark"
    },
    {
      "author": "О. Генри, Муравьев В.С., Урнов М.В.",
      "id": "1018221151",
      "rank": 86,
      "rating": "4,6",
      "title": "Дары волхвов",
      "url": "https://www.livelib.ru/book/1018221151-dary-volhvov-o-genri"
    },
    {
      "author": "Стивен Кинг",
      "id": "1006202149",
      "rank": 87,
      "rating": "4,5",
      "title": "11/22/63",
      "url": "https://www.livelib.ru/book/1006202149-112263-stiven-king"
    }
  ]
};

