import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { TestQuestion, TestOption } from '../data/tests';
import styles from './InteractiveTest.module.css';

export interface InteractiveTestSessionState {
  currentIndex: number;
  selectedOptionId: string | null;
  revealed: boolean;
  results: boolean[];
  optionOrderByQuestion: Record<string, string[]>;
}

interface InteractiveTestProps {
  questions: TestQuestion[];
  onComplete: (score: number) => void;
  initialState?: InteractiveTestSessionState | null;
  onStateChange?: (state: InteractiveTestSessionState) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildOptionOrderByQuestion(questions: TestQuestion[]): Record<string, string[]> {
  return questions.reduce<Record<string, string[]>>((acc, question) => {
    const ids = question.options?.map((option) => option.id) ?? [];
    acc[question.id] = shuffleArray(ids);
    return acc;
  }, {});
}

function isValidOptionOrder(
  questions: TestQuestion[],
  optionOrderByQuestion?: Record<string, string[]>,
): boolean {
  if (!optionOrderByQuestion) return false;

  return questions.every((question) => {
    const baseIds = question.options?.map((option) => option.id) ?? [];
    const saved = optionOrderByQuestion[question.id] ?? [];
    if (baseIds.length !== saved.length) return false;
    const baseSet = new Set(baseIds);
    return saved.every((id) => baseSet.has(id));
  });
}

export function InteractiveTest({ questions, onComplete, initialState, onStateChange }: InteractiveTestProps) {
  const lastSnapshotRef = useRef<string>('');

  const normalizedInitialState = useMemo(() => {
    if (!initialState) {
      return {
        currentIndex: 0,
        selectedOptionId: null,
        revealed: false,
        results: [],
        optionOrderByQuestion: buildOptionOrderByQuestion(questions),
      } satisfies InteractiveTestSessionState;
    }

    const maxIndex = Math.max(0, questions.length - 1);
    const optionOrderByQuestion = isValidOptionOrder(questions, initialState.optionOrderByQuestion)
      ? initialState.optionOrderByQuestion
      : buildOptionOrderByQuestion(questions);

    return {
      currentIndex: Math.min(Math.max(initialState.currentIndex, 0), maxIndex),
      selectedOptionId: initialState.selectedOptionId,
      revealed: initialState.revealed,
      results: initialState.results.slice(0, questions.length),
      optionOrderByQuestion,
    } satisfies InteractiveTestSessionState;
  }, [initialState, questions]);

  const [currentIndex, setCurrentIndex] = useState(normalizedInitialState.currentIndex);
  const [selected, setSelected] = useState<string | null>(normalizedInitialState.selectedOptionId);
  const [revealed, setRevealed] = useState(normalizedInitialState.revealed);
  const [results, setResults] = useState<boolean[]>(normalizedInitialState.results);
  const [optionOrderByQuestion] = useState<Record<string, string[]>>(normalizedInitialState.optionOrderByQuestion);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const orderedOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    const orderedIds = optionOrderByQuestion[currentQuestion.id] ?? currentQuestion.options.map((option) => option.id);
    const byId = new Map(currentQuestion.options.map((option) => [option.id, option]));
    return orderedIds
      .map((id) => byId.get(id))
      .filter((option): option is TestOption => option != null);
  }, [currentQuestion, optionOrderByQuestion]);

  const displayedOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return orderedOptions.length > 0 ? orderedOptions : currentQuestion.options;
  }, [currentQuestion, orderedOptions]);

  useEffect(() => {
    if (finished || !onStateChange || questions.length === 0) return;

    const hasStarted = results.length > 0 || currentIndex > 0 || revealed || selected != null;
    if (!hasStarted) return;

    const snapshot = JSON.stringify({
      currentIndex,
      selectedOptionId: selected,
      revealed,
      results,
      optionOrderByQuestion,
    });

    if (snapshot === lastSnapshotRef.current) return;
    lastSnapshotRef.current = snapshot;

    onStateChange({
      currentIndex,
      selectedOptionId: selected,
      revealed,
      results,
      optionOrderByQuestion,
    });
  }, [currentIndex, finished, onStateChange, optionOrderByQuestion, questions.length, results, revealed, selected]);

  const handleSelect = (optionId: string) => {
    if (revealed || !currentQuestion) return;

    const option = currentQuestion.options?.find((item) => item.id === optionId);
    const correct = option?.correct ?? false;

    setSelected(optionId);
    setRevealed(true);
    setResults((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }

    setFinished(true);
    const correctCount = results.filter(Boolean).length;
    const score = Math.round((correctCount / questions.length) * 100);
    onComplete(score);
  };

  if (finished || questions.length === 0 || !currentQuestion) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.progress}>
        <div className={styles.progressRow}>
          <span className={styles.progressText}>
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
        </div>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className={styles.questionBlock}
        >
          <h3 className={styles.questionText}>{currentQuestion.question}</h3>

          {currentQuestion.options && (
            <ul className={styles.options}>
              {displayedOptions.map((option) => (
                <OptionRow
                  key={option.id}
                  option={option}
                  selected={selected === option.id}
                  revealed={revealed}
                  onSelect={() => handleSelect(option.id)}
                />
              ))}
            </ul>
          )}

          {revealed && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={styles.explanation}
            >
              <strong>Пояснение:</strong> {currentQuestion.explanation}
            </motion.div>
          )}

          {revealed && (
            <motion.button
              type="button"
              className={styles.nextBtn}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
            >
              {isLast ? 'Завершить тест' : 'Далее'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OptionRow({
  option,
  selected,
  revealed,
  onSelect,
}: {
  option: TestOption;
  selected: boolean;
  revealed: boolean;
  onSelect: () => void;
}) {
  const showCorrect = revealed && option.correct;
  const showWrong = revealed && selected && !option.correct;

  return (
    <motion.li
      className={`${styles.option} ${selected ? styles.optionSelected : ''} ${showCorrect ? styles.optionCorrect : ''} ${showWrong ? styles.optionWrong : ''}`}
      onClick={onSelect}
      whileHover={!revealed ? { scale: 1.01 } : undefined}
      whileTap={!revealed ? { scale: 0.99 } : undefined}
    >
      <span className={styles.optionText}>{option.text}</span>
      {showCorrect && <Check size={18} className={styles.optionIcon} />}
      {showWrong && <X size={18} className={styles.optionIconWrong} />}
    </motion.li>
  );
}
