import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, Clock, ChevronRight, Ellipsis } from 'lucide-react';
import type { Lesson } from '../data/lessons';
import { getTestForLesson } from '../data/tests';
import { useProgress } from '../context/ProgressContext';
import { AlgorithmIcon } from './AlgorithmIcon';
import styles from './LessonCard.module.css';

interface LessonCardProps {
  lesson: Lesson;
  index?: number;
}

const difficultyColors: Record<string, string> = {
  easy: 'var(--success)',
  medium: '#d97706',
  hard: '#dc2626',
};

function getGrade(score: number): string {
  if (score >= 85) return '5';
  if (score >= 70) return '4';
  if (score >= 50) return '3';
  return '2';
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { getScoreForLesson } = useProgress();
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';
  const isInProgress = lesson.status === 'inProgress';
  const score = isCompleted ? getScoreForLesson(lesson.id) : null;
  const grade = score == null ? null : getGrade(score);
  const questionsCount = getTestForLesson(lesson.id).length;
  const correctCount = score == null ? 0 : Math.round((score / 100) * questionsCount);

  return (
    <motion.article
      className={`${styles.card} ${isLocked ? styles.locked : ''}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!isLocked ? { y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' } : undefined}
      whileTap={!isLocked ? { scale: 0.99 } : undefined}
    >
      <div className={styles.iconWrap}>
        <AlgorithmIcon name={lesson.algorithmIcon} locked={isLocked} />
        {isCompleted && (
          <motion.span
            className={styles.completedBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Check size={14} />
          </motion.span>
        )}
        {isInProgress && (
          <motion.span
            className={styles.inProgressBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Ellipsis size={15} />
          </motion.span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span
            className={styles.difficulty}
            style={{ color: difficultyColors[lesson.difficulty] }}
          >
            {lesson.difficulty === 'easy' && 'Легко'}
            {lesson.difficulty === 'medium' && 'Средне'}
            {lesson.difficulty === 'hard' && 'Сложно'}
          </span>
          <span className={styles.duration}>
            <Clock size={12} />
            {lesson.duration}
          </span>
        </div>
        <h3 className={styles.title}>{lesson.title}</h3>
        <p className={styles.desc}>{lesson.description}</p>
        <div className={styles.topics}>
          {lesson.topics.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        {isLocked ? (
          <span className={styles.lockedLabel}>
            <Lock size={16} />
            Скоро
          </span>
        ) : (
          <>
            <Link
              to={`/student/lesson/${lesson.id}`}
              className={`${styles.cta} ${isCompleted ? styles.ctaRepeat : ''} ${isInProgress ? styles.ctaContinue : ''} ${!isCompleted && !isInProgress ? styles.ctaStart : ''}`}
            >
              {isCompleted ? 'Повторить' : isInProgress ? 'Продолжить' : 'Начать'}
              <ChevronRight size={18} />
            </Link>
            {isCompleted && score != null && (
              <div className={styles.resultStats} aria-label="Результат прохождения">
                <span className={styles.resultStat}>
                  <strong>{correctCount}/{questionsCount}</strong>
                </span>
                <span className={styles.resultStat}>
                  <strong>{score}%</strong>
                </span>
                <span className={styles.resultGrade}>
                  оценка: <strong className={`${styles.gradeValue} ${styles[`grade${grade}`]}`}>{grade}</strong>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.article>
  );
}
