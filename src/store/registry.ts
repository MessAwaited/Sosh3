export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface RegistrationRequest {
  id: string;
  name: string;
  classId: string;
  className: string;
  createdAt: number;
  status: RequestStatus;
}

export interface ApprovedStudent {
  id: string;
  name: string;
  classId: string;
  className: string;
  approvedAt: number;
  password: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
}

export interface LessonProgressRecord {
  lessonId: string;
  completedAt: number;
  testScore: number;
  testAttempts: number;
  durationMs?: number;
}

export interface StudentWithProgress extends ApprovedStudent {
  progress: LessonProgressRecord[];
  streakDays: number;
}

export type CompetitionApplicationStatus = 'pending' | 'approved';

export interface CompetitionApplication {
  id: string;
  competitionId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  createdAt: number;
  status: CompetitionApplicationStatus;
  approvedAt?: number;
}

export interface CompetitionReviewCriteria {
  correctness: number;
  efficiency: number;
  codeQuality: number;
  documentation: number;
}

export interface CompetitionReview {
  reviewedAt: number;
  criteria: CompetitionReviewCriteria;
  comment?: string;
  totalScore: number;
  reviewedBy?: string;
}

export interface CompetitionSubmission {
  id: string;
  competitionId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  fileDataUrl?: string;
  review?: CompetitionReview;
}

const REQUESTS_KEY = 'sosh3_registration_requests';
const APPROVED_KEY = 'sosh3_approved_students';
const PROGRESS_PREFIX = 'sosh3_progress_';
const COMPETITION_APPLICATIONS_KEY = 'sosh3_competition_applications';
const COMPETITION_SUBMISSIONS_KEY = 'sosh3_competition_submissions';

export const CURRENT_COMPETITION_ID = 'spring-algorithm-cup-2026';
export const MAX_STUDENTS_PER_CLASS = 25;

