
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PDFCategory, SOPCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const usePDFCategoryViewModel = () => {
  const [categories, setCategories] = useState<PDFCategory[]>([]);
  const [sopCategories, setSopCategories] = useState<SOPCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userProfile?.organizationId) return;

      setIsLoading(true);
      try {
        // Fetch SOP categories
        const sopCategoriesQuery = query(
          collection(db, 'sopCategories'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const sopCategoriesSnapshot = await getDocs(sopCategoriesQuery);
        const sopCategoriesData = sopCategoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SOPCategory[];
        
        setSopCategories(sopCategoriesData);
        
        // Fetch PDF documents
        const pdfQuery = query(
          collection(db, 'pdfCategories'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const pdfSnapshot = await getDocs(pdfQuery);
        const pdfData = pdfSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PDFCategory[];
        
        setCategories(pdfData);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userProfile?.organizationId]);

  const deletePDF = async (pdfId: string) => {
    try {
      // Get the PDF document to access its URL
      const pdfDoc = categories.find(pdf => pdf.id === pdfId);
      
      if (!pdfDoc || !pdfDoc.pdfURL) {
        throw new Error('PDF not found or has no URL');
      }
      
      // First, delete the file from Storage
      const storageRef = ref(storage, pdfDoc.pdfURL);
      await deleteObject(storageRef);
      
      // Then delete the document from Firestore
      await deleteDoc(doc(db, 'pdfCategories', pdfId));
      
      // Update local state
      setCategories(prev => prev.filter(pdf => pdf.id !== pdfId));
      
      return true;
    } catch (err) {
      console.error('Error deleting PDF:', err);
      throw err;
    }
  };

  return {
    categories,
    sopCategories,
    isLoading,
    error,
    deletePDF,
    selectedCategory,
    setSelectedCategory
  };
};
