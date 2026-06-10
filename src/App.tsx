import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { StudentDashboard } from './pages/StudentDashboard';
import { LessonPage } from './pages/LessonPage';
import { TheoryPage } from './pages/TheoryPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentCompetitionPage } from './pages/StudentCompetitionPage';
import { StudentRatingPage } from './pages/StudentRatingPage';

const routerBasename = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '');

function ProtectedStudent() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'student') return <Navigate to="/teacher" replace />;
  return <Outlet />;
}

function ProtectedTeacher() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'teacher') return <Navigate to="/student" replace />;
  return <Outlet />;
}

function RedirectFromRoot() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student" replace />;
  return <Navigate to="/teacher" replace />;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RedirectFromRoot />} />
            <Route path="/student" element={<Layout />}>
              <Route element={<ProtectedStudent />}>
                <Route index element={<StudentDashboard />} />
                <Route path="lesson/:id" element={<LessonPage />} />
                <Route path="theory" element={<TheoryPage />} />
                <Route path="competition" element={<StudentCompetitionPage />} />
                <Route path="rating" element={<StudentRatingPage />} />
              </Route>
            </Route>
            <Route path="/teacher" element={<Layout />}>
              <Route element={<ProtectedTeacher />}>
                <Route index element={<TeacherDashboard />} />
                <Route path="competition" element={<Navigate to="/teacher" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