const RATING_DEMO_PROFILES: Array<{
  id: string;
  name: string;
  classId: string;
  className: string;
  score: number;
}> = [
  { id: 'rating-lukyanchikov', name: 'Лукьянчиков Ричард Русланович', classId: '11a', className: '11А', score: 100 },
  { id: 'rating-ibn-la-ahad', name: 'Смирнова Арина Павловна', classId: '10a', className: '10А', score: 94 },
  { id: 'rating-osi-hiteo', name: 'Кузнецов Матвей Андреевич', classId: '11b', className: '11Б', score: 89 },
  { id: 'rating-dzho-pitch', name: 'Орлова София Дмитриевна', classId: '9a', className: '9А', score: 85 },
  { id: 'rating-tesla', name: 'Васильев Никита Игоревич', classId: '10b', className: '10Б', score: 81 },
  { id: 'rating-zhukov', name: 'Жуков Кирилл Сергеевич', classId: '9b', className: '9Б', score: 80 },
  { id: 'rating-dev-1', name: 'Егорова Полина Максимовна', classId: '11a', className: '11А', score: 80 },
  { id: 'rating-bibinos', name: 'Морозов Артем Алексеевич', classId: '10a', className: '10А', score: 79 },
  { id: 'rating-dev-2', name: 'Крылова Дарья Романовна', classId: '11b', className: '11Б', score: 77 },
  { id: 'rating-mirnaya', name: 'Миронова Анастасия Никитична', classId: '9a', className: '9А', score: 75 },
  { id: 'rating-messengerov', name: 'Федоров Максим Олегович', classId: '10b', className: '10Б', score: 73 },
  { id: 'rating-voronin', name: 'Воронина Елизавета Николаевна', classId: '9b', className: '9Б', score: 69 },
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function validateStudentName(name: string): { ok: true } | { ok: false; error: string } {
  const s = name.trim();
  if (!s) return { ok: false, error: 'Введите имя' };
  if (s.length < 2) return { ok: false, error: 'Имя должно содержать не менее 2 символов' };
  if (s.length > 80) return { ok: false, error: 'Имя слишком длинное' };
  const chars = s.replace(/\s+/g, '');
  const unique = new Set(chars.toLowerCase()).size;
  if (unique < 2) return { ok: false, error: 'Введите настоящее имя' };
  if (chars.length >= 5 && unique < 3) return { ok: false, error: 'Введите ФИО ученика, например: Иванов Иван' };
  return { ok: true };
}

export function getRegistrationRequests(): RegistrationRequest[] {
  const list = loadJson<RegistrationRequest[]>(REQUESTS_KEY, []);
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export function getPendingRequests(): RegistrationRequest[] {
  return getRegistrationRequests().filter((r) => r.status === 'pending');
}

export function submitRegistrationRequest(name: string, classId: string, className: string): { success: true } | { success: false; error: string } {
  const nameTrim = name.trim();
  const validation = validateStudentName(nameTrim);
  if (!validation.ok) return { success: false, error: validation.error };
  const requests = getRegistrationRequests();
  const duplicate = requests.find(
    (r) => r.status === 'pending' && r.name.toLowerCase() === nameTrim.toLowerCase() && r.classId === classId,
  );
  if (duplicate) return { success: false, error: 'Заявка с таким именем и классом уже отправлена' };
  const approved = getApprovedStudents();
  if (approved.some((a) => a.name.toLowerCase() === nameTrim.toLowerCase() && a.classId === classId)) {
    return { success: false, error: 'Ученик уже допущен к курсу. Войдите через «Вход».' };
  }
  const newRequest: RegistrationRequest = {
    id: generateId('req'),
    name: nameTrim,
    classId,
    className,
    createdAt: Date.now(),
    status: 'pending',
  };
  saveJson(REQUESTS_KEY, [...requests, newRequest]);
  return { success: true };
}

export function getApprovedCountByClass(classId: string): number {
  return getApprovedStudents().filter((s) => s.classId === classId).length;
}

export function approveRequest(requestId: string, password: string): boolean {
  const pwd = (password || '').trim();
  if (!pwd) return false;
  const requests = getRegistrationRequests();
  const req = requests.find((r) => r.id === requestId && r.status === 'pending');
  if (!req) return false;
  if (getApprovedCountByClass(req.classId) >= MAX_STUDENTS_PER_CLASS) return false;
  const approved: ApprovedStudent = {
    id: `student-${requestId}`,
    name: req.name,
    classId: req.classId,
    className: req.className,
    approvedAt: Date.now(),
    password: pwd,
  };
  saveJson(REQUESTS_KEY, requests.map((r) => (r.id === requestId ? { ...r, status: 'approved' as RequestStatus } : r)));
  saveJson(APPROVED_KEY, [...getApprovedStudents(), approved]);
  return true;
}

export function rejectRequest(requestId: string): boolean {
  const requests = getRegistrationRequests();
  const req = requests.find((r) => r.id === requestId && r.status === 'pending');
  if (!req) return false;
  saveJson(REQUESTS_KEY, requests.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as RequestStatus } : r)));
  return true;
}

export function removeStudentFromCourse(studentId: string): boolean {
  const approved = getApprovedStudents();
  if (!approved.some((s) => s.id === studentId)) return false;
  saveJson(APPROVED_KEY, approved.filter((s) => s.id !== studentId));
  localStorage.removeItem(`${PROGRESS_PREFIX}${studentId}`);
  return true;
}

export function getApprovedStudents(): ApprovedStudent[] {
  const list = loadJson<ApprovedStudent[]>(APPROVED_KEY, []);
  return list.map((s) => ({ ...s, password: s.password ?? '' }));
}

export function generatePassword(length = 8): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function getApprovedStudentById(id: string): ApprovedStudent | null {
  return getApprovedStudents().find((s) => s.id === id) ?? null;
}

export function getApprovedStudentByNameAndClass(name: string, classId: string): ApprovedStudent | null {
  const n = name.trim().toLowerCase();
  return getApprovedStudents().find((s) => s.name.toLowerCase() === n && s.classId === classId) ?? null;
}

export function getApprovedStudentByLogin(name: string, classId: string, password: string): Omit<ApprovedStudent, 'password'> | null {
  const student = getApprovedStudentByNameAndClass(name, classId);
  if (!student) return null;
  const pwd = (student.password ?? '').trim();
  if (pwd === '' || pwd !== (password || '').trim()) return null;
  return {
    id: student.id,
    name: student.name,
    classId: student.classId,
    className: student.className,
    approvedAt: student.approvedAt,
  };
}

function loadProgressForStudent(studentId: string): LessonProgressRecord[] {
  return loadJson<LessonProgressRecord[]>(`${PROGRESS_PREFIX}${studentId}`, []);
}

export function getStudentsWithProgress(): StudentWithProgress[] {
  return getApprovedStudents().map((student) => ({
    ...student,
    progress: loadProgressForStudent(student.id),
    streakDays: 3,
  }));
}

export function getStudentsWithProgressByClass(classId: string): StudentWithProgress[] {
  return getStudentsWithProgress().filter((s) => s.classId === classId);
}

function getCompetitionApplicationsRaw(): CompetitionApplication[] {
  return loadJson<CompetitionApplication[]>(COMPETITION_APPLICATIONS_KEY, []).sort((a, b) => b.createdAt - a.createdAt);
}

function saveCompetitionApplications(list: CompetitionApplication[]) {
  saveJson(COMPETITION_APPLICATIONS_KEY, list);
}

function getCompetitionSubmissionsRaw(): CompetitionSubmission[] {
  return loadJson<CompetitionSubmission[]>(COMPETITION_SUBMISSIONS_KEY, []).sort((a, b) => b.uploadedAt - a.uploadedAt);
}

function saveCompetitionSubmissions(list: CompetitionSubmission[]) {
  saveJson(COMPETITION_SUBMISSIONS_KEY, list);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
    reader.readAsDataURL(file);
  });
}

export function getCompetitionApplications(competitionId = CURRENT_COMPETITION_ID): CompetitionApplication[] {
  return getCompetitionApplicationsRaw().filter((x) => x.competitionId === competitionId);
}

export function getCompetitionApplicationsByStatus(status: CompetitionApplicationStatus, competitionId = CURRENT_COMPETITION_ID): CompetitionApplication[] {
  return getCompetitionApplications(competitionId).filter((x) => x.status === status);
}

export function getCompetitionApplicationByStudentId(studentId: string, competitionId = CURRENT_COMPETITION_ID): CompetitionApplication | null {
  return getCompetitionApplications(competitionId).find((x) => x.studentId === studentId) ?? null;
}

export function submitCompetitionApplication(studentId: string, competitionId = CURRENT_COMPETITION_ID): { success: true } | { success: false; error: string } {
  const student = getApprovedStudentById(studentId);
  if (!student) return { success: false, error: 'Ученик не найден в списке допущенных.' };
  if (getCompetitionApplicationByStudentId(studentId, competitionId)) {
    return { success: false, error: 'Заявка уже подана.' };
  }
  const newItem: CompetitionApplication = {
    id: generateId('comp-req'),
    competitionId,
    studentId: student.id,
    studentName: student.name,
    classId: student.classId,
    className: student.className,
    createdAt: Date.now(),
    status: 'pending',
  };
  saveCompetitionApplications([newItem, ...getCompetitionApplicationsRaw()]);
  return { success: true };
}

export function approveCompetitionApplication(applicationId: string): boolean {
  const list = getCompetitionApplicationsRaw();
  const target = list.find((x) => x.id === applicationId && x.status === 'pending');
  if (!target) return false;
  saveCompetitionApplications(
    list.map((x) => (x.id === applicationId ? { ...x, status: 'approved' as CompetitionApplicationStatus, approvedAt: Date.now() } : x)),
  );
  return true;
}

export function rejectCompetitionApplication(applicationId: string): boolean {
  const list = getCompetitionApplicationsRaw();
  const target = list.find((x) => x.id === applicationId && x.status === 'pending');
  if (!target) return false;
  saveCompetitionApplications(list.filter((x) => x.id !== applicationId));
  return true;
}

export function hasCompetitionAccess(studentId: string, competitionId = CURRENT_COMPETITION_ID): boolean {
  const app = getCompetitionApplicationByStudentId(studentId, competitionId);
  return app?.status === 'approved';
}

