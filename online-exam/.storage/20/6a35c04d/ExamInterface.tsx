import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import ExamTimer from '@/components/ExamTimer';
import { getCurrentUser, hasAttemptedExam, saveExamAttempt } from '@/lib/auth';
import { subjects, Subject, ExamAttempt } from '@/lib/examData';
import { AlertTriangle, BookOpen, Send, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExamInterface() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [user] = useState(getCurrentUser());
  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isExamActive, setIsExamActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [startTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    if (!subjectId) {
      navigate('/student-dashboard');
      return;
    }

    // Check if already attempted
    if (hasAttemptedExam(user.id, subjectId)) {
      alert('You have already attempted this exam!');
      navigate('/student-dashboard');
      return;
    }

    // Find subject
    const foundSubject = subjects.find(s => s.id === subjectId);
    if (!foundSubject) {
      navigate('/student-dashboard');
      return;
    }

    setSubject(foundSubject);
  }, [user, subjectId, navigate]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isExamActive) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setShowWarning(true);
            setTimeout(() => {
              handleSubmitExam(true);
            }, 3000);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamActive]);

  // Prevent context menu and keyboard shortcuts
  useEffect(() => {
    const preventActions = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', preventActions);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('keydown', preventActions);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = useCallback(() => {
    if (!subject) return 0;
    
    let score = 0;
    subject.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });
    return score;
  }, [subject, answers]);

  const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setIsExamActive(false);
    
    if (!user || !subject) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const score = calculateScore();

    const examAttempt: ExamAttempt = {
      id: `${user.id}-${subject.id}-${Date.now()}`,
      studentId: user.id,
      subjectId: subject.id,
      answers,
      score,
      totalMarks: subject.totalMarks,
      attemptedAt: endTime.toISOString(),
      timeSpent,
      tabSwitches
    };

    saveExamAttempt(examAttempt);
    
    // Navigate to results
    navigate(`/results/${subject.id}`, { 
      state: { 
        examAttempt,
        subject,
        isAutoSubmit 
      } 
    });
  }, [user, subject, answers, startTime, tabSwitches, calculateScore, navigate, isSubmitting]);

  const handleTimeUp = useCallback(() => {
    handleSubmitExam(true);
  }, [handleSubmitExam]);

  const nextQuestion = () => {
    if (subject && currentQuestionIndex < subject.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (!subject || !user) {
    return <div>Loading...</div>;
  }

  const currentQuestion = subject.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / subject.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{subject.name}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {subject.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={tabSwitches >= 1 ? "destructive" : "secondary"}>
                Tab Switches: {tabSwitches}/2
              </Badge>
              <ExamTimer 
                duration={subject.duration} 
                onTimeUp={handleTimeUp}
                isActive={isExamActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warning for tab switches */}
      {showWarning && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Maximum tab switches exceeded! Your exam will be auto-submitted in 3 seconds.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
                <CardDescription>
                  {answeredQuestions}/{subject.questions.length} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {subject.questions.map((_, index: number) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestionIndex 
                          ? "default" 
                          : answers[subject.questions[index].id] !== undefined
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => goToQuestion(index)}
                      className="h-8 w-8 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-gray-600 mt-1">
                    Progress: {Math.round(progress)}%
                  </p>
                </div>

                <Button 
                  onClick={() => handleSubmitExam(false)}
                  className="w-full mt-4"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Question {currentQuestionIndex + 1}
                    </CardTitle>
                    <CardDescription>
                      Marks: {currentQuestion.marks}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {answers[currentQuestion.id] !== undefined ? 'Answered' : 'Not Answered'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium leading-relaxed">
                  {currentQuestion.question}
                </div>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                >
                  {currentQuestion.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === subject.questions.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}