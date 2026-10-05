import React, { useState, useMemo, useRef, useEffect } from 'react';
import IsbnLookup from './IsbnLookup.jsx';
import SnapshotPanel, { useLibrarySnapshots } from './SnapshotPanel.jsx';
import { downloadLibrary, libraryFilename, saveSnapshot, validateLibrary } from './snapshots.js';
import { pagesToLog, recordReadingProgress } from './readingProgress.js';

const PlusIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SearchIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const XIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ChevronRightIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const BookOpenIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const SmartphoneIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const HeadphonesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>;
const LayersIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>;
const TrophyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 22} height={props.size || 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const TrashIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const TagIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const ClockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const TargetIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const PlayIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const SquareIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const Edit3Icon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 15} height={props.size || 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
const ShuffleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const GridIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const LayersBoxIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const DownloadIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const UploadIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const BarChart2Icon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const EyeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FlameIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"></path></svg>;

const PREDEFINED_GENRES = [
  "Антиутопия", "Баллады", "Бизнес и экономика", "Биография и мемуары",
  "Детектив", "Детская литература", "Драма", "Здоровье и спорт",
  "Искусство и культура", "Исторический роман", "История", "Киберпанк",
  "Классическая литература", "Комиксы и графические романы", "Кулинария",
  "Любовный роман", "Магический реализм", "Мистика", "Наука и научпоп",
  "Научная фантастика", "Нон-фикшн", "Подростковая литература (YA)", "Поэма",
  "Поэзия", "Приключения", "Проза", "Психология", "Публицистика",
  "Путешествия", "Религия и духовность", "Роман", "Саморазвитие",
  "Сатира", "Современная проза", "Стихи", "Триллер", "Ужасы",
  "Фантастика", "Философия", "Фэнтези", "Эротика", "Эссе", "Юмор", "Другое"
];

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

const MOTIVATIONAL_STREAK = [
  "Каждая прочитанная страница меняет мышление. Вы на верном пути!",
  "Отличный темп чтения! Дисциплина творит настоящие чудеса.",
  "Чтение сегодня — это мудрость и сила завтра.",
  "Вы держите серию без единого пропуска — великолепный результат!",
  "Книги открывают нам миры, которые иначе невозможно увидеть.",
  "Еще один шаг к вашей годовой цели! Так держать.",
  "Привычка читать каждый день делает вас непобедимым."
];

const MOTIVATIONAL_NO_STREAK = [
  "Сделайте паузу и прочитайте хотя бы 5 страниц сегодня!",
  "Сегодня отличный день, чтобы открыть любимую книгу.",
  "Даже одна глава в день меняет всё. Начните прямо сейчас!",
  "Ваши книги ждут вас на полке!"
];

const formatDateKey = (dInput) => {
  if (!dInput) return '';
  if (typeof dInput === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dInput)) {
    return dInput.slice(0, 10);
  }
  const d = new Date(dInput);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  return formatDateKey(d);
};

const getPluralDays = (n) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'дней';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
};

// Новые пользователи начинают с пустой библиотеки.
const INITIAL_BOOKS = [];

// Общие правила для поиска и сравнения авторов.
const cleanText = (value) => String(value ?? '').normalize('NFC').trim().replace(/\s+/g, ' ');
const normalizeSearchText = (value) => cleanText(value).toLocaleLowerCase('ru-RU').replace(/ё/g, 'е');
const AUTHOR_NAMES = new Map([
  ['федор достоевский', 'Фёдор Достоевский'],
  ['алексей сальников', 'Алексей Сальников'],
]);
const canonicalAuthor = (value) => AUTHOR_NAMES.get(normalizeSearchText(value)) || cleanText(value);
const normalizeBookAuthors = (items) => items.map(book => ({ ...book, author: canonicalAuthor(book.author) }));
const getUniqueAuthors = (items) => {
  const names = new Map();
  items.forEach(book => {
    const label = canonicalAuthor(book.author);
    const key = normalizeSearchText(label);
    if (key && !names.has(key)) names.set(key, label);
  });
  return [...names.values()].sort((a, b) => a.localeCompare(b, 'ru'));
};

export default function App() {
  const [activeTab, setActiveTab] = useState('diary'); // 'diary' | 'library' | 'analytics' | 'roulette' | 'tournament'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'shelf'
  const [statViewType, setStatViewType] = useState('months'); // 'months' | 'genres' | 'formats' | 'activity'
  
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem('warm_readingTrackerBooks_v21');
      if (savedBooks) return normalizeBookAuthors(JSON.parse(savedBooks));
    } catch (e) { console.error(e); }
    return normalizeBookAuthors(INITIAL_BOOKS);
  });

  const [manualStreakBonus, setManualStreakBonus] = useState(() => {
    try {
      return Number(localStorage.getItem('warm_readingTrackerStreakBonus_v21')) || 0;
    } catch (e) { return 0; }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem('warm_readingTrackerGoals_v21');
      if (savedGoals) return JSON.parse(savedGoals);
    } catch (e) { console.error(e); }
    return { yearly: 0, monthly: 0 };
  });

  const snapshotData = useMemo(() => ({ books, goals, manualStreakBonus }), [books, goals, manualStreakBonus]);
  const libraryRef = useRef(snapshotData);
  libraryRef.current = snapshotData;
  const snapshotError = useLibrarySnapshots(snapshotData);
  const [isSnapshotsOpen, setIsSnapshotsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('warm_readingTrackerBooks_v21', JSON.stringify(books));
    } catch (e) { console.error(e); }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('warm_readingTrackerStreakBonus_v21', String(manualStreakBonus));
    } catch (e) { console.error(e); }
  }, [manualStreakBonus]);

  useEffect(() => {
    try {
      localStorage.setItem('warm_readingTrackerGoals_v21', JSON.stringify(goals));
    } catch (e) { console.error(e); }
  }, [goals]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [sketchnoteModalUrl, setSketchnoteModalUrl] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [customModal, setCustomModal] = useState(null); 
  
  const [filter, setFilter] = useState('all'); 
  const [genreFilter, setGenreFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [logPagesInput, setLogPagesInput] = useState({});
  const [logPageMode, setLogPageMode] = useState({});
  const [logProgressErrors, setLogProgressErrors] = useState({});
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

  const [rouletteGenre, setRouletteGenre] = useState('all');
  const [rouletteBook, setRouletteBook] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState(0);

  const fileInputRef = useRef(null);

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
      const currentInput = parseInt(logMinutesInput[bookId] || 0, 10);
      setLogMinutesInput(prev => ({ ...prev, [bookId]: currentInput + mins }));
      setActiveTimer(null);
      setTimerDisplay(0);
    } else {
      if (activeTimer) {
        const mins = Math.ceil(timerDisplay / 60);
        const currentInput = parseInt(logMinutesInput[activeTimer.bookId] || 0, 10);
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

  const readBooksList = useMemo(() => books.filter(b => b.status === 'read'), [books]);
  const activeBooks = useMemo(() => books.filter(b => b.status === 'reading' || b.status === 'rereading'), [books]);
  const wishlistBooks = useMemo(() => books.filter(b => b.status === 'wishlist'), [books]);
  const droppedBooks = useMemo(() => books.filter(b => b.status === 'dropped'), [books]);

  const uniqueAuthors = useMemo(() => getUniqueAuthors(books), [books]);
  const uniqueSeries = useMemo(() => Array.from(new Set(books.map(b => b.seriesName).filter(Boolean))).sort(), [books]);

  const readingDatesSet = useMemo(() => {
    const set = new Set();
    books.forEach(b => {
      if (b.log && Array.isArray(b.log)) {
        b.log.forEach(entry => {
          if ((entry.pages > 0 || entry.minutes > 0) && entry.date) {
            const key = formatDateKey(entry.date);
            if (key) set.add(key);
          }
        });
      }
    });
    return set;
  }, [books]);

  const { calculatedStreak, maxStreak, hasReadToday, totalStreak } = useMemo(() => {
    const today = getMoscowDate();
    const todayStr = formatDateKey(today);
    const isTodayRead = readingDatesSet.has(todayStr);

    let streak = 0;
    const checkDate = new Date(today);

    // If today hasn't been read yet, start checking from yesterday
    if (!isTodayRead) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Step day by day backwards regardless of month borders
    while (true) {
      const dStr = formatDateKey(checkDate);
      if (readingDatesSet.has(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculating all-time maximum streak
    const sortedDates = Array.from(readingDatesSet).sort();
    let maxS = 0;
    let currentRun = 0;
    let prevDate = null;

    sortedDates.forEach(dStr => {
      const parts = dStr.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!prevDate) {
        currentRun = 1;
      } else {
        const diffDays = Math.round((d.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          currentRun++;
        } else if (diffDays > 1) {
          currentRun = 1;
        }
      }
      prevDate = d;
      if (currentRun > maxS) maxS = currentRun;
    });

    const finalStreak = Math.max(0, streak + manualStreakBonus);

    return {
      calculatedStreak: streak,
      totalStreak: finalStreak,
      currentStreak: finalStreak,
      maxStreak: Math.max(maxS, finalStreak),
      hasReadToday: isTodayRead
    };
  }, [readingDatesSet, manualStreakBonus]);

  const filteredBooks = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    return books.filter(book => {
      const statusMatch = filter === 'all' || 
        book.status === filter || 
        (filter === 'reading' && (book.status === 'reading' || book.status === 'rereading'));
      const genreMatch = genreFilter === 'all' || book.genre === genreFilter;
      const authorMatch = authorFilter === 'all' || normalizeSearchText(book.author) === normalizeSearchText(authorFilter);
      const seriesMatch = seriesFilter === 'all' || book.seriesName === seriesFilter;
      const tagMatch = tagFilter === 'all' || (book.tags && book.tags.includes(tagFilter));
      const searchMatch = !query || [book.title, book.author, book.seriesName]
        .some(value => normalizeSearchText(value).includes(query));
        
      return statusMatch && genreMatch && authorMatch && seriesMatch && tagMatch && searchMatch;
    });
  }, [books, filter, genreFilter, authorFilter, seriesFilter, tagFilter, searchQuery]);

  const todayMoscow = getMoscowDate();

  const monthlyStats = useMemo(() => {
    const stats = {};
    readBooksList.forEach(b => {
      if (b.dateFinished) {
        const d = new Date(b.dateFinished);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        if (!stats[key]) {
          stats[key] = { key, label, books: [], pages: 0, sortKey: new Date(d.getFullYear(), d.getMonth(), 1).getTime() };
        }
        stats[key].books.push(b);
        stats[key].pages += (b.totalPages || b.readPages || 0);
      }
    });
    return Object.values(stats).sort((a, b) => b.sortKey - a.sortKey);
  }, [readBooksList]);

  const genreStats = useMemo(() => {
    const stats = {};
    readBooksList.forEach(b => {
      const g = b.genre || 'Другое';
      stats[g] = (stats[g] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [readBooksList]);

  const formatStats = useMemo(() => {
    const stats = { paper: 0, ebook: 0, audio: 0, combo: 0 };
    readBooksList.forEach(b => {
      if (stats[b.format] !== undefined) stats[b.format]++;
      else stats.paper++;
    });
    return stats;
  }, [readBooksList]);

  const weekdayStats = useMemo(() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const fullDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const sums = [0, 0, 0, 0, 0, 0, 0];
    books.forEach(b => {
      if (b.log) {
        b.log.forEach(entry => {
          const d = new Date(entry.date);
          let dayIdx = d.getDay() - 1;
          if (dayIdx === -1) dayIdx = 6;
          sums[dayIdx] += (entry.pages || 0);
        });
      }
    });
    return days.map((day, idx) => ({ day, fullName: fullDays[idx], pages: sums[idx] }));
  }, [books]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    d.setHours(0, 0, 0, 0);
    
    let pagesOnDate = 0;
    let minutesOnDate = 0;
    books.forEach(b => {
      if (b.log) {
        b.log.forEach(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
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
  }
  
  const totalPagesThisMonth = calendarDays.reduce((acc, day) => day ? acc + day.pages : acc, 0);
  const totalMinutesThisMonth = calendarDays.reduce((acc, day) => day ? acc + day.minutes : acc, 0);
  const avgPagesPerDay = Math.round(totalPagesThisMonth / avgDivisor);
  
  const totalReadBooks = readBooksList.length;
  const totalReadPages = books.reduce((sum, b) => sum + (b.readPages || 0), 0);
  const totalMinutesAllTime = books.reduce((sum, b) => {
    return sum + (b.log ? b.log.reduce((s, entry) => s + (entry.minutes || 0), 0) : 0);
  }, 0);

  const currentYear = todayMoscow.getFullYear();
  const readThisYear = readBooksList.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear).length;
  
  const targetMonthNum = currentMonth.getMonth();
  const targetYearNum = currentMonth.getFullYear();
  const readThisTargetMonth = readBooksList.filter(b => b.dateFinished && new Date(b.dateFinished).getMonth() === targetMonthNum && new Date(b.dateFinished).getFullYear() === targetYearNum);

  const selectedDateKey = formatDateKey(selectedDate);

  const pagesOnSelectedDateAllBooks = useMemo(() => {
    return books.reduce((sum, b) => {
      if (!b.log || !Array.isArray(b.log)) return sum;
      return sum + b.log.reduce((acc, entry) => {
        return formatDateKey(entry.date) === selectedDateKey ? acc + (Number(entry.pages) || 0) : acc;
      }, 0);
    }, 0);
  }, [books, selectedDateKey]);

  const minsOnSelectedDateAllBooks = useMemo(() => {
    return books.reduce((sum, b) => {
      if (!b.log || !Array.isArray(b.log)) return sum;
      return sum + b.log.reduce((acc, entry) => {
        return formatDateKey(entry.date) === selectedDateKey ? acc + (Number(entry.minutes) || 0) : acc;
      }, 0);
    }, 0);
  }, [books, selectedDateKey]);

  const todayDayNumber = todayMoscow.getDate();
  const dailyMotivation = totalStreak > 0 
    ? MOTIVATIONAL_STREAK[todayDayNumber % MOTIVATIONAL_STREAK.length]
    : MOTIVATIONAL_NO_STREAK[todayDayNumber % MOTIVATIONAL_NO_STREAK.length];

  const handleDateClick = (date) => {
    if (date <= todayMoscow) setSelectedDate(date);
  };

  const openNewBookModal = () => {
    setCurrentBook({
      id: Date.now(),
      title: '', author: '', genre: 'Проза', seriesName: '', seriesIndex: '', seriesTotal: '',
      status: 'wishlist', format: 'paper',
      totalPages: '', readPages: 0, rating: 0, annotation: '', summary: '', quotes: '', 
      coverUrl: '', sketchnoteUrl: '',
      tags: [], dateStarted: '', dateFinished: '', log: []
    });
    setIsModalOpen(true);
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (!currentBook.title) return;
    
    let updatedBook = { ...currentBook, author: canonicalAuthor(currentBook.author) };
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
        if (updatedBook.totalPages) updatedBook.readPages = updatedBook.totalPages; 
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
    const input = logPagesInput[bookId] ?? '';
    const mode = logPageMode[bookId] || 'page';
    const minutes = logMinutesInput[bookId] ?? '';
    const logDateKey = formatDateKey(selectedDate);
    const current = libraryRef.current.books.find(book => book.id === bookId);
    if (!current) return;
    try {
      if (recordReadingProgress(current, input, mode, minutes, logDateKey) === current) return;
    } catch (error) {
      setLogProgressErrors(prev => ({ ...prev, [bookId]: error.message }));
      return;
    }
    setBooks(prev => prev.map(book => {
      if (book.id !== bookId) return book;
      // Recalculate against the latest progress, including a queued earlier click.
      try { return recordReadingProgress(book, input, mode, minutes, logDateKey); }
      catch { return book; }
    }));
    setLogProgressErrors(prev => ({ ...prev, [bookId]: '' }));
    setLogPagesInput(prev => ({ ...prev, [bookId]: '' }));
    setLogMinutesInput(prev => ({ ...prev, [bookId]: '' }));
  };

  const handleQuickFinish = (bookId) => {
    const logDateKey = formatDateKey(selectedDate);
    setBooks(books.map(b => {
      if (b.id === bookId) {
        const remaining = (b.totalPages || 0) - (b.readPages || 0);
        const newLog = [...(b.log || [])];
        if (remaining > 0) {
          newLog.push({ date: logDateKey, pages: remaining, minutes: Math.round(remaining * 1.5) });
        }
        return { 
          ...b, readPages: b.totalPages, status: 'read', 
          log: newLog, dateFinished: b.dateFinished || getMoscowDateString(0) 
        };
      }
      return b;
    }));
  };

  const roulettePool = useMemo(() => {
    if (rouletteGenre === 'all') return wishlistBooks;
    return wishlistBooks.filter(b => b.genre === rouletteGenre);
  }, [wishlistBooks, rouletteGenre]);

  const spinRoulette = () => {
    if (roulettePool.length === 0) return;
    setIsSpinning(true);
    setRouletteBook(null);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * roulettePool.length);
      setRouletteBook(roulettePool[randomIndex]);
      counter++;
      if (counter > 14) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 110);
  };

  const exportBackup = () => {
    downloadLibrary(snapshotData, libraryFilename());
  };

  const applyLibrary = (data) => {
    validateLibrary(data);
    setBooks(normalizeBookAuthors(data.books));
    if (data.goals) setGoals(data.goals);
    if (data.manualStreakBonus != null) setManualStreakBonus(data.manualStreakBonus);
  };

  const importBackup = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || isImporting) return;
    setIsImporting(true);
    let validFile = false;
    try {
      const parsed = validateLibrary(JSON.parse((await file.text()).replace(/^\uFEFF/, '')));
      // Normalize before writing a safety copy or changing the current library.
      const data = { ...parsed, books: normalizeBookAuthors(parsed.books) };
      validFile = true;
      await saveSnapshot(libraryRef.current, 'import');
      applyLibrary(data);
      setCustomModal({ title: 'Библиотека восстановлена. Предыдущая версия сохранена в снимках.', type: 'info', onSubmit: () => setCustomModal(null) });
    } catch {
      setCustomModal({
        title: validFile
          ? 'Не удалось сохранить снимок перед импортом. Данные не заменены. Скачайте JSON-бэкап и попробуйте снова.'
          : 'Не удалось прочитать файл резервной копии. Данные не заменены.',
        type: 'info', onSubmit: () => setCustomModal(null)
      });
    } finally { setIsImporting(false); }
  };

  const toggleTournamentSelection = (id) => {
    if (selectedForTournament.includes(id)) {
      setSelectedForTournament(selectedForTournament.filter(bookId => bookId !== id));
    } else {
      if (selectedForTournament.length < bracketSize) {
        setSelectedForTournament([...selectedForTournament, id]);
      }
    }
  };

  const startTournament = () => {
    if (selectedForTournament.length !== bracketSize) return;
    const participants = selectedForTournament.map(id => books.find(b => b.id === id)).filter(Boolean);
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }
    const firstRound = [];
    for (let i = 0; i < participants.length; i += 2) {
      firstRound.push([participants[i], participants[i + 1]]);
    }
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
        for (let i = 0; i < updatedNextRound.length; i += 2) {
          newRound.push([updatedNextRound[i], updatedNextRound[i + 1]]);
        }
        setCurrentRound(newRound);
        setNextRound([]);
        setCurrentMatchIndex(0);
      }
    }
  };

  const bookshelfShelves = useMemo(() => {
    const shelves = [];
    for (let i = 0; i < filteredBooks.length; i += 6) {
      shelves.push(filteredBooks.slice(i, i + 6));
    }
    return shelves;
  }, [filteredBooks]);

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#4A4238] font-sans pb-24 md:pb-16 selection:bg-[#EEDFCC]">
      
      {/* Top Header */}
      <div className="bg-[#F7F2E8] border-b border-[#EADFCF] sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 flex justify-between items-center h-16">
          <div className="font-black text-lg sm:text-xl md:text-2xl text-[#765A45] tracking-tight flex items-center gap-1 sm:gap-2 cursor-pointer" onClick={() => setActiveTab('diary')}>
            <BookOpenIcon size={26} className="text-[#765A45] w-5 h-5 sm:w-[26px] sm:h-[26px]" />
            LibriMori
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-[#EFE7D8] rounded-2xl p-1 shadow-inner border border-[#E2D5C3]">
              <button onClick={() => setActiveTab('diary')} className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'diary' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Дневник</button>
              <button onClick={() => setActiveTab('library')} className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Библиотека</button>
              <button onClick={() => setActiveTab('analytics')} className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Аналитика</button>
              <button onClick={() => setActiveTab('roulette')} className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'roulette' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Рулетка</button>
              <button onClick={() => setActiveTab('tournament')} className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'tournament' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}>Турнир</button>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsSnapshotsOpen(true)} disabled={isImporting} title="Снимки библиотеки" className="bg-[#EFE7D8] hover:bg-[#EADFCF] text-[#564B41] p-2.5 rounded-2xl transition-colors flex items-center gap-1 text-xs font-bold border border-[#E2D5C3] shadow-sm disabled:opacity-50">
                <LayersIcon size={16} className="hidden sm:block" /> <span>Снимки</span>
              </button>
              <button onClick={exportBackup} title="Резервная копия библиотеки" className="bg-[#EFE7D8] hover:bg-[#EADFCF] text-[#74675B] p-2.5 rounded-2xl transition-colors flex items-center gap-1 text-xs font-bold border border-[#E2D5C3] shadow-sm">
                <DownloadIcon size={16} /> <span className="hidden lg:inline">Бэкап</span>
              </button>
              <button disabled={isImporting} onClick={() => fileInputRef.current && fileInputRef.current.click()} title="Восстановить из файла" className="bg-[#EFE7D8] hover:bg-[#EADFCF] text-[#74675B] p-2.5 rounded-2xl transition-colors flex items-center gap-1 text-xs font-bold border border-[#E2D5C3] shadow-sm disabled:opacity-50">
                <UploadIcon size={16} /> <span className="hidden lg:inline">Загрузить</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={importBackup} accept=".json" className="hidden" />
            </div>
          </div>
        </div>
      </div>

      <main className="pt-4 md:pt-8 max-w-6xl mx-auto px-4">
        {snapshotError && <div role="alert" className="mb-4 rounded-2xl border border-[#E2D5C3] bg-[#FCF9F2] p-3 text-sm text-[#9B493B]">{snapshotError} <button onClick={exportBackup} className="underline font-bold">Скачать бэкап</button></div>}
        
        {/* ================= DIARY TAB ================= */}
        {activeTab === 'diary' && (
          <div className="space-y-5 md:space-y-6">
            
            {/* Reading Streak & Motivation Banner */}
            <div className="bg-[#F7F2E8] border border-[#EADFCF] p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${totalStreak > 0 ? 'bg-[#FBE8E4] text-[#9B493B]' : 'bg-[#EFE7D8] text-[#706155]'}`}>
                  <FlameIcon size={26} className={totalStreak > 0 ? 'animate-pulse' : ''} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm md:text-base font-black text-[#564B41]">
                      {totalStreak > 0 ? `Серия: ${totalStreak} ${getPluralDays(totalStreak)} без пропуска!` : 'Серия чтения ещё не начата'}
                    </span>
                    {maxStreak > 0 && (
                      <span className="text-[10px] font-bold bg-[#EFE7D8] text-[#765A45] px-2.5 py-0.5 rounded-full border border-[#E2D5C3]">
                        Рекорд: {maxStreak} {getPluralDays(maxStreak)}
                      </span>
                    )}
                    <button 
                      onClick={() => {
                        setCustomModal({
                          title: 'Указать серию дней чтения (дней):',
                          type: 'prompt',
                          defaultValue: totalStreak,
                          onSubmit: (val) => {
                            if (val !== null && !isNaN(val)) {
                              const diff = Number(val) - calculatedStreak;
                              setManualStreakBonus(diff);
                              setCustomModal(null);
                            }
                          }
                        });
                      }}
                      title="Скорректировать счётчик серии"
                      className="p-1 hover:bg-[#E2D5C3] rounded-lg text-[#765A45] transition-colors"
                    >
                      <Edit3Icon size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-[#706155] italic mt-0.5">
                    «{dailyMotivation}»
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center">
                {hasReadToday ? (
                  <span className="inline-flex items-center gap-1.5 bg-[#DDEAE3] text-[#4F6F61] px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm">
                    <CheckIcon size={14} /> Сегодня прочитано!
                  </span>
                ) : (
                  <span className="inline-block bg-[#F2E8DC] text-[#765A45] px-3.5 py-1.5 rounded-2xl text-xs font-bold border border-[#E2D5C3] shadow-sm">
                    Отметьте чтение за сегодня
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              <div className="bg-[#F7F2E8] p-3.5 md:p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-2xl md:text-3xl font-black text-[#765A45] mb-1">{totalReadBooks}</span>
                <span className="text-[10px] font-bold text-[#706155] uppercase tracking-wider">Прочитано</span>
              </div>
              <div className="bg-[#F7F2E8] p-3.5 md:p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-2xl md:text-3xl font-black text-[#486B59] mb-1">{totalReadPages}</span>
                <span className="text-[10px] font-bold text-[#706155] uppercase tracking-wider">Всего страниц</span>
              </div>
              <div className="bg-[#F7F2E8] p-3.5 md:p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-2xl md:text-3xl font-black text-[#765B82] mb-1">
                  {Math.floor(totalMinutesAllTime / 60)}<span className="text-sm">ч</span> {totalMinutesAllTime % 60}<span className="text-sm">м</span>
                </span>
                <span className="text-[10px] font-bold text-[#706155] uppercase tracking-wider">Время за чтением</span>
              </div>
              <div className="bg-[#F7F2E8] p-3.5 md:p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-2xl md:text-3xl font-black text-[#8A542B] mb-1">{activeBooks.length}</span>
                <span className="text-[10px] font-bold text-[#706155] uppercase tracking-wider">В процессе</span>
              </div>
              <div className="bg-[#F7F2E8] p-3.5 md:p-4 rounded-3xl border border-[#EADFCF] shadow-sm flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                <span className="text-2xl md:text-3xl font-black text-[#46657F] mb-1">{avgPagesPerDay}</span>
                <span className="text-[10px] font-bold text-[#706155] uppercase tracking-wider">Стр/день (мес)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3.5 md:gap-4">
              <div className="bg-[#BFA892] rounded-3xl p-4 md:p-5 shadow-sm text-[#352B24] flex items-center gap-4 relative overflow-hidden">
                <div className="absolute right-[-20px] opacity-15"><TargetIcon size={120} /></div>
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#352B24]">Цель на {currentYear} год</span>
                    <button onClick={() => {
                      setCustomModal({
                        title: 'Изменить годовую цель (книг):', type: 'prompt', defaultValue: goals.yearly,
                        onSubmit: (val) => { if (val && !isNaN(val)) { setGoals({...goals, yearly: Number(val)}); setCustomModal(null); } }
                      });
                    }} className="flex items-center gap-2 text-xl md:text-2xl font-black hover:text-[#241D18] transition-colors bg-white/20 px-3 py-1 rounded-2xl shadow-sm">
                      {goals.yearly > 0 ? `${readThisYear} / ${goals.yearly}` : 'Задать цель'}
                      <Edit3Icon size={14} className="text-[#352B24]" />
                    </button>
                  </div>
                  <div className="w-full bg-[#9A8470]/50 rounded-full h-2.5">
                    <div className="bg-[#FAF0E6] h-2.5 rounded-full transition-all" style={{ width: `${goals.yearly > 0 ? Math.min(100, (readThisYear / goals.yearly) * 100) : 0}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#A896B5] rounded-3xl p-4 md:p-5 shadow-sm text-[#352B24] flex items-center gap-4 relative overflow-hidden">
                <div className="absolute right-[-20px] opacity-15"><BookOpenIcon size={120} /></div>
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#352B24]">Цель на {currentMonth.toLocaleDateString('ru-RU', {month:'long'})}</span>
                    <button onClick={() => {
                      setCustomModal({
                        title: 'Изменить месячную цель (книг):', type: 'prompt', defaultValue: goals.monthly,
                        onSubmit: (val) => { if (val && !isNaN(val)) { setGoals({...goals, monthly: Number(val)}); setCustomModal(null); } }
                      });
                    }} className="flex items-center gap-2 text-xl md:text-2xl font-black hover:text-[#241D18] transition-colors bg-white/20 px-3 py-1 rounded-2xl shadow-sm">
                      {goals.monthly > 0 ? `${readThisTargetMonth.length} / ${goals.monthly}` : 'Задать цель'}
                      <Edit3Icon size={14} className="text-[#352B24]" />
                    </button>
                  </div>
                  <div className="w-full bg-[#83738F]/50 rounded-full h-2.5">
                    <div className="bg-[#FAF0E6] h-2.5 rounded-full transition-all" style={{ width: `${goals.monthly > 0 ? Math.min(100, (readThisTargetMonth.length / goals.monthly) * 100) : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Diary & Calendar Section */}
            <div className="grid lg:grid-cols-3 gap-5 md:gap-6 items-start">
              
              {/* Tracker / Log Column */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F7F2E8] p-4 md:p-5 rounded-3xl border border-[#EADFCF] shadow-sm gap-3">
                  <div>
                    <h2 className="text-base md:text-xl font-bold text-[#564B41] flex items-center gap-2">
                      <span className="bg-[#EFE7D8] text-[#765A45] p-2 rounded-2xl"><ClockIcon size={18}/></span>
                      Записи за: {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {selectedDate.toDateString() === todayMoscow.toDateString() && (
                        <span className="inline-block bg-[#DDEAE3] text-[#4F6F61] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Сегодня</span>
                      )}
                      <span className="inline-block bg-[#EFE7D8] text-[#765A45] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E2D5C3] shadow-sm">
                        Итог дня: {pagesOnSelectedDateAllBooks} стр. / {Math.floor(minsOnSelectedDateAllBooks / 60)}ч {minsOnSelectedDateAllBooks % 60}м
                      </span>
                    </div>
                  </div>
                  <button onClick={openNewBookModal} className="bg-[#806047] hover:bg-[#694C37] text-white w-full sm:w-auto px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <PlusIcon size={16}/> Добавить книгу
                  </button>
                </div>

                {activeBooks.length === 0 ? (
                  <div className="bg-[#F7F2E8] border-2 border-dashed border-[#DDD0BE] rounded-3xl p-8 text-center">
                    <div className="text-[#BAACA0] mb-3 flex justify-center"><BookOpenIcon size={42} /></div>
                    <h3 className="text-base font-bold text-[#675B50] mb-1">Вы сейчас ничего не читаете</h3>
                    <p className="text-[#706155] text-xs mb-4">Нажмите кнопку добавления книги, чтобы начать трекать чтение.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 md:space-y-4">
                    {activeBooks.map(book => {
                      const pagesOnSelectedDate = book.log?.reduce((acc, entry) => formatDateKey(entry.date) === selectedDateKey ? acc + (Number(entry.pages) || 0) : acc, 0) || 0;
                      const minsOnSelectedDate = book.log?.reduce((acc, entry) => formatDateKey(entry.date) === selectedDateKey ? acc + (Number(entry.minutes) || 0) : acc, 0) || 0;
                      const pageMode = logPageMode[book.id] || 'page';
                      let pagesPreview = 0;
                      let pageInputError = '';
                      try { pagesPreview = pagesToLog(book, logPagesInput[book.id] ?? '', pageMode); }
                      catch (error) { pageInputError = error.message; }

                      return (
                        <div key={book.id} className="bg-[#F7F2E8] rounded-3xl p-4 md:p-5 shadow-sm border border-[#EADFCF]">
                          <div className="flex gap-3.5 md:gap-4 items-start">
                            
                            {/* Unstretched Cover */}
                            <div 
                              onClick={() => { setCurrentBook(book); setIsModalOpen(true); }}
                              className="w-20 sm:w-24 aspect-[2/3] bg-[#EFE7D8] rounded-2xl shrink-0 overflow-hidden shadow-sm border border-[#E2D5C3] relative cursor-pointer group"
                            >
                              {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#EAE2D2] text-[#765A45] p-1.5 text-center text-[10px] font-bold leading-tight">
                                  {book.title}
                                </div>
                              )}
                              {book.sketchnoteUrl && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSketchnoteModalUrl(book.sketchnoteUrl); }} 
                                  title="Открыть конспект / скетч"
                                  className="absolute bottom-1 right-1 bg-white/90 text-[#765A45] p-1 rounded-lg shadow-sm backdrop-blur-sm"
                                >
                                  <EyeIcon size={12} />
                                </button>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-1">
                                  <h3 onClick={() => { setCurrentBook(book); setIsModalOpen(true); }} className="font-bold text-sm sm:text-base md:text-lg text-[#4A4238] line-clamp-1 cursor-pointer hover:underline">
                                    {book.title}
                                  </h3>
                                  {book.status === 'rereading' && <span className="text-[9px] bg-[#EFE4D3] text-[#9E7749] px-2 py-0.5 rounded-full font-bold shrink-0">Перечитываю</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <p className="text-xs text-[#706155]">{book.author}</p>
                                  {book.seriesName && (
                                    <span className="text-[9px] bg-[#E2D5C3] text-[#6A5443] px-2 py-0.5 rounded-full font-bold">
                                      📚 {book.seriesName} {book.seriesIndex ? `(№${book.seriesIndex})` : ''}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex justify-between text-[10px] font-bold text-[#74675B] mb-1">
                                  <span>Прогресс</span>
                                  <span>{book.readPages || 0} / {book.totalPages || '?'} стр.</span>
                                </div>
                                <div className="w-full bg-[#EADFCF] rounded-full h-2 shadow-inner overflow-hidden">
                                  <div className="bg-[#9ABAA9] h-2 rounded-full transition-all duration-500" style={{ width: `${book.totalPages ? Math.min(100, Math.round(((book.readPages || 0) / book.totalPages) * 100)) : 0}%` }}></div>
                                </div>
                              </div>
                              
                              {/* Quick increment buttons */}
                              <div className="mt-3 flex flex-wrap gap-1.5" aria-label={`Способ ввода страниц — ${book.title}`}>
                                {[['page', 'До страницы'], ['delta', '+ Страницы']].map(([mode, label]) => (
                                  <button key={mode} type="button" aria-pressed={pageMode === mode} onClick={() => {
                                    setLogPageMode(prev => ({ ...prev, [book.id]: mode }));
                                    setLogPagesInput(prev => ({ ...prev, [book.id]: '' }));
                                    setLogMinutesInput(prev => ({ ...prev, [book.id]: '' }));
                                    setLogProgressErrors(prev => ({ ...prev, [book.id]: '' }));
                                  }} className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-[#E2D5C3] ${pageMode === mode ? 'bg-[#806047] text-white' : 'bg-[#EFE7D8] text-[#564B41]'}`}>{label}</button>
                                ))}
                              </div>
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                                <span className="text-[9px] font-bold text-[#706155] uppercase shrink-0">Быстро:</span>
                                {[10, 25].map(p => (
                                  <button key={p} onClick={() => {
                                    const currentPages = pageMode === 'delta' ? Number(logPagesInput[book.id]) || 0 : 0;
                                    const newPages = currentPages + p;
                                    setLogPageMode(prev => ({ ...prev, [book.id]: 'delta' }));
                                    setLogProgressErrors(prev => ({ ...prev, [book.id]: '' }));
                                    setLogPagesInput(prev => ({ ...prev, [book.id]: newPages }));
                                    setLogMinutesInput(prev => ({ ...prev, [book.id]: Math.round(newPages * 1.5) }));
                                  }} className="bg-[#EFE7D8] hover:bg-[#EADFCF] active:scale-95 text-[#74675B] text-[10px] font-bold px-2.5 py-1 rounded-xl shrink-0 transition-all shadow-sm border border-[#E2D5C3]">
                                    +{p} стр
                                  </button>
                                ))}
                                {logPagesInput[book.id] ? (
                                  <button onClick={() => {
                                    setLogPagesInput(prev => ({ ...prev, [book.id]: '' }));
                                    setLogMinutesInput(prev => ({ ...prev, [book.id]: '' }));
                                    setLogProgressErrors(prev => ({ ...prev, [book.id]: '' }));
                                  }} className="text-[9px] text-[#9B493B] font-bold hover:underline ml-auto">сбросить</button>
                                ) : null}
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <button 
                                  onClick={() => toggleTimer(book.id)} 
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${activeTimer?.bookId === book.id ? 'bg-[#9B493B] text-white animate-pulse' : 'bg-[#EADFCF] hover:bg-[#DDD0BE] text-[#564B41]'}`}
                                >
                                  {activeTimer?.bookId === book.id ? <SquareIcon size={14} /> : <PlayIcon size={14} />}
                                  {activeTimer?.bookId === book.id ? formatTimer(timerDisplay) : 'Таймер'}
                                </button>
                                <input 
                                  type="number" min="0" step="1" max={pageMode === 'page' && Number(book.totalPages) > 0 ? book.totalPages : undefined} placeholder={pageMode === 'page' ? 'Страница' : '+ стр'}
                                  aria-label={`${pageMode === 'page' ? 'Дочитал до страницы' : 'Добавить страниц'} — ${book.title}`}
                                  value={logPagesInput[book.id] || ''} 
                                  onKeyDown={(event) => { if (event.key === 'Enter') handleLogProgress(book.id); }}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setLogPagesInput({ ...logPagesInput, [book.id]: val });
                                    setLogProgressErrors(prev => ({ ...prev, [book.id]: '' }));
                                    if (pageMode === 'delta') {
                                      setLogMinutesInput(prev => ({ ...prev, [book.id]: val && Number.isFinite(Number(val)) && Number(val) >= 0 ? Math.round(Number(val) * 1.5) : '' }));
                                    }
                                  }}
                                  className="w-24 bg-[#FCF9F2] border border-[#EADFCF] rounded-xl px-2 py-2 text-xs font-bold outline-none focus:border-[#A68970] text-center"
                                />
                                <input 
                                  type="number" min="0" step="1" placeholder="+ мин" aria-label={`Минуты чтения — ${book.title}`} value={logMinutesInput[book.id] ?? ''} onChange={(e) => setLogMinutesInput({ ...logMinutesInput, [book.id]: e.target.value })}
                                  onKeyDown={(event) => { if (event.key === 'Enter') handleLogProgress(book.id); }}
                                  className="w-16 bg-[#FCF9F2] border border-[#EADFCF] rounded-xl px-2 py-2 text-xs font-bold outline-none focus:border-[#A68970] text-center"
                                />
                                <button onClick={() => handleLogProgress(book.id)} className="bg-[#806047] hover:bg-[#694C37] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                                  Записать
                                </button>
                                {book.totalPages && (book.readPages || 0) < book.totalPages && (
                                  <button onClick={() => handleQuickFinish(book.id)} title="Дочитал до конца!" className="bg-[#DDEAE3] hover:bg-[#C9DEC2] text-[#4F6F61] p-2 rounded-xl transition-colors ml-auto sm:ml-0 shadow-sm">
                                    <CheckIcon size={16} />
                                  </button>
                                )}
                              </div>
                              {(pageInputError || logProgressErrors[book.id]) ? (
                                <p role="alert" className="mt-2 text-xs text-[#9B493B]">{pageInputError || logProgressErrors[book.id]}</p>
                              ) : (
                                <p className="mt-2 text-xs text-[#706155]" aria-live="polite">{logPagesInput[book.id] !== '' && logPagesInput[book.id] != null ? `Будет добавлено: ${pagesPreview} стр. (сейчас ${book.readPages || 0}).` : 'Введите страницу, до которой дочитали, или выберите «+ Страницы».'}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 text-[11px] font-bold flex flex-wrap gap-2">
                            <span className="bg-[#EFE7D8] text-[#74675B] px-3 py-1.5 rounded-xl border border-[#E2D5C3] flex items-center gap-1">
                              За {selectedDate.toLocaleDateString()}: {pagesOnSelectedDate} стр. / {minsOnSelectedDate} мин.
                            </span>
                            {book.sketchnoteUrl && (
                              <button onClick={() => setSketchnoteModalUrl(book.sketchnoteUrl)} className="bg-[#F2E8DC] hover:bg-[#EADFCF] text-[#765A45] px-3 py-1.5 rounded-xl border border-[#E2D5C3] flex items-center gap-1 transition-colors">
                                🎨 Визуальный конспект
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Calendar Column */}
              <div className="space-y-3 lg:sticky lg:top-24 max-w-sm mx-auto w-full">
                <div className="bg-[#F7F2E8] rounded-3xl p-3 sm:p-4 shadow-sm border border-[#EADFCF]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-sm sm:text-base text-[#564B41] capitalize">
                      {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => setIsSummaryModalOpen(true)} className="text-[#765A45] bg-[#EADFCF] hover:bg-[#DDD0BE] px-2.5 py-1.5 rounded-2xl text-[10px] font-bold transition-colors flex items-center gap-1 shadow-sm">
                      <CameraIcon size={12}/> Итоги
                    </button>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-[#EADFCF] rounded-lg text-[#74675B]"><ChevronLeftIcon size={16}/></button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-[#EADFCF] rounded-lg text-[#74675B]"><ChevronRightIcon size={16}/></button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                      <div key={d} className="text-[9px] font-black text-[#706155]">{d}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
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
                          bgClass = 'bg-[#98C4AB] hover:bg-[#83B398] text-[#243C2F] shadow-sm'; 
                        } else if (day.pages <= 100) {
                          bgClass = 'bg-[#6CA384] hover:bg-[#5B9273] text-[#102017] shadow-sm'; 
                        } else {
                          bgClass = 'bg-[#477C5E] hover:bg-[#3D6B51] text-white shadow-sm'; 
                        }
                      } else if (isPastOrToday) {
                        bgClass = 'bg-[#E8C2C2] hover:bg-[#DFB3B3] text-[#7A3E3E] shadow-sm'; 
                      } else if (isFuture) {
                        bgClass = 'bg-transparent opacity-30 cursor-not-allowed text-[#706155]';
                      }

                      return (
                        <button 
                          key={idx} onClick={() => handleDateClick(day.date)} disabled={isFuture}
                          className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold transition-all relative ${bgClass} ${isSelected ? 'ring-2 ring-[#A68970] ring-offset-1 scale-110 z-10' : ''}`}
                          title={`${day.date.toLocaleDateString()} - ${day.pages} стр. / ${day.minutes} мин.`}
                        >
                          {day.date.getDate()}
                          {isToday && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#846851] rounded-full"></div>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Page-Count Legend */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#EADFCF] flex flex-wrap gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-bold text-[#74675B] justify-center items-center">
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#E8C2C2] rounded-sm shadow-xs"></div> 0 стр</div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#D2E7DB] rounded-sm shadow-xs"></div> 1–20</div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#98C4AB] rounded-sm shadow-xs"></div> 21–50</div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#6CA384] rounded-sm shadow-xs"></div> 51–100</div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#477C5E] rounded-sm shadow-xs"></div> 100+</div>
                  </div>
                </div>

                {/* Day Summary Card below calendar for mobile quick-view */}
                <div className="bg-[#F7F2E8] rounded-2xl p-4 shadow-sm border border-[#EADFCF] flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#564B41] text-sm">
                      {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </span>
                    {selectedDate.toDateString() === todayMoscow.toDateString() && (
                      <span className="text-[9px] font-black text-[#4F6F61] uppercase tracking-wider mt-0.5">Сегодня</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-black text-[#765A45] text-lg leading-none">{pagesOnSelectedDateAllBooks} <span className="text-[10px] uppercase text-[#706155]">стр</span></span>
                    <span className="text-[11px] font-bold text-[#74675B] mt-1">{Math.floor(minsOnSelectedDateAllBooks / 60)}ч {minsOnSelectedDateAllBooks % 60}м</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-4">
            
            {/* Library Status Badges with Book Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'all', label: 'Все книги', count: books.length, color: 'text-[#765A45]' },
                { id: 'reading', label: 'В процессе', count: activeBooks.length, color: 'text-[#8A542B]' },
                { id: 'read', label: 'Прочитано', count: readBooksList.length, color: 'text-[#486B59]' },
                { id: 'wishlist', label: 'Виш-лист', count: wishlistBooks.length, color: 'text-[#46657F]' },
                { id: 'dropped', label: 'Брошено', count: droppedBooks.length, color: 'text-[#9B493B]' }
              ].map(badge => (
                <button
                  key={badge.id}
                  onClick={() => setFilter(badge.id)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    filter === badge.id 
                      ? 'bg-white border-[#A68970] shadow-sm' 
                      : 'bg-[#F7F2E8] border-[#EADFCF] hover:bg-[#EFE7D8]'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#706155] uppercase">{badge.label}</span>
                  <span className={`text-xl font-black ${badge.color}`}>{badge.count}</span>
                </button>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3.5 bg-[#F7F2E8] p-4 md:p-5 rounded-3xl shadow-sm border border-[#EADFCF]">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex-1 relative min-w-[200px]">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706155]"><SearchIcon size={16}/></div>
                  <input 
                    type="text" 
                    placeholder="Поиск по названию, автору или серии..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FCF9F2] border border-[#EADFCF] text-[#4A4238] pl-10 pr-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm outline-none focus:border-[#A68970] transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#706155] hover:text-[#564B41]">
                      <XIcon size={14} />
                    </button>
                  )}
                </div>

                <div className="flex bg-[#EFE7D8] rounded-2xl p-1 border border-[#E2D5C3]">
                  <button onClick={() => setViewMode('grid')} title="Сетка обложек" className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B]'}`}>
                    <GridIcon size={16} />
                  </button>
                  <button onClick={() => setViewMode('shelf')} title="Книжная полка" className={`p-2 rounded-xl transition-all ${viewMode === 'shelf' ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B]'}`}>
                    <LayersBoxIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Genre and Author Dropdowns */}
              <div className="flex flex-wrap gap-2 items-center">
                <select 
                  value={genreFilter} 
                  onChange={(e) => setGenreFilter(e.target.value)} 
                  className="bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3 py-2 rounded-2xl font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="all">Все жанры</option>
                  {PREDEFINED_GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                <select 
                  value={authorFilter} 
                  onChange={(e) => setAuthorFilter(e.target.value)} 
                  className="bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3 py-2 rounded-2xl font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="all">Все авторы</option>
                  {uniqueAuthors.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                {uniqueSeries.length > 0 && (
                  <select 
                    value={seriesFilter} 
                    onChange={(e) => setSeriesFilter(e.target.value)} 
                    className="bg-[#FCF9F2] border border-[#EADFCF] text-[#564B41] px-3 py-2 rounded-2xl font-bold text-xs outline-none cursor-pointer"
                  >
                    <option value="all">Все серии</option>
                    {uniqueSeries.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}

                {(genreFilter !== 'all' || authorFilter !== 'all' || seriesFilter !== 'all') && (
                  <button 
                    onClick={() => { setGenreFilter('all'); setAuthorFilter('all'); setSeriesFilter('all'); }} 
                    className="text-xs font-bold text-[#9B493B] hover:underline px-2"
                  >
                    Сбросить
                  </button>
                )}
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
                <button onClick={openNewBookModal} className="bg-[#F7F2E8] border-2 border-dashed border-[#D5C6B4] rounded-2xl flex flex-col items-center justify-center text-[#706155] hover:text-[#765A45] hover:border-[#A68970] hover:bg-[#EFE7D8] transition-all aspect-[2/3] group shadow-sm">
                  <div className="bg-[#EFE7D8] group-hover:bg-[#EADFCF] p-2.5 rounded-2xl mb-1.5 transition-colors"><PlusIcon size={20} /></div>
                  <span className="font-bold text-xs">Добавить книгу</span>
                </button>

                {filteredBooks.map(book => {
                  const FormatIcon = FORMATS.find(f => f.id === book.format)?.icon || BookOpenIcon;
                  
                  return (
                    <div 
                      key={book.id} 
                      onClick={() => { setCurrentBook(book); setIsModalOpen(true); }} 
                      className="bg-[#F7F2E8] border border-[#EADFCF] rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col aspect-[2/3] relative"
                    >
                      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-1">
                        <div className={`p-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 ${book.status === 'read' ? 'text-[#486B59]' : book.status === 'reading' || book.status === 'rereading' ? 'text-[#8A542B]' : book.status === 'dropped' ? 'text-[#9B493B]' : 'text-[#706155]'}`}>
                          <CheckIcon size={10} />
                        </div>
                        <div className="p-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 text-[#74675B]">
                          <FormatIcon size={10} />
                        </div>
                        {book.sketchnoteUrl && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSketchnoteModalUrl(book.sketchnoteUrl); }}
                            title="Посмотреть визуальный конспект"
                            className="p-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 text-[#765A45] hover:scale-110 transition-transform"
                          >
                            <EyeIcon size={10} />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 min-h-0 bg-[#EFE7D8] relative overflow-hidden">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#EAE2D2] text-[#765A45] font-black p-2 text-center text-xs">
                            {book.title}
                          </div>
                        )}
                        
                        {book.seriesName && (
                          <div className="absolute top-1.5 left-1.5 bg-black/60 text-[#FDFBF7] text-[7px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm max-w-[80%] truncate">
                            {book.seriesName} {book.seriesIndex ? `#${book.seriesIndex}` : ''}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2.5 bg-[#F7F2E8] min-h-[64px] flex flex-col gap-1 shrink-0 border-t border-[#EFE7D8]">
                        <div>
                          <h3 className="font-bold text-xs text-[#4A4238] line-clamp-1 leading-tight">{book.title}</h3>
                          <p className="text-[10px] text-[#706155] line-clamp-1 mt-0.5">{book.author}</p>
                        </div>
                        
                        <div className="mt-0.5 flex justify-between items-start gap-1 text-[9px] leading-tight font-bold text-[#765A45]">
                          <span className="min-w-0 flex-1 break-words">{book.genre}</span>
                          {book.status === 'read' && book.rating > 0 && <span className="shrink-0 whitespace-nowrap">★ {book.rating}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Virtual Wooden Bookshelf View */}
            {viewMode === 'shelf' && (
              <div className="space-y-6 pt-2">
                {bookshelfShelves.map((shelfBooks, shelfIdx) => (
                  <div key={shelfIdx} className="relative pt-4">
                    <div className="flex flex-wrap items-end gap-3 sm:gap-6 px-4 pb-2 min-h-[210px]">
                      {shelfIdx === 0 && (
                        <div onClick={openNewBookModal} className="w-20 sm:w-24 h-40 sm:h-52 border-2 border-dashed border-[#D5C6B4] bg-[#F7F2E8]/80 rounded-xl flex flex-col items-center justify-center text-[#706155] hover:text-[#765A45] hover:border-[#A68970] transition-all cursor-pointer shadow-sm mb-1">
                          <PlusIcon size={24} />
                          <span className="text-[10px] font-bold mt-1">Добавить</span>
                        </div>
                      )}

                      {shelfBooks.map((book, bookIdx) => {
                        const spineColors = [
                          'bg-[#846851] text-[#FDFBF7]',
                          'bg-[#486B59] text-[#FDFBF7]',
                          'bg-[#765B82] text-[#FDFBF7]',
                          'bg-[#8A542B] text-[#FDFBF7]',
                          'bg-[#564B41] text-[#FDFBF7]',
                          'bg-[#BFA892] text-[#4A4238]'
                        ];
                        const spineColor = spineColors[(book.id + bookIdx) % spineColors.length];

                        return (
                          <div 
                            key={book.id} 
                            onClick={() => { setCurrentBook(book); setIsModalOpen(true); }}
                            className="group relative cursor-pointer mb-1 transition-transform hover:-translate-y-2 duration-300"
                            title={`${book.title} — ${book.author}`}
                          >
                            <div className={`w-20 sm:w-24 h-40 sm:h-52 rounded-r-xl rounded-l-md shadow-md border-l-4 border-black/15 flex flex-col justify-between p-2.5 ${spineColor} overflow-hidden relative`}>
                              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none"></div>
                              
                              <div>
                                <div className="text-[8px] font-bold opacity-80 uppercase tracking-widest truncate">{book.genre}</div>
                                {book.seriesName && (
                                  <div className="text-[7px] font-bold text-[#E2D5C3] truncate mt-0.5">
                                    {book.seriesName} {book.seriesIndex ? `#${book.seriesIndex}` : ''}
                                  </div>
                                )}
                              </div>
                              
                              <div className="my-auto text-center">
                                <h4 className="font-black text-xs sm:text-sm line-clamp-3 leading-snug tracking-tight">{book.title}</h4>
                                <p className="text-[9px] opacity-90 line-clamp-1 mt-1 font-medium">{book.author}</p>
                              </div>

                              <div className="flex justify-center items-center gap-1 text-[9px] font-bold opacity-80">
                                {book.status === 'read' ? '★ ' + (book.rating || '✓') : book.status === 'reading' ? '📖' : '📌'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-4 sm:h-5 bg-gradient-to-b from-[#A68970] via-[#8C745E] to-[#6A5443] rounded-sm shadow-xl border-t border-[#C7B299] relative z-10 flex items-center justify-between px-6">
                      <div className="w-2 h-2 rounded-full bg-[#524133] shadow-inner"></div>
                      <div className="w-2 h-2 rounded-full bg-[#524133] shadow-inner"></div>
                    </div>
                  </div>
                ))}

                {filteredBooks.length === 0 && (
                  <div className="text-center py-12 text-[#706155] font-bold text-sm">
                    Книги не найдены. Измените параметры фильтрации или добавьте новую книгу.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-5 md:space-y-6">
            
            {/* Analytics Header Card */}
            <div className="bg-[#F7F2E8] rounded-3xl p-5 md:p-6 shadow-sm border border-[#EADFCF] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#564B41] flex items-center gap-2.5">
                  <span className="bg-[#EFE7D8] text-[#765A45] p-2 rounded-2xl"><BarChart2Icon size={22}/></span>
                  Аналитика и прочитанное
                </h2>
                <p className="text-xs md:text-sm text-[#706155] mt-1">
                  Подробная статистика вашего прогресса чтения, разбивка по месяцам, жанрам и форматам.
                </p>
              </div>

              {/* Subtabs Switcher */}
              <div className="flex flex-wrap bg-[#EFE7D8] rounded-2xl p-1 border border-[#E2D5C3]">
                {[
                  { id: 'months', label: 'По месяцам' },
                  { id: 'genres', label: 'По жанрам' },
                  { id: 'formats', label: 'По форматам' },
                  { id: 'activity', label: 'По дням недели' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatViewType(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statViewType === tab.id ? 'bg-white text-[#765A45] shadow-sm' : 'text-[#74675B] hover:text-[#4A4238]'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar in Analytics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F7F2E8] p-4 rounded-2xl border border-[#EADFCF] shadow-sm">
                <span className="text-[10px] font-bold text-[#706155] uppercase">Всего прочитано</span>
                <p className="text-2xl font-black text-[#765A45] mt-1">{totalReadBooks} книг</p>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-2xl border border-[#EADFCF] shadow-sm">
                <span className="text-[10px] font-bold text-[#706155] uppercase">Прочитано страниц</span>
                <p className="text-2xl font-black text-[#486B59] mt-1">{totalReadPages}</p>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-2xl border border-[#EADFCF] shadow-sm">
                <span className="text-[10px] font-bold text-[#706155] uppercase">Время за чтением</span>
                <p className="text-2xl font-black text-[#765B82] mt-1">{Math.floor(totalMinutesAllTime / 60)}ч {totalMinutesAllTime % 60}м</p>
              </div>
              <div className="bg-[#F7F2E8] p-4 rounded-2xl border border-[#EADFCF] shadow-sm">
                <span className="text-[10px] font-bold text-[#706155] uppercase">Дней без пропуска</span>
                <p className="text-2xl font-black text-[#9B493B] mt-1">{totalStreak} {getPluralDays(totalStreak)}</p>
              </div>
            </div>

            {/* Monthly Breakdown View */}
            {statViewType === 'months' && (
              <div className="bg-[#F7F2E8] p-5 md:p-6 rounded-3xl border border-[#EADFCF] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs md:text-sm font-black text-[#765A45] uppercase tracking-wider">История прочитанного по месяцам</h4>
                  <span className="text-[11px] font-bold text-[#706155]">Нажмите на обложку для просмотра деталей</span>
                </div>

                {monthlyStats.length === 0 ? (
                  <p className="text-xs text-[#706155] py-10 text-center">Вы пока не завершили ни одной книги с указанием даты.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthlyStats.map(month => (
                      <div key={month.key} className="bg-[#FCF9F2] p-4 rounded-2xl border border-[#EADFCF] shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-[#EADFCF] pb-2">
                          <h5 className="font-bold text-[#564B41] capitalize">{month.label}</h5>
                          <div className="text-right">
                            <span className="block font-black text-[#765A45] text-sm">{month.books.length} книг</span>
                            <span className="block text-[10px] font-bold text-[#706155]">{month.pages} стр.</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2.5 overflow-y-auto max-h-48 pr-1">
                          {month.books.map(b => (
                            <div 
                              key={b.id} 
                              title={`${b.title} — ${b.author}`} 
                              onClick={() => { setCurrentBook(b); setIsModalOpen(true); }} 
                              className="w-14 sm:w-16 aspect-[2/3] bg-[#EFE7D8] rounded-xl overflow-hidden shadow-sm border border-[#E2D5C3] cursor-pointer hover:scale-105 transition-transform shrink-0 relative group"
                            >
                              {b.coverUrl ? (
                                <img src={b.coverUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="text-[8px] p-1 text-center font-bold text-[#765A45] leading-tight flex items-center justify-center h-full bg-[#EAE2D2]">{b.title}</div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <SearchIcon size={14} className="text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {statViewType === 'genres' && (
              <div className="bg-[#F7F2E8] p-5 md:p-6 rounded-3xl border border-[#EADFCF] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs md:text-sm font-black text-[#765A45] uppercase tracking-wider">Распределение по жанрам</h4>
                  <span className="text-[11px] font-bold text-[#706155]">Всего прочитано: {totalReadBooks}</span>
                </div>
                {genreStats.length === 0 ? (
                  <p className="text-xs text-[#706155] py-10 text-center">Прочитайте книги, чтобы увидеть статистику жанров.</p>
                ) : (
                  <div className="space-y-3.5 bg-[#FCF9F2] p-5 rounded-2xl border border-[#EADFCF]">
                    {genreStats.map(([genre, count], i) => {
                      const percent = totalReadBooks > 0 ? Math.round((count / totalReadBooks) * 100) : 0;
                      const colors = ['bg-[#846851]', 'bg-[#6F8E80]', 'bg-[#9E82A8]', 'bg-[#C98E5E]', 'bg-[#62839F]', 'bg-[#BFA892]'];
                      const barColor = colors[i % colors.length];

                      return (
                        <div key={genre} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-[#564B41]">
                            <span className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${barColor}`}></span>
                              {genre}
                            </span>
                            <span>{count} книг ({percent}%)</span>
                          </div>
                          <div className="w-full bg-[#EADFCF] rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div className={`${barColor} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {statViewType === 'formats' && (
              <div className="bg-[#F7F2E8] p-5 md:p-6 rounded-3xl border border-[#EADFCF] shadow-sm space-y-4">
                <h4 className="text-xs md:text-sm font-black text-[#765A45] uppercase tracking-wider">Форматы прочитанных книг</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'paper', label: 'Бумажные', count: formatStats.paper, color: 'border-[#846851] text-[#765A45]', bg: 'bg-[#846851]' },
                    { id: 'ebook', label: 'Электронные', count: formatStats.ebook, color: 'border-[#62839F] text-[#46657F]', bg: 'bg-[#62839F]' },
                    { id: 'audio', label: 'Аудиокниги', count: formatStats.audio, color: 'border-[#9E82A8] text-[#765B82]', bg: 'bg-[#9E82A8]' },
                    { id: 'combo', label: 'Комбо', count: formatStats.combo, color: 'border-[#6F8E80] text-[#486B59]', bg: 'bg-[#6F8E80]' }
                  ].map(f => {
                    const percent = totalReadBooks > 0 ? Math.round((f.count / totalReadBooks) * 100) : 0;
                    return (
                      <div key={f.id} className="bg-[#FCF9F2] p-4 rounded-2xl border border-[#EADFCF] flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-[#74675B]">{f.label}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white border ${f.color}`}>{percent}%</span>
                        </div>
                        <div className="text-2xl font-black text-[#4A4238] mb-2">{f.count} <span className="text-xs font-bold text-[#706155]">книг</span></div>
                        <div className="w-full bg-[#EADFCF] rounded-full h-1.5 overflow-hidden">
                          <div className={`${f.bg} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {statViewType === 'activity' && (
              <div className="bg-[#F7F2E8] p-5 md:p-6 rounded-3xl border border-[#EADFCF] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs md:text-sm font-black text-[#765A45] uppercase tracking-wider">Активность чтения по дням недели</h4>
                  <span className="text-[11px] font-bold text-[#706155]">Сумма прочитанных страниц</span>
                </div>
                <div className="bg-[#FCF9F2] p-5 rounded-2xl border border-[#EADFCF]">
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                    {weekdayStats.map(w => {
                      const maxPages = Math.max(...weekdayStats.map(item => item.pages), 1);
                      const heightPercent = Math.max(15, Math.round((w.pages / maxPages) * 100));

                      return (
                        <div key={w.day} className="bg-[#F7F2E8] p-3 rounded-2xl border border-[#EADFCF] flex flex-col items-center justify-between h-40">
                          <span className="text-[10px] font-black text-[#564B41]">{w.pages} стр.</span>
                          <div className="w-8 bg-[#EADFCF] rounded-xl h-24 flex items-end overflow-hidden p-1">
                            <div className="w-full bg-[#806047] rounded-lg transition-all duration-700" style={{ height: `${heightPercent}%` }}></div>
                          </div>
                          <div className="text-center">
                            <span className="block text-[11px] font-bold text-[#706155]">{w.day}</span>
                            <span className="hidden sm:block text-[8px] text-[#706155]">{w.fullName.slice(0, 3)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= ROULETTE TAB ================= */}
        {activeTab === 'roulette' && (
          <div className="max-w-xl mx-auto text-center py-6">
            <div className="bg-[#F7F2E8] rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-[#EADFCF]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EFE7D8] text-[#765A45] rounded-3xl mb-4 shadow-sm">
                <ShuffleIcon size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#564B41] mb-2">Книжная рулетка</h2>
              <p className="text-[#706155] text-xs sm:text-sm mb-6">Случайный выбор следующей книги из вашего списка желаний.</p>

              {/* Genre selector for Roulette */}
              <div className="mb-6 flex justify-center items-center gap-2">
                <span className="text-xs font-bold text-[#74675B]">Жанр:</span>
                <select 
                  value={rouletteGenre} 
                  onChange={(e) => setRouletteGenre(e.target.value)}
                  className="bg-[#FCF9F2] border border-[#EADFCF] rounded-2xl px-3 py-2 text-xs font-bold text-[#564B41] outline-none"
                >
                  <option value="all">Любой жанр ({wishlistBooks.length})</option>
                  {PREDEFINED_GENRES.map(g => {
                    const countInWishlist = wishlistBooks.filter(b => b.genre === g).length;
                    if (countInWishlist === 0) return null;
                    return <option key={g} value={g}>{g} ({countInWishlist})</option>;
                  })}
                </select>
              </div>

              {roulettePool.length === 0 ? (
                <div className="p-6 bg-[#EFE7D8] rounded-2xl text-xs font-bold text-[#706155] mb-6">
                  {wishlistBooks.length === 0 
                    ? 'В вашем виш-листе пока нет книг. Добавьте книги со статусом «Виш-лист», чтобы запустить рулетку!'
                    : 'В выбранном жанре нет книг в виш-листе. Выберите другой жанр или сбросьте фильтр.'}
                </div>
              ) : (
                <div className="mb-8">
                  <div className="w-44 sm:w-52 aspect-[2/3] mx-auto bg-[#EFE7D8] rounded-3xl overflow-hidden shadow-xl border-4 border-[#EADFCF] mb-4 flex items-center justify-center relative">
                    {rouletteBook ? (
                      rouletteBook.coverUrl ? (
                        <img src={rouletteBook.coverUrl} className={`w-full h-full object-cover transition-all ${isSpinning ? 'blur-sm scale-105' : 'scale-100'}`} alt="" />
                      ) : (
                        <div className="p-4 text-center text-xs font-bold text-[#765A45]">{rouletteBook.title}</div>
                      )
                    ) : (
                      <div className="text-[#706155] font-bold text-xs p-4 text-center">Нажмите кнопку ниже, чтобы выбрать книгу</div>
                    )}
                  </div>

                  {rouletteBook && !isSpinning && (
                    <div className="space-y-2">
                      <h3 className="font-black text-lg sm:text-xl text-[#4A4238]">{rouletteBook.title}</h3>
                      <p className="text-xs sm:text-sm text-[#706155]">{rouletteBook.author} • {rouletteBook.genre}</p>
                      <button onClick={() => {
                        setBooks(books.map(b => b.id === rouletteBook.id ? { ...b, status: 'reading', dateStarted: getMoscowDateString(0) } : b));
                        setActiveTab('diary');
                      }} className="bg-[#486B59] hover:bg-[#3C594A] text-white px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-sm mt-3">
                        Начать читать эту книгу!
                      </button>
                    </div>
                  )}
                </div>
              )}

              {roulettePool.length > 0 && (
                <button onClick={spinRoulette} disabled={isSpinning} className="bg-[#806047] hover:bg-[#694C37] disabled:bg-[#D5C6B4] disabled:text-[#564B41] text-white px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base transition-all shadow-md flex items-center gap-2 mx-auto">
                  <ShuffleIcon size={18} /> {isSpinning ? 'Крутим рулетку...' : 'Испытать удачу'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= TOURNAMENT TAB ================= */}
        {activeTab === 'tournament' && (
          <div className="max-w-4xl mx-auto">
            {tournamentPhase === 'setup' && (
              <div className="bg-[#F7F2E8] rounded-3xl p-5 sm:p-10 shadow-sm border border-[#EADFCF]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#EFE7D8] text-[#765A45] rounded-3xl mb-3 shadow-sm"><TrophyIcon size={28} /></div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#564B41] mb-1.5">Книжный Турнир</h2>
                  <p className="text-[#706155] text-xs sm:text-base">Столкните прочитанные книги в раундах на вылет и определите главного победителя!</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                  <button onClick={() => { setBracketSize(4); setSelectedForTournament([]); }} className={`px-5 py-2.5 rounded-2xl font-bold border-2 text-xs sm:text-sm transition-all ${bracketSize === 4 ? 'border-[#A68970] bg-[#FCF9F2] text-[#765A45]' : 'border-[#EADFCF] text-[#706155] hover:border-[#D5C6B4]'}`}>Полуфинал (4 книги)</button>
                  <button onClick={() => { setBracketSize(8); setSelectedForTournament([]); }} className={`px-5 py-2.5 rounded-2xl font-bold border-2 text-xs sm:text-sm transition-all ${bracketSize === 8 ? 'border-[#A68970] bg-[#FCF9F2] text-[#765A45]' : 'border-[#EADFCF] text-[#706155] hover:border-[#D5C6B4]'}`}>Четвертьфинал (8 книг)</button>
                </div>

                <div className="mb-3 flex justify-between items-center text-xs sm:text-sm font-bold text-[#706155]">
                  <span>Выберите {bracketSize} книг:</span>
                  <span className={selectedForTournament.length === bracketSize ? 'text-[#486B59]' : 'text-[#706155]'}>Выбрано: {selectedForTournament.length} / {bracketSize}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
                  {readBooksList.map(book => (
                    <div key={book.id} onClick={() => toggleTournamentSelection(book.id)} className={`cursor-pointer rounded-2xl border-2 p-2.5 transition-all flex flex-col aspect-[3/4] sm:aspect-auto sm:h-28 relative overflow-hidden group ${selectedForTournament.includes(book.id) ? 'border-[#A68970]' : 'border-[#EADFCF] hover:border-[#D5C6B4]'}`}>
                      {book.coverUrl ? (
                        <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity"><img src={book.coverUrl} className="w-full h-full object-cover blur-[2px] scale-110" alt=""/></div>
                      ) : <div className="absolute inset-0 bg-[#EFE7D8] z-0"></div>}
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="bg-white/90 backdrop-blur rounded-xl p-1.5 shadow-sm">
                          <h4 className="font-bold text-[10px] sm:text-xs text-[#4A4238] line-clamp-2 leading-tight">{book.title}</h4>
                        </div>
                        <div className="self-end mt-auto">
                          <div className={`inline-flex rounded-full p-1 shadow-sm ${selectedForTournament.includes(book.id) ? 'bg-[#806047] text-white' : 'bg-white text-[#706155]'}`}><CheckIcon size={12} /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {readBooksList.length === 0 && <div className="col-span-full py-8 text-center text-[#765A45] font-bold text-sm">Добавьте книги со статусом «Прочитано», чтобы начать турнир!</div>}
                </div>

                <div className="text-center">
                  <button onClick={startTournament} disabled={selectedForTournament.length !== bracketSize} className="bg-[#806047] hover:bg-[#694C37] disabled:bg-[#EADFCF] disabled:text-[#564B41] disabled:cursor-not-allowed text-white px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base tracking-wide transition-all shadow-md w-full sm:w-auto">НАЧАТЬ ТУРНИР</button>
                </div>
              </div>
            )}

            {tournamentPhase === 'bracket' && (
              <div className="bg-[#564B41] rounded-3xl p-5 sm:p-10 shadow-xl text-center relative overflow-hidden text-[#F7F2E8]">
                <h3 className="text-[#BAACA0] font-bold tracking-widest uppercase text-xs sm:text-sm mb-6">
                  {currentRound.length === 4 ? 'Четвертьфинал' : currentRound.length === 2 ? 'Полуфинал' : 'Финал'} &nbsp;• Дуэль {currentMatchIndex + 1} из {currentRound.length}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-16">
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
              <div className="bg-gradient-to-br from-[#73543E] to-[#604632] rounded-3xl p-6 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                <TrophyIcon size={56} className="mx-auto mb-3 text-[#FDFBF7] drop-shadow-lg" />
                <h2 className="text-2xl sm:text-4xl font-black mb-1.5 tracking-tight">Абсолютный Чемпион!</h2>
                <p className="text-[#F9F4EC] mb-6 font-bold text-xs sm:text-base">Победитель вашего книжного турнира</p>
                
                <div className="w-28 sm:w-44 aspect-[2/3] mx-auto bg-[#4A4238] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[#FDFBF7] ring-offset-4 ring-offset-[#BFA892] mb-5 transform hover:scale-105 transition-transform">
                  {tournamentWinner?.coverUrl ? <img src={tournamentWinner.coverUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#BAACA0] p-3 text-center font-bold text-xs">{tournamentWinner?.title}</div>}
                </div>
                
                <h3 className="text-xl sm:text-3xl font-black mb-1 px-4">{tournamentWinner?.title}</h3>
                <p className="text-base sm:text-xl text-[#F9F4EC] mb-6">{tournamentWinner?.author}</p>
                
                <button onClick={() => setTournamentPhase('setup')} className="bg-white text-[#4A4238] px-7 py-3 rounded-2xl font-black text-sm sm:text-base hover:bg-[#F9F4EC] transition-colors shadow-lg">Новый турнир</button>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#F7F2E8]/95 backdrop-blur-md border-t border-[#EADFCF] py-2 px-3 z-30 flex justify-around items-center md:hidden shadow-lg">
        <button onClick={() => setActiveTab('diary')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'diary' ? 'text-[#765A45]' : 'text-[#706155]'}`}>
          <ClockIcon size={18} />
          <span className="text-[9px] font-bold">Дневник</span>
        </button>
        <button onClick={() => setActiveTab('library')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'library' ? 'text-[#765A45]' : 'text-[#706155]'}`}>
          <BookOpenIcon size={18} />
          <span className="text-[9px] font-bold">Библиотека</span>
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'analytics' ? 'text-[#765A45]' : 'text-[#706155]'}`}>
          <BarChart2Icon size={18} />
          <span className="text-[9px] font-bold">Аналитика</span>
        </button>
        <button onClick={() => setActiveTab('roulette')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'roulette' ? 'text-[#765A45]' : 'text-[#706155]'}`}>
          <ShuffleIcon size={18} />
          <span className="text-[9px] font-bold">Рулетка</span>
        </button>
        <button onClick={() => setActiveTab('tournament')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'tournament' ? 'text-[#765A45]' : 'text-[#706155]'}`}>
          <TrophyIcon size={18} />
          <span className="text-[9px] font-bold">Турнир</span>
        </button>
      </div>

      {/* Fullscreen Sketchnote Modal Viewer */}
      {sketchnoteModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md" onClick={() => setSketchnoteModalUrl(null)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#FCF9F2] shadow-2xl p-2 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-3 py-2 border-b border-[#EADFCF]">
              <span className="text-xs font-bold text-[#765A45]">Визуальный конспект / Скетч</span>
              <button onClick={() => setSketchnoteModalUrl(null)} className="text-[#74675B] hover:text-[#4A4238] p-1"><XIcon size={20}/></button>
            </div>
            <div className="overflow-auto flex-1 p-2 flex justify-center items-center">
              <img src={sketchnoteModalUrl} alt="Sketchnote" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary Share Card Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A4238]/60 backdrop-blur-sm" onClick={() => setIsSummaryModalOpen(false)}></div>
          <div className="bg-[#F7F2E8] rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-[340px] overflow-hidden flex flex-col border border-[#EADFCF]">
            <div className="bg-gradient-to-br from-[#73543E] via-[#665071] to-[#854438] p-5 text-white text-center flex flex-col items-center">
              <h2 className="text-2xl font-black mb-1 uppercase tracking-wider">Итоги месяца</h2>
              <p className="text-white font-bold mb-5 bg-black/10 px-3.5 py-1 rounded-full uppercase text-xs tracking-widest backdrop-blur-sm">
                {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </p>
              
              <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
                <div className="bg-black/10 backdrop-blur-sm rounded-3xl p-3.5 border border-white/30 shadow-inner">
                  <div className="text-3xl font-black">{readThisTargetMonth.length}</div>
                  <div className="text-[9px] font-bold text-white uppercase mt-1">Книг</div>
                </div>
                <div className="bg-black/10 backdrop-blur-sm rounded-3xl p-3.5 border border-white/30 shadow-inner">
                  <div className="text-3xl font-black">{totalPagesThisMonth}</div>
                  <div className="text-[9px] font-bold text-white uppercase mt-1">Страниц</div>
                </div>
                <div className="col-span-2 bg-black/10 backdrop-blur-sm rounded-3xl p-3.5 border border-white/30 shadow-inner">
                  <div className="text-2xl font-black">{Math.floor(totalMinutesThisMonth / 60)}ч {totalMinutesThisMonth % 60}м</div>
                  <div className="text-[9px] font-bold text-white uppercase mt-1">Время за чтением</div>
                </div>
              </div>
              
              {readThisTargetMonth.length > 0 && (
                <div className="w-full">
                  <p className="text-[9px] uppercase font-bold text-white mb-2">Прочитано в этом месяце:</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {readThisTargetMonth.map(b => (
                      <div key={b.id} className="w-10 aspect-[2/3] bg-[#4A4238] rounded-xl shadow-md overflow-hidden border border-white/30">
                        {b.coverUrl ? <img src={b.coverUrl} className="w-full h-full object-cover" alt="" /> : <div className="text-[5px] p-0.5 text-center font-bold">{b.title}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 text-[8px] uppercase tracking-widest text-white">LibriMori Tracker</div>
            </div>
            <div className="p-3.5 flex gap-2 justify-center bg-[#F7F2E8]">
              <button onClick={() => setIsSummaryModalOpen(false)} className="px-5 py-2 bg-[#EADFCF] hover:bg-[#DDD0BE] text-[#564B41] rounded-2xl font-bold text-xs transition-colors">Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Book Edit / Add Modal */}
      {isModalOpen && currentBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-[#4A4238]/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#F7F2E8] rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto relative z-10 flex flex-col border border-[#EADFCF]">
            
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-[#EADFCF] sticky top-0 bg-[#F7F2E8]/95 backdrop-blur-md z-20">
              <h2 className="text-lg sm:text-xl font-black text-[#564B41]">{currentBook.id.toString().length > 10 ? 'Новая книга' : 'Редактирование'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-[#EADFCF] hover:bg-[#DDD0BE] p-2 rounded-full text-[#74675B] transition-colors"><XIcon size={18}/></button>
            </div>

            <form onSubmit={handleSaveBook} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              <IsbnLookup key={currentBook.id} book={currentBook} books={books} onFound={(details) => {
                setCurrentBook(previous => {
                  if (!previous || previous.id !== currentBook.id) return previous;
                  const updated = { ...previous, isbn: details.isbn };
                  for (const field of ['title', 'author', 'annotation', 'totalPages', 'coverUrl']) {
                    if (!previous[field] && details[field]) updated[field] = details[field];
                  }
                  return updated;
                });
              }} />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-full sm:w-40 shrink-0 flex flex-col gap-2.5">
                  <div className="aspect-[2/3] bg-[#EFE7D8] rounded-3xl border-2 border-dashed border-[#D5C6B4] overflow-hidden relative flex items-center justify-center group max-w-[160px] mx-auto sm:max-w-none w-full">
                    {currentBook.coverUrl ? (
                      <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                      <span className="text-[#706155] font-bold text-xs text-center px-4">Обложка</span>
                    )}
                  </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cover-upload" className="cursor-pointer bg-[#FCF9F2] border border-[#D5C6B4] text-[#4A4238] text-xs font-bold px-3 py-2 rounded-xl text-center w-full hover:bg-white transition-colors">С устройства</label>
                      <button type="button" onClick={() => {
                        setCustomModal({
                          title: 'Вставить URL обложки:', type: 'prompt', defaultValue: currentBook.coverUrl || '',
                          onSubmit: (url) => { if (url) setCurrentBook({...currentBook, coverUrl: url}); setCustomModal(null); }
                        });
                      }} className="bg-[#FCF9F2] border border-[#D5C6B4] text-[#4A4238] text-xs font-bold px-3 py-2 rounded-xl text-center w-full hover:bg-white transition-colors">По ссылке</button>
                    </div>
                  <input type="file" id="cover-upload" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) { 
                      const reader = new FileReader(); 
                      reader.onloadend = () => setCurrentBook({ ...currentBook, coverUrl: reader.result }); 
                      reader.readAsDataURL(file); 
                    }
                  }} />
                </div>

                <div className="flex-1 space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Название книги *</label>
                    <input required type="text" value={currentBook.title} onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-xs sm:text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] text-[#4A4238]" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Автор</label>
                      <input type="text" value={currentBook.author} onChange={(e) => setCurrentBook({...currentBook, author: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-xs sm:text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] text-[#4A4238]" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Жанр</label>
                      <select 
                        value={currentBook.genre || 'Проза'} 
                        onChange={(e) => setCurrentBook({...currentBook, genre: e.target.value})}
                        className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-xs sm:text-sm focus:border-[#A68970] outline-none bg-[#FCF9F2] text-[#4A4238] cursor-pointer"
                      >
                        {PREDEFINED_GENRES.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#EFE7D8] p-3 rounded-2xl border border-[#EADFCF] space-y-2">
                    <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Книжная серия / Цикл</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Напр. Воспоминания о прошлом Земли" value={currentBook.seriesName || ''} onChange={(e) => setCurrentBook({...currentBook, seriesName: e.target.value})} className="flex-1 border-2 border-[#EADFCF] rounded-xl p-2 font-bold text-xs bg-white outline-none text-[#4A4238]" />
                      <input type="number" placeholder="№" value={currentBook.seriesIndex || ''} onChange={(e) => setCurrentBook({...currentBook, seriesIndex: e.target.value ? Number(e.target.value) : ''})} className="w-16 border-2 border-[#EADFCF] rounded-xl p-2 font-bold text-xs bg-white outline-none text-[#4A4238] text-center" />
                    </div>
                  </div>

                  {/* Sketchnote Image Upload & URL input */}
                  <div className="bg-[#EFE7D8] p-3 rounded-2xl border border-[#EADFCF] space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider flex items-center gap-1.5">
                        🎨 Визуальный конспект / Sketchnote
                      </label>
                      {currentBook.sketchnoteUrl && (
                        <button type="button" onClick={() => setSketchnoteModalUrl(currentBook.sketchnoteUrl)} className="text-[10px] font-bold text-[#765A45] hover:underline flex items-center gap-1">
                          <EyeIcon size={12} /> Предпросмотр
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Ссылка на конспект или загрузите файл..." 
                        value={currentBook.sketchnoteUrl || ''} 
                        onChange={(e) => setCurrentBook({...currentBook, sketchnoteUrl: e.target.value})}
                        className="flex-1 border-2 border-[#EADFCF] rounded-xl p-2 font-bold text-xs bg-white outline-none text-[#4A4238]" 
                      />
                      <label htmlFor="sketchnote-upload" className="cursor-pointer bg-[#806047] hover:bg-[#694C37] text-white text-[11px] font-bold px-3 py-2 rounded-xl shrink-0 transition-colors shadow-sm">
                        Загрузить
                      </label>
                      <input type="file" id="sketchnote-upload" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setCurrentBook({ ...currentBook, sketchnoteUrl: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Формат</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {FORMATS.map(f => (
                        <button key={f.id} type="button" onClick={() => setCurrentBook({...currentBook, format: f.id})} className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl border-2 font-bold text-[11px] transition-all ${currentBook.format === f.id ? 'border-[#A68970] bg-[#FCF9F2] text-[#765A45] shadow-sm' : 'border-[#EADFCF] bg-[#F7F2E8] text-[#74675B]'}`}>
                          <f.icon size={13} /> {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EFE7D8] p-4 rounded-3xl border border-[#EADFCF] space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Статус</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 bg-[#F7F2E8] rounded-2xl border-2 border-[#EADFCF] p-1 gap-1">
                    {STATUSES.map(s => (
                      <button key={s.id} type="button" onClick={() => setCurrentBook({...currentBook, status: s.id})} className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${currentBook.status === s.id ? 'bg-[#806047] text-white shadow-sm' : 'text-[#74675B] hover:bg-[#EADFCF]'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Всего страниц</label>
                    <input type="number" value={currentBook.totalPages} onChange={(e) => setCurrentBook({...currentBook, totalPages: e.target.value ? Number(e.target.value) : ''})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-2.5 font-bold text-xs sm:text-sm bg-white outline-none text-[#4A4238]" />
                  </div>
                  
                  {(currentBook.status === 'reading' || currentBook.status === 'rereading' || currentBook.status === 'dropped') && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Прочитано</label>
                      <input type="number" value={currentBook.readPages} onChange={(e) => setCurrentBook({...currentBook, readPages: e.target.value ? Number(e.target.value) : 0})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-2.5 font-bold text-xs sm:text-sm bg-white outline-none text-[#4A4238]" />
                    </div>
                  )}

                  {currentBook.status === 'read' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Оценка (1-5)</label>
                      <input type="number" min="1" max="5" value={currentBook.rating || ''} onChange={(e) => setCurrentBook({...currentBook, rating: Number(e.target.value)})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-2.5 font-bold text-xs sm:text-sm bg-white outline-none text-[#4A4238]" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Дата начала</label>
                    <input type="date" value={currentBook.dateStarted || ''} onChange={(e) => setCurrentBook({...currentBook, dateStarted: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-2.5 font-bold text-xs bg-white text-[#564B41] outline-none" />
                  </div>
                  {currentBook.status !== 'wishlist' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Дата завершения</label>
                      <input type="date" value={currentBook.dateFinished || ''} onChange={(e) => setCurrentBook({...currentBook, dateFinished: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-2.5 font-bold text-xs bg-white text-[#564B41] outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Аннотация</label>
                  <textarea rows="2" value={currentBook.annotation || ''} onChange={(e) => setCurrentBook({...currentBook, annotation: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-medium text-xs sm:text-sm outline-none bg-[#FCF9F2] resize-none text-[#4A4238]" placeholder="О чем книга..."></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Резюме / Рецензия</label>
                  <textarea rows="2" value={currentBook.summary || ''} onChange={(e) => setCurrentBook({...currentBook, summary: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-medium text-xs sm:text-sm outline-none bg-[#FCF9F2] resize-none text-[#4A4238]"></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#706155] uppercase tracking-wider">Цитаты</label>
                  <textarea rows="2" value={currentBook.quotes || ''} onChange={(e) => setCurrentBook({...currentBook, quotes: e.target.value})} className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-medium text-xs sm:text-sm outline-none bg-[#FCF9F2] resize-none text-[#4A4238]"></textarea>
                </div>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                {currentBook.id.toString().length < 10 ? (
                  <button type="button" onClick={() => handleDeleteBook(currentBook.id)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#9B493B] hover:bg-[#FCEAE8] px-4 py-2.5 rounded-2xl font-bold text-xs transition-colors">
                    <TrashIcon size={16}/> Удалить
                  </button>
                ) : <div></div>}
                <button type="submit" className="w-full sm:w-auto bg-[#806047] hover:bg-[#694C37] text-white px-7 py-3 rounded-2xl font-black text-sm transition-colors shadow-lg">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSnapshotsOpen && <SnapshotPanel data={snapshotData} onRestore={applyLibrary} onClose={() => setIsSnapshotsOpen(false)} />}

      {/* Custom Modal Dialog */}
      {customModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#4A4238]/60 backdrop-blur-sm" onClick={() => setCustomModal(null)}></div>
          <div className="bg-[#F7F2E8] rounded-[2rem] p-5 shadow-2xl relative z-10 w-full max-w-sm border border-[#EADFCF]">
            <h3 className="text-base font-bold text-[#564B41] mb-3">{customModal.title}</h3>
            
            {customModal.type === 'prompt' && (
              <input 
                autoFocus
                type="text" 
                defaultValue={customModal.defaultValue}
                className="w-full border-2 border-[#EADFCF] rounded-2xl p-3 font-bold text-xs sm:text-sm outline-none focus:border-[#A68970] mb-5 bg-[#FCF9F2] text-[#4A4238]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    customModal.onSubmit(e.currentTarget.value);
                  }
                }}
                id="custom-modal-input"
              />
            )}

            <div className="flex gap-2.5 justify-end">
              {customModal.type !== 'info' && (
                <button onClick={() => setCustomModal(null)} className="px-4 py-2 rounded-xl font-bold text-xs text-[#74675B] hover:bg-[#EADFCF] transition-colors">
                  Отмена
                </button>
              )}
              <button 
                onClick={() => {
                  if (customModal.type === 'prompt') {
                    const input = document.getElementById('custom-modal-input');
                    customModal.onSubmit(input ? input.value : '');
                  } else {
                    customModal.onSubmit();
                  }
                }} 
                className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#806047] hover:bg-[#694C37] transition-colors shadow-md"
              >
                ОК
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