export async function submitCompetitionZip(
  studentId: string,
  file: File,
  competitionId = CURRENT_COMPETITION_ID,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!hasCompetitionAccess(studentId, competitionId)) {
    return { success: false, error: 'Загрузка доступна только после принятия заявки учителем.' };
  }
  if (!file) return { success: false, error: 'Файл не выбран.' };
  const fileName = (file.name || '').trim();
  const lowerName = fileName.toLowerCase();
  const allowedArchiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tar.gz', '.tar.bz2', '.tar.xz'];
  const isArchive = allowedArchiveExtensions.some((ext) => lowerName.endsWith(ext));
  if (!isArchive) {
    return { success: false, error: 'Нужен архивный файл (.zip, .rar, .7z, .tar, .gz).' };
  }
  const student = getApprovedStudentById(studentId);
  if (!student) return { success: false, error: 'Ученик не найден.' };

  const newSubmission: CompetitionSubmission = {
    id: generateId('comp-sub'),
    competitionId,
    studentId: student.id,
    studentName: student.name,
    classId: student.classId,
    className: student.className,
    fileName,
    fileSize: file.size,
    uploadedAt: Date.now(),
    fileDataUrl: await readFileAsDataUrl(file),
  };
  saveCompetitionSubmissions([newSubmission, ...getCompetitionSubmissionsRaw()]);
  return { success: true };
}

export function getCompetitionSubmissions(competitionId = CURRENT_COMPETITION_ID): CompetitionSubmission[] {
  return getCompetitionSubmissionsRaw().filter((x) => x.competitionId === competitionId);
}

export function getCompetitionSubmissionsByStudentId(studentId: string, competitionId = CURRENT_COMPETITION_ID): CompetitionSubmission[] {
  return getCompetitionSubmissions(competitionId).filter((x) => x.studentId === studentId);
}

export function saveCompetitionReview(
  submissionId: string,
  criteria: CompetitionReviewCriteria,
  comment?: string,
  reviewerName?: string,
): boolean {
  const list = getCompetitionSubmissionsRaw();
  if (!list.some((item) => item.id === submissionId)) return false;
  const values = Object.values(criteria);
  if (values.some((value) => value < 1 || value > 100 || Number.isNaN(value))) return false;

  const review: CompetitionReview = {
    reviewedAt: Date.now(),
    criteria,
    comment: comment?.trim() || undefined,
    totalScore: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    reviewedBy: reviewerName?.trim() || undefined,
  };

  saveCompetitionSubmissions(list.map((item) => (item.id === submissionId ? { ...item, review } : item)));
  return true;
}

const TEACHER_PASSWORD = '1111';
const TEACHERS_WITH_EMAIL: { id: string; name: string; email: string }[] = [
  { id: 't1', name: 'Иванова Мария Ивановна', email: 'ivanova@school3.ru' },
  { id: 't2', name: 'Петров Сергей Александрович', email: 'petrov@school3.ru' },
  { id: 't3', name: 'Сидорова Елена Викторовна', email: 'sidorova@school3.ru' },
];

export function getTeacherAccounts(): TeacherAccount[] {
  return TEACHERS_WITH_EMAIL.map((t) => ({ id: t.id, name: t.name }));
}

export function getTeacherByEmailAndPassword(email: string, password: string): TeacherAccount | null {
  const e = (email || '').trim().toLowerCase();
  const p = (password || '').trim();
  if (!e || p !== TEACHER_PASSWORD) return null;
  const teacher = TEACHERS_WITH_EMAIL.find((t) => t.email.toLowerCase() === e);
  return teacher ? { id: teacher.id, name: teacher.name } : null;
}

function buildRatingDemoProgress(score: number, now: number): LessonProgressRecord[] {
  const lessonCount = score >= 90 ? 4 : score >= 80 ? 3 : 2;
  return Array.from({ length: lessonCount }, (_, i) => ({
    lessonId: String(i + 1),
    completedAt: now - 86400000 * (lessonCount - i),
    testScore: Math.max(60, Math.min(100, score - i)),
    testAttempts: 1,
    durationMs: 300000 + i * 25000,
  }));
}

function ensureRatingDemoProfiles(now: number) {
  const approved = loadJson<ApprovedStudent[]>(APPROVED_KEY, []);
  let changed = false;
  const nextApproved = [...approved];
  const defaultPwd = 'demo123';

  for (const [index, profile] of RATING_DEMO_PROFILES.entries()) {
    const studentIndex = nextApproved.findIndex((student) => student.id === profile.id);
    const approvedAt = now - 86400000 * (RATING_DEMO_PROFILES.length - index + 2);

    if (studentIndex < 0) {
      nextApproved.push({
        id: profile.id,
        name: profile.name,
        classId: profile.classId,
        className: profile.className,
        approvedAt,
        password: defaultPwd,
      });
      changed = true;
      continue;
    }

    const current = nextApproved[studentIndex];
    const needsUpdate =
      current.name !== profile.name ||
      current.classId !== profile.classId ||
      current.className !== profile.className;

    if (!needsUpdate) continue;

    nextApproved[studentIndex] = {
      ...current,
      name: profile.name,
      classId: profile.classId,
      className: profile.className,
    };
    changed = true;
  }

  if (changed) {
    saveJson(APPROVED_KEY, nextApproved);
  }

  for (const profile of RATING_DEMO_PROFILES) {
    const progressKey = `${PROGRESS_PREFIX}${profile.id}`;
    const existingProgress = loadJson<LessonProgressRecord[]>(progressKey, []);
    if (existingProgress.length > 0) continue;
    saveJson(progressKey, buildRatingDemoProgress(profile.score, now));
  }
}

