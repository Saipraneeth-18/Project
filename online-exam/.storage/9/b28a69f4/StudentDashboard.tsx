import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser, logout, hasAttemptedExam, getExamAttempts } from '@/lib/auth';
import { subjects, examSchedules } from '@/lib/examData';
import { Clock, Calendar, BookOpen, Trophy, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState(getCurrentUser());
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvailableExams = () => {
    if (!user?.year) return [];
    
    return subjects
      .filter(subject => subject.year === user.year)
      .map(subject => {
        const schedule = examSchedules.find(s => s.subjectId === subject.id);
        const hasAttempted = hasAttemptedExam(user.id, subject.id);
        const isTimeValid = schedule ? isExamTimeValid(schedule) : false;
        
        return {
          ...subject,
          schedule,
          hasAttempted,
          isTimeValid,
          canAttempt: !hasAttempted && isTimeValid && schedule?.isActive
        };
      });
  };

  const isExamTimeValid = (schedule: any) => {
    const now = new Date();
    const examDate = new Date(schedule.date);
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    
    const startTime = new Date(examDate);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(examDate);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    return now >= startTime && now <= endTime;
  };

  const getStudentResults = () => {
    if (!user) return [];
    
    const attempts = getExamAttempts().filter(attempt => attempt.studentId === user.id);
    return attempts.map(attempt => {
      const subject = subjects.find(s => s.id === attempt.subjectId);
      return {
        ...attempt,
        subjectName: subject?.name || 'Unknown Subject',
        percentage: Math.round((attempt.score / attempt.totalMarks) * 100)
      };
    });
  };

  const startExam = (subjectId: string) => {
    navigate(`/exam/${subjectId}`);
  };

  if (!user) return null;

  const availableExams = getAvailableExams();
  const results = getStudentResults();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.rollNumber}</p>
                <p className="text-xs text-gray-500">Year {user.year} - {user.department}</p>
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
        {/* Current Time */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-mono">
                Current Time: {currentTime.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Exams */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Available Exams - Year {user.year}
                </CardTitle>
                <CardDescription>
                  Exams scheduled for your academic year
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableExams.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No exams are currently scheduled for your year.
                    </AlertDescription>
                  </Alert>
                ) : (
                  availableExams.map((exam) => (
                    <div key={exam.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{exam.name}</h3>
                          <p className="text-sm text-gray-600">
                            Duration: {exam.duration} minutes | Total Marks: {exam.totalMarks}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {exam.hasAttempted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {!exam.hasAttempted && exam.isTimeValid && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                              Available Now
                            </Badge>
                          )}
                          {!exam.hasAttempted && !exam.isTimeValid && (
                            <Badge variant="outline">
                              Not Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {exam.schedule && (
                        <div className="text-sm text-gray-600">
                          <p>📅 Date: {new Date(exam.schedule.date).toLocaleDateString()}</p>
                          <p>⏰ Time: {exam.schedule.startTime} - {exam.schedule.endTime}</p>
                        </div>
                      )}

                      {exam.hasAttempted ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            You have already attempted this exam. Multiple attempts are not allowed.
                          </AlertDescription>
                        </Alert>
                      ) : exam.canAttempt ? (
                        <Button 
                          onClick={() => startExam(exam.id)}
                          className="w-full"
                        >
                          Start Exam
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          {!exam.schedule?.isActive ? 'Exam Not Active' : 'Not Available'}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Your Results
                </CardTitle>
                <CardDescription>
                  Exam results and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No exam results available yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium">{result.subjectName}</h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Score:</span>
                            <span className="font-medium">
                              {result.score}/{result.totalMarks}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Percentage:</span>
                            <span className={`font-medium ${
                              result.percentage >= 60 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Time Spent:</span>
                            <span>{Math.round(result.timeSpent / 60)} min</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Tab Switches:</span>
                            <span>{result.tabSwitches}</span>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-xs text-gray-500">
                          Attempted: {new Date(result.attemptedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Exam Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>• Exams are only available during scheduled times</p>
                <p>• Each exam can be attempted only once</p>
                <p>• Maximum 2 tab switches allowed</p>
                <p>• Auto-submit when time expires</p>
                <p>• Results are displayed immediately after completion</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}