import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser } from '@/lib/auth';
import { Trophy, Clock, Eye, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';

export default function Results() {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  
  const { examAttempt, subject, isAutoSubmit } = location.state || {};

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    if (!examAttempt || !subject) {
      navigate('/student-dashboard');
      return;
    }
  }, [user, examAttempt, subject, navigate]);

  if (!examAttempt || !subject || !user) {
    return <div>Loading...</div>;
  }

  const percentage = Math.round((examAttempt.score / examAttempt.totalMarks) * 100);
  const timeSpentMinutes = Math.round(examAttempt.timeSpent / 60);
  const isPassed = percentage >= 60;

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
                <p className="text-sm text-gray-600">{subject.name}</p>
              </div>
            </div>
            <Button onClick={() => navigate('/student-dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auto-submit warning */}
        {isAutoSubmit && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <RotateCcw className="h-5 w-5" />
                <span className="font-medium">
                  This exam was automatically submitted due to time expiry or tab switching violations.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {examAttempt.score}
              </CardTitle>
              <CardDescription>out of {examAttempt.totalMarks} marks</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className={`text-3xl font-bold ${gradeInfo.color}`}>
                {percentage}%
              </CardTitle>
              <CardDescription>Percentage Score</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className={`text-3xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </CardTitle>
              <CardDescription>Grade</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className="text-sm text-gray-600">{percentage}%</span>
              </div>
              <Progress value={percentage} className="w-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.keys(examAttempt.answers).length}
                </div>
                <div className="text-sm text-gray-600">Questions Attempted</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {subject.questions.filter((q: any) => examAttempt.answers[q.id] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {timeSpentMinutes}
                </div>
                <div className="text-sm text-gray-600">Minutes Spent</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${examAttempt.tabSwitches > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {examAttempt.tabSwitches}
                </div>
                <div className="text-sm text-gray-600">Tab Switches</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {isPassed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    PASSED
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    FAILED
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Question-wise Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Question-wise Analysis
            </CardTitle>
            <CardDescription>
              Review your answers and see the correct solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subject.questions.map((question: any, index: number) => {
              const userAnswer = examAttempt.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAttempted = userAnswer !== undefined;

              return (
                <div key={question.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-700 mb-3">{question.question}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={isCorrect ? "default" : wasAttempted ? "destructive" : "secondary"}>
                        {isCorrect ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </>
                        ) : wasAttempted ? (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Wrong
                          </>
                        ) : (
                          'Not Attempted'
                        )}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {question.marks} marks
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option: string, optionIndex: number) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = question.correctAnswer === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded border ${
                            isCorrectAnswer
                              ? 'bg-green-50 border-green-200'
                              : isUserAnswer
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex items-center space-x-2">
                              {isCorrectAnswer && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Correct Answer
                                </Badge>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Exam Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Exam Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Subject:</span> {subject.name}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {subject.duration} minutes
              </div>
              <div>
                <span className="font-medium">Attempted At:</span>{' '}
                {new Date(examAttempt.attemptedAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Time Spent:</span> {timeSpentMinutes} minutes
              </div>
              <div>
                <span className="font-medium">Total Questions:</span> {subject.questions.length}
              </div>
              <div>
                <span className="font-medium">Questions Attempted:</span>{' '}
                {Object.keys(examAttempt.answers).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}