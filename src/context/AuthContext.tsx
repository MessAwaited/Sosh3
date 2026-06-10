import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ApprovedStudent } from '../store/registry';
import { getTeacherAccounts } from '../store/registry';

export type StudentLoginPayload = Omit<ApprovedStudent, 'password'>;
import type { TeacherAccount } from '../store/registry';

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  classId?: string;
  className?: string;
  teacherId?: string;
}

interface AuthContextType {
  user: User | null;
  loginStudent: (student: StudentLoginPayload) => void;
  loginTeacher: (teacher: TeacherAccount) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'sosh3_auth';

function loadStored(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as User;
    if (stored.role === 'teacher' && stored.teacherId) {
      const teacher = getTeacherAccounts().find((item) => item.id === stored.teacherId);
      if (teacher && teacher.name !== stored.name) {
        const normalized: User = { ...stored, name: teacher.name };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
    return stored;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStored);

  const loginStudent = useCallback((student: StudentLoginPayload) => {
    const newUser: User = {
      id: student.id,
      name: student.name,
      role: 'student',
      classId: student.classId,
      className: student.className,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const loginTeacher = useCallback((teacher: TeacherAccount) => {
    const newUser: User = {
      id: teacher.id,
      name: teacher.name,
      role: 'teacher',
      teacherId: teacher.id,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginStudent, loginTeacher, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
