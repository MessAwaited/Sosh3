export type QuestionType = 'single' | 'multiple' | 'code';

export interface TestOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: TestOption[];
  code?: string;
  correctCodeAnswer?: string;
  explanation?: string;
}

export interface LessonTest {
  lessonId: string;
  questions: TestQuestion[];
}

const tests: Record<string, TestQuestion[]> = {
  '1': [
    {
      id: 'q1-1',
      type: 'single',
      question: 'Какой функцией в Python считывают строку с клавиатуры?',
      options: [
        { id: 'a', text: 'read()', correct: false },
        { id: 'b', text: 'input()', correct: true },
        { id: 'c', text: 'scan()', correct: false },
        { id: 'd', text: 'get()', correct: false },
      ],
      explanation: 'Функция input() считывает строку с клавиатуры и возвращает её.',
    },
    {
      id: 'q1-2',
      type: 'single',
      question: 'Что выведет print(2 + 3 * 2)?',
      options: [
        { id: 'a', text: '10', correct: false },
        { id: 'b', text: '8', correct: true },
        { id: 'c', text: '7', correct: false },
        { id: 'd', text: '12', correct: false },
      ],
      explanation: 'Сначала выполняется умножение 3 * 2 = 6, затем 2 + 6 = 8.',
    },
    {
      id: 'q1-3',
      type: 'single',
      question: 'Как преобразовать строку "42" в целое число?',
      options: [
        { id: 'a', text: 'int("42")', correct: true },
        { id: 'b', text: 'number("42")', correct: false },
        { id: 'c', text: 'str_to_int("42")', correct: false },
        { id: 'd', text: 'parse("42")', correct: false },
      ],
      explanation: 'Функция int() преобразует строку в целое число.',
    },
    {
      id: 'q1-4',
      type: 'single',
      question: 'Что вернёт input(), если пользователь введёт число 7?',
      options: [
        { id: 'a', text: 'Целое число 7', correct: false },
        { id: 'b', text: 'Строку "7"', correct: true },
        { id: 'c', text: 'Число с плавающей точкой 7.0', correct: false },
        { id: 'd', text: 'Ничего (None)', correct: false },
      ],
      explanation: 'input() всегда возвращает строку. Для числа нужно использовать int(input()).',
    },
    {
      id: 'q1-5',
      type: 'single',
      question: 'Какой тип данных у результата выражения 5 / 2 в Python 3?',
      options: [
        { id: 'a', text: 'int', correct: false },
        { id: 'b', text: 'float', correct: true },
        { id: 'c', text: 'str', correct: false },
        { id: 'd', text: 'complex', correct: false },
      ],
      explanation: 'Оператор / всегда возвращает float (2.5). Для целочисленного деления используется //.',
    },
    {
      id: 'q1-6',
      type: 'single',
      question: 'Что выведет print(type(3))?',
      options: [
        { id: 'a', text: '<class "int">', correct: false },
        { id: 'b', text: '<class \'int\'>', correct: true },
        { id: 'c', text: 'int', correct: false },
        { id: 'd', text: '3', correct: false },
      ],
      explanation: 'type(3) возвращает класс int, print выводит его строковое представление.',
    },
    {
      id: 'q1-7',
      type: 'single',
      question: 'Как вывести несколько значений в одной строке через пробел?',
      options: [
        { id: 'a', text: 'print(a, b, c)', correct: true },
        { id: 'b', text: 'print(a + b + c)', correct: false },
        { id: 'c', text: 'print(a b c)', correct: false },
        { id: 'd', text: 'print(a; b; c)', correct: false },
      ],
      explanation: 'print() принимает несколько аргументов через запятую и выводит их через пробел.',
    },
    {
      id: 'q1-8',
      type: 'single',
      question: 'Что такое переменная в Python?',
      options: [
        { id: 'a', text: 'Именованная область памяти для хранения значения', correct: true },
        { id: 'b', text: 'Только число', correct: false },
        { id: 'c', text: 'Константа, которую нельзя изменить', correct: false },
        { id: 'd', text: 'Функция', correct: false },
      ],
      explanation: 'Переменная — это имя, связанное со значением. Тип определяется значением.',
    },
  ],
  '2': [
    {
      id: 'q2-1',
      type: 'single',
      question: 'Какой цикл выполнится ровно 5 раз?',
      options: [
        { id: 'a', text: 'for i in range(5):', correct: true },
        { id: 'b', text: 'for i in range(1, 5):', correct: false },
        { id: 'c', text: 'for i in 5:', correct: false },
        { id: 'd', text: 'for i in range(0, 5, 2):', correct: false },
      ],
      explanation: 'range(5) даёт 0, 1, 2, 3, 4 — 5 итераций.',
    },
    {
      id: 'q2-2',
      type: 'single',
      question: 'Что выведет: print(10 if 3 > 5 else 20)',
      options: [
        { id: 'a', text: '10', correct: false },
        { id: 'b', text: '20', correct: true },
        { id: 'c', text: 'Ошибка', correct: false },
        { id: 'd', text: 'None', correct: false },
      ],
      explanation: 'Условие 3 > 5 ложно, поэтому выбирается значение после else — 20.',
    },
    {
      id: 'q2-3',
      type: 'single',
      question: 'Какой оператор проверяет «не равно» в Python?',
      options: [
        { id: 'a', text: '!=', correct: true },
        { id: 'b', text: '<>', correct: false },
        { id: 'c', text: 'not=', correct: false },
        { id: 'd', text: '=/=', correct: false },
      ],
      explanation: 'Оператор != возвращает True, если значения не равны.',
    },
    {
      id: 'q2-4',
      type: 'single',
      question: 'Что выведет: for i in range(2, 5): print(i, end=" ")',
      options: [
        { id: 'a', text: '0 1 2 3 4', correct: false },
        { id: 'b', text: '2 3 4', correct: true },
        { id: 'c', text: '2 3 4 5', correct: false },
        { id: 'd', text: '1 2 3 4', correct: false },
      ],
      explanation: 'range(2, 5) даёт числа 2, 3, 4 (конец 5 не включается).',
    },
    {
      id: 'q2-5',
      type: 'single',
      question: 'Как прервать выполнение цикла for досрочно?',
      options: [
        { id: 'a', text: 'break', correct: true },
        { id: 'b', text: 'stop', correct: false },
        { id: 'c', text: 'exit', correct: false },
        { id: 'd', text: 'return', correct: false },
      ],
      explanation: 'Оператор break немедленно выходит из цикла.',
    },
    {
      id: 'q2-6',
      type: 'single',
      question: 'Что такое else у цикла for?',
      options: [
        { id: 'a', text: 'Блок выполняется, если цикл завершился без break', correct: true },
        { id: 'b', text: 'Блок выполняется при ошибке', correct: false },
        { id: 'c', text: 'То же, что и у if', correct: false },
        { id: 'd', text: 'В Python у for нет else', correct: false },
      ],
      explanation: 'else у цикла выполняется после нормального завершения (без break).',
    },
    {
      id: 'q2-7',
      type: 'single',
      question: 'Какое значение имеет выражение 7 % 3?',
      options: [
        { id: 'a', text: '1', correct: true },
        { id: 'b', text: '2', correct: false },
        { id: 'c', text: '0', correct: false },
        { id: 'd', text: '2.33', correct: false },
      ],
      explanation: '% — остаток от деления. 7 = 2*3 + 1, поэтому 7 % 3 = 1.',
    },
  ],
  '3': [
    {
      id: 'q3-1',
      type: 'single',
      question: 'Что вернёт [1, 2, 3, 4][1:3]?',
      options: [
        { id: 'a', text: '[1, 2]', correct: false },
        { id: 'b', text: '[2, 3]', correct: true },
        { id: 'c', text: '[1, 2, 3]', correct: false },
        { id: 'd', text: '[2, 3, 4]', correct: false },
      ],
      explanation: 'Срез [1:3] берёт элементы с индекса 1 по 2 (3 не включается).',
    },
    {
      id: 'q3-2',
      type: 'single',
      question: 'Как добавить элемент x в конец списка a?',
      options: [
        { id: 'a', text: 'a.add(x)', correct: false },
        { id: 'b', text: 'a.append(x)', correct: true },
        { id: 'c', text: 'a.push(x)', correct: false },
        { id: 'd', text: 'a.insert(-1, x)', correct: false },
      ],
      explanation: 'Метод append(x) добавляет элемент в конец списка.',
    },
    {
      id: 'q3-3',
      type: 'single',
      question: 'Какой индекс у первого элемента списка?',
      options: [
        { id: 'a', text: '1', correct: false },
        { id: 'b', text: '0', correct: true },
        { id: 'c', text: '-1', correct: false },
        { id: 'd', text: 'first', correct: false },
      ],
      explanation: 'В Python индексация с нуля: первый элемент имеет индекс 0.',
    },
    {
      id: 'q3-4',
      type: 'single',
      question: 'Что вернёт len([10, 20, 30])?',
      options: [
        { id: 'a', text: '30', correct: false },
        { id: 'b', text: '3', correct: true },
        { id: 'c', text: '2', correct: false },
        { id: 'd', text: '0', correct: false },
      ],
      explanation: 'len() возвращает количество элементов в списке.',
    },
    {
      id: 'q3-5',
      type: 'single',
      question: 'Как получить последний элемент списка a?',
      options: [
        { id: 'a', text: 'a[len(a)]', correct: false },
        { id: 'b', text: 'a[-1]', correct: true },
        { id: 'c', text: 'a.last()', correct: false },
        { id: 'd', text: 'a(end)', correct: false },
      ],
      explanation: 'Отрицательный индекс -1 означает последний элемент.',
    },
    {
      id: 'q3-6',
      type: 'single',
      question: 'Что делает метод a.sort()?',
      options: [
        { id: 'a', text: 'Сортирует список a на месте и возвращает None', correct: true },
        { id: 'b', text: 'Возвращает новый отсортированный список', correct: false },
        { id: 'c', text: 'Удаляет дубликаты', correct: false },
        { id: 'd', text: 'Переворачивает список', correct: false },
      ],
      explanation: 'sort() изменяет список и возвращает None. sorted(a) возвращает новый список.',
    },
    {
      id: 'q3-7',
      type: 'single',
      question: 'Чему равно [1, 2] + [3, 4]?',
      options: [
        { id: 'a', text: '[1, 2, 3, 4]', correct: true },
        { id: 'b', text: '[4, 6]', correct: false },
        { id: 'c', text: '[1, 3, 2, 4]', correct: false },
        { id: 'd', text: 'Ошибка', correct: false },
      ],
      explanation: 'Оператор + для списков выполняет конкатенацию.',
    },
    {
      id: 'q3-8',
      type: 'single',
      question: 'Что вернёт [5, 2, 8].index(2)?',
      options: [
        { id: 'a', text: '0', correct: false },
        { id: 'b', text: '1', correct: true },
        { id: 'c', text: '2', correct: false },
        { id: 'd', text: 'True', correct: false },
      ],
      explanation: 'index(value) возвращает индекс первого вхождения элемента. 2 на позиции 1.',
    },
  ],
  '4': [
    { id: 'q4-1', type: 'single', question: 'Как получить длину строки s?', options: [{ id: 'a', text: 'len(s)', correct: true }, { id: 'b', text: 's.length()', correct: false }, { id: 'c', text: 'size(s)', correct: false }, { id: 'd', text: 's.size', correct: false }], explanation: 'Функция len() возвращает длину строки и других коллекций.' },
    { id: 'q4-2', type: 'single', question: 'Что вернёт "hello".upper()?', options: [{ id: 'a', text: '"HELLO"', correct: true }, { id: 'b', text: '"Hello"', correct: false }, { id: 'c', text: '"hello"', correct: false }, { id: 'd', text: 'Ошибка', correct: false }], explanation: 'Метод upper() возвращает строку в верхнем регистре.' },
    { id: 'q4-3', type: 'single', question: 'Как объединить строки a и b?', options: [{ id: 'a', text: 'a + b', correct: true }, { id: 'b', text: 'a.concat(b)', correct: false }, { id: 'c', text: 'a & b', correct: false }, { id: 'd', text: 'concat(a, b)', correct: false }], explanation: 'Оператор + для строк выполняет конкатенацию.' },
    { id: 'q4-4', type: 'single', question: 'Что вернёт "  hi  ".strip()?', options: [{ id: 'a', text: '"hi"', correct: true }, { id: 'b', text: '"  hi  "', correct: false }, { id: 'c', text: '" hi "', correct: false }, { id: 'd', text: '""', correct: false }], explanation: 'strip() удаляет пробелы с обоих концов строки.' },
    { id: 'q4-5', type: 'single', question: 'Как проверить, что строка s начинается с "Py"?', options: [{ id: 'a', text: 's.startswith("Py")', correct: true }, { id: 'b', text: 's.begin("Py")', correct: false }, { id: 'c', text: 's[0:2] == "Py"', correct: false }, { id: 'd', text: 's.starts("Py")', correct: false }], explanation: 'Метод startswith(prefix) возвращает True, если строка начинается с prefix.' },
    { id: 'q4-6', type: 'single', question: 'Что вернёт "a,b,c".split(",")?', options: [{ id: 'a', text: '["a", "b", "c"]', correct: true }, { id: 'b', text: '"a","b","c"', correct: false }, { id: 'c', text: '("a", "b", "c")', correct: false }, { id: 'd', text: 'Ошибка', correct: false }], explanation: 'split(разделитель) разбивает строку на список подстрок.' },
  ],
  '5': [
    { id: 'q5-1', type: 'single', question: 'Как объявить функцию без параметров в Python?', options: [{ id: 'a', text: 'def f():', correct: true }, { id: 'b', text: 'function f():', correct: false }, { id: 'c', text: 'func f():', correct: false }, { id: 'd', text: 'def f:', correct: false }], explanation: 'Функции объявляются ключевым словом def и двоеточием.' },
    { id: 'q5-2', type: 'single', question: 'Что такое рекурсия?', options: [{ id: 'a', text: 'Вызов функцией самой себя', correct: true }, { id: 'b', text: 'Повтор цикла', correct: false }, { id: 'c', text: 'Возврат значения', correct: false }, { id: 'd', text: 'Импорт модуля', correct: false }], explanation: 'Рекурсия — когда функция вызывает сама себя для решения подзадачи.' },
    { id: 'q5-3', type: 'single', question: 'Что вернёт функция без return?', options: [{ id: 'a', text: 'None', correct: true }, { id: 'b', text: '0', correct: false }, { id: 'c', text: 'Ошибка', correct: false }, { id: 'd', text: 'Пустую строку', correct: false }], explanation: 'Если return не указан, функция возвращает None.' },
    { id: 'q5-4', type: 'single', question: 'Как передать аргумент по имени?', options: [{ id: 'a', text: 'f(x=5)', correct: true }, { id: 'b', text: 'f(5=x)', correct: false }, { id: 'c', text: 'f(param: 5)', correct: false }, { id: 'd', text: 'f(:x 5)', correct: false }], explanation: 'Именованные аргументы передаются как имя=значение.' },
    { id: 'q5-5', type: 'single', question: 'Что такое базовый случай в рекурсии?', options: [{ id: 'a', text: 'Условие, при котором рекурсия прекращается', correct: true }, { id: 'b', text: 'Первый вызов функции', correct: false }, { id: 'c', text: 'Возврат списка', correct: false }, { id: 'd', text: 'Главная функция', correct: false }], explanation: 'Без базового случая рекурсия будет бесконечной.' },
    { id: 'q5-6', type: 'single', question: 'Сколько раз вызовется f(3), если f(n) вызывает f(n-1) при n > 0?', options: [{ id: 'a', text: '4 раза (n=3,2,1,0)', correct: true }, { id: 'b', text: '3 раза', correct: false }, { id: 'c', text: 'Бесконечно', correct: false }, { id: 'd', text: '1 раз', correct: false }], explanation: 'Рекурсия идёт от 3 до 0 — 4 вызова.' },
  ],
  '6': [
    { id: 'q6-1', type: 'single', question: 'Какая сортировка имеет сложность O(n²) в худшем случае?', options: [{ id: 'a', text: 'Пузырьковая', correct: true }, { id: 'b', text: 'Быстрая (в среднем)', correct: false }, { id: 'c', text: 'Слиянием', correct: false }, { id: 'd', text: 'Все перечисленные', correct: false }], explanation: 'Пузырьковая сортировка — O(n²). Быстрая и слиянием — O(n log n) в среднем.' },
    { id: 'q6-2', type: 'single', question: 'Что такое стабильная сортировка?', options: [{ id: 'a', text: 'Сохраняет относительный порядок равных элементов', correct: true }, { id: 'b', text: 'Работает за O(1) памяти', correct: false }, { id: 'c', text: 'Не меняет исходный список', correct: false }, { id: 'd', text: 'Использует один проход', correct: false }], explanation: 'В стабильной сортировке равные элементы не меняют свой порядок.' },
    { id: 'q6-3', type: 'single', question: 'Какова средняя сложность быстрой сортировки?', options: [{ id: 'a', text: 'O(n log n)', correct: true }, { id: 'b', text: 'O(n²)', correct: false }, { id: 'c', text: 'O(n)', correct: false }, { id: 'd', text: 'O(log n)', correct: false }], explanation: 'В среднем быстрая сортировка выполняется за O(n log n).' },
    { id: 'q6-4', type: 'single', question: 'Метод sort() в Python использует какой алгоритм?', options: [{ id: 'a', text: 'Timsort (гибрид)', correct: true }, { id: 'b', text: 'Только пузырьковую', correct: false }, { id: 'c', text: 'Только быструю', correct: false }, { id: 'd', text: 'Слиянием', correct: false }], explanation: 'Timsort — гибрид слияния и вставок, стабильный и эффективный.' },
    { id: 'q6-5', type: 'single', question: 'Что означает O-нотация?', options: [{ id: 'a', text: 'Верхняя граница роста функции', correct: true }, { id: 'b', text: 'Точное число операций', correct: false }, { id: 'c', text: 'Нижняя граница', correct: false }, { id: 'd', text: 'Среднее время', correct: false }], explanation: 'O(f(n)) означает «не быстрее, чем c·f(n) при больших n».' },
    { id: 'q6-6', type: 'single', question: 'Сортировка слиянием требует дополнительной памяти порядка:', options: [{ id: 'a', text: 'O(n)', correct: true }, { id: 'b', text: 'O(1)', correct: false }, { id: 'c', text: 'O(log n)', correct: false }, { id: 'd', text: 'O(n²)', correct: false }], explanation: 'При слиянии двух половин нужен вспомогательный массив размера n.' },
  ],
  '7': [
    { id: 'q7-1', type: 'single', question: 'Какова сложность бинарного поиска в отсортированном массиве?', options: [{ id: 'a', text: 'O(log n)', correct: true }, { id: 'b', text: 'O(n)', correct: false }, { id: 'c', text: 'O(n log n)', correct: false }, { id: 'd', text: 'O(1)', correct: false }], explanation: 'На каждом шаге область поиска уменьшается вдвое.' },
    { id: 'q7-2', type: 'single', question: 'Бинарный поиск применим только к:', options: [{ id: 'a', text: 'Отсортированным данным', correct: true }, { id: 'b', text: 'Любым спискам', correct: false }, { id: 'c', text: 'Строкам', correct: false }, { id: 'd', text: 'Словарям', correct: false }], explanation: 'Идея бинарного поиска — отбрасывать половину по сравнению с серединой.' },
    { id: 'q7-3', type: 'single', question: 'Что такое нижняя граница (lower bound)?', options: [{ id: 'a', text: 'Первый элемент ≥ заданного значения', correct: true }, { id: 'b', text: 'Минимальный элемент массива', correct: false }, { id: 'c', text: 'Средний элемент', correct: false }, { id: 'd', text: 'Индекс 0', correct: false }], explanation: 'Lower bound — позиция первого элемента не меньше x.' },
    { id: 'q7-4', type: 'single', question: 'В бинарном поиске границы l и r. Как вычислить середину без переполнения?', options: [{ id: 'a', text: 'mid = l + (r - l) // 2', correct: true }, { id: 'b', text: 'mid = (l + r) // 2', correct: false }, { id: 'c', text: 'mid = (l + r) / 2', correct: false }, { id: 'd', text: 'mid = l + r', correct: false }], explanation: 'Форма l + (r-l)//2 избегает переполнения при больших l, r.' },
    { id: 'q7-5', type: 'single', question: 'Сколько сравнений в худшем случае при бинарном поиске в массиве из 1024 элементов?', options: [{ id: 'a', text: 'Не более 11', correct: true }, { id: 'b', text: '1024', correct: false }, { id: 'c', text: '10', correct: false }, { id: 'd', text: '512', correct: false }], explanation: 'log2(1024) = 10, плюс возможно одно сравнение — до 11.' },
    { id: 'q7-6', type: 'single', question: 'Что вернёт bisect_left([1,2,2,3], 2)?', options: [{ id: 'a', text: '1', correct: true }, { id: 'b', text: '2', correct: false }, { id: 'c', text: '0', correct: false }, { id: 'd', text: '3', correct: false }], explanation: 'bisect_left возвращает индекс первого вхождения 2 (индекс 1).' },
  ],
  '8': [
    { id: 'q8-1', type: 'single', question: 'Что такое динамическое программирование?', options: [{ id: 'a', text: 'Разбиение задачи на перекрывающиеся подзадачи с запоминанием', correct: true }, { id: 'b', text: 'Только рекурсия', correct: false }, { id: 'c', text: 'Случайный перебор', correct: false }, { id: 'd', text: 'Сортировка', correct: false }], explanation: 'ДП — решение по подзадачам с сохранением результатов.' },
    { id: 'q8-2', type: 'single', question: 'Что такое мемоизация?', options: [{ id: 'a', text: 'Сохранение результатов вызовов функции', correct: true }, { id: 'b', text: 'Удаление данных', correct: false }, { id: 'c', text: 'Сжатие массива', correct: false }, { id: 'd', text: 'Рекурсия без return', correct: false }], explanation: 'Мемоизация — кэширование возвращаемых значений по аргументам.' },
    { id: 'q8-3', type: 'single', question: 'Чему равно F(0) в числах Фибоначчи (F(0), F(1)=1)?', options: [{ id: 'a', text: '0', correct: true }, { id: 'b', text: '1', correct: false }, { id: 'c', text: '2', correct: false }, { id: 'd', text: 'Не определено', correct: false }], explanation: 'Обычно F(0)=0, F(1)=1, далее F(n)=F(n-1)+F(n-2).' },
    { id: 'q8-4', type: 'single', question: 'Задача о рюкзаке: что оптимизируем?', options: [{ id: 'a', text: 'Стоимость/ценность при ограничении по весу', correct: true }, { id: 'b', text: 'Только вес', correct: false }, { id: 'c', text: 'Количество предметов', correct: false }, { id: 'd', text: 'Размер рюкзака', correct: false }], explanation: 'Максимизируем ценность при ограничении по весу.' },
    { id: 'q8-5', type: 'single', question: 'НОП (LCS) — это:', options: [{ id: 'a', text: 'Наибольшая общая подпоследовательность', correct: true }, { id: 'b', text: 'Наименьший общий префикс', correct: false }, { id: 'c', text: 'Сумма подмассива', correct: false }, { id: 'd', text: 'Длина строки', correct: false }], explanation: 'Longest Common Subsequence — классическая задача на ДП.' },
    { id: 'q8-6', type: 'single', question: 'В ДП «снизу вверх» мы:', options: [{ id: 'a', text: 'Заполняем таблицу от базовых случаев', correct: true }, { id: 'b', text: 'Идём только рекурсией', correct: false }, { id: 'c', text: 'Не используем память', correct: false }, { id: 'd', text: 'Перебираем все варианты', correct: false }], explanation: 'Итеративное заполнение от меньших подзадач к большим.' },
  ],
  '9': [
    { id: 'q9-1', type: 'single', question: 'DFS — это обход:', options: [{ id: 'a', text: 'В глубину', correct: true }, { id: 'b', text: 'В ширину', correct: false }, { id: 'c', text: 'По весам рёбер', correct: false }, { id: 'd', text: 'Случайный', correct: false }], explanation: 'Depth-First Search — в глубину, обычно с очередью или стеком.' },
    { id: 'q9-2', type: 'single', question: 'BFS находит кратчайший путь в графе, если:', options: [{ id: 'a', text: 'Рёбра имеют единичную длину (или равные)', correct: true }, { id: 'b', text: 'Граф всегда дерево', correct: false }, { id: 'c', text: 'Граф ориентированный', correct: false }, { id: 'd', text: 'Нет циклов', correct: false }], explanation: 'При единичных весах BFS даёт кратчайший путь по числу рёбер.' },
    { id: 'q9-3', type: 'single', question: 'Как представить граф без весов в коде?', options: [{ id: 'a', text: 'Список смежности (adjacency list)', correct: true }, { id: 'b', text: 'Только матрица', correct: false }, { id: 'c', text: 'Один массив', correct: false }, { id: 'd', text: 'Строка', correct: false }], explanation: 'Список смежности: для каждой вершины — список соседей.' },
    { id: 'q9-4', type: 'single', question: 'Компонента связности — это:', options: [{ id: 'a', text: 'Максимальное множество вершин, достижимых друг из друга', correct: true }, { id: 'b', text: 'Одна вершина', correct: false }, { id: 'c', text: 'Все рёбра графа', correct: false }, { id: 'd', text: 'Минимальный разрез', correct: false }], explanation: 'В неориентированном графе — множество вершин, соединённых путями.' },
    { id: 'q9-5', type: 'single', question: 'Для BFS обычно используют:', options: [{ id: 'a', text: 'Очередь (queue)', correct: true }, { id: 'b', text: 'Стек', correct: false }, { id: 'c', text: 'Кучу', correct: false }, { id: 'd', text: 'Список', correct: false }], explanation: 'BFS обрабатывает вершины в порядке добавления — FIFO, очередь.' },
    { id: 'q9-6', type: 'single', question: 'Проверка на цикл в неориентированном графе при обходе:', options: [{ id: 'a', text: 'Не посещать уже посещённую вершину (кроме родителя)', correct: true }, { id: 'b', text: 'Считать только рёбра', correct: false }, { id: 'c', text: 'Игнорировать обратные рёбра', correct: false }, { id: 'd', text: 'Использовать только DFS', correct: false }], explanation: 'При обходе помечаем посещённые; если попали в посещённую не родителя — цикл.' },
  ],
};

// Для уроков без теста — минимальный набор
const defaultQuestions: TestQuestion[] = [
  { id: 'd1', type: 'single', question: 'Материал урока усвоен?', options: [{ id: 'a', text: 'Да', correct: true }, { id: 'b', text: 'Нет', correct: false }] },
];

export function getTestForLesson(lessonId: string): TestQuestion[] {
  return tests[lessonId] ?? defaultQuestions;
}