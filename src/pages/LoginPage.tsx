import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, User, LogIn, UserPlus, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { classes } from '../data/classes';
import {
  getApprovedStudentByLogin,
  submitRegistrationRequest,
  getApprovedStudents,
  getTeacherByEmailAndPassword,
} from '../store/registry';
import { LoginLogo } from '../components/LoginLogo';
import { LoginParticles } from '../components/LoginParticles';
import { useTheme } from '../context/ThemeContext';
import styles from './LoginPage.module.css';

type StudentMode = 'register' | 'login';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loginStudent, loginTeacher } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [studentMode, setStudentMode] = useState<StudentMode>('login');
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  const approvedStudents = getApprovedStudents();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'student' ? '/student' : '/teacher', { replace: true });
    }
  }, [user, navigate]);

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const c = classes.find((x) => x.id === classId);
    const result = submitRegistrationRequest(name, classId, c?.name ?? '');
    if (result.success) {
      setMessage({
        type: 'ok',
        text: 'Заявка отправлена. После одобрения учитель направит вам пароль для входа — войдите через «Вход», введя ФИО, класс и полученный пароль.',
      });
      setName('');
      setClassId('');
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const student = getApprovedStudentByLogin(name, classId, password);
    if (student) {
      loginStudent(student);
      navigate('/student', { replace: true });
    } else {
      setMessage({
        type: 'error',
        text: 'Неверные данные или пароль. Проверьте ФИО, класс и пароль, выданный учителем.',
      });
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const teacher = getTeacherByEmailAndPassword(teacherEmail, teacherPassword);
    if (teacher) {
      loginTeacher(teacher);
      navigate('/teacher', { replace: true });
    } else {
      setMessage({ type: 'error', text: 'Неверная почта или пароль. Для демо используйте пароль 1111.' });
    }
  };

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <LoginParticles />
      <div className={styles.pattern} aria-hidden />
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.logoWrap}>
          <LoginLogo />
        </div>

        <label className={styles.label}>Войти как</label>
        <div className={styles.roleRow}>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'student' ? styles.roleActive : ''}`}
            onClick={() => { setRole('student'); setMessage(null); }}
          >
            <User size={20} />
            Ученик
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'teacher' ? styles.roleActive : ''}`}
            onClick={() => { setRole('teacher'); setMessage(null); }}
          >
            <GraduationCap size={20} />
            Учитель
          </button>
        </div>

        {role === 'student' && (
          <>
            <label className={styles.labelAction}>Действие</label>
            <div className={styles.studentTabs}>
              <button
                type="button"
                className={studentMode === 'login' ? styles.tabActive : styles.tab}
                onClick={() => { setStudentMode('login'); setMessage(null); setPassword(''); }}
              >
                Вход
              </button>
              <button
                type="button"
                className={studentMode === 'register' ? styles.tabActive : styles.tab}
                onClick={() => { setStudentMode('register'); setMessage(null); setPassword(''); }}
              >
                Регистрация
              </button>
            </div>

            <form onSubmit={studentMode === 'register' ? handleStudentRegister : handleStudentLogin} className={styles.form}>
              <label className={styles.label}>ФИО</label>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иванов Иван"
                required
              />
              <label className={styles.label}>Класс</label>
              <select
                className={styles.select}
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                <option value="">Выберите класс</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {studentMode === 'login' && (
                <>
                  <label className={styles.label}>Пароль</label>
                  <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль от учителя"
                    required
                    autoComplete="current-password"
                  />
                </>
              )}
              {message && <p className={message.type === 'ok' ? styles.messageOk : styles.messageError}>{message.text}</p>}
              <button type="submit" className={styles.submit}>
                {studentMode === 'register' ? (
                  <>
                    <UserPlus size={18} />
                    Отправить заявку
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Войти
                  </>
                )}
              </button>
            </form>
            {studentMode === 'login' && approvedStudents.length === 0 && (
              <p className={styles.hint}>Пока нет одобренных учеников. Сначала пройдите регистрацию.</p>
            )}
          </>
        )}

        {role === 'teacher' && (
          <form onSubmit={handleTeacherLogin} className={styles.form}>
            <label className={styles.label}>Почта</label>
            <input
              type="email"
              className={styles.input}
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="teacher@school3.ru"
              required
              autoComplete="email"
            />
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              className={styles.input}
              value={teacherPassword}
              onChange={(e) => setTeacherPassword(e.target.value)}
              placeholder="••••"
              required
              autoComplete="current-password"
            />
            {message && <p className={styles.messageError}>{message.text}</p>}
            <button type="submit" className={styles.submit}>
              <LogIn size={18} />
              Войти
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
