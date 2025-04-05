
export type UserRole = 'Admin' | 'Supervisor' | 'Husbandry' | 'Vet Services';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  facilityName: string;
  username: string;
  userUID: string;
  userEmail: string;
  accountType: UserRole;
  assignedCategoryIDs?: string[];
  quizScores?: UserQuizScore[];
  assignedFloors?: string[];
  organizationId: string;
  lastActivityDate?: Date; // Firestore Timestamp converted to Date
}

export interface UserQuizScore {
  quizID: string;
  scores: number[];
  completionDates: Date[]; // Firestore Timestamp converted to Date
  dueDates?: Record<string, Date | null>; // Firestore Timestamp converted to Date
  nextRenewalDates?: Record<string, Date | null>; // Firestore Timestamp converted to Date
  acknowledgmentStatus?: {
    acknowledged: boolean;
    acknowledgedDate: Date; // Firestore Timestamp converted to Date
    readingTime?: number;
    signature?: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  quizPassingThreshold: number;
  defaultQuizExpiryDays: number;
  allowQuizRetakes: boolean;
  maxQuizAttempts?: number;
  requirePDFReview: boolean;
  minimumPDFViewTime: number;
  allowPDFDownload: boolean;
  allowedAccountTypes: string[];
  defaultFloor: string;
  requireNHPCertification: boolean;
  organizationName: string;
  organizationLogo?: string;
  primaryColor: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  type: 'Research' | 'Vivarium' | 'Clinical' | 'Mixed Use';
  maxBioSafetyLevel: 1 | 2 | 3 | 4;
  address: string;
  notes?: string;
  isActive: boolean;
  organizationId: string;
  // floors removed as they should be stored in their own collection
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  sections: string[];
  isRestricted: boolean;
  buildingId: string; // Reference to parent building
  organizationId: string;
}

export interface PDFCategory {
  id: string;
  nameOfCategory: string;
  SOPForStaffTittle: string;
  pdfName: string;
  pdfURL?: string;
  quizCategoryID?: string; // Optional - only if this PDF has a quiz linked
  organizationId: string;
  uploadedBy?: string; // Firebase UID of user who uploaded
  uploadedAt?: Date; // Firestore Timestamp converted to Date
}

export interface SOPCategory {
  id: string;
  nameOfCategory: string;
  SOPForStaffTittle: string;
  sopPages?: string;
  organizationId: string;
}

export interface Quiz {
  id: string;
  info: {
    title: string;
    description: string;
    peopleAttended?: number;
    rules?: string[];
  };
  quizCategory: string;
  quizCategoryID: string;
  organizationId: string;
  verificationType: 'quiz' | 'acknowledgment' | 'both';
  acknowledgmentText?: string;
  questions?: Question[];
  dateCreated?: Date; // Firestore Timestamp converted to Date
  dueDate?: Date; // Firestore Timestamp converted to Date
  renewalFrequency?: 'quarterly' | 'yearly' | 'custom';
  nextRenewalDates?: Date; // Firestore Timestamp converted to Date
  customRenewalDate?: Date; // Firestore Timestamp converted to Date
  acknowledgmentMetadata?: {
    requiredReadingTime?: number;
    acknowledgmentStatement: string;
    additionalNotes?: string;
    requireSignature: boolean;
  };
}

export interface Question {
  questionText: string;
  options: string[];
  answer: string;
}
