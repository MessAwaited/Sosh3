import { getCompetitionSubmissions } from '../store/registry';

export type RatingRow = {
  place: number;
  id: string;
  name: string;
  className: string;
  classId: string;
  score: number;
};

const RATING_DESIGN_ROWS: Array<Omit<RatingRow, 'place'>> = [
  { id: 'rating-lukyanchikov', name: 'Лукьянчиков Ричард Русланович', className: '11А', classId: '11a', score: 100 },
  { id: 'rating-ibn-la-ahad', name: 'Смирнова Арина Павловна', className: '10А', classId: '10a', score: 94 },
  { id: 'rating-osi-hiteo', name: 'Кузнецов Матвей Андреевич', className: '11Б', classId: '11b', score: 89 },
  { id: 'rating-dzho-pitch', name: 'Орлова София Дмитриевна', className: '9А', classId: '9a', score: 85 },
  { id: 'rating-tesla', name: 'Васильев Никита Игоревич', className: '10Б', classId: '10b', score: 81 },
  { id: 'rating-zhukov', name: 'Жуков Кирилл Сергеевич', className: '9Б', classId: '9b', score: 80 },
  { id: 'rating-dev-1', name: 'Егорова Полина Максимовна', className: '11А', classId: '11a', score: 80 },
  { id: 'rating-bibinos', name: 'Морозов Артем Алексеевич', className: '10А', classId: '10a', score: 79 },
  { id: 'rating-dev-2', name: 'Крылова Дарья Романовна', className: '11Б', classId: '11b', score: 77 },
  { id: 'rating-mirnaya', name: 'Миронова Анастасия Никитична', className: '9А', classId: '9a', score: 75 },
  { id: 'rating-messengerov', name: 'Федоров Максим Олегович', className: '10Б', classId: '10b', score: 73 },
  { id: 'rating-voronin', name: 'Воронина Елизавета Николаевна', className: '9Б', classId: '9b', score: 69 },
];

function normalizeClassName(className: string): string {
  return className.replace(/\s+/g, '');
}

function buildReviewedCompetitionRows(): Array<Omit<RatingRow, 'place'>> {
  const submissions = getCompetitionSubmissions();
  const byStudent = new Map<string, Omit<RatingRow, 'place'>>();

  for (const submission of submissions) {
    if (!submission.review) continue;
    if (byStudent.has(submission.studentId)) continue;

    byStudent.set(submission.studentId, {
      id: submission.studentId,
      name: submission.studentName,
      classId: submission.classId,
      className: normalizeClassName(submission.className),
      score: submission.review.totalScore,
    });
  }

  return [...byStudent.values()];
}

export function getRatingBaseRows(): Array<Omit<RatingRow, 'place'>> {
  return RATING_DESIGN_ROWS.map((row) => ({ ...row }));
}

export function buildRating(): RatingRow[] {
  const byId = new Map<string, Omit<RatingRow, 'place'>>();

  for (const row of getRatingBaseRows()) {
    byId.set(row.id, row);
  }

  for (const row of buildReviewedCompetitionRows()) {
    byId.set(row.id, row);
  }

  return [...byId.values()]
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ru'))
    .map((row, index) => ({ ...row, place: index + 1 }));
}
