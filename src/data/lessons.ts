export type LessonStatus = 'locked' | 'available' | 'completed' | 'inProgress';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  algorithmIcon: string;
  topics: string[];
  status: LessonStatus;
  order: number;
}

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Ввод и вывод данных',
    description: 'Базовые операции ввода-вывода в Python. input(), print(), типы данных.',
    duration: '5 мин',
    difficulty: 'easy',
    algorithmIcon: 'terminal',
    topics: ['Python', 'Ввод-вывод', 'Типы данных'],
    status: 'completed',
    order: 1,
  },
  {
    id: '2',
    title: 'Условия и циклы',
    description: 'Операторы if/else, циклы for и while. Логические выражения.',
    duration: '10 мин',
    difficulty: 'easy',
    algorithmIcon: 'branch',
    topics: ['Условия', 'Циклы', 'Логика'],
    status: 'completed',
    order: 2,
  },
  {
    id: '3',
    title: 'Списки и срезы',
    description: 'Работа со списками, индексация, срезы, методы list.',
    duration: '10 мин',
    difficulty: 'easy',
    algorithmIcon: 'list',
    topics: ['Списки', 'Индексация', 'Срезы'],
    status: 'available',
    order: 3,
  },
  {
    id: '4',
    title: 'Строки и символы',
    description: 'Обработка строк, методы str, кодировка, регулярные выражения.',
    duration: '15 мин',
    difficulty: 'medium',
    algorithmIcon: 'text',
    topics: ['Строки', 'Символы', 'Методы'],
    status: 'locked',
    order: 4,
  },
  {
    id: '5',
    title: 'Функции и рекурсия',
    description: 'Определение функций, рекурсивные алгоритмы, стек вызовов.',
    duration: '15 мин',
    difficulty: 'medium',
    algorithmIcon: 'function',
    topics: ['Функции', 'Рекурсия', 'Стек'],
    status: 'locked',
    order: 5,
  },
  {
    id: '6',
    title: 'Сортировки',
    description: 'Пузырьковая, быстрая, сортировка слиянием. Сложность O(n log n).',
    duration: '20 мин',
    difficulty: 'medium',
    algorithmIcon: 'sort',
    topics: ['Сортировка', 'O-нотация', 'Алгоритмы'],
    status: 'locked',
    order: 6,
  },
  {
    id: '7',
    title: 'Бинарный поиск',
    description: 'Поиск в отсортированном массиве за O(log n). Нижняя и верхняя границы.',
    duration: '20 мин',
    difficulty: 'medium',
    algorithmIcon: 'search',
    topics: ['Бинарный поиск', 'Диапазоны'],
    status: 'locked',
    order: 7,
  },
  {
    id: '8',
    title: 'Динамическое программирование',
    description: 'Задачи на ДП: числа Фибоначчи, рюкзак, НОП.',
    duration: '25 мин',
    difficulty: 'hard',
    algorithmIcon: 'dp',
    topics: ['ДП', 'Мемоизация', 'Оптимизация'],
    status: 'locked',
    order: 8,
  },
  {
    id: '9',
    title: 'Графы: обход в глубину и ширину',
    description: 'DFS, BFS. Поиск компонент связности, кратчайший путь.',
    duration: '25 мин',
    difficulty: 'hard',
    algorithmIcon: 'graph',
    topics: ['Графы', 'DFS', 'BFS'],
    status: 'locked',
    order: 9,
  },
];
