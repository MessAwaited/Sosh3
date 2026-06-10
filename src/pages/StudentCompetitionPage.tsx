import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, FileArchive, Flag, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { competition } from '../data/competition';
import {
  getCompetitionApplicationByStudentId,
  getCompetitionSubmissionsByStudentId,
  hasCompetitionAccess,
  submitCompetitionApplication,
  submitCompetitionZip,
} from '../store/registry';
import styles from './StudentCompetitionPage.module.css';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function StudentCompetitionPage() {
  const { user } = useAuth();
  const studentId = user?.id ?? '';
  const [, refreshView] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const application = studentId ? getCompetitionApplicationByStudentId(studentId, competition.id) : null;
  const hasAccess = studentId ? hasCompetitionAccess(studentId, competition.id) : false;
  const submissions = studentId ? getCompetitionSubmissionsByStudentId(studentId, competition.id) : [];
  const reviewedSubmission = submissions.find((item) => Boolean(item.review)) ?? null;
  const [showScore, setShowScore] = useState(false);

  const handleApply = () => {
    if (!studentId) return;
    const result = submitCompetitionApplication(studentId, competition.id);
    if (!result.success) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setMessage({ type: 'ok', text: 'Заявка отправлена. Ожидайте подтверждение учителя.' });
    refreshView((x) => x + 1);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedFile) {
      setMessage({ type: 'error', text: 'Выберите архив перед отправкой.' });
      return;
    }
    const result = await submitCompetitionZip(studentId, selectedFile, competition.id);
    if (!result.success) {
      setMessage({ type: 'error', text: result.error });
      return;
    }
    setMessage({ type: 'ok', text: `Архив ${selectedFile.name} загружен.` });
    setSelectedFile(null);
    refreshView((x) => x + 1);
  };

  const buttonText = application ? 'Заявка подана' : 'Подать заявку';

  return (
    <div className={styles.page}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Соревнование
      </motion.h1>
      <p className={styles.subtitle}>
        Здесь проходит практический тур по спортивному программированию. Участнику нужно подать заявку, дождаться допуска от учителя, выполнить задание на Python и отправить архив с решением. Соревнование помогает проверить не только знание синтаксиса, но и умение анализировать условие, выбирать алгоритм, тестировать программу и аккуратно оформлять проект для проверки.
      </p>

      <motion.section
        className={styles.card}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.heroRow}>
          <div className={styles.poster}><img src="/competition-poster.png" alt="Постер соревнования" /></div>
          <div className={styles.info}>
            <h2>{competition.title}</h2>
            <ul className={styles.metaList}>
              <li><Flag size={16} /> {competition.mode}</li>
              <li><CalendarDays size={16} /> Регистрация до {competition.registrationDeadline}</li>
              <li><CalendarDays size={16} /> {competition.timeRange}</li>
            </ul>
          </div>
        </div>

        <p className={styles.description}>{competition.description}</p>

        <div className={styles.applyRow}>
          <button
            type="button"
            className={`${styles.applyBtn} ${application ? styles.applyBtnSubmitted : ''}`}
            onClick={handleApply}
            disabled={Boolean(application)}
          >
            {buttonText}
          </button>
        </div>
      </motion.section>

      {application?.status === 'pending' && (
        <div className={styles.statusPending}>
          Заявка отправлена. После принятия учителем откроется доступ к заданию и загрузке архива.
        </div>
      )}

      {hasAccess && (
        <section className={`${styles.taskSection} ${reviewedSubmission?.review ? styles.taskSectionReviewed : ''}`}>
          {!reviewedSubmission?.review && (
            <>
              <div className={styles.taskHeader}>
                <h3>{competition.taskTitle}</h3>
              </div>
              <p className={styles.taskText}>{competition.taskDescription}</p>
            </>
          )}
          {reviewedSubmission?.review ? (
            <div className={styles.reviewSuccess}>
              <h4>Ваша работа успешно проверена</h4>
              <p>
                Проверил: <strong>{reviewedSubmission.review.reviewedBy ?? 'Иванова Мария Ивановна'}</strong>
              </p>
              <button
                type="button"
                className={styles.showScoreBtn}
                onClick={() => setShowScore((current) => !current)}
              >
                {showScore ? 'Скрыть оценку' : 'Посмотреть оценку'}
              </button>
              {showScore && (
                <div className={styles.scoreDetails}>
                  <p><strong>Итоговый балл:</strong> {reviewedSubmission.review.totalScore} / 100</p>
                  <p><strong>Корректность:</strong> {reviewedSubmission.review.criteria.correctness}</p>
                  <p><strong>Эффективность:</strong> {reviewedSubmission.review.criteria.efficiency}</p>
                  <p><strong>Качество кода:</strong> {reviewedSubmission.review.criteria.codeQuality}</p>
                  <p><strong>Документация:</strong> {reviewedSubmission.review.criteria.documentation}</p>
                  {reviewedSubmission.review.comment && (
                    <p><strong>Комментарий учителя:</strong> {reviewedSubmission.review.comment}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form className={styles.uploadForm} onSubmit={handleUpload}>
              <label className={styles.fileLabel}>
                <FileArchive size={18} />
                Выберите архив проекта
              </label>
              <input
                type="file"
                accept=".zip,.rar,.7z,.tar,.gz,.bz2,.xz,.tar.gz,.tar.bz2,.tar.xz,application/zip,application/x-zip-compressed,application/x-rar-compressed,application/vnd.rar,application/x-7z-compressed,application/x-tar,application/gzip"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className={styles.fileInput}
              />
              <button type="submit" className={styles.uploadBtn}>
                <Upload size={18} />
                Отправить архив
              </button>
            </form>
          )}

          {submissions.length > 0 && (
            <div className={styles.submissions}>
              <h4>Ваши отправки</h4>
              <ul>
                {submissions.map((item) => (
                  <li key={item.id}>
                    <span>{item.fileName}</span>
                    <span>{formatBytes(item.fileSize)}</span>
                    <span>{new Date(item.uploadedAt).toLocaleString('ru-RU')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {message && (
        <p className={message.type === 'ok' ? styles.messageOk : styles.messageError}>
          {message.text}
        </p>
      )}
    </div>
  );
}
