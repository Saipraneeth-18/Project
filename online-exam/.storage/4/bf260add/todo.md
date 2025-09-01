# Online Examination System - MVP Implementation Plan

## Core Features to Implement:
1. **Authentication System**
   - Student login with Roll Number/College ID
   - Admin login
   - Role-based access control

2. **Student Dashboard**
   - View available exams based on year/subject
   - Exam schedule display
   - Take exam interface with timer
   - Results display

3. **Admin Dashboard**
   - Manage students and teachers
   - Create and schedule exams
   - View all results
   - Manage subjects by year

4. **Exam System**
   - Time-bound exam access
   - Auto-submit on timeout
   - Tab switch detection (max 2 switches)
   - One-time attempt restriction
   - Instant results

## Files to Create:
1. **src/pages/Login.tsx** - Authentication page
2. **src/pages/StudentDashboard.tsx** - Student main interface
3. **src/pages/AdminDashboard.tsx** - Admin main interface
4. **src/pages/ExamInterface.tsx** - Exam taking interface
5. **src/pages/Results.tsx** - Results display
6. **src/components/ExamTimer.tsx** - Timer component
7. **src/lib/examData.ts** - Mock data for subjects and questions
8. **src/lib/auth.ts** - Authentication logic

## Subject Structure (BTech CSE):
- **1st Year**: C Programming, Mathematics, Physics
- **2nd Year**: Data Structures, DBMS, Digital Logic
- **3rd Year**: OS, Computer Networks, Software Engineering
- **4th Year**: AI/ML, Cloud Computing, Cybersecurity

## Technical Implementation:
- Use localStorage for MVP (MongoDB integration noted for future)
- React Router for navigation
- Context API for state management
- Shadcn/ui components for UI
- Timer functionality with auto-submit
- Tab visibility API for tab switch detection

## Security Features:
- Session management
- Exam attempt tracking
- Time validation
- Tab switch monitoring