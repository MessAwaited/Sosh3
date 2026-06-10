import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Flame, ChevronRight } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessons';
import { buildAchievements } from '../data/achievements';
import { buildRating } from '../data/rating';
import { competition } from '../data/competition';
import { getCompetitionApplicationByStudentId, getCompetitionSubmissionsByStudentId } from '../store/registry';
import { LessonCard } from '../components/LessonCard';
import { AchievementBadge } from '../components/AchievementBadge';
import styles from './StudentDashboard.module.css';

const TOTAL_LESSONS = lessons.length;

export function StudentDashboard() {
  const { user } = useAuth();
  const { completedCount, completedLessonIds, progress, streakDays, hasLessonSession } = useProgress();
  const percent = Math.round((completedCount / TOTAL_LESSONS) * 100);
  const studentId = user?.id ?? '';

  const lessonsWithStatus = lessons.map((lesson) => {
    const completed = completedLessonIds.has(lesson.id);
    const inProgress = !completed && hasLessonSession(lesson.id);
    const prevCompleted = lesson.order === 1 || completedLessonIds.has(String(lesson.order - 1));
    const status: 'locked' | 'available' | 'completed' | 'inProgress' = completed
      ? 'completed'
      : inProgress
        ? 'inProgress'
      : prevCompleted
        ? 'available'
        : 'locked';

    return { ...lesson, status };
  });

  const hasSpeedRun = progress.some((item) => item.durationMs != null && item.durationMs <= 5 * 60 * 1000);
  const hasCompletedSortingLesson = completedLessonIds.has('6');
  const hasCompetitionApplication = studentId
    ? getCompetitionApplicationByStudentId(studentId, competition.id) != null
    : false;
  const hasCompetitionSubmission = studentId
    ? getCompetitionSubmissionsByStudentId(studentId, competition.id).length > 0
    : false;
  const hasCompetitionParticipation = hasCompetitionApplication || hasCompetitionSubmission;
  const isInTopFive = studentId ? buildRating().slice(0, 5).some((item) => item.id === studentId) : false;

  const achievements = buildAchievements({
    completedCount,
    totalLessons: TOTAL_LESSONS,
    streakDays,
    hasSpeedRun,
    hasCompletedSortingLesson,
    hasCompetitionParticipation,
    isInTopFive,
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Практико-ориентированный курс
        </motion.h1>
      </section>

      <motion.section
        className={styles.progressSection}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <motion.div
          className={styles.progressCard}
          whileHover={{ boxShadow: '0 12px 32px rgba(227, 6, 17, 0.12)' }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.progressHead}>
            <Flame size={22} className={styles.progressIcon} />
            <h2>Ваш прогресс</h2>
          </div>
          <div className={styles.progressStats}>
            <span className={styles.percent}>{percent}%</span>
            <span className={styles.lessons}>{completedCount} из {TOTAL_LESSONS} уроков</span>
          </div>
          <div className={styles.track}>
            <motion.div
              className={styles.trackFill}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className={styles.milestones}>
            {[0, 25, 50, 75, 100].map((milestone) => (
              <span
                key={milestone}
                className={`${styles.milestone} ${milestone === 100 ? styles.milestoneEnd : milestone === 0 ? styles.milestoneStart : ''}`}
                style={{ left: `${milestone}%` }}
              >
                {milestone}%
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.theoryCta}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Link to="/student/theory" className={styles.theoryLink}>
            <BookOpen size={20} />
            <span>Теория и полезные материалы по Python</span>
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.sectionHead}>
          <h2>Уроки курса</h2>
        </div>
        <motion.div
          className={styles.lessonGrid}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="visible"
        >
          {lessonsWithStatus.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className={styles.sectionHead}>
          <h2>Достижения</h2>
          <p>Собирайте награды за прогресс</p>
        </div>
        <div className={styles.achievementGrid}>
          {achievements.map((achievement, index) => (
            <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