function buildReviewCriteriaForScore(score: number): CompetitionReviewCriteria {
  return {
    correctness: score,
    efficiency: score,
    codeQuality: score,
    documentation: score,
  };
}

function buildReviewForScore(score: number, reviewedAt: number): CompetitionReview {
  return {
    reviewedAt,
    criteria: buildReviewCriteriaForScore(score),
    totalScore: score,
    reviewedBy: 'Иванова Мария Ивановна',
    comment: 'Работа зачтена. Балл выставлен по критериям соревнования.',
  };
}

function ensureRatingDemoCompetitionData(now: number) {
  const applications = getCompetitionApplicationsRaw();
  const submissions = getCompetitionSubmissionsRaw();
  const nextApplications = [...applications];
  const nextSubmissions = [...submissions];
  let applicationsChanged = false;
  let submissionsChanged = false;

  for (const [index, profile] of RATING_DEMO_PROFILES.entries()) {
    const createdAt = now - 3600000 * (RATING_DEMO_PROFILES.length - index + 6);
    const approvedAt = createdAt + 15 * 60000;
    const uploadedAt = approvedAt + (35 + index * 3) * 60000;
    const reviewedAt = uploadedAt + 40 * 60000;

    const appIndex = nextApplications.findIndex(
      (item) => item.competitionId === CURRENT_COMPETITION_ID && item.studentId === profile.id,
    );

    if (appIndex < 0) {
      nextApplications.push({
        id: `rating-app-${profile.id}`,
        competitionId: CURRENT_COMPETITION_ID,
        studentId: profile.id,
        studentName: profile.name,
        classId: profile.classId,
        className: profile.className,
        createdAt,
        status: 'approved',
        approvedAt,
      });
      applicationsChanged = true;
    } else {
      const current = nextApplications[appIndex];
      const normalized: CompetitionApplication = {
        ...current,
        competitionId: CURRENT_COMPETITION_ID,
        studentId: profile.id,
        studentName: profile.name,
        classId: profile.classId,
        className: profile.className,
        createdAt: current.createdAt || createdAt,
        status: 'approved',
        approvedAt: current.approvedAt ?? approvedAt,
      };
      if (JSON.stringify(current) !== JSON.stringify(normalized)) {
        nextApplications[appIndex] = normalized;
        applicationsChanged = true;
      }
    }

    const submissionIndex = nextSubmissions.findIndex(
      (item) => item.competitionId === CURRENT_COMPETITION_ID && item.studentId === profile.id,
    );
    const requiredReview = buildReviewForScore(profile.score, reviewedAt);

    if (submissionIndex < 0) {
      nextSubmissions.push({
        id: `rating-sub-${profile.id}`,
        competitionId: CURRENT_COMPETITION_ID,
        studentId: profile.id,
        studentName: profile.name,
        classId: profile.classId,
        className: profile.className,
        fileName: `${profile.id}.zip`,
        fileSize: 120000 + index * 7000,
        uploadedAt,
        review: requiredReview,
      });
      submissionsChanged = true;
    } else {
      const current = nextSubmissions[submissionIndex];
      const normalized: CompetitionSubmission = {
        ...current,
        competitionId: CURRENT_COMPETITION_ID,
        studentId: profile.id,
        studentName: profile.name,
        classId: profile.classId,
        className: profile.className,
        fileName: current.fileName || `${profile.id}.zip`,
        fileSize: current.fileSize > 0 ? current.fileSize : 120000 + index * 7000,
        uploadedAt: current.uploadedAt || uploadedAt,
        review: buildReviewForScore(profile.score, current.review?.reviewedAt ?? reviewedAt),
      };
      if (JSON.stringify(current) !== JSON.stringify(normalized)) {
        nextSubmissions[submissionIndex] = normalized;
        submissionsChanged = true;
      }
    }
  }

  if (applicationsChanged) {
    saveCompetitionApplications(nextApplications);
  }
  if (submissionsChanged) {
    saveCompetitionSubmissions(nextSubmissions);
  }
}

