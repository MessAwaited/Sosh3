import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { User } from './AuthContext';

export interface LessonProgressItem {
  lessonId: string;
  completedAt: number;
  testScore: number;
  testAttempts: number;
  durationMs?: number;
}

export interface LessonSessionItem {
  lessonId: string;
  currentIndex: number;
  selectedOptionId: string | null;
  revealed: boolean;
  results: boolean[];
  optionOrderByQuestion: Record<string, string[]>;
  updatedAt: number;
}

const STORAGE_PREFIX = 'sosh3_progress_';
const SESSION_STORAGE_PREFIX = 'sosh3_session_';

function loadProgress(userId: string): LessonProgressItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProgress(userId: string, progress: LessonProgressItem[]) {
  localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(progress));
}

function loadSessions(userId: string): LessonSessionItem[] {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_PREFIX + userId);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSessions(userId: string, sessions: LessonSessionItem[]) {
  localStorage.setItem(SESSION_STORAGE_PREFIX + userId, JSON.stringify(sessions));
}

function calculateStreakDays(progress: LessonProgressItem[]): number {
  if (progress.length === 0) return 0;

  const dayKeys = new Set(
    progress.map((item) => {
      const d = new Date(item.completedAt);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }),
  );

  const sortedDays = [...dayKeys].sort((a, b) => b - a);
  let streak = 1;

  for (let i = 1; i < sortedDays.length; i += 1) {
    const diffDays = (sortedDays[i - 1] - sortedDays[i]) / (24 * 60 * 60 * 1000);
    if (diffDays === 1) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

interface ProgressContextType {
  progress: LessonProgressItem[];
  lessonSessions: LessonSessionItem[];
  completedLessonIds: Set<string>;
  completedCount: number;
  streakDays: number;
  completeLesson: (lessonId: string, testScore: number, durationMs?: number) => void;
  getScoreForLesson: (lessonId: string) => number | null;
  getLessonSession: (lessonId: string) => LessonSessionItem | null;
  hasLessonSession: (lessonId: string) => boolean;
  saveLessonSession: (
    lessonId: string,
    session: Omit<LessonSessionItem, 'lessonId' | 'updatedAt'>,
  ) => void;
  clearLessonSession: (lessonId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const providerKey = user?.role === 'student' && user.id ? user.id : 'anonymous';

  return (
    <ProgressProviderState key={providerKey} user={user}>
      {children}
    </ProgressProviderState>
  );
}

function ProgressProviderState({ children, user }: { children: ReactNode; user: User | null }) {
  const studentId = user?.role === 'student' && user.id ? user.id : null;
  const [progress, setProgress] = useState<LessonProgressItem[]>(() => (studentId ? loadProgress(studentId) : []));
  const [lessonSessions, setLessonSessions] = useState<LessonSessionItem[]>(() => (studentId ? loadSessions(studentId) : []));

  const completedLessonIds = new Set(progress.map((p) => p.lessonId));
  const completedCount = progress.length;

  const completeLesson = useCallback(
    (lessonId: string, testScore: number, durationMs?: number) => {
      if (!studentId) return;

      setProgress((prev) => {
        const existing = prev.find((p) => p.lessonId === lessonId);
        const next = existing
          ? prev.map((p) =>
              p.lessonId === lessonId
                ? {
                    ...p,
                    completedAt: Date.now(),
                    testScore: Math.max(p.testScore, testScore),
                    testAttempts: p.testAttempts + 1,
                    durationMs,
                  }
                : p,
            )
          : [
              ...prev,
              {
                lessonId,
                completedAt: Date.now(),
                testScore,
                testAttempts: 1,
                durationMs,
              },
            ];
        saveProgress(studentId, next);
        return next;
      });

      setLessonSessions((prev) => {
        const next = prev.filter((item) => item.lessonId !== lessonId);
        saveSessions(studentId, next);
        return next;
      });
    },
    [studentId],
  );

  const getScoreForLesson = useCallback(
    (lessonId: string) => {
      const p = progress.find((x) => x.lessonId === lessonId);
      return p ? p.testScore : null;
    },
    [progress],
  );

  const getLessonSession = useCallback(
    (lessonId: string) => lessonSessions.find((item) => item.lessonId === lessonId) ?? null,
    [lessonSessions],
  );

  const hasLessonSession = useCallback(
    (lessonId: string) => lessonSessions.some((item) => item.lessonId === lessonId),
    [lessonSessions],
  );

  const saveLessonSession = useCallback(
    (lessonId: string, session: Omit<LessonSessionItem, 'lessonId' | 'updatedAt'>) => {
      if (!studentId) return;

      setLessonSessions((prev) => {
        const nextItem: LessonSessionItem = {
          lessonId,
          ...session,
          updatedAt: Date.now(),
        };
        const existingIndex = prev.findIndex((item) => item.lessonId === lessonId);
        const next =
          existingIndex >= 0
            ? prev.map((item, index) => (index === existingIndex ? nextItem : item))
            : [...prev, nextItem];
        saveSessions(studentId, next);
        return next;
      });
    },
    [studentId],
  );

  const clearLessonSession = useCallback(
    (lessonId: string) => {
      if (!studentId) return;

      setLessonSessions((prev) => {
        const next = prev.filter((item) => item.lessonId !== lessonId);
        saveSessions(studentId, next);
        return next;
      });
    },
    [studentId],
  );

  const streakDays = calculateStreakDays(progress);

  const value: ProgressContextType = {
    progress,
    lessonSessions,
    completedLessonIds,
    completedCount,
    streakDays,
    completeLesson,
    getScoreForLesson,
    getLessonSession,
    hasLessonSession,
    saveLessonSession,
    clearLessonSession,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
