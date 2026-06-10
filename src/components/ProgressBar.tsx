import { motion } from 'framer-motion';
import { Target, Flame } from 'lucide-react';
import styles from './ProgressBar.module.css';

const TOTAL_LESSONS = 9;
const COMPLETED = 2;
const PERCENT = Math.round((COMPLETED / TOTAL_LESSONS) * 100);

export function ProgressBar() {
  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.titleRow}>
            <Target size={22} className={styles.icon} />
            <h2>Ваш прогресс</h2>
          </div>
          <div className={styles.streak}>
            <Flame size={18} />
            <span>3 дня подряд</span>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.percent}>{PERCENT}%</span>
          <span className={styles.lessons}>
            {COMPLETED} из {TOTAL_LESSONS} уроков
          </span>
        </div>
        <div className={styles.track}>
          <motion.div
            className={styles.fill}
            initial={{ width: 0 }}
            animate={{ width: `${PERCENT}%` }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className={styles.milestones}>
          {[25, 50, 75, 100].map((m) => (
            <motion.span
              key={m}
              className={`${styles.milestone} ${m === 100 ? styles.milestoneEnd : ''}`}
              style={{ left: `${m}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + m / 100, duration: 0.3 }}
            >
              {m}%
            </motion.span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