export function seedInitialDataIfEmpty() {
  const existingApproved = loadJson<ApprovedStudent[]>(APPROVED_KEY, []);
  const existingRequests = loadJson<RegistrationRequest[]>(REQUESTS_KEY, []);
  const now = Date.now();

  if (existingApproved.length === 0) {
    const defaultPwd = 'demo123';
    const approved: ApprovedStudent[] = [
      { id: 'student-seed-1', name: 'Иванов Алексей', classId: '9a', className: '9 А', approvedAt: now - 86400000 * 5, password: defaultPwd },
      { id: 'student-seed-2', name: 'Петрова Мария', classId: '9a', className: '9 А', approvedAt: now - 86400000 * 4, password: defaultPwd },
      { id: 'student-seed-3', name: 'Сидоров Иван', classId: '9a', className: '9 А', approvedAt: now - 86400000 * 3, password: defaultPwd },
      { id: 'student-seed-4', name: 'Козлова Анна', classId: '9b', className: '9 Б', approvedAt: now - 86400000 * 2, password: defaultPwd },
      { id: 'student-seed-5', name: 'Новиков Дмитрий', classId: '9b', className: '9 Б', approvedAt: now - 86400000, password: defaultPwd },
      { id: 'student-seed-6', name: 'Морозова Елена', classId: '10a', className: '10 А', approvedAt: now, password: defaultPwd },
      { id: 'student-seed-7', name: 'Волков Артём', classId: '10a', className: '10 А', approvedAt: now, password: defaultPwd },
      { id: 'student-seed-8', name: 'Соколова Ольга', classId: '10b', className: '10 Б', approvedAt: now, password: defaultPwd },
      { id: 'student-seed-9', name: 'Лебедев Никита', classId: '11a', className: '11 А', approvedAt: now, password: defaultPwd },
    ];
    saveJson(APPROVED_KEY, approved);
    saveJson(`${PROGRESS_PREFIX}student-seed-1`, [
      { lessonId: '1', completedAt: now - 86400000 * 2, testScore: 100, testAttempts: 1, durationMs: 320000 },
      { lessonId: '2', completedAt: now - 86400000, testScore: 85, testAttempts: 2, durationMs: 480000 },
    ]);
    saveJson(`${PROGRESS_PREFIX}student-seed-2`, [
      { lessonId: '1', completedAt: now - 86400000 * 3, testScore: 90, testAttempts: 1, durationMs: 280000 },
    ]);
    saveJson(`${PROGRESS_PREFIX}student-seed-3`, [
      { lessonId: '1', completedAt: now - 86400000 * 5, testScore: 70, testAttempts: 3, durationMs: 510000 },
      { lessonId: '2', completedAt: now - 86400000 * 4, testScore: 80, testAttempts: 2, durationMs: 390000 },
      { lessonId: '3', completedAt: now - 86400000, testScore: 95, testAttempts: 1, durationMs: 420000 },
    ]);
    saveJson(`${PROGRESS_PREFIX}student-seed-6`, [
      { lessonId: '1', completedAt: now - 86400000 * 2, testScore: 100, testAttempts: 1, durationMs: 240000 },
      { lessonId: '2', completedAt: now - 86400000, testScore: 90, testAttempts: 1, durationMs: 360000 },
    ]);
  }

  if (existingRequests.length === 0) {
    const newRequests: RegistrationRequest[] = [
      { id: 'req-seed-1', name: 'Федорова Дарья', classId: '9a', className: '9 А', createdAt: now - 3600000, status: 'pending' },
      { id: 'req-seed-2', name: 'Кузнецов Максим', classId: '10a', className: '10 А', createdAt: now - 7200000, status: 'pending' },
      { id: 'req-seed-3', name: 'Попова Виктория', classId: '11b', className: '11 Б', createdAt: now - 1800000, status: 'pending' },
    ];
    saveJson(REQUESTS_KEY, newRequests);
  }

  ensureRatingDemoProfiles(now);
  ensureRatingDemoCompetitionData(now);
}

