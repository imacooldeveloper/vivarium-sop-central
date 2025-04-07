
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const usePDFUploadViewModel = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { userProfile } = useAuth();

  const uploadPDF = async (
    file: File,
    pdfName: string,
    quizCategoryID: string,
    categoryName: string,
    subcategoryTitle: string,
    folderId?: string
  ) => {
    if (!userProfile?.organizationId) {
      console.error('No organization ID available', userProfile);
      toast.error('No organization ID available. Please log in again.');
      throw new Error('No organization ID available');
    }

    console.log("Starting upload with organizationId:", userProfile.organizationId);
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
    try {
      // Validate file is actually a PDF
      if (file.type !== 'application/pdf') {
        throw new Error('Selected file is not a PDF');
      }

      // Create a unique filename with timestamp
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      
      // Create a reference to the storage location
      const storageRef = ref(storage, `pdfs/${userProfile.organizationId}/${filename}`);
      console.log("Storage ref created");

      // Show initial progress
      setUploadProgress(10);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("File uploaded successfully");
      
      // Update progress
      setUploadProgress(50);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log("Download URL obtained:", downloadURL);
      
      // Update progress
      setUploadProgress(80);
      
      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'pdfCategories'), {
        nameOfCategory: categoryName,
        SOPForStaffTittle: subcategoryTitle,
        pdfName: pdfName,
        pdfURL: downloadURL,
        quizCategoryID: quizCategoryID || null, // Make it nullable if not provided
        organizationId: userProfile.organizationId,
        uploadedBy: userProfile.id,
        uploadedAt: serverTimestamp(), // Use server timestamp for consistency
        folderId: folderId || null, // Store the folder ID if provided
      });
      
      console.log("Document added to Firestore with ID:", docRef.id);
      setUploadProgress(100);
      
      toast.success("PDF uploaded successfully!");
      return docRef.id;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadError(error instanceof Error ? error : new Error('Failed to upload PDF'));
      toast.error("Failed to upload PDF. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadPDF,
    isUploading,
    uploadError,
    uploadProgress
  };
};
