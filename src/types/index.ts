
export interface User {
  id: string;
  userUID: string; // Firebase UID
  organizationId: string;
  firstName: string;
  lastName: string;
  username: string;
  userEmail: string;
  facilityName: string;
  accountType: "Admin" | "Husbandry" | "Supervisor" | "Veterinarian";
  quizScores?: {
    quizId: string;
    score: number;
    passed: boolean;
    completedAt: Date;
  }[];
}

export interface SOPCategory {
  id: string;
  nameOfCategory: string;
  organizationId: string;
  SOPForStaffTittle?: string;
  sopPages?: string;
}

export interface PDFCategory {
  id: string;
  nameOfCategory: string;
  organizationId: string;
  pdfName: string;
  pdfURL: string;
  categoryId?: string;
  subcategory?: string;
  uploadedAt?: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategory: string;
  organizationId: string;
  passingScore: number;
  timeLimit: number;
  isRequired: boolean;
  createdAt: Date;
  createdBy: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  answers: {
    questionId: string;
    selectedAnswerIndex: number;
    isCorrect: boolean;
  }[];
}
