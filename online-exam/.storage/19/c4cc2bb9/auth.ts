import { students, adminCredentials, ExamAttempt } from './examData';

export interface AuthUser {
  id: string;
  name: string;
  rollNumber?: string;
  year?: number;
  department?: string;
  role: 'student' | 'admin';
}

export const authenticateStudent = (rollNumber: string): AuthUser | null => {
  const student = students.find(s => s.rollNumber === rollNumber);
  if (student) {
    return {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      year: student.year,
      department: student.department,
      role: 'student'
    };
  }
  return null;
};

export const authenticateAdmin = (username: string, password: string): AuthUser | null => {
  if (username === adminCredentials.username && password === adminCredentials.password) {
    return {
      id: 'admin',
      name: 'Administrator',
      role: 'admin'
    };
  }
  return null;
};

export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: AuthUser): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const hasAttemptedExam = (studentId: string, subjectId: string): boolean => {
  const attempts = JSON.parse(localStorage.getItem('examAttempts') || '[]') as ExamAttempt[];
  return attempts.some((attempt: ExamAttempt) => 
    attempt.studentId === studentId && attempt.subjectId === subjectId
  );
};

export const saveExamAttempt = (attempt: ExamAttempt): void => {
  const attempts = JSON.parse(localStorage.getItem('examAttempts') || '[]') as ExamAttempt[];
  attempts.push(attempt);
  localStorage.setItem('examAttempts', JSON.stringify(attempts));
};

export const getExamAttempts = (): ExamAttempt[] => {
  return JSON.parse(localStorage.getItem('examAttempts') || '[]') as ExamAttempt[];
};