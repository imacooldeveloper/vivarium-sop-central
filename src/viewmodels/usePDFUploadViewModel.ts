
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const usePDFUploadViewModel = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { userProfile } = useAuth();

  const uploadPDF = async (
    file: File,
    pdfName: string,
    quizCategoryID: string,
    categoryName: string,
    subcategoryTitle: string
  ) => {
    if (!userProfile?.organizationId) {
      throw new Error('No organization ID available');
    }

    setIsUploading(true);
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `pdfs/${userProfile.organizationId}/${Date.now()}_${file.name}`);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
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
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadPDF,
    isUploading
  };
};
