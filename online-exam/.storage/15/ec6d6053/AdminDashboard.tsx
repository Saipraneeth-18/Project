import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCurrentUser, logout, getExamAttempts } from '@/lib/auth';
import { students, subjects, examSchedules } from '@/lib/examData';
import { Users, BookOpen, Calendar, BarChart3, LogOut, Trophy, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAllResults = () => {
    const attempts = getExamAttempts();
    return attempts.map(attempt => {
      const student = students.find(s => s.id === attempt.studentId);
      const subject = subjects.find(s => s.id === attempt.subjectId);
      return {
        ...attempt,
        studentName: student?.name || 'Unknown',
        rollNumber: student?.rollNumber || 'Unknown',
        subjectName: subject?.name || 'Unknown',
        percentage: Math.round((attempt.score / attempt.totalMarks) * 100)
      };
    });
  };

  const getStatistics = () => {
    const attempts = getExamAttempts();
    const totalStudents = students.length;
    const totalExams = subjects.length;
    const totalAttempts = attempts.length;
    const averageScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalMarks) * 100, 0) / attempts.length)
      : 0;

    return {
      totalStudents,
      totalExams,
      totalAttempts,
      averageScore
    };
  };

  if (!user) return null;

  const results = getAllResults();
  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Online Examination System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground">Available subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Exam attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">Exam Results</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          {/* Exam Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>
                  View all student exam attempts and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No exam results available yet. Students haven't attempted any exams.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attempted At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.studentName}
                          </TableCell>
                          <TableCell>{result.rollNumber}</TableCell>
                          <TableCell>{result.subjectName}</TableCell>
                          <TableCell>
                            {result.score}/{result.totalMarks}
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              result.percentage >= 60 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.percentage}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={result.percentage >= 60 ? "default" : "destructive"}>
                              {result.percentage >= 60 ? 'PASSED' : 'FAILED'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(result.attemptedAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Registered Students</CardTitle>
                <CardDescription>
                  Manage student registrations and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Exams Attempted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const studentAttempts = results.filter(r => r.studentId === student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Year {student.year}</Badge>
                          </TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{studentAttempts.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Available Subjects</CardTitle>
                <CardDescription>
                  Year-wise subject allocation for BTech CSE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Attempts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => {
                      const subjectAttempts = results.filter(r => r.subjectId === subject.id);
                      return (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Year {subject.year}</Badge>
                          </TableCell>
                          <TableCell>{subject.duration} min</TableCell>
                          <TableCell>{subject.totalMarks}</TableCell>
                          <TableCell>{subject.questions.length}</TableCell>
                          <TableCell>{subjectAttempts.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle>Exam Schedules</CardTitle>
                <CardDescription>
                  Manage exam schedules and timings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examSchedules.map((schedule) => {
                      const subject = subjects.find(s => s.id === schedule.subjectId);
                      return (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">
                            {subject?.name || 'Unknown Subject'}
                          </TableCell>
                          <TableCell>
                            {new Date(schedule.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{schedule.startTime}</TableCell>
                          <TableCell>{schedule.endTime}</TableCell>
                          <TableCell>
                            <Badge variant={schedule.isActive ? "default" : "secondary"}>
                              {schedule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}