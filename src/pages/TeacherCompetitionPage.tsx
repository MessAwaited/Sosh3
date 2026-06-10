import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileArchive,
  Flag,
  SearchCheck,
  Users,
} from 'lucide-react';
import { competition } from '../data/competition';
import type { CompetitionReviewCriteria, CompetitionSubmission } from '../store/registry';
import {
  approveCompetitionApplication,
  getCompetitionApplications,
  getCompetitionSubmissions,
  rejectCompetitionApplication,
  saveCompetitionReview,
} from '../store/registry';
import { useAuth } from '../context/AuthContext';
import { publicAsset } from '../utils/assets';
import styles from './TeacherCompetitionPage.module.css';

type CompetitionTeacherTab = 'applications' | 'participants';

type ReviewForm = CompetitionReviewCriteria & {
  comment: string;
};

const defaultReviewForm: ReviewForm = {
  correctness: 80,
  efficiency: 80,
  codeQuality: 80,
  documentation: 80,
  comment: '',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '—';
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} д ${hours % 24} ч`;
  if (hours > 0) return `${hours} ч ${minutes % 60} мин`;
  return `${minutes} мин`;
}

function getLatestSubmission(submissions: CompetitionSubmission[], studentId: string): CompetitionSubmission | null {
  return submissions.find((item) => item.studentId === studentId) ?? null;
}

export function TeacherCompetitionPage() {
  const { user } = useAuth();
  const [, refreshView] = useState(0);
  const [activeTab, setActiveTab] = useState<CompetitionTeacherTab>('applications');
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewForm>(defaultReviewForm);

  const applications = getCompetitionApplications(competition.id);
  const submissions = getCompetitionSubmissions(competition.id);
  const pending = applications.filter((x) => x.status === 'pending');
  const approved = applications.filter((x) => x.status === 'approved');

  const participants = approved.map((application) => {
    const submission = getLatestSubmission(submissions, application.studentId);
    const review = submission?.review;
    const durationMs = submission && application.approvedAt ? submission.uploadedAt - application.approvedAt : undefined;
    return { application, submission, review, durationMs };
  });

  const reviewingSubmission = reviewingSubmissionId
    ? submissions.find((item) => item.id === reviewingSubmissionId) ?? null
    : null;

  const handleApprove = (id: string) => {
    const ok = approveCompetitionApplication(id);
    if (ok) refreshView((x) => x + 1);
  };

  const handleReject = (id: string) => {
    const ok = rejectCompetitionApplication(id);
    if (ok) refreshView((x) => x + 1);
  };

  const openReviewModal = (submission: CompetitionSubmission) => {
    setReviewingSubmissionId(submission.id);
    setReviewForm({
      correctness: submission.review?.criteria.correctness ?? 80,
      efficiency: submission.review?.criteria.efficiency ?? 80,
      codeQuality: submission.review?.criteria.codeQuality ?? 80,
      documentation: submission.review?.criteria.documentation ?? 80,
      comment: submission.review?.comment ?? '',
    });
  };

  const closeReviewModal = () => {
    setReviewingSubmissionId(null);
    setReviewForm(defaultReviewForm);
  };

  const handleReviewScoreChange = (field: keyof CompetitionReviewCriteria, value: string) => {
    const numeric = Math.max(1, Math.min(100, Number(value) || 1));
    setReviewForm((current) => ({ ...current, [field]: numeric }));
  };

  const handleSaveReview = () => {
    if (!reviewingSubmissionId) return;
    const ok = saveCompetitionReview(
      reviewingSubmissionId,
      {
        correctness: reviewForm.correctness,
        efficiency: reviewForm.efficiency,
        codeQuality: reviewForm.codeQuality,
        documentation: reviewForm.documentation,
      },
      reviewForm.comment,
      user?.name,
    );
    if (ok) {
      refreshView((x) => x + 1);
      closeReviewModal();
    }
  };

  const handleDownload = (submission: CompetitionSubmission) => {
    if (!submission.fileDataUrl) return;
    const link = document.createElement('a');
    link.href = submission.fileDataUrl;
    link.download = submission.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.page}>
      <motion.section className={styles.card} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.heroRow}>
          <div className={styles.poster}><img src={publicAsset('/competition-poster.png')} alt="Постер соревнования" /></div>
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

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <ClipboardCheck size={20} />
            <span className={styles.summaryValue}>{pending.length}</span>
            <span className={styles.summaryLabel}>Новых заявок</span>
          </div>
          <div className={styles.summaryCard}>
            <Users size={20} />
            <span className={styles.summaryValue}>{participants.length}</span>
            <span className={styles.summaryLabel}>Участников</span>
          </div>
          <div className={styles.summaryCard}>
            <FileArchive size={20} />
            <span className={styles.summaryValue}>{submissions.length}</span>
            <span className={styles.summaryLabel}>Отправлено работ</span>
          </div>
        </div>
      </motion.section>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'applications' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Заявки
          {pending.length > 0 && <span className={styles.badge}>{pending.length}</span>}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'participants' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          Список участников
        </button>
      </div>

      {activeTab === 'applications' && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <ClipboardCheck size={20} />
            <h2>Заявки учеников</h2>
          </div>

          {pending.length === 0 ? (
            <p className={styles.empty}>Новых заявок пока нет.</p>
          ) : (
            <ul className={styles.requestList}>
              {pending.map((item) => (
                <li key={item.id} className={styles.requestItem}>
                  <div>
                    <strong>{item.studentName}</strong>
                    <span className={styles.requestMeta}> · {item.className}</span>
                    <div className={styles.requestDate}>{new Date(item.createdAt).toLocaleString('ru-RU')}</div>
                  </div>
                  <div className={styles.requestActions}>
                    <button type="button" className={styles.acceptBtn} onClick={() => handleApprove(item.id)}>
                      Принять заявку
                    </button>
                    <button type="button" className={styles.rejectBtn} onClick={() => handleReject(item.id)}>
                      Отклонить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {activeTab === 'participants' && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <Users size={20} />
            <h2>Участники соревнования</h2>
          </div>

          {participants.length === 0 ? (
            <p className={styles.empty}>Пока нет допущенных участников.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Класс</th>
                    <th>Статус задания</th>
                    <th>Статус отправки</th>
                    <th>Время выполнения</th>
                    <th>Баллы</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(({ application, submission, review, durationMs }) => (
                    <tr key={application.id}>
                      <td>{application.studentName}</td>
                      <td>{application.className}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${review ? styles.statusChecked : styles.statusPending}`}>
                          {review ? 'Проверено' : 'Не проверено'}
                        </span>
                      </td>
                      <td>
                        {submission ? (
                          <div className={styles.cellStack}>
                            <span className={`${styles.statusBadge} ${styles.statusUploaded}`}>Отправлено</span>
                            <span className={styles.cellMeta}>{submission.fileName} · {formatBytes(submission.fileSize)}</span>
                            <span className={styles.cellMeta}>{new Date(submission.uploadedAt).toLocaleString('ru-RU')}</span>
                          </div>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles.statusMissing}`}>Не отправлено</span>
                        )}
                      </td>
                      <td>{formatDuration(durationMs)}</td>
                      <td>{review ? `${review.totalScore} / 100` : '—'}</td>
                      <td>
                        <div className={styles.actionCell}>
                          <button type="button" className={styles.secondaryBtn} onClick={() => submission && handleDownload(submission)} disabled={!submission?.fileDataUrl}>
                            <Download size={16} />
                            Архив
                          </button>
                          <button type="button" className={styles.primaryBtn} onClick={() => submission && openReviewModal(submission)} disabled={!submission}>
                            <SearchCheck size={16} />
                            Проверить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {reviewingSubmission && (
        <div className={styles.modalOverlay} onClick={closeReviewModal} role="dialog" aria-modal="true">
          <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h3 className={styles.modalTitle}>Проверка работы</h3>
                <p className={styles.modalSub}>{reviewingSubmission.studentName} · {reviewingSubmission.className}</p>
              </div>
              <button type="button" className={styles.secondaryBtn} onClick={() => handleDownload(reviewingSubmission)} disabled={!reviewingSubmission.fileDataUrl}>
                <Download size={16} />
                Скачать архив
              </button>
            </div>

            <div className={styles.criteriaGrid}>
              <label className={styles.field}>
                <span>Корректность решения</span>
                <input type="number" min={1} max={100} value={reviewForm.correctness} onChange={(e) => handleReviewScoreChange('correctness', e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Эффективность алгоритма</span>
                <input type="number" min={1} max={100} value={reviewForm.efficiency} onChange={(e) => handleReviewScoreChange('efficiency', e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Качество кода</span>
                <input type="number" min={1} max={100} value={reviewForm.codeQuality} onChange={(e) => handleReviewScoreChange('codeQuality', e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Комментарии и документация</span>
                <input type="number" min={1} max={100} value={reviewForm.documentation} onChange={(e) => handleReviewScoreChange('documentation', e.target.value)} />
              </label>
            </div>

            <label className={styles.field}>
              <span>Комментарий учителя</span>
              <textarea
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((current) => ({ ...current, comment: e.target.value }))}
                placeholder="Например: хорошо решена основная логика, но стоит улучшить обработку крайних случаев."
              />
            </label>

            <div className={styles.totalBox}>
              Итоговый балл: {Math.round((reviewForm.correctness + reviewForm.efficiency + reviewForm.codeQuality + reviewForm.documentation) / 4)} / 100
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={closeReviewModal}>Отмена</button>
              <button type="button" className={styles.primaryBtn} onClick={handleSaveReview}>
                <CheckCircle2 size={16} />
                Сохранить проверку
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
