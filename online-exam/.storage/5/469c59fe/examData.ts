export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Subject {
  id: string;
  name: string;
  year: number;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
}

export interface ExamSchedule {
  id: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  date: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  year: number;
  department: string;
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  subjectId: string;
  answers: Record<string, number>;
  score: number;
  totalMarks: number;
  attemptedAt: string;
  timeSpent: number;
  tabSwitches: number;
}

// Mock data for subjects and questions
export const subjects: Subject[] = [
  // 1st Year Subjects
  {
    id: 'c-prog-1',
    name: 'C Programming',
    year: 1,
    duration: 60,
    totalMarks: 50,
    questions: [
      {
        id: 'c1',
        question: 'Which of the following is the correct syntax for declaring a variable in C?',
        options: ['int x;', 'integer x;', 'var x;', 'x: int;'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'c2',
        question: 'What is the output of printf("%d", 5/2) in C?',
        options: ['2.5', '2', '3', 'Error'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c3',
        question: 'Which header file is required for using printf() function?',
        options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c4',
        question: 'What is the size of int data type in C (typically)?',
        options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c5',
        question: 'Which operator is used to access the address of a variable?',
        options: ['*', '&', '%', '#'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c6',
        question: 'What is the correct way to declare a pointer in C?',
        options: ['int ptr;', 'int *ptr;', 'int &ptr;', 'pointer int ptr;'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c7',
        question: 'Which loop executes at least once?',
        options: ['for loop', 'while loop', 'do-while loop', 'nested loop'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'c8',
        question: 'What is the correct syntax for a for loop in C?',
        options: ['for(i=0; i<10; i++)', 'for i=0 to 10', 'for(i=0, i<10, i++)', 'for i in range(10)'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'c9',
        question: 'Which function is used to allocate memory dynamically in C?',
        options: ['alloc()', 'malloc()', 'memory()', 'new()'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'c10',
        question: 'What does the break statement do in a loop?',
        options: ['Continues to next iteration', 'Exits the loop', 'Pauses the loop', 'Restarts the loop'],
        correctAnswer: 1,
        marks: 5
      }
    ]
  },
  {
    id: 'math-1',
    name: 'Mathematics',
    year: 1,
    duration: 60,
    totalMarks: 50,
    questions: [
      {
        id: 'm1',
        question: 'What is the derivative of x²?',
        options: ['x', '2x', 'x²', '2x²'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm2',
        question: 'What is the integral of 2x?',
        options: ['x²', 'x² + C', '2x²', '2x² + C'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm3',
        question: 'What is the value of sin(90°)?',
        options: ['0', '1', '-1', '0.5'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm4',
        question: 'What is the value of log₁₀(100)?',
        options: ['1', '2', '10', '100'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm5',
        question: 'What is the determinant of a 2x2 matrix [[a,b],[c,d]]?',
        options: ['a+d-b-c', 'ad-bc', 'ac-bd', 'ab-cd'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm6',
        question: 'What is the sum of first n natural numbers?',
        options: ['n(n+1)', 'n(n+1)/2', 'n²', 'n(n-1)/2'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm7',
        question: 'What is the value of e (Euler\'s number) approximately?',
        options: ['2.718', '3.14', '1.414', '1.732'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'm8',
        question: 'What is the formula for the area of a circle?',
        options: ['2πr', 'πr²', 'πr', '2πr²'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm9',
        question: 'What is the value of cos(0°)?',
        options: ['0', '1', '-1', '0.5'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'm10',
        question: 'What is the slope of a line passing through points (0,0) and (1,1)?',
        options: ['0', '1', '2', 'undefined'],
        correctAnswer: 1,
        marks: 5
      }
    ]
  },
  // 2nd Year Subjects
  {
    id: 'ds-2',
    name: 'Data Structures',
    year: 2,
    duration: 60,
    totalMarks: 50,
    questions: [
      {
        id: 'ds1',
        question: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds2',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds3',
        question: 'In a binary tree, what is the maximum number of nodes at level k?',
        options: ['2^k', '2^(k-1)', '2^(k+1)', 'k^2'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'ds4',
        question: 'Which traversal of binary tree gives sorted order in BST?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds5',
        question: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds6',
        question: 'Which data structure is used for BFS traversal?',
        options: ['Stack', 'Queue', 'Array', 'Tree'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds7',
        question: 'What is a hash collision?',
        options: ['When hash function fails', 'When two keys map to same index', 'When hash table is full', 'When key is not found'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds8',
        question: 'Which sorting algorithm is stable?',
        options: ['Quick sort', 'Heap sort', 'Merge sort', 'Selection sort'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'ds9',
        question: 'What is the space complexity of recursive fibonacci?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ds10',
        question: 'In a circular queue, how do you check if it\'s full?',
        options: ['front == rear', '(rear + 1) % size == front', 'rear == size - 1', 'front == 0'],
        correctAnswer: 1,
        marks: 5
      }
    ]
  },
  // 3rd Year Subjects
  {
    id: 'os-3',
    name: 'Operating Systems',
    year: 3,
    duration: 60,
    totalMarks: 50,
    questions: [
      {
        id: 'os1',
        question: 'What is a process?',
        options: ['A program in execution', 'A compiled program', 'A system call', 'A memory location'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'os2',
        question: 'Which scheduling algorithm gives minimum average waiting time?',
        options: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'os3',
        question: 'What is deadlock?',
        options: ['Process termination', 'Infinite loop', 'Circular wait for resources', 'Memory overflow'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'os4',
        question: 'Which memory management technique eliminates external fragmentation?',
        options: ['Paging', 'Segmentation', 'Contiguous allocation', 'Dynamic allocation'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'os5',
        question: 'What is the purpose of system calls?',
        options: ['Interface between user and kernel', 'Memory allocation', 'Process scheduling', 'File compression'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'os6',
        question: 'Which page replacement algorithm is optimal?',
        options: ['FIFO', 'LRU', 'Optimal', 'Clock'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'os7',
        question: 'What is thrashing?',
        options: ['High CPU utilization', 'Excessive paging activity', 'Process synchronization', 'Memory leak'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'os8',
        question: 'Which IPC mechanism is fastest?',
        options: ['Pipes', 'Message queues', 'Shared memory', 'Sockets'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'os9',
        question: 'What is the banker\'s algorithm used for?',
        options: ['Process scheduling', 'Deadlock avoidance', 'Memory management', 'File allocation'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'os10',
        question: 'What is a semaphore?',
        options: ['A scheduling algorithm', 'A synchronization primitive', 'A memory location', 'A system call'],
        correctAnswer: 1,
        marks: 5
      }
    ]
  },
  // 4th Year Subjects
  {
    id: 'ai-4',
    name: 'Artificial Intelligence',
    year: 4,
    duration: 60,
    totalMarks: 50,
    questions: [
      {
        id: 'ai1',
        question: 'What is the goal of artificial intelligence?',
        options: ['Replace humans', 'Simulate human intelligence', 'Increase processing speed', 'Reduce memory usage'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai2',
        question: 'Which search algorithm is complete and optimal?',
        options: ['DFS', 'BFS', 'A*', 'Greedy'],
        correctAnswer: 2,
        marks: 5
      },
      {
        id: 'ai3',
        question: 'What is machine learning?',
        options: ['Programming computers', 'Learning from data', 'Hardware optimization', 'Network protocols'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai4',
        question: 'Which is a supervised learning algorithm?',
        options: ['K-means', 'Linear regression', 'DBSCAN', 'PCA'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai5',
        question: 'What is overfitting in machine learning?',
        options: ['Model performs well on training data only', 'Model is too simple', 'Model has no parameters', 'Model is very fast'],
        correctAnswer: 0,
        marks: 5
      },
      {
        id: 'ai6',
        question: 'What is a neural network?',
        options: ['Computer network', 'Brain simulation model', 'Database system', 'Operating system'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai7',
        question: 'What is the purpose of activation function?',
        options: ['Speed up training', 'Introduce non-linearity', 'Reduce memory', 'Prevent errors'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai8',
        question: 'What is backpropagation?',
        options: ['Forward pass algorithm', 'Weight update algorithm', 'Data preprocessing', 'Model evaluation'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai9',
        question: 'What is cross-validation used for?',
        options: ['Data cleaning', 'Model evaluation', 'Feature selection', 'Data visualization'],
        correctAnswer: 1,
        marks: 5
      },
      {
        id: 'ai10',
        question: 'What is the difference between AI and ML?',
        options: ['No difference', 'AI is broader concept, ML is subset', 'ML is broader', 'They are opposite'],
        correctAnswer: 1,
        marks: 5
      }
    ]
  }
];

export const examSchedules: ExamSchedule[] = [
  {
    id: 'schedule-1',
    subjectId: 'c-prog-1',
    startTime: '09:00',
    endTime: '10:00',
    date: '2025-09-01',
    isActive: true
  },
  {
    id: 'schedule-2',
    subjectId: 'math-1',
    startTime: '11:00',
    endTime: '12:00',
    date: '2025-09-01',
    isActive: true
  },
  {
    id: 'schedule-3',
    subjectId: 'ds-2',
    startTime: '09:00',
    endTime: '10:00',
    date: '2025-09-02',
    isActive: true
  },
  {
    id: 'schedule-4',
    subjectId: 'os-3',
    startTime: '14:00',
    endTime: '15:00',
    date: '2025-09-02',
    isActive: true
  },
  {
    id: 'schedule-5',
    subjectId: 'ai-4',
    startTime: '10:00',
    endTime: '11:00',
    date: '2025-09-03',
    isActive: true
  }
];

export const students: Student[] = [
  { id: '1', rollNumber: 'CSE2021001', name: 'John Doe', year: 1, department: 'CSE' },
  { id: '2', rollNumber: 'CSE2020001', name: 'Jane Smith', year: 2, department: 'CSE' },
  { id: '3', rollNumber: 'CSE2019001', name: 'Bob Johnson', year: 3, department: 'CSE' },
  { id: '4', rollNumber: 'CSE2018001', name: 'Alice Brown', year: 4, department: 'CSE' },
];

// Admin credentials
export const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};