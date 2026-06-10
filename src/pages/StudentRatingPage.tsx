import { motion } from 'framer-motion';
import { buildRating } from '../data/rating';
import { publicAsset } from '../utils/assets';
import styles from './StudentRatingPage.module.css';

const medalByPlace: Record<number, string> = {
  1: publicAsset('/rating/medal-1.png'),
  2: publicAsset('/rating/medal-2.png'),
  3: publicAsset('/rating/medal-3.png'),
};

const avatarImage = publicAsset('/rating/avatar.png');

function PlaceMark({ place }: { place: number }) {
  const medal = medalByPlace[place];
  if (medal) {
    return <img src={medal} alt={`Медаль за ${place} место`} className={styles.medal} />;
  }
  return <span className={styles.placeBadge}>{place}</span>;
}

export function StudentRatingPage() {
  const rating = buildRating();
  const leaders = rating.slice(0, 5);
  const participants = rating.slice(5);

  return (
    <div className={styles.page}>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={styles.title}>Таблица лидеров</h1>
        <div className={styles.leadersList}>
          {leaders.map((student, index) => (
            <motion.article
              key={student.id}
              className={styles.row}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={styles.person}>
                <span className={styles.avatarWrap}>
                  <img src={avatarImage} alt="" className={styles.avatar} />
                </span>
                <span className={styles.name}>{student.name}</span>
              </div>
              <span className={styles.className}>{student.className}</span>
              <span className={styles.score}>{student.score}</span>
              <PlaceMark place={student.place} />
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.participantsSection}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
      >
        <h2 className={styles.title}>Таблица участников</h2>
        <div className={styles.participantsWrap}>
          <div className={styles.scrollArea}>
            {participants.map((student, index) => (
              <motion.article
                key={student.id}
                className={`${styles.row} ${styles.participantRow}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={styles.person}>
                  <span className={styles.avatarWrap}>
                    <img src={avatarImage} alt="" className={styles.avatar} />
                  </span>
                  <span className={styles.name}>{student.name}</span>
                </div>
                <span className={styles.className}>{student.className}</span>
                <span className={styles.score}>{student.score}</span>
                <PlaceMark place={student.place} />
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
