import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import {
  Star,
  Flame,
  Calendar,
  Zap,
  Cpu,
  Trophy,
  Network,
  GraduationCap,
} from 'lucide-react';
import type { Achievement } from '../data/achievements';
import styles from './AchievementBadge.module.css';

const achievementIcons: Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>> = {
  star: Star,
  flame: Flame,
  calendar: Calendar,
  zap: Zap,
  cpu: Cpu,
  trophy: Trophy,
  network: Network,
  graduation: GraduationCap,
};

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

export function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  const Icon = achievementIcons[achievement.icon] ?? Star;
  const iconStyle = achievement.iconScale != null
    ? { transform: `scale(${achievement.iconScale})` }
    : undefined;

  return (
    <motion.div
      className={`${styles.badge} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: 0.03 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div className={styles.iconWrap}>
        {achievement.iconImage ? (
          <img src={achievement.iconImage} alt="" className={styles.iconImage} style={iconStyle} />
        ) : (
          <Icon size={24} style={iconStyle} />
        )}
      </div>
      <div className={styles.text}>
        <span className={styles.title}>{achievement.title}</span>
        <span className={styles.desc}>{achievement.description}</span>
        {achievement.progress != null && achievement.total != null && !achievement.unlocked && (
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{
                  width: `${(achievement.progress / achievement.total) * 100}%`,
                }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
              />
            </div>
            <span className={styles.progressLabel}>
              {achievement.progress}/{achievement.total}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
