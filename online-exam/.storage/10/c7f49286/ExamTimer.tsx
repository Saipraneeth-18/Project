import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExamTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
}

export default function ExamTimer({ duration, onTimeUp, isActive }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        
        // Show warning when 5 minutes left
        if (prev <= 300 && !isWarning) {
          setIsWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp, isWarning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 300) return 'text-red-600'; // 5 minutes
    if (timeLeft <= 600) return 'text-yellow-600'; // 10 minutes
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm border">
        <Clock className={`h-6 w-6 ${getTimerColor()}`} />
        <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {isWarning && timeLeft > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: Only {Math.ceil(timeLeft / 60)} minutes remaining!
          </AlertDescription>
        </Alert>
      )}
      
      {timeLeft === 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Time's up! Your exam has been automatically submitted.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}