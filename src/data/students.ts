export interface StudentProgress {
  lessonId: string;
  completedAt: number;
  testScore: number;
  testAttempts: number;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  progress: StudentProgress[];
  streakDays: number;
}

// Mock: progress хранится по studentId в localStorage в реальном приложении было бы с бэкенда
const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Иванов Алексей', classId: '9a', progress: [{ lessonId: '1', completedAt: Date.now() - 86400000 * 2, testScore: 100, testAttempts: 1 }, { lessonId: '2', completedAt: Date.now() - 86400000, testScore: 85, testAttempts: 2 }], streakDays: 3 },
  { id: 's2', name: 'Петрова Мария', classId: '9a', progress: [{ lessonId: '1', completedAt: Date.now() - 86400000 * 3, testScore: 90, testAttempts: 1 }], streakDays: 1 },
  { id: 's3', name: 'Сидоров Иван', classId: '9a', progress: [{ lessonId: '1', completedAt: Date.now() - 86400000 * 5, testScore: 70, testAttempts: 3 }, { lessonId: '2', completedAt: Date.now() - 86400000 * 4, testScore: 80, testAttempts: 2 }, { lessonId: '3', completedAt: Date.now() - 86400000, testScore: 95, testAttempts: 1 }], streakDays: 5 },
  { id: 's4', name: 'Козлова Анна', classId: '9b', progress: [], streakDays: 0 },
  { id: 's5', name: 'Новиков Дмитрий', classId: '9b', progress: [{ lessonId: '1', completedAt: Date.now(), testScore: 100, testAttempts: 1 }], streakDays: 1 },
  { id: 's6', name: 'Морозова Елена', classId: '10a', progress: [{ lessonId: '1', completedAt: Date.now() - 86400000 * 10, testScore: 100, testAttempts: 1 }, { lessonId: '2', completedAt: Date.now() - 86400000 * 9, testScore: 90, testAttempts: 1 }, { lessonId: '3', completedAt: Date.now() - 86400000 * 8, testScore: 85, testAttempts: 2 }], streakDays: 2 },
];

export function getStudentsByClass(classId: string): Student[] {
  return MOCK_STUDENTS.filter((s) => s.classId === classId);
}

export function getAllStudents(): Student[] {
  return MOCK_STUDENTS;
}
