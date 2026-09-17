import React, { useState, useMemo, useRef, useEffect } from 'react';

const PlusIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125 cursor-pointer" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const XIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125 cursor-pointer" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ChevronRightIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125 cursor-pointer" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125 cursor-pointer" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const BookOpenIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const SmartphoneIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const HeadphonesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>;
const LayersIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>;
const TrophyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const TrashIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const TagIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const ClockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const TargetIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const PlayIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const SquareIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const Edit3Icon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 hover:scale-125" {...props}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;

const PREDEFINED_GENRES = ["Фантастика", "Фэнтези", "Детектив", "Психология", "Бизнес", "Роман", "Триллер", "Нон-фикшн"];
const FORMATS = [
  { id: 'paper', label: 'Бумажная', icon: BookOpenIcon },
  { id: 'ebook', label: 'Электронная', icon: SmartphoneIcon },
  { id: 'audio', label: 'Аудио', icon: HeadphonesIcon },
  { id: 'combo', label: 'Комбо', icon: LayersIcon }
];
const STATUSES = [
  { id: 'wishlist', label: 'Виш-лист' },
  { id: 'reading', label: 'Читаю сейчас' },
  { id: 'rereading', label: 'Перечитываю' },
  { id: 'read', label: 'Прочитано' },
  { id: 'dropped', label: 'Брошено' }
];

const getMoscowDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowTime = new Date(utc + (3 * 3600000));
  moscowTime.setHours(0, 0, 0, 0);
  return moscowTime;
};

const getMoscowDateString = (daysAgo = 0) => {
  const d = getMoscowDate();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const INITIAL_BOOKS = [
  {
    id: 1, title: 'Задача трех тел', author: 'Лю Цысинь', status: 'reading', genre: 'Фантастика', format: 'paper',
    totalPages: 464, readPages: 180, rating: 0, annotation: 'Секретный военный проект «Красный берег» посылает сигналы внеземной цивилизации...', summary: '', quotes: '', 
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['космос', 'научная фантастика'],
    dateStarted: getMoscowDateString(5),
    log: [
      { date: getMoscowDateString(4), pages: 50, minutes: 75 }, 
      { date: getMoscowDateString(2), pages: 60, minutes: 90 }, 
      { date: getMoscowDateString(0), pages: 70, minutes: 105 }
    ]
  },
  {
    id: 2, title: 'Атомные привычки', author: 'Джеймс Клир', status: 'reading', genre: 'Психология', format: 'audio',
    totalPages: 320, readPages: 110, rating: 0, annotation: 'Как приобрести хорошие привычки и избавиться от плохих.', summary: '', quotes: '', 
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['саморазвитие', 'продуктивность'],
    dateStarted: getMoscowDateString(3),
    log: [
      { date: getMoscowDateString(3), pages: 40, minutes: 60 },
      { date: getMoscowDateString(1), pages: 70, minutes: 105 }
    ]
  },
  {
    id: 3, title: 'Дюна', author: 'Фрэнк Герберт', status: 'read', genre: 'Фантастика', format: 'combo',
    totalPages: 700, readPages: 700, rating: 5, annotation: 'История Пола Атрейдеса на пустынной планете Арракис...', summary: 'Эпично и масштабно. Лучшая фантастика столетия.', quotes: 'Я не должен бояться. Страх — убийца разума.',
    coverUrl: 'https://images.unsplash.com/photo-1546552356-372989cfa124?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['любимое', 'классика'],
    dateStarted: getMoscowDateString(30), dateFinished: getMoscowDateString(15), 
    log: [
      { date: getMoscowDateString(28), pages: 100, minutes: 150 },
      { date: getMoscowDateString(20), pages: 200, minutes: 300 }
    ]
  },
  {
    id: 4, title: 'Шантарам', author: 'Грегори Дэвид Робертс', status: 'read', genre: 'Роман', format: 'paper',
    totalPages: 850, readPages: 850, rating: 5, annotation: 'Побег из австралийской тюрьмы и новая жизнь в трущобах Бомбея.', summary: 'Невероятная атмосфера Индии и глубокие философские мысли.', quotes: 'Судьба — это не то, что случается с нами, а то, как мы к этому относимся.',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['индия', 'бестселлер'],
    dateStarted: getMoscowDateString(45), dateFinished: getMoscowDateString(20), log: []
  },
  {
    id: 5, title: 'Портрет Дориана Грея', author: 'Оскар Уайльд', status: 'read', genre: 'Фэнтези', format: 'ebook',
    totalPages: 320, readPages: 320, rating: 4, annotation: 'История молодого человека, чья душа стареет на портрете, пока он сам остается вечно молодым.', summary: 'Великолепный слог и глубокий моральный подтекст.', quotes: 'Единственный способ избавиться от искушения — поддаться ему.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['классика', 'философия'],
    dateStarted: getMoscowDateString(60), dateFinished: getMoscowDateString(50), log: []
  },
  {
    id: 6, title: 'Убийство в Восточном экспрессе', author: 'Агата Кристи', status: 'read', genre: 'Детектив', format: 'audio',
    totalPages: 250, readPages: 250, rating: 5, annotation: 'Знаменитый детектив Эркюль Пуаро расследует загадочное убийство в застрявшем в снегу поезде.', summary: 'Непревзойдённая интрига до самой последней страницы.', quotes: 'Когда исключено невозможное, то, что останется, как ни невероятно, и есть правда.',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['детектив', 'пуаро'],
    dateStarted: getMoscowDateString(70), dateFinished: getMoscowDateString(65), log: []
  },
  {
    id: 7, title: 'Цветы для Элджернона', author: 'Дэниел Киз', status: 'read', genre: 'Фантастика', format: 'paper',
    totalPages: 310, readPages: 310, rating: 5, annotation: 'Эксперимент по улучшению интеллекта умственно отсталого уборщика и лабораторной мыши.', summary: 'До глубины души трогательная история.', quotes: 'Я не знаю, что хуже — не знать ничего и быть счастливым дураком или знать всё и страдать.',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['драма', 'научно-фантастическое'],
    dateStarted: getMoscowDateString(90), dateFinished: getMoscowDateString(82), log: []
  },
  {
    id: 8, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', status: 'wishlist', genre: 'Фэнтези', format: 'paper',
    totalPages: 480, readPages: 0, rating: 0, annotation: 'Визит Воланда и его свиты в Москву 1930-х годов.', summary: '', quotes: '',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['классика', 'мистика'],
    dateStarted: '', dateFinished: '', log: []
  },
  {
    id: 9, title: '1984', author: 'Джордж Оруэлл', status: 'wishlist', genre: 'Фантастика', format: 'ebook',
    totalPages: 320, readPages: 0, rating: 0, annotation: 'Мрачная антиутопия о тоталитарном обществе и партии.', summary: '', quotes: '',
    coverUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['антиутопия', 'политика'],
    dateStarted: '', dateFinished: '', log: []
  },
  {
    id: 10, title: 'Тёмная Башня: Стрелок', author: 'Стивен Кинг', status: 'wishlist', genre: 'Фэнтези', format: 'paper',
    totalPages: 300, readPages: 0, rating: 0, annotation: 'Стрелок Роланд преследует Человека в черном по пустыне.', summary: '', quotes: '',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['фэнтези', 'кинг'],
    dateStarted: '', dateFinished: '', log: []
  },
  {
    id: 11, title: 'Психология влияния', author: 'Роберт Чалдини', status: 'wishlist', genre: 'Психология', format: 'audio',
    totalPages: 400, readPages: 0, rating: 0, annotation: 'Как люди принимают решения и почему соглашаются.', summary: '', quotes: '',
    coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['психология', 'бизнес'],
    dateStarted: '', dateFinished: '', log: []
  },
  {
    id: 12, title: 'Сила подсознания', author: 'Джо Диспенза', status: 'wishlist', genre: 'Нон-фикшн', format: 'combo',
    totalPages: 380, readPages: 0, rating: 0, annotation: 'Как изменить привычки и запрограммировать мозг на успех.', summary: '', quotes: '',
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['мотивация', 'саморазвитие'],
    dateStarted: '', dateFinished: '', log: []
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('diary'); 
  
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem('warm_readingTrackerBooks_v6');
      if (savedBooks) return JSON.parse(savedBooks);
    } catch (e) { console.error(e); }
    return INITIAL_BOOKS;
  });

  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem('warm_readingTrackerGoals_v6');
      if (savedGoals) return JSON.parse(savedGoals);
    } catch (e) { console.error(e); }
    return { yearly: 20, monthly: 5 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('warm_readingTrackerBooks_v6', JSON.stringify(books));
    } catch (e) { console.error(e); }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('warm_readingTrackerGoals_v6', JSON.stringify(goals));
    } catch (e) { console.error(e); }
  }, [goals]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [customModal, setCustomModal] = useState(null); 
  
  const [filter, setFilter] = useState('all'); 
  const [genreFilter, setGenreFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [logPagesInput, setLogPagesInput] = useState({});
  const [logMinutesInput, setLogMinutesInput] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => getMoscowDate());
  const [currentMonth, setCurrentMonth] = useState(() => getMoscowDate());

  const [tournamentPhase, setTournamentPhase] = useState('setup');
  const [selectedForTournament, setSelectedForTournament] = useState([]);
  const [bracketSize, setBracketSize] = useState(4);
  const [currentRound, setCurrentRound] = useState([]);
  const [nextRound, setNextRound] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [tournamentWinner, setTournamentWinner] = useState(null);

  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState(0);

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerDisplay(Math.floor((Date.now() - activeTimer.start) / 1000) + activeTimer.elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const toggleTimer = (bookId) => {
    if (activeTimer && activeTimer.bookId === bookId) {
      const mins = Math.ceil(timerDisplay / 60);
      const currentInput = parseInt(logMinutesInput[bookId] || 0);
      setLogMinutesInput(prev => ({ ...prev, [bookId]: currentInput + mins }));
      setActiveTimer(null);
      setTimerDisplay(0);
    } else {
      if (activeTimer) {
        const mins = Math.ceil(timerDisplay / 60);
        const currentInput = parseInt(logMinutesInput[activeTimer.bookId] || 0);
        setLogMinutesInput(prev => ({ ...prev, [activeTimer.bookId]: currentInput + mins }));
      }
      setActiveTimer({ bookId, start: Date.now(), elapsed: 0 });
      setTimerDisplay(0);
    }
  };

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const uniqueAuthors = Array.from(new Set(books.map(b => b.author).filter(Boolean))).sort();
  const uniqueGenres = Array.from(new Set(books.map(b => b.genre).filter(Boolean))).sort();
  const uniqueTags = Array.from(new Set(books.flatMap(b => b.tags || []).filter(Boolean))).sort();

  const filteredBooks = books.filter(book => {
    const statusMatch = filter === 'all' || 
      book.status === filter || 
      (filter === 'reading' && (book.status === 'reading' || book.status === 'rereading'));
    const genreMatch = genreFilter === 'all' || book.genre === genreFilter;
    const authorMatch = authorFilter === 'all' || book.author === authorFilter;
    const tagMatch = tagFilter === 'all' || (book.tags && book.tags.includes(tagFilter));
    const searchMatch = !searchQuery || 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return statusMatch && genreMatch && authorMatch && tagMatch && searchMatch;
  });

  const activeBooks = books.filter(b => b.status === 'reading' || b.status === 'rereading');
  const readBooks = books.filter(b => b.status === 'read');

  const todayMoscow = getMoscowDate();
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const calendarDays = [];
  for(let i = 0; i < firstDay; i++) calendarDays.push(null);
  
  for(let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    d.setHours(0, 0, 0, 0);
    
    let pagesOnDate = 0;
    let minutesOnDate = 0;
    books.forEach(b => {
      if (b.log) {
        b.log.forEach(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0,0,0,0);
          if (entryDate.getTime() === d.getTime()) {
            pagesOnDate += entry.pages || 0;
            minutesOnDate += entry.minutes || 0;
          }
        });
      }
    });
    
    calendarDays.push({ date: d, pages: pagesOnDate, minutes: minutesOnDate });
  }

  let avgDivisor = daysInMonth;
  if (currentMonth.getFullYear() === todayMoscow.getFullYear() && currentMonth.getMonth() === todayMoscow.getMonth()) {
    avgDivisor = todayMoscow.getDate() || 1;
  } else if (currentMonth > todayMoscow) {
    avgDivisor = 1; 
  }
  
  const totalPagesThisMonth = calendarDays.reduce((acc, day) => day ? acc + day.pages : acc, 0);
  const totalMinutesThisMonth = calendarDays.reduce((acc, day) => day ? acc + day.minutes : acc, 0);
  const avgPagesPerDay = Math.round(totalPagesThisMonth / avgDivisor);
  
  const totalReadBooks = readBooks.length;
  const totalReadPages = books.reduce((sum, b) => sum + (b.readPages || 0), 0);
  const totalMinutesAllTime = books.reduce((sum, b) => {
    return sum + (b.log ? b.log.reduce((s, entry) => s + (entry.minutes || 0), 0) : 0);
  }, 0);

  const currentYear = todayMoscow.getFullYear();
  const readThisYear = readBooks.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length;
  
  const targetMonthNum = currentMonth.getMonth();
  const targetYearNum = currentMonth.getFullYear();
  const readThisTargetMonth = readBooks.filter(b => b.dateFinished && new Date(b.dateFinished).getMonth() === targetMonthNum && new Date(b.dateFinished).getFullYear() === targetYearNum);

  const handleDateClick = (date) => {
    if (date <= todayMoscow) setSelectedDate(date);
  };

  const openNewBookModal = () => {
    setCurrentBook({
      id: Date.now(),
      title: '', author: '', genre: '', status: 'wishlist', format: 'paper',
      totalPages: '', readPages: 0, rating: 0, annotation: '', summary: '', quotes: '', coverUrl: '',
      tags: [], dateStarted: '', dateFinished: '', log: []
    });
    setIsModalOpen(true);
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!currentBook.title) return;
    
    let updatedBook = { ...currentBook };
    const todayStr = getMoscowDateString(0);
    const existingBook = books.find(b => b.id === updatedBook.id);
    
    if (!existingBook && (updatedBook.status === 'reading' || updatedBook.status === 'rereading') && !updatedBook.dateStarted) {
      updatedBook.dateStarted = todayStr;
    } else if (existingBook) {
      const wasActive = existingBook.status === 'reading' || existingBook.status === 'rereading';
      const isNowActive = updatedBook.status === 'reading' || updatedBook.status === 'rereading';
      
      if (!wasActive && isNowActive && !updatedBook.dateStarted) {
        updatedBook.dateStarted = todayStr;
      }
      if (existingBook.status !== 'read' && updatedBook.status === 'read' && !updatedBook.dateFinished) {
        updatedBook.dateFinished = todayStr;
        if(updatedBook.totalPages) updatedBook.readPages = updatedBook.totalPages; 
      }
    }

    if (existingBook) {
      setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    } else {
      setBooks([...books, updatedBook]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteBook = (id) => {
    setCustomModal({
      title: 'Удалить эту книгу из библиотеки?',
      type: 'confirm',
      onSubmit: () => {
         setBooks(books.filter(b => b.id !== id));
         setIsModalOpen(false);
         setCustomModal(null);
      }
    });
  };

  const handleLogProgress = (bookId) => {
    const pagesStr = logPagesInput[bookId];
    const minsStr = logMinutesInput[bookId];
    
    const pages = pagesStr ? parseInt(pagesStr, 10) : 0;
    const minutes = minsStr ? parseInt(minsStr, 10) : Math.round(pages * 1.5);
    
    if (pages <= 0 && minutes <= 0) return;

    setBooks(books.map(b => {
      if (b.id === bookId) {
        const dateStr = selectedDate.toISOString();
        const newLog = [...(b.log || []), { date: dateStr, pages, minutes }];
        const newReadPages = (b.readPages || 0) + pages;
        
        let newStatus = b.status;
        let newFinished = b.dateFinished;
        
        if (b.totalPages && newReadPages >= b.totalPages && newStatus !== 'read') {
          newStatus = 'read';
          newFinished = getMoscowDateString(0);
        }

        return { ...b, readPages: newReadPages, status: newStatus, log: newLog, dateFinished: newFinished };
      }
      return b;
    }));

    setLogPagesInput(prev => ({ ...prev, [bookId]: '' }));
    setLogMinutesInput(prev => ({ ...prev, [bookId]: '' }));
  };

  const handleQuickFinish = (bookId) => {
    setBooks(books.map(b => {
      if (b.id === bookId) {
        const remaining = (b.totalPages || 0) - (b.readPages || 0);
        const dateStr = selectedDate.toISOString();
        const newLog = [...(b.log || [])];
        if (remaining > 0) {
          newLog.push({ date: dateStr, pages: remaining, minutes: Math.round(remaining * 1.5) });
        }
        return { 
          ...b, readPages: b.totalPages, status: 'read', 
          log: newLog, dateFinished: b.dateFinished || getMoscowDateString(0) 
        };
      }
      return b;
    }));
  };

  const calculateDaysToRead = (start, end) => {
    if (!start || !end) return null;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays === 0 ? 1 : diffDays; 
  };

  const toggleTournamentSelection = (id) => {
    if (selectedForTournament.includes(id)) {
      setSelectedForTournament(selectedForTournament.filter(bookId => bookId !== id));
    } else {
      if (selectedForTournament.length < bracketSize) setSelectedForTournament([...selectedForTournament, id]);
    }
  };

  const startTournament = () => {
    if (selectedForTournament.length !== bracketSize) return;
    const participants = selectedForTournament.map(id => books.find(b => b.id === id));
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }
    const firstRound = [];
    for (let i = 0; i < participants.length; i += 2) firstRound.push([participants[i], participants[i+1]]);
    
    setCurrentRound(firstRound);
    setNextRound([]);
    setCurrentMatchIndex(0);
    setTournamentPhase('bracket');
    setTournamentWinner(null);
  };

  const selectWinner = (winnerBook) => {
    const updatedNextRound = [...nextRound, winnerBook];
    if (currentMatchIndex + 1 < currentRound.length) {
      setNextRound(updatedNextRound);
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      if (updatedNextRound.length === 1) {
        setTournamentWinner(updatedNextRound[0]);
        setTournamentPhase('winner');
      } else {
        const newRound = [];
        for (let i = 0; i < updatedNextRound.length; i += 2) newRound.push([updatedNextRound[i], updatedNextRound[i+1]]);
        setCurrentRound(newRound);
        setNextRound([]);
        setCurrentMatchIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#4A4238] font-sans pb-20 selection:bg-[#EEDFCC]">
      
      {/* Top Navigation */}
      <div className="bg-[#F7F2E8] border-b border-[#EADFCF] sticky top-0 z-10 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="font-black text-2xl text-[#846851] tracking-tight flex items-center gap-2">
            <BookOpenIcon size={28} className="text-[#9C7A5E]" />
            КнигоТрекер
          </div>
          <div className="flex bg-[#EFE7D8] rounded-2xl p-1 shadow-inner overflow-x-auto border border-[#E2D5C3]">
            <button onClick={() => setActiveTab('diary')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'diary' ? 'bg-[#FFFFFF] text-[#846851] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Дневник</button>
            <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'library' ? 'bg-[#FFFFFF] text-[#846851] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Библиотека</button>
            <button onClick={() => setActiveTab('tournament')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'tournament' ? 'bg-[#FFFFFF] text-[#846851] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Турнир</button>
          </div>
        </div>
      </div>

      <main className="pt-8 max-w-6xl mx-auto px-4">
        
        {/* ================= DIARY TAB ================= */}
        {activeTab === 'diary' && (
          <div className="animate-fade-in space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[#F7F2E8] p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#9C7A5E] mb-1">{totalReadBooks}</span>
                <span className="text-[10px] font-bold text-[#948477] uppercase tracking-wider">Прочитано</span>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#6F8E80] mb-1">{totalReadPages}</span>
                <span className="text-[10px] font-bold text-[#948477] uppercase tracking-wider">Всего страниц</span>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#9E82A8] mb-1">{Math.floor(totalMinutesAllTime/60)}<span className="text-lg">ч</span> {totalMinutesAllTime%60}<span className="text-lg">м</span></span>
                <span className="text-[10px] font-bold text-[#948477] uppercase tracking-wider">Время за чтением</span>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#C98E5E] mb-1">{activeBooks.length}</span>
                <span className="text-[10px] font-bold text-[#948477] uppercase tracking-wider">В процессе</span>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center md:col-span-1 col-span-2">
                <span className="text-3xl font-black text-[#62839F] mb-1">{avgPagesPerDay}</span>
                <span className="text-[10px] font-bold text-[#948477] uppercase tracking-wider">Стр/день (за мес.)</span>
              </div>
            </div>

            {/* Goals Row */}
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-[#BFA892] rounded-3xl p-5 shadow-sm text-white flex items-center gap-4 relative overflow-hidden">
                 <div className="absolute right-[-20px] opacity-15"><TargetIcon size={120} /></div>
                 <div className="flex-1 relative z-10">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-[#F9F4EC]">Цель на {currentYear} год</span>
                     <button onClick={() => {
                       setCustomModal({
                         title: 'Изменить годовую цель:', type: 'prompt', defaultValue: goals.yearly,
                         onSubmit: (val) => { if (val && !isNaN(val)) { setGoals({...goals, yearly: Number(val)}); setCustomModal(null); } }
                       });
                     }} className="flex items-center gap-2 text-2xl font-black hover:text-[#FAF0E6] transition-colors group cursor-pointer bg-white/20 px-3.5 py-1.5 rounded-2xl shadow-sm">
                       {readThisYear} / {goals.yearly}
                       <Edit3Icon size={16} className="text-white" />
                     </button>
                   </div>
                   <div className="w-full bg-[#9A8470]/50 rounded-full h-2.5">
                      <div className="bg-[#FAF0E6] h-2.5 rounded-full transition-all" style={{width: `${Math.min(100, (readThisYear/goals.yearly)*100)}%`}}></div>
                   </div>
                 </div>
               </div>

               <div className="bg-[#A896B5] rounded-3xl p-5 shadow-sm text-white flex items-center gap-4 relative overflow-hidden">
                 <div className="absolute right-[-20px] opacity-15"><BookOpenIcon size={120} /></div>
                 <div className="flex-1 relative z-10">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-[#F9F4EC]">Цель на {currentMonth.toLocaleDateString('ru-RU', {month:'long'})}</span>
                     <button onClick={() => {
                       setCustomModal({
                         title: 'Изменить месячную цель:', type: 'prompt', defaultValue: goals.monthly,
                         onSubmit: (val) => { if (val && !isNaN(val)) { setGoals({...goals, monthly: Number(val)}); setCustomModal(null); } }
                       });
                     }} className="flex items-center gap-2 text-2xl font-black hover:text-[#FAF0E6] transition-colors group cursor-pointer bg-white/20 px-3.5 py-1.5 rounded-2xl shadow-sm">
                       {readThisTargetMonth.length} / {goals.monthly}
                       <Edit3Icon size={16} className="text-white" />
                     </button>
                   </div>
                   <div className="w-full bg-[#83738F]/50 rounded-full h-2.5">
                      <div className="bg-[#FAF0E6] h-2.5 rounded-full transition-all" style={{width: `${Math.min(100, (readThisTargetMonth.length/goals.monthly)*100)}%`}}></div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              
              {/* Tracker / Log column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F7F2E8] p-5 rounded-3xl border border-[#EADFCF] shadow-sm gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#564B41] flex items-center gap-2">
                      <span className="bg-[#EFE7D8] text-[#846851] p-2 rounded-2xl"><ClockIcon size={20}/></span>
                      Записи за: {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    {selectedDate.toDateString() === todayMoscow.toDateString() && (
                      <span className="inline-block bg-[#DDEAE3] text-[#4F6F61] text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">Сегодня (Москва)</span>
                    )}
                  </div>
                  <button onClick={openNewBookModal} className="bg-[#A68970] hover:bg-[#92745C] text-white w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <PlusIcon size={18}/> Добавить книгу
                  </button>
                </div>

                {activeBooks.length === 0 ? (
                  <div className="bg-[#F7F2E8] border-2 border-dashed border-[#DDD0BE] rounded-3xl p-10 text-center">
                    <div className="text-[#BAACA0] mb-3 flex justify-center"><BookOpenIcon size={48} /></div>
                    <h3 className="text-lg font-bold text-[#675B50] mb-1">Вы сейчас ничего не читаете</h3>
                    <p className="text-[#948477] text-sm mb-4">Нажмите кнопку выше, чтобы добавить книгу.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBooks.map(book => {
                      const pagesOnSelectedDate = book.log?.reduce((acc, entry) => new Date(entry.date).toDateString() === selectedDate.toDateString() ? acc + (entry.pages||0) : acc, 0) || 0;
                      const minsOnSelectedDate = book.log?.reduce((acc, entry) => new Date(entry.date).toDateString() === selectedDate.toDateString() ? acc + (entry.minutes||0) : acc, 0) || 0;

                      return (
                        <div key={book.id} className="bg-[#F7F2E8] rounded-3xl p-5 shadow-sm border border-[#EADFCF]">
                          <div className="flex gap-4">
                            <div className="w-16 sm:w-20 aspect-[3/4] bg-[#EFE7D8] rounded-2xl shrink-0 overflow-hidden shadow-sm border border-[#E2D5C3] relative">
                               {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                               ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#EAE2D2] text-[#846851] p-2 text-center text-[10px] font-bold leading-tight">
                                  {book.title}
                                </div>
                               )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                   <h3 className="font-bold text-base sm:text-lg text-[#4A4238] line-clamp-1">{book.title}</h3>
                                   {book.status === 'rereading' && <span className="text-[10px] bg-[#EFE4D3] text-[#9E7749] px-2.5 py-0.5 rounded-full font-bold ml-2 shrink-0">Перечитываю</span>}
                                </div>
                                <p className="text-xs sm:text-sm text-[#847466] mb-2">{book.author}</p>
                                
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-[#74675B] mb-1">
                                  <span>Прогресс</span>
                                  <span>{book.readPages || 0} / {book.totalPages || '?'} стр.</span>
                                </div>
                                <div className="w-full bg-[#EADFCF] rounded-full h-2 shadow-inner overflow-hidden">
                                  <div className="bg-[#9ABAA9] h-2 rounded-full transition-all duration-500" style={{ width: `${book.totalPages ? Math.min(100, Math.round(((book.readPages || 0) / book.totalPages) * 100)) : 0}%` }}></div>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button 
                                  onClick={() => toggleTimer(book.id)} 
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${activeTimer?.bookId === book.id ? 'bg-[#D67C6B] text-white animate-pulse' : 'bg-[#EADFCF] hover:bg-[#DDD0BE] text-[#564B41]'}`}
                                >
                                  {activeTimer?.bookId === book.id ? <SquareIcon size={14} /> : <PlayIcon size={14} />}
                                  {activeTimer?.bookId === book.id ? formatTimer(timerDisplay) : 'Таймер'}
                                </button>
                                <input 
                                  type="number" placeholder="+ стр" 
                                  value={logPagesInput[book.id] || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setLogPagesInput({...logPagesInput, [book.id]: val});
                                    if (val && !isNaN(val)) {
                                      setLogMinutesInput(prev => ({...prev, [book.id]: Math.round(Number(val) * 1.5)}));
                                    } else {
                                      setLogMinutesInput(prev => ({...prev, [book.id]: ''}));
                                    }
                                  }}
                                  className="w-16 sm:w-20 bg-[#FCF9F2] border border-[#EADFCF] rounded-xl px-2 py-2 text-xs font-bold outline-none focus:border-[#A68970] text-center"
                                />
                                <input 
                                  type="number" placeholder="+ мин" value={logMinutesInput[book.id] || ''} onChange={(e) => setLogMinutesInput({...logMinutesInput, [book.id]: e.target.value})}
                                  className="w-16 sm:w-20 bg-[#FCF9F2] border border-[#EADFCF] rounded-xl px-2 py-2 text-xs font-bold outline-none focus:border-[#A68970] text-center"
                                />
                                <button onClick={() => handleLogProgress(book.id)} className="bg-[#A68970] hover:bg-[#92745C] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                                  Записать
                                </button>
                                {book.totalPages && (book.readPages || 0) < book.totalPages && (
                                  <button onClick={() => handleQuickFinish(book.id)} title="Дочитал до конца!" className="bg-[#DDEAE3] hover:bg-[#C9DEC2] text-[#4F6F61] p-2 rounded-xl transition-colors ml-auto sm:ml-0 shadow-sm">
                                    <CheckIcon size={18} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs font-bold flex flex-wrap gap-2">
                            <span className="bg-[#EFE7D8] text-[#74675B] px-3 py-1.5 rounded-xl border border-[#E2D5C3] flex items-center gap-1">
                              За {selectedDate.toLocaleDateString()}: {pagesOnSelectedDate} стр. / {minsOnSelectedDate} мин.
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Calendar Column */}
              <div className="bg-[#F7F2E8] rounded-3xl p-5 shadow-sm border border-[#EADFCF] sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-lg text-[#564B41] capitalize">
                    {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => setIsSummaryModalOpen(true)} className="text-[#846851] bg-[#EADFCF] hover:bg-[#DDD0BE] px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm">
                    <CameraIcon size={14}/> Итоги
                  </button>
                </div>
                
                <div className="flex justify-between mb-4">
                   <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1.5 hover:bg-[#EADFCF] rounded-xl text-[#74675B]"><ChevronLeftIcon size={20}/></button>
                   <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1.5 hover:bg-[#EADFCF] rounded-xl text-[#74675B]"><ChevronRightIcon size={20}/></button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                    <div key={d} className="text-[10px] font-black text-[#9B8C80]">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="aspect-square"></div>;
                    
                    const isToday = day.date.toDateString() === todayMoscow.toDateString();
                    const isSelected = day.date.toDateString() === selectedDate.toDateString();
                    const isFuture = day.date > todayMoscow;
                    const isPastOrToday = day.date <= todayMoscow;
                    
                    let bgClass = 'bg-[#EFE7D8] hover:bg-[#E2D5C3] text-[#74675B]';
                    
                    if (day.pages > 0) {
                       if (day.pages <= 20) {
                         bgClass = 'bg-[#D2E7DB] hover:bg-[#C0DEC9] text-[#3E5C4E] shadow-sm'; 
                       } else if (day.pages <= 50) {
                         bgClass = 'bg-[#98C4AB] hover:bg-[#83B398] text-white shadow-sm'; 
                       } else if (day.pages <= 100) {
                         bgClass = 'bg-[#6CA384] hover:bg-[#5B9273] text-white shadow-sm'; 
                       } else {
                         bgClass = 'bg-[#477C5E] hover:bg-[#3D6B51] text-white shadow-sm'; 
                       }
                    } else if (isPastOrToday) {
                       bgClass = 'bg-[#E8C2C2] hover:bg-[#DFB3B3] text-[#7A3E3E] shadow-sm'; 
                    } else if (isFuture) {
                       bgClass = 'bg-transparent opacity-30 cursor-not-allowed text-[#9B8C80]';
                    }

                    return (
                      <button 
                        key={idx} onClick={() => handleDateClick(day.date)} disabled={isFuture}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative ${bgClass} ${isSelected ? 'ring-2 ring-[#A68970] ring-offset-1 scale-110 z-10' : ''}`}
                        title={`${day.date.toLocaleDateString()} - ${day.pages} стр. / ${day.minutes} мин.`}
                      >
                        {day.date.getDate()}
                        {isToday && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#846851] rounded-full"></div>}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-5 flex flex-wrap gap-1.5 text-[9px] font-bold text-[#74675B] justify-center items-center">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#E8C2C2] rounded-sm"></div> 0</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#D2E7DB] rounded-sm"></div> &lt;20</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#98C4AB] rounded-sm"></div> 21-50</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#6CA384] rounded-sm"></div> 51-100</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#477C5E] rounded-sm"></div> 100+</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= LIBRARY TAB ================= */}
        {activeTab === 'library' && (
          <div className="animate-fade-in">
            <div className="flex flex-col gap-4 mb-6 bg-[#F7F2E8] p-5 rounded-3xl shadow-sm border border-[#EADFCF]">
              
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'reading', label: 'В процессе' },
                  { id: 'read', label: 'Прочитано' },
                  { id: 'wishlist', label: 'Виш-лист' },
                  { id: 'dropped', label: 'Брошено' }
                ].map(f => (
                  <button
                    key={f.id} onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all flex-1 sm:flex-none text-center ${
                      filter === f.id ? 'bg-[#A68970] text-white shadow-sm' : 'bg-[#EFE7D8] text-[#74675B] hover:bg-[#EADFCF]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
                <div className="relative w-full sm:flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8C80]"><SearchIcon size={16}/></div>
                  <input type="text" placeholder="Поиск по названию или автору..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FCF9F2] border border-[#EADFCF] text-[#4A4238] pl-10 pr-4 py-2.5 rounded-2xl font-bold text-sm outline-none focus:border-[#A68970] transition-colors"
                  />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9B8C80] hover:text-[#564B41]"><XIcon size={14} /></button>}
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="appearance-none bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3.5 py-2.5 rounded-2xl font-bold text-xs outline-none cursor-pointer min-w-[120px]">
                    <option value="all">Все авторы</option>
                    {uniqueAuthors.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="appearance-none bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3.5 py-2.5 rounded-2xl font-bold text-xs outline-none cursor-pointer min-w-[120px]">
                    <option value="all">Все жанры</option>
                    {uniqueGenres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="appearance-none bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3.5 py-2.5 rounded-2xl font-bold text-xs outline-none cursor-pointer min-w-[120px]">
                    <option value="all">Все теги</option>
                    {uniqueTags.map(t => <option key={t} value={t}>#{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
              <button onClick={openNewBookModal} className="bg-[#F7F2E8] border-2 border-dashed border-[#D5C6B4] rounded-2xl flex flex-col items-center justify-center text-[#9B8C80] hover:text-[#846851] hover:border-[#A68970] hover:bg-[#EFE7D8] transition-all aspect-[2/3] group shadow-sm">
                <div className="bg-[#EFE7D8] group-hover:bg-[#EADFCF] p-2.5 rounded-2xl mb-1.5 transition-colors"><PlusIcon size={20} /></div>
                <span className="font-bold text-xs">Добавить</span>
              </button>

              {filteredBooks.map(book => {
                const FormatIcon = FORMATS.find(f => f.id === book.format)?.icon || BookOpenIcon;
                
                return (
                  <div key={book.id} onClick={() => { setCurrentBook(book); setIsModalOpen(true); }} className="bg-[#F7F2E8] border border-[#EADFCF] rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col aspect-[2/3] relative">
                    <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-1">
                      <div className={`p-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 ${book.status === 'read' ? 'text-[#6F8E80]' : book.status === 'reading' || book.status === 'rereading' ? 'text-[#C98E5E]' : book.status === 'dropped' ? 'text-[#D67C6B]' : 'text-[#9B8C80]'}`}>
                         <CheckIcon size={10} />
                      </div>
                      <div className="p-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 text-[#74675B]">
                        <FormatIcon size={10} />
                      </div>
                    </div>

                    <div className="flex-1 bg-[#EFE7D8] relative overflow-hidden">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#EAE2D2] text-[#846851] font-black p-1 text-center text-[10px]">
                          {book.title}
                        </div>
                      )}
                      
                      {book.tags && book.tags.length > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
                          {book.tags.slice(0, 1).map(t => (
                            <span key={t} className="bg-black/60 text-white text-[7px] font-bold px-1 py-0.5 rounded backdrop-blur-sm truncate max-w-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2 bg-[#F7F2E8] h-[60px] flex flex-col justify-between shrink-0 border-t border-[#EFE7D8]">
                      <div>
                         <h3 className="font-bold text-[11px] text-[#4A4238] line-clamp-1 leading-tight">{book.title}</h3>
                         <p className="text-[9px] text-[#948477] line-clamp-1 mt-0.5">{book.author}</p>
                      </div>
                      
                      <div className="mt-0.5">
                        {(book.status === 'reading' || book.status === 'rereading') && book.totalPages > 0 && (
                          <div className="w-full bg-[#EADFCF] rounded-full h-1 mb-0.5">
                            <div className="bg-[#9ABAA9] h-1 rounded-full" style={{ width: `${Math.min(100, Math.round(((book.readPages || 0) / book.totalPages) * 100))}%` }}></div>
                          </div>
                        )}
                        {book.status === 'read' && book.dateStarted && book.dateFinished && (
                          <div className="text-[8px] font-bold text-[#6F8E80] bg-[#DDEAE3] px-1 py-0.5 rounded inline-block">
                            За {calculateDaysToRead(book.dateStarted, book.dateFinished)} дн.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= TOURNAMENT TAB ================= */}
        {activeTab === 'tournament' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            {tournamentPhase === 'setup' && (
              <div className="bg-[#F7F2E8] rounded-3xl p-6 sm:p-10 shadow-sm border border-[#EADFCF]">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EFE7D8] text-[#846851] rounded-3xl mb-4 shadow-sm"><TrophyIcon size={32} /></div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#564B41] mb-2">Книжный Турнир</h2>
                  <p className="text-[#847466] text-sm sm:text-base">Выберите лучшие прочитанные книги и столкните их лбами, чтобы выявить абсолютного чемпиона.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <button onClick={() => { setBracketSize(4); setSelectedForTournament([]); }} className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${bracketSize === 4 ? 'border-[#A68970] bg-[#FCF9F2] text-[#846851]' : 'border-[#EADFCF] text-[#847466] hover:border-[#D5C6B4]'}`}>Полуфинал (4 книги)</button>
                  <button onClick={() => { setBracketSize(8); setSelectedForTournament([]); }} className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${bracketSize === 8 ? 'border-[#A68970] bg-[#FCF9F2] text-[#846851]' : 'border-[#EADFCF] text-[#847466] hover:border-[#D5C6B4]'}`}>Четвертьфинал (8 книг)</button>
                </div>

                <div className="mb-4 flex justify-between items-center text-sm font-bold text-[#847466]">
                  <span>Выберите {bracketSize} книг для турнира:</span>
                  <span className={selectedForTournament.length === bracketSize ? 'text-[#6F8E80]' : 'text-[#9B8C80]'}>Выбрано: {selectedForTournament.length} / {bracketSize}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  {readBooks.map(book => (
                    <div key={book.id} onClick={() => toggleTournamentSelection(book.id)} className={`cursor-pointer rounded-2xl border-2 p-2.5 transition-all flex flex-col aspect-[3/4] sm:aspect-auto sm:h-32 relative overflow-hidden group ${selectedForTournament.includes(book.id) ? 'border-[#A68970]' : 'border-[#EADFCF] hover:border-[#D5C6B4]'}`}>
                      {book.coverUrl ? (
                         <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity"><img src={book.coverUrl} className="w-full h-full object-cover blur-[2px] scale-110" alt=""/></div>
                      ) : <div className="absolute inset-0 bg-[#EFE7D8] z-0"></div>}
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                         <div className="bg-white/90 backdrop-blur rounded-xl p-1.5 shadow-sm">
                            <h4 className="font-bold text-[10px] sm:text-xs text-[#4A4238] line-clamp-2 leading-tight">{book.title}</h4>
                         </div>
                         <div className="self-end mt-auto">
                           <div className={`inline-flex rounded-full p-1 shadow-sm ${selectedForTournament.includes(book.id) ? 'bg-[#A68970] text-white' : 'bg-white text-[#9B8C80]'}`}><CheckIcon size={12} /></div>
                         </div>
                      </div>
                    </div>
                  ))}
                  {readBooks.length === 0 && <div className="col-span-full py-10 text-center text-[#846851] font-bold">Нужно добавить прочитанные книги в библиотеку!</div>}
                </div>

                <div className="text-center">
                  <button onClick={startTournament} disabled={selectedForTournament.length !== bracketSize} className="bg-[#A68970] hover:bg-[#92745C] disabled:bg-[#EADFCF] disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-black tracking-wide transition-all shadow-md w-full sm:w-auto">НАЧАТЬ ТУРНИР</button>
                </div>
              </div>
            )}

            {tournamentPhase === 'bracket' && (
              <div className="bg-[#564B41] rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden text-[#F7F2E8]">
                <h3 className="text-[#BAACA0] font-bold tracking-widest uppercase text-xs sm:text-sm mb-8">
                  {currentRound.length === 4 ? 'Четвертьфинал' : currentRound.length === 2 ? 'Полуфинал' : 'Финал'} &nbsp;• Бой {currentMatchIndex + 1} из {currentRound.length}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
                  {currentRound[currentMatchIndex].map((book, idx) => (
                    <div key={idx} className="relative group w-full sm:w-auto">
                      <button onClick={() => selectWinner(book)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-[#BFA892] transition-all rounded-3xl p-4 w-full sm:w-64 flex flex-row sm:flex-col items-center gap-4 text-left group-hover:scale-105">
                         <div className="w-16 sm:w-32 aspect-[2/3] bg-[#4A4238] rounded-2xl overflow-hidden shadow-2xl shrink-0">
                           {book.coverUrl ? <img src={book.coverUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#BAACA0] text-[10px] text-center p-2">{book.title}</div>}
                         </div>
                         <div className="text-left sm:text-center flex-1">
                           <h4 className="font-black text-white text-sm sm:text-lg line-clamp-2">{book.title}</h4>
                           <p className="text-[#BAACA0] text-xs sm:text-sm mt-1">{book.author}</p>
                         </div>
                      </button>
                    </div>
                  ))}
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex">
                    <div className="w-12 h-12 rounded-2xl bg-[#BFA892] flex items-center justify-center text-[#4A4238] font-black text-xl italic shadow-lg border-4 border-[#564B41]">VS</div>
                  </div>
                </div>
              </div>
            )}

            {tournamentPhase === 'winner' && (
              <div className="bg-gradient-to-br from-[#BFA892] to-[#8C745E] rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl animate-fade-in relative overflow-hidden">
                <TrophyIcon size={64} className="mx-auto mb-4 text-[#FDFBF7] drop-shadow-lg" />
                <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Абсолютный Чемпион!</h2>
                <p className="text-[#F9F4EC] mb-8 font-bold">Победитель вашего личного турнира</p>
                
                <div className="w-32 sm:w-48 aspect-[2/3] mx-auto bg-[#4A4238] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[#FDFBF7] ring-offset-4 ring-offset-[#BFA892] mb-6 transform hover:scale-105 transition-transform">
                   {tournamentWinner?.coverUrl ? <img src={tournamentWinner.coverUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#BAACA0] p-4 text-center font-bold text-sm">{tournamentWinner?.title}</div>}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black mb-2 px-4">{tournamentWinner?.title}</h3>
                <p className="text-lg sm:text-xl text-[#F9F4EC] mb-8">{tournamentWinner?.author}</p>
                
                <button onClick={() => setTournamentPhase('setup')} className="bg-white text-[#4A4238] px-8 py-3.5 rounded-2xl font-black hover:bg-[#F9F4EC] transition-colors shadow-lg">Новый турнир</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Summary Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A4238]/60 backdrop-blur-sm" onClick={() => setIsSummaryModalOpen(false)}></div>
          <div className="bg-[#F7F2E8] rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-[360px] overflow-hidden flex flex-col animate-fade-in border border-[#EADFCF]">
             <div className="bg-gradient-to-br from-[#BFA892] via-[#A896B5] to-[#D67C6B] p-6 text-white text-center flex flex-col items-center">
                <h2 className="text-3xl font-black mb-1 uppercase tracking-wider drop-shadow-sm">Итоги</h2>
                <p className="text-white/90 font-bold mb-6 bg-white/20 px-4 py-1.5 rounded-full uppercase text-xs tracking-widest backdrop-blur-sm">
                  {currentMonth.toLocaleDateString('ru-RU', {month: 'long', year: 'numeric'})}
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                   <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 border border-white/30 shadow-inner">
                      <div className="text-4xl font-black drop-shadow-sm">{readThisTargetMonth.length}</div>
                      <div className="text-[10px] font-bold text-white/90 uppercase mt-1 tracking-wider">Книг</div>
                   </div>
                   <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 border border-white/30 shadow-inner">
                      <div className="text-4xl font-black drop-shadow-sm">{totalPagesThisMonth}</div>
                      <div className="text-[10px] font-bold text-white/90 uppercase mt-1 tracking-wider">Страниц</div>
                   </div>
                   <div className="col-span-2 bg-white/20 backdrop-blur-sm rounded-3xl p-4 border border-white/30 shadow-inner flex flex-col justify-center">
                      <div className="text-3xl font-black drop-shadow-sm">{Math.floor(totalMinutesThisMonth/60)}ч {totalMinutesThisMonth%60}м</div>
                      <div className="text-[10px] font-bold text-white/90 uppercase mt-1 tracking-wider">Время за чтением</div>
                   </div>
                </div>
                
                {readThisTargetMonth.length > 0 && (
                   <div className="w-full">
                     <p className="text-[10px] uppercase font-bold text-white/80 mb-2">Прочитано в этом месяце:</p>
                     <div className="flex flex-wrap justify-center gap-2">
                        {readThisTargetMonth.map(b => (
                           <div key={b.id} className="w-12 aspect-[2/3] bg-[#4A4238] rounded-xl shadow-md overflow-hidden border border-white/30">
                              {b.coverUrl ? <img src={b.coverUrl} className="w-full h-full object-cover" /> : <div className="text-[6px] p-1 text-center font-bold">{b.title}</div>}
                           </div>
                        ))}
                     </div>
                   </div>
                )}
                <div className="mt-6 text-[8px] uppercase tracking-widest text-white/60">Сгенерировано в КнигоТрекер</div>
             </div>
             <div className="p-4 flex gap-2 justify-center bg-[#F7F2E8]">
                <button onClick={() => setIsSummaryModalOpen(false)} className="px-6 py-2.5 bg-[#EADFCF] hover:bg-[#DDD0BE] text-[#564B41] rounded-2xl font-bold transition-colors">Закрыть</button>
             </div>
          </div>
        </div>
      )}

      {/* Book Edit Modal */}
      {isModalOpen && currentBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-[#4A4238]/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#F7F2E8] rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto relative z-10 animate-fade-in flex flex-col border border-[#EADFCF]">
            
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-[#EADFCF] sticky top-0 bg-[#F7F2E8]/95 backdrop-blur-md z-20">
              <h2 className="text-xl sm:text-2xl font-black text-[#564B41]">{currentBook.id.toString().length > 10 ? 'Новая книга' : 'Редактирование'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-[#EADFCF] hover:bg-[#DDD0BE] p-2.5 rounded-full text-[#74675B] transition-colors"><XIcon size={20}/></button>
            </div>

            <form onSubmit={handleSaveBook} className="p-5 sm:p-6 space-y-6 sm:space-y-8">
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0 flex flex-col gap-3">
                  <div className="aspect-[2/3] bg-[#EFE7D8] rounded-3xl border-2 border-dashed border-[#D5C6B4] overflow-hidden relative flex items-center justify-center group">
                    {currentBook.coverUrl ? (
                      <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                      <span className="text-[#9B8C80] font-bold text-xs text-center px-4">Обложка</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                       <label htmlFor="cover-upload" className="cursor-pointer bg-white/95 text-[#4A4238] text-[10px] font-bold px-3.5 py-2.5 rounded-xl text-center w-full hover:bg-white shadow-sm transition-colors">С устройства</label>
                       <button type="button" onClick={() => {
                         setCustomModal({
                           title: 'Вставить URL картинки:', type: 'prompt', defaultValue: currentBook.coverUrl || '',
                           onSubmit: (url) => { if (url) setCurrentBook({...currentBook, coverUrl: url}); setCustomModal(null); }
                         });
                       }} className="bg-white/95 text-[#4A4238] text-[10px] font-bold px-3.5 py-2.5 rounded-xl text-center w-full hover:bg-white shadow-sm transition-colors">По ссылке</button>
                    </div>
                  </div>
                  <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) { const reader = new FileReader(); reader.onloadend = () => setCurrentBook({ ...currentBook, coverUrl: reader.result }); reader.readAsDataURL(file); }
                  }} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Название книги *</label>
                    <input required type="text" value={currentBook.title} onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] transition-colors text-[#4A4238]" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Автор</label>
                      <input type="text" value={currentBook.author} onChange={(e) => setCurrentBook({...currentBook, author: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] transition-colors text-[#4A4238]" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Жанр</label>
                      <div className="relative">
                        <input list="genre-list" type="text" value={currentBook.genre || ''} onChange={(e) => setCurrentBook({...currentBook, genre: e.target.value})} onFocus={(e) => e.target.select()} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 pr-9 font-bold text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] transition-colors text-[#4A4238]" />
                        {currentBook.genre && <button type="button" onClick={() => setCurrentBook({...currentBook, genre: ''})} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B8C80] hover:text-[#564B41] p-1.5 bg-[#EADFCF]/50 rounded-xl"><XIcon size={12} /></button>}
                      </div>
                      <datalist id="genre-list">{PREDEFINED_GENRES.map(g => <option key={g} value={g} />)}</datalist>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider flex items-center gap-1"><TagIcon size={12}/> Личные теги (через запятую)</label>
                    <input type="text" placeholder="саморазвитие, любимое, космос..." value={currentBook.tags?.join(', ') || ''} onChange={(e) => setCurrentBook({...currentBook, tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm text-[#846851] focus:border-[#A68970] outline-none bg-[#FCF9F2] transition-colors" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Формат чтения</label>
                    <div className="flex flex-wrap gap-2">
                      {FORMATS.map(f => (
                        <button key={f.id} type="button" onClick={() => setCurrentBook({...currentBook, format: f.id})} className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl border-2 font-bold text-xs transition-all ${currentBook.format === f.id ? 'border-[#A68970] bg-[#FCF9F2] text-[#846851] shadow-sm' : 'border-[#EADFCF] bg-[#F7F2E8] text-[#74675B] hover:border-[#D5C6B4]'}`}>
                          <f.icon size={14} /> {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EFE7D8] p-5 rounded-3xl border border-[#EADFCF] space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Статус</label>
                  <div className="flex flex-wrap bg-[#F7F2E8] rounded-2xl border-2 border-[#EADFCF] p-1.5 gap-1">
                    {STATUSES.map(s => (
                      <button key={s.id} type="button" onClick={() => setCurrentBook({...currentBook, status: s.id})} className={`flex-1 min-w-[80px] py-2 text-xs font-bold rounded-xl transition-all ${currentBook.status === s.id ? 'bg-[#A68970] text-white shadow-sm' : 'text-[#74675B] hover:bg-[#EADFCF]'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Всего страниц</label>
                    <input type="number" value={currentBook.totalPages} onChange={(e) => setCurrentBook({...currentBook, totalPages: e.target.value ? Number(e.target.value) : ''})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm bg-white focus:border-[#A68970] outline-none text-[#4A4238]" />
                  </div>
                  
                  {(currentBook.status === 'reading' || currentBook.status === 'rereading' || currentBook.status === 'dropped') && (
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Прочитано</label>
                      <input type="number" value={currentBook.readPages} onChange={(e) => setCurrentBook({...currentBook, readPages: e.target.value ? Number(e.target.value) : 0})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm bg-white focus:border-[#A68970] outline-none text-[#4A4238]" />
                    </div>
                  )}

                  {currentBook.status === 'read' && (
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Оценка (1-5)</label>
                      <input type="number" min="1" max="5" value={currentBook.rating || ''} onChange={(e) => setCurrentBook({...currentBook, rating: Number(e.target.value)})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm bg-white focus:border-[#A68970] outline-none text-[#4A4238]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1 space-y-1.5">
                     <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Дата начала</label>
                     <input type="date" value={currentBook.dateStarted || ''} onChange={(e) => setCurrentBook({...currentBook, dateStarted: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm bg-white text-[#564B41] outline-none" />
                  </div>
                  {currentBook.status !== 'wishlist' && (
                    <div className="flex-1 space-y-1.5">
                       <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Дата завершения</label>
                       <input type="date" value={currentBook.dateFinished || ''} onChange={(e) => setCurrentBook({...currentBook, dateFinished: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-sm bg-white text-[#564B41] outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Аннотация (О чем книга)</label>
                  <textarea rows="2" value={currentBook.annotation || ''} onChange={(e) => setCurrentBook({...currentBook, annotation: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3.5 font-medium text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] resize-none text-[#4A4238]" placeholder="Сюжет без спойлеров..."></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Резюме / Рецензия</label>
                  <textarea rows="3" value={currentBook.summary} onChange={(e) => setCurrentBook({...currentBook, summary: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3.5 font-medium text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] resize-none text-[#4A4238]"></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#948477] uppercase tracking-wider">Цитаты</label>
                  <textarea rows="2" value={currentBook.quotes} onChange={(e) => setCurrentBook({...currentBook, quotes: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3.5 font-medium text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] resize-none text-[#4A4238]"></textarea>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                {currentBook.id.toString().length < 10 ? (
                  <button type="button" onClick={() => handleDeleteBook(currentBook.id)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#C56B5D] hover:bg-[#FCEAE8] px-4 py-3 rounded-2xl font-bold transition-colors">
                    <TrashIcon size={18}/> Удалить книгу
                  </button>
                ) : <div></div>}
                <button type="submit" className="w-full sm:w-auto bg-[#A68970] hover:bg-[#92745C] text-white px-8 py-3.5 rounded-2xl font-black text-base transition-colors shadow-lg">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Modal Dialog */}
      {customModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A4238]/60 backdrop-blur-sm" onClick={() => setCustomModal(null)}></div>
          <div className="bg-[#F7F2E8] rounded-[2rem] p-6 shadow-2xl relative z-10 w-full max-w-sm animate-fade-in border border-[#EADFCF]">
            <h3 className="text-lg font-bold text-[#564B41] mb-4">{customModal.title}</h3>
            
            {customModal.type === 'prompt' && (
              <input 
                autoFocus
                type="text" 
                defaultValue={customModal.defaultValue}
                className="w-full border-2 border-[#EADFCF] rounded-2xl p-3.5 font-bold text-sm outline-none focus:border-[#A68970] mb-6 bg-[#FCF9F2] text-[#4A4238] transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     customModal.onSubmit(e.target.value);
                  }
                }}
                id="custom-modal-input"
              />
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setCustomModal(null)} className="px-5 py-2.5 rounded-2xl font-bold text-[#74675B] hover:bg-[#EADFCF] transition-colors">Отмена</button>
              <button 
                onClick={() => {
                  if (customModal.type === 'prompt') {
                    const val = document.getElementById('custom-modal-input').value;
                    customModal.onSubmit(val);
                  } else {
                    customModal.onSubmit();
                  }
                }} 
                className="px-5 py-2.5 rounded-2xl font-bold text-white bg-[#A68970] hover:bg-[#92745C] transition-colors shadow-md"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}