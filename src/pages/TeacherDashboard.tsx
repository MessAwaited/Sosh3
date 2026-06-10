import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, UserCheck, UserX, ClipboardList, ArrowLeft, Clock, CheckCircle, Trash2, Trophy } from 'lucide-react';
import { classes } from '../data/classes';
import { lessons } from '../data/lessons';
import { TeacherCompetitionPage } from './TeacherCompetitionPage';
import type { RegistrationRequest, StudentWithProgress } from '../store/registry';
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getStudentsWithProgressByClass,
  generatePassword,
  getApprovedCountByClass,
  removeStudentFromCourse,
  MAX_STUDENTS_PER_CLASS,
} from '../store/registry';
import styles from './TeacherDashboard.module.css';

const TOTAL_LESSONS = lessons.length;

function formatDuration(ms: number | undefined): string {
  if (ms == null || ms < 0) return '—';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  if (min > 0) return `${min} мин ${sec} сек`;
  return `${sec} сек`;
}

function getGradeFromScore(avgScore: number): { grade: number; label: string } {
  if (avgScore >= 90) return { grade: 5, label: 'Отлично' };
  if (avgScore >= 75) return { grade: 4, label: 'Хорошо' };
  if (avgScore >= 60) return { grade: 3, label: 'Удовлетворительно' };
  if (avgScore >= 0) return { grade: 2, label: 'Неудовлетворительно' };
  return { grade: 0, label: '—' };
}

function getStudentAverageScore(student: StudentWithProgress): number {
  return student.progress.length > 0
    ? Math.round(student.progress.reduce((sum, item) => sum + item.testScore, 0) / student.progress.length)
    : 0;
}

function getStudentProgressPercent(student: StudentWithProgress): number {
  return TOTAL_LESSONS > 0 ? Math.round((student.progress.length / TOTAL_LESSONS) * 100) : 0;
}

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'progress' | 'requests' | 'competition'>('progress');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? '');
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProgress | null>(null);
  const [pendingRequests, setPendingRequests] = useState(getPendingRequests());
  const [approvingRequest, setApprovingRequest] = useState<RegistrationRequest | null>(null);
  const [approvePassword, setApprovePassword] = useState('');
  const [approvedPasswordShown, setApprovedPasswordShown] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const students = selectedClassId ? getStudentsWithProgressByClass(selectedClassId) : [];
  const averageLessons = students.length > 0
    ? (students.reduce((sum, student) => sum + student.progress.length, 0) / students.length).toFixed(1)
    : '0';
  const averageScore = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + getStudentAverageScore(student), 0) / students.length)
    : 0;
  const studentsWithProgress = students.filter((student) => student.progress.length > 0);
  const averageGrade = studentsWithProgress.length > 0
    ? (
        studentsWithProgress.reduce((sum, student) => sum + getGradeFromScore(getStudentAverageScore(student)).grade, 0)
        / studentsWithProgress.length
      ).toFixed(1)
    : '—';
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + getStudentProgressPercent(student), 0) / students.length)
    : 0;

  const refreshStudents = useCallback(() => {
    setPendingRequests(getPendingRequests());
    setSelectedStudent(null);
  }, []);

  const openApproveModal = useCallback((req: RegistrationRequest) => {
    setApprovingRequest(req);
    setApprovePassword(generatePassword(8));
    setApprovedPasswordShown(null);
  }, []);

  const closeApproveModal = useCallback(() => {
    setApprovingRequest(null);
    setApprovePassword('');
    setApprovedPasswordShown(null);
  }, []);

  const handleApproveConfirm = useCallback(() => {
    if (!approvingRequest || !approvePassword.trim()) return;
    if (getApprovedCountByClass(approvingRequest.classId) >= MAX_STUDENTS_PER_CLASS) return;
    const ok = approveRequest(approvingRequest.id, approvePassword.trim());
    if (ok) {
      setApprovedPasswordShown(approvePassword.trim());
      refreshStudents();
      setTimeout(() => closeApproveModal(), 2500);
    }
    return ok;
  }, [approvingRequest, approvePassword, closeApproveModal, refreshStudents]);

  const handleReject = useCallback((requestId: string) => {
    rejectRequest(requestId);
    refreshStudents();
  }, [refreshStudents]);

  const handleRemoveStudent = useCallback((student: StudentWithProgress) => {
    if (!confirm(`Исключить ${student.name} из курса? Ученик не сможет войти в систему. Данные прогресса будут удалены.`)) return;
    const ok = removeStudentFromCourse(student.id);
    if (ok) {
      refreshStudents();
      setSelectedStudent(null);
    }
  }, [refreshStudents]);

  const togglePasswordVisibility = useCallback((studentId: string) => {
    setVisiblePasswords((current) => ({ ...current, [studentId]: !current[studentId] }));
  }, []);

  return (
    <div className={styles.page}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Кабинет учителя
      </motion.h1>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'progress' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <TrendingUp size={18} />
          Прогресс учеников
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <ClipboardList size={18} />
          Заявки
          {pendingRequests.length > 0 && <span className={styles.badge}>{pendingRequests.length}</span>}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'competition' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('competition')}
        >
          <Trophy size={18} />
          Соревнование
        </button>
      </div>

      {activeTab === 'requests' && (
        <motion.section className={styles.requestsSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {pendingRequests.length === 0 ? (
            <p className={styles.empty}>Нет новых заявок.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ученик</th>
                    <th>Класс</th>
                    <th>Мест в классе</th>
                    <th>Дата заявки</th>
                    <th className={styles.actionsColumn}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req, index) => {
                    const countInClass = getApprovedCountByClass(req.classId);
                    const classFull = countInClass >= MAX_STUDENTS_PER_CLASS;
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <td><span className={styles.name}>{req.name}</span></td>
                        <td><span className={styles.count}>{req.className}</span></td>
                        <td><span className={styles.count}>{countInClass} из {MAX_STUDENTS_PER_CLASS}</span></td>
                        <td>{new Date(req.createdAt).toLocaleDateString('ru-RU')}</td>
                        <td className={styles.actionsColumn}>
                          <div className={styles.requestActions}>
                            <button
                              type="button"
                              className={styles.btnApprove}
                              onClick={() => openApproveModal(req)}
                              title={classFull ? 'В классе достигнут лимит' : 'Одобрить'}
                              disabled={classFull}
                            >
                              <UserCheck size={18} />
                              Одобрить
                            </button>
                            <button type="button" className={styles.btnReject} onClick={() => handleReject(req.id)} title="Отклонить">
                              <UserX size={18} />
                              Отклонить
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      )}

      {activeTab === 'progress' && (
        <>
          {selectedStudent ? (
            <motion.section className={styles.studentDetail} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <button type="button" className={styles.backToList} onClick={() => setSelectedStudent(null)}>
                <ArrowLeft size={18} />
                К списку учеников
              </button>
              <h2 className={styles.studentDetailTitle}>
                {selectedStudent.name}
                <span className={styles.studentDetailClass}> · {selectedStudent.className}</span>
              </h2>
              <p className={styles.studentDetailSub}>
                Пройдено уроков: {selectedStudent.progress.length} из {TOTAL_LESSONS}
                {selectedStudent.progress.length > 0 && (() => {
                  const avg = getStudentAverageScore(selectedStudent);
                  const { grade, label } = getGradeFromScore(avg);
                  return <> · Средний балл: {avg}% · Оценка: {grade > 0 ? `${grade} (${label})` : '—'}</>;
                })()}
                {' · '}
                Пароль для входа: <strong>{selectedStudent.password}</strong>
              </p>
              <div className={styles.studentDetailActions}>
                <button type="button" className={styles.btnRemove} onClick={(e) => { e.stopPropagation(); handleRemoveStudent(selectedStudent); }} title="Исключить из курса">
                  <Trash2 size={18} />
                  Исключить из курса
                </button>
              </div>

              {selectedStudent.progress.length === 0 ? (
                <p className={styles.empty}>Ученик ещё не прошёл ни одного урока.</p>
              ) : (
                <ul className={styles.lessonDetailList}>
                  {selectedStudent.progress
                    .slice()
                    .sort((a, b) => {
                      const lessonA = lessons.find((l) => l.id === a.lessonId);
                      const lessonB = lessons.find((l) => l.id === b.lessonId);
                      return (lessonA?.order ?? 0) - (lessonB?.order ?? 0);
                    })
                    .map((progress) => {
                      const lesson = lessons.find((l) => l.id === progress.lessonId);
                      return (
                        <motion.li key={progress.lessonId} className={styles.lessonDetailCard} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                          <div className={styles.lessonDetailHeader}>
                            <CheckCircle size={20} className={styles.lessonDetailIcon} />
                            <span className={styles.lessonDetailName}>{lesson?.title ?? `Урок ${progress.lessonId}`}</span>
                          </div>
                          <div className={styles.lessonDetailStats}>
                            <span className={styles.lessonDetailStat} title="Результат теста">
                              Балл: <strong>{progress.testScore}%</strong>
                            </span>
                            <span className={styles.lessonDetailStat}>
                              Попыток: <strong>{progress.testAttempts}</strong>
                            </span>
                            <span className={styles.lessonDetailStat}>
                              <Clock size={14} />
                              Время: <strong>{formatDuration(progress.durationMs)}</strong>
                            </span>
                            <span className={styles.lessonDetailStat}>{new Date(progress.completedAt).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </motion.li>
                      );
                    })}
                </ul>
              )}
            </motion.section>
          ) : (
            <>
              <motion.div className={styles.toolbar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <label className={styles.label}>Класс</label>
                <select
                  className={styles.select}
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedStudent(null);
                  }}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div className={styles.tableWrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ученик</th>
                      <th>Прогресс</th>
                      <th>Уроков пройдено</th>
                      <th>Средний балл</th>
                      <th>Оценка</th>
                      <th>Серия дней</th>
                      <th>Пароль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className={styles.empty}>
                          В этом классе пока нет одобренных учеников или они ещё не начинали курс.
                        </td>
                      </tr>
                    ) : (
                      students.map((student, i) => {
                        const completed = student.progress.length;
                        const percent = getStudentProgressPercent(student);
                        const avgScore = getStudentAverageScore(student);
                        const { grade, label } = student.progress.length > 0 ? getGradeFromScore(avgScore) : { grade: 0, label: '—' };
                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className={styles.rowClickable}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td><span className={styles.name}>{student.name}</span></td>
                            <td>
                              <div className={styles.progressCell}>
                                <div className={styles.progressTrack}>
                                  <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }} />
                                </div>
                                <span className={styles.progressPercent}>{percent}%</span>
                              </div>
                            </td>
                            <td><span className={styles.count}>{completed} из {TOTAL_LESSONS}</span></td>
                            <td><span className={styles.score}>{avgScore}%</span></td>
                            <td>
                              <span className={styles.gradeBadge} data-grade={grade}>
                                {grade > 0 ? `${grade} (${label})` : label}
                              </span>
                            </td>
                            <td>
                              <span className={styles.streak}>
                                <TrendingUp size={14} />
                                {student.streakDays} дн.
                              </span>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div className={styles.passwordCell}>
                                <button type="button" className={styles.passwordToggle} onClick={() => togglePasswordVisibility(student.id)}>
                                  {visiblePasswords[student.id] ? 'Скрыть' : 'Показать'}
                                </button>
                                <span className={styles.passwordValue}>{visiblePasswords[student.id] ? student.password : '••••••••'}</span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </motion.div>

              <motion.section className={styles.summary} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h2 className={styles.summaryTitle}>Сводка по классу</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <Users size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>{students.length}</span>
                    <span className={styles.summaryLabel}>Учеников</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <BookOpen size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>{averageLessons}</span>
                    <span className={styles.summaryLabel}>Среднее уроков на ученика</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <TrendingUp size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>{averageProgress}%</span>
                    <span className={styles.summaryLabel}>Средний прогресс</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <CheckCircle size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>{averageScore}%</span>
                    <span className={styles.summaryLabel}>Средний балл</span>
                  </div>
                  <div className={styles.summaryCard}>
                    <BookOpen size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>{averageGrade}</span>
                    <span className={styles.summaryLabel}>Средняя оценка</span>
                  </div>
                </div>
              </motion.section>
            </>
          )}
        </>
      )}

      {activeTab === 'competition' && <TeacherCompetitionPage />}

      {approvingRequest && (
        <div className={styles.modalOverlay} onClick={closeApproveModal} role="dialog" aria-modal="true">
          <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Пароль для входа ученика</h3>
            <p className={styles.modalSub}>
              Задайте пароль для <strong>{approvingRequest.name}</strong> ({approvingRequest.className}). Передайте его ученику — по нему он будет входить в систему.
            </p>
            {approvedPasswordShown ? (
              <div className={styles.approvedBlock}>
                <p className={styles.approvedLabel}>Ученик одобрен. Передайте ему пароль:</p>
                <p className={styles.approvedPassword}>{approvedPasswordShown}</p>
                <p className={styles.approvedHint}>Окно закроется автоматически.</p>
              </div>
            ) : (
              <>
                <label className={styles.modalLabel}>Пароль</label>
                <div className={styles.modalPasswordRow}>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={approvePassword}
                    onChange={(e) => setApprovePassword(e.target.value)}
                    placeholder="Введите или сгенерируйте"
                  />
                  <button type="button" className={styles.btnGenerate} onClick={() => setApprovePassword(generatePassword(8))}>
                    Сгенерировать
                  </button>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnCancel} onClick={closeApproveModal}>Отмена</button>
                  <button type="button" className={styles.btnConfirm} onClick={handleApproveConfirm} disabled={!approvePassword.trim()}>
                    <UserCheck size={18} />
                    Одобрить и задать пароль
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
