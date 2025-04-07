
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  organizationId: string;
  role: string;
  accountType?: string;
  quizScores?: any[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organizationId?: string;
  accountType?: string;
  quizScores?: any[];
  userEmail?: string;
  userUID?: string;
  facilityName?: string;
  username?: string;
}

export interface SOPCategory {
  id: string;
  nameOfCategory: string;
  organizationId: string;
  createdBy: string;
  createdAt: any; // Timestamp
  SOPForStaffTittle?: string; // Fixed property to match existing references
}

// Adding folder type
export interface Folder {
  id: string;
  name: string;
  organizationId: string;
  createdBy: string;
  createdAt: any; // Timestamp
}

export interface PDFCategory {
  id: string;
  nameOfCategory: string;
  SOPForStaffTittle: string;
  subcategory?: string;
  pdfName: string;
  pdfURL: string;
  quizCategoryID: string;
  organizationId: string;
  uploadedBy: string;
  uploadedAt: any;
  folderId?: string | null;
  categoryId?: string; // Added for CategoryManager compatibility
  fileName?: string;
  fileUrl?: string;
  title?: string;
  uploadedByName?: string;
}

// Updated Quiz type for components that reference it
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  questions?: QuizQuestion[];
  createdBy?: string;
  createdAt?: any;
  status?: 'draft' | 'published' | 'completed';
  score?: number;
  totalQuestions?: number;
  timeLimit?: number;
  passingScore?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastUpdated?: any;
  organizationId?: string;
  assignedTo?: string[];
  dueDate?: any;
  isRequired?: boolean;
  categoryId?: string;
  // Added for compatibility with current implementation
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
  // Added for compatibility with current implementation
  question?: string;
  correctAnswerIndex?: number;
}

export interface QuizOption {
  id: string;
  text: string;
}
