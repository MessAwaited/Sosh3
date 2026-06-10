import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const logoutSlotRef = useRef<HTMLDivElement | null>(null);

  const navLabel = (label: string) => (
    <>
      <span className={styles.navFill} aria-hidden />
      <span className={styles.navText}>{label}</span>
    </>
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!isLogoutConfirmOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (logoutSlotRef.current?.contains(event.target as Node)) return;
      setIsLogoutConfirmOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isLogoutConfirmOpen]);

  return (
    <div className={styles.wrap}>
      <motion.header
        className={styles.header}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.inner}>
          <NavLink to={user?.role === 'student' ? '/student' : '/teacher'} className={styles.logo}>
            <img src="/tochka-rosta-full-logo.png" alt="Точка роста" className={styles.logoImage} />
          </NavLink>

          <nav className={styles.nav}>
            {user?.role === 'student' && (
              <>
                <NavLink to="/student" className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)} end>
                  {navLabel('Курс')}
                </NavLink>
                <NavLink to="/student/theory" className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}>
                  {navLabel('Теория')}
                </NavLink>
                <NavLink to="/student/competition" className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}>
                  {navLabel('Соревнование')}
                </NavLink>
                <NavLink to="/student/rating" className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}>
                  {navLabel('Рейтинг')}
                </NavLink>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <NavLink to="/teacher" className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)} end>
                  {navLabel('Кабинет учителя')}
                </NavLink>
              </>
            )}
          </nav>

          <div className={styles.user}>
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className={styles.userName}>
              {user?.name}
              {user?.className && <span className={styles.userClass}> · {user.className}</span>}
            </span>
            <div className={styles.logoutSlot} ref={logoutSlotRef}>
              <AnimatePresence initial={false}>
                {isLogoutConfirmOpen ? (
                <motion.div
                  key="logout-confirm"
                  className={styles.logoutConfirm}
                  role="group"
                  aria-label="Подтверждение выхода"
                  initial={{ opacity: 0, scale: 0.72, x: -10, y: '-50%' }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.72, x: -10, y: '-50%' }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.logoutConfirmText}>Выйти из аккаунта?</span>
                  <button type="button" className={styles.logoutConfirmYes} onClick={handleLogout}>
                    Да
                  </button>
                  <button
                    type="button"
                    className={styles.logoutConfirmNo}
                    onClick={() => setIsLogoutConfirmOpen(false)}
                  >
                    Нет
                  </button>
                </motion.div>
                ) : (
                <button
                  key="logout-button"
                  type="button"
                  className={styles.logoutBtn}
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
