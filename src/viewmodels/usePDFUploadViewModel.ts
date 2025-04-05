
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const usePDFUploadViewModel = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const { userProfile } = useAuth();

  const uploadPDF = async (
    file: File,
    pdfName: string,
    quizCategoryID: string,
    categoryName: string,
    subcategoryTitle: string
  ) => {
    if (!userProfile?.organizationId) {
      console.error('No organization ID available', userProfile);
      throw new Error('No organization ID available');
    }

    console.log("Starting upload with organizationId:", userProfile.organizationId);
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `pdfs/${userProfile.organizationId}/${Date.now()}_${file.name}`);
      console.log("Storage ref created");
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("File uploaded successfully");
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log("Download URL obtained:", downloadURL);
      
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
      });
      
      console.log("Document added to Firestore with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadError(error instanceof Error ? error : new Error('Failed to upload PDF'));
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadPDF,
    isUploading,
    uploadError
  };
};
