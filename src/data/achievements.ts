export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconImage?: string;
  iconScale?: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface BuildAchievementsParams {
  completedCount: number;
  totalLessons: number;
  streakDays: number;
  hasSpeedRun: boolean;
  hasCompletedSortingLesson: boolean;
  hasCompetitionParticipation: boolean;
  isInTopFive: boolean;
}

export function buildAchievements(params: BuildAchievementsParams): Achievement[] {
  const {
    completedCount,
    totalLessons,
    streakDays,
    hasSpeedRun,
    hasCompletedSortingLesson,
    hasCompetitionParticipation,
    isInTopFive,
  } = params;

  return [
    {
      id: 'first_lesson',
      title: 'Первый шаг',
      description: 'Завершите первый урок',
      icon: 'star',
      unlocked: completedCount >= 1,
      progress: Math.min(completedCount, 1),
      total: 1,
    },
    {
      id: 'three_lessons',
      title: 'Набираем темп',
      description: 'Завершите 3 урока',
      icon: 'flame',
      unlocked: completedCount >= 3,
      progress: Math.min(completedCount, 3),
      total: 3,
    },
    {
      id: 'week_streak',
      title: 'Марафонец',
      description: 'Занимайтесь 7 дней подряд',
      icon: 'calendar',
      iconImage: '/achievements/marathoner.png',
      iconScale: 1.45,
      unlocked: streakDays >= 7,
      progress: Math.min(streakDays, 7),
      total: 7,
    },
    {
      id: 'speed_demon',
      title: 'Скоростной режим',
      description: 'Решите задачу менее чем за 5 минут',
      icon: 'zap',
      iconImage: '/achievements/speedometer.png',
      unlocked: hasSpeedRun,
    },
    {
      id: 'algorithm_master',
      title: 'Кладовщик',
      description: 'Пройдите урок «Сортировки»',
      icon: 'cpu',
      iconImage: '/achievements/warehouse.png',
      unlocked: hasCompletedSortingLesson,
      progress: hasCompletedSortingLesson ? 1 : 0,
      total: 1,
    },
    {
      id: 'dp_champion',
      title: 'Кандидат',
      description: 'Поучаствуйте в соревновании',
      icon: 'trophy',
      iconImage: '/achievements/candidate.png',
      unlocked: hasCompetitionParticipation,
      progress: hasCompetitionParticipation ? 1 : 0,
      total: 1,
    },
    {
      id: 'graph_explorer',
      title: 'Величайший',
      description: 'Попасть в топ 5 рейтинга',
      icon: 'network',
      iconImage: '/achievements/greatest.png',
      unlocked: isInTopFive,
      progress: isInTopFive ? 1 : 0,
      total: 1,
    },
    {
      id: 'course_complete',
      title: 'Выпускник курса',
      description: 'Завершите весь курс',
      icon: 'graduation',
      unlocked: completedCount >= totalLessons,
      progress: Math.min(completedCount, totalLessons),
      total: totalLessons,
    },
  ];
}
