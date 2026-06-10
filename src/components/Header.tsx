import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  return (
    <motion.header
      className={styles.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.logo}>
          <motion.span
            className={styles.logoIcon}
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <img src="/tochka-growth-mark.png" alt="" className={styles.logoIconImage} />
          </motion.span>
          <div>
            <span className={styles.logoTitle}>Спортивное программирование</span>
            <span className={styles.logoSub}>Python · Точка роста</span>
          </div>
        </div>
        <div className={styles.badge}>
          <GraduationCap size={18} />
          <span>МБОУ СОШ №3</span>
        </div>
      </div>
    </motion.header>
  );
}
