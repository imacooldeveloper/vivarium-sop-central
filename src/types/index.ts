export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  organizationId: string;
  role: string;
}

export interface SOPCategory {
  id: string;
  nameOfCategory: string;
  organizationId: string;
  createdBy: string;
  createdAt: any; // Timestamp
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
}
