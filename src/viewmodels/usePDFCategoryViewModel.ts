
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PDFCategory, SOPCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const usePDFCategoryViewModel = () => {
  const [categories, setCategories] = useState<PDFCategory[]>([]);
  const [sopCategories, setSopCategories] = useState<SOPCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userProfile?.organizationId) {
        console.log("No organization ID available", userProfile);
        setIsLoading(false);
        return;
      }

      console.log("Fetching categories with organizationId:", userProfile.organizationId);
      setIsLoading(true);
      try {
        // Fetch SOP categories
        const sopCategoriesQuery = query(
          collection(db, 'sopCategories'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const sopCategoriesSnapshot = await getDocs(sopCategoriesQuery);
        console.log("SOP categories found:", sopCategoriesSnapshot.docs.length);
        
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
        console.log("PDF documents found:", pdfSnapshot.docs.length);
        
        const pdfData = pdfSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamp to JavaScript Date if exists
          return {
            id: doc.id,
            ...data,
            uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
          };
        }) as PDFCategory[];
        
        setCategories(pdfData);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        toast.error("Failed to load SOP categories. Please try again.");
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
      
      toast.success("PDF deleted successfully");
      return true;
    } catch (err) {
      console.error('Error deleting PDF:', err);
      toast.error("Failed to delete PDF. Please try again.");
      throw err;
    }
  };

  const refreshCategories = () => {
    setIsLoading(true);
    setError(null);
    // Force a refetch by changing the dependency that the useEffect watches
    if (userProfile?.organizationId) {
      // This will trigger the useEffect to run again
      const fetchData = async () => {
        try {
          // Fetch SOP categories
          const sopCategoriesQuery = query(
            collection(db, 'sopCategories'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const sopCategoriesSnapshot = await getDocs(sopCategoriesQuery);
          console.log("SOP categories refreshed:", sopCategoriesSnapshot.docs.length);
          
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
          console.log("PDF documents refreshed:", pdfSnapshot.docs.length);
          
          const pdfData = pdfSnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamp to JavaScript Date if exists
            return {
              id: doc.id,
              ...data,
              uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
            };
          }) as PDFCategory[];
          
          setCategories(pdfData);
          toast.success("SOP list refreshed");
        } catch (err) {
          console.error('Error refreshing categories:', err);
          setError(err instanceof Error ? err : new Error('Failed to refresh categories'));
          toast.error("Failed to refresh SOPs. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  };

  return {
    categories,
    sopCategories,
    isLoading,
    error,
    deletePDF,
    selectedCategory,
    setSelectedCategory,
    refreshCategories
  };
};
