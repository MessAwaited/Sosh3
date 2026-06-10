import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { lessons } from '../data/lessons';
import { getTestForLesson } from '../data/tests';
import { InteractiveTest, type InteractiveTestSessionState } from '../components/InteractiveTest';
import { AlgorithmIcon } from '../components/AlgorithmIcon';
import styles from './LessonPage.module.css';

export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  return <LessonPageContent key={id ?? 'missing'} id={id} />;
}

function LessonPageContent({ id }: { id?: string }) {
  const {
    completeLesson,
    getScoreForLesson,
    getLessonSession,
    saveLessonSession,
    clearLessonSession,
  } = useProgress();
  const [testDone, setTestDone] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [previousScoreForResult, setPreviousScoreForResult] = useState<number | null>(null);
  const [testVersion, setTestVersion] = useState(0);
  const lessonStartTime = useRef<number | null>(null);

  const lesson = lessons.find((l) => l.id === id);
  const questions = lesson ? getTestForLesson(lesson.id) : [];
  const session = lesson ? getLessonSession(lesson.id) : null;

  const initialState = useMemo<InteractiveTestSessionState | null>(() => {
    if (!session) return null;
    return {
      currentIndex: session.currentIndex,
      selectedOptionId: session.selectedOptionId,
      revealed: session.revealed,
      results: session.results,
      optionOrderByQuestion: session.optionOrderByQuestion,
    };
  }, [session]);

  useEffect(() => {
    lessonStartTime.current = Date.now();
  }, [id]);

  const handleTestComplete = useCallback(
    (score: number) => {
      const previousScore = lesson ? getScoreForLesson(lesson.id) : null;
      setFinalScore(score);
      setPreviousScoreForResult(previousScore);
      setTestDone(true);
      if (lesson) {
        const durationMs = lessonStartTime.current == null ? undefined : Date.now() - lessonStartTime.current;
        completeLesson(lesson.id, score, durationMs);
      }
    },
    [completeLesson, getScoreForLesson, lesson],
  );

  const handleSessionChange = useCallback(
    (state: InteractiveTestSessionState) => {
      if (!lesson) return;

      const hasStarted =
        state.results.length > 0 || state.currentIndex > 0 || state.revealed || state.selectedOptionId != null;

      if (!hasStarted) {
        clearLessonSession(lesson.id);
        return;
      }

      saveLessonSession(lesson.id, {
        currentIndex: state.currentIndex,
        selectedOptionId: state.selectedOptionId,
        revealed: state.revealed,
        results: state.results,
        optionOrderByQuestion: state.optionOrderByQuestion,
      });
    },
    [clearLessonSession, lesson, saveLessonSession],
  );

  if (!lesson) {
    return (
      <div className={styles.page}>
        <p>Урок не найден.</p>
        <Link to="/student">Назад к курсу</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/student" className={styles.back}>
        <ArrowLeft size={20} />
        К курсу
      </Link>

      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.lessonTitleRow}>
          <AlgorithmIcon name={lesson.algorithmIcon} size={32} />
          <div>
            <h1 className={styles.title}>{lesson.title}</h1>
            <p className={styles.desc}>{lesson.description}</p>
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.duration}>{lesson.duration}</span>
          <span className={styles.difficulty}>
            {lesson.difficulty === 'easy' && 'Легко'}
            {lesson.difficulty === 'medium' && 'Средне'}
            {lesson.difficulty === 'hard' && 'Сложно'}
          </span>
        </div>
      </motion.header>

      <section className={styles.content}>
        {!testDone ? (
          <>
            <h2 className={styles.sectionTitle}>Проверка знаний</h2>
            <InteractiveTest
              key={`${lesson.id}:${testVersion}`}
              questions={questions}
              onComplete={handleTestComplete}
              initialState={testVersion === 0 ? initialState : null}
              onStateChange={handleSessionChange}
            />
          </>
        ) : (
          <motion.div
            className={styles.resultCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle size={48} className={styles.resultIcon} />
            <h2>Тест пройден</h2>
            <p className={styles.resultScore}>Результат: {finalScore ?? 0}%</p>
            {previousScoreForResult != null && (
              <p className={styles.resultPrev}>Лучший результат до этого: {previousScoreForResult}%</p>
            )}
            <div className={styles.resultActions}>
              <Link to="/student" className={styles.resultBtn}>
                К списку уроков
              </Link>
              <button
                type="button"
                className={styles.resultBtnSecondary}
                onClick={() => {
                  clearLessonSession(lesson.id);
                  lessonStartTime.current = Date.now();
                  setTestDone(false);
                  setFinalScore(null);
                  setTestVersion((prev) => prev + 1);
                }}
              >
                Пройти ещё раз
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
