
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp, DocumentData } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { PDFCategory, SOPCategory, Folder } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const usePDFCategoryViewModel = () => {
  const [categories, setCategories] = useState<PDFCategory[]>([]);
  const [sopCategories, setSopCategories] = useState<SOPCategory[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userProfile?.organizationId) {
        console.log("No organization ID available", userProfile);
        setDebugInfo({
          error: "No organization ID available",
          userProfile
        });
        setIsLoading(false);
        return;
      }

      console.log("Fetching categories with organizationId:", userProfile.organizationId);
      setIsLoading(true);
      
      try {
        // Debug info object to collect data about the fetch process
        const debug = {
          organizationId: userProfile.organizationId,
          collections: {
            sopCategories: {
              attempted: true,
              count: 0,
              error: null
            },
            pdfCategories: {
              attempted: true,
              count: 0,
              error: null,
              results: []
            },
            sopFolders: {
              attempted: true,
              count: 0,
              error: null
            }
          }
        };
        
        // Fetch SOP categories from "sopCategories" collection
        try {
          const sopCategoriesQuery = query(
            collection(db, 'sopCategories'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const sopCategoriesSnapshot = await getDocs(sopCategoriesQuery);
          console.log("SOP categories found (sopCategories):", sopCategoriesSnapshot.docs.length);
          
          const sopCategoriesData = sopCategoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as SOPCategory[];
          
          debug.collections.sopCategories.count = sopCategoriesSnapshot.docs.length;
          setSopCategories(sopCategoriesData);
        } catch (err) {
          console.error('Error fetching from sopCategories:', err);
          debug.collections.sopCategories.error = err instanceof Error ? err.message : String(err);
        }
        
        // Fetch SOP folders
        try {
          const foldersQuery = query(
            collection(db, 'sopFolders'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const foldersSnapshot = await getDocs(foldersQuery);
          console.log("Folders found:", foldersSnapshot.docs.length);
          
          const foldersData = foldersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Folder[];
          
          debug.collections.sopFolders.count = foldersSnapshot.docs.length;
          setFolders(foldersData);
          
          if (foldersSnapshot.docs.length > 0) {
            console.log("Sample folder data:", foldersSnapshot.docs[0].data());
          } else {
            // Try alternative collection name if no results
            const altFoldersQuery = query(
              collection(db, 'SOPFolders'),
              where('organizationId', '==', userProfile.organizationId)
            );
            const altFoldersSnapshot = await getDocs(altFoldersQuery);
            
            if (altFoldersSnapshot.docs.length > 0) {
              const altFoldersData = altFoldersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Folder[];
              
              setFolders(altFoldersData);
              console.log("Found folders in alternative collection:", altFoldersSnapshot.docs.length);
            }
          }
        } catch (err) {
          console.error('Error fetching folders:', err);
          debug.collections.sopFolders.error = err instanceof Error ? err.message : String(err);
        }
        
        // Array to collect all PDF documents from different collections
        let allPdfs: PDFCategory[] = [];
        
        // Fetch PDF documents from "pdfCategories" collection
        try {
          const pdfQuery = query(
            collection(db, 'pdfCategories'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const pdfSnapshot = await getDocs(pdfQuery);
          console.log("PDF documents found (pdfCategories):", pdfSnapshot.docs.length);
          
          if (pdfSnapshot.docs.length > 0) {
            console.log("Sample PDF data:", pdfSnapshot.docs[0].data());
          }
          
          const pdfData = pdfSnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamp to JavaScript Date if exists
            return {
              id: doc.id,
              ...data,
              uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
            };
          }) as PDFCategory[];
          
          debug.collections.pdfCategories.count = pdfSnapshot.docs.length;
          debug.collections.pdfCategories.results = pdfSnapshot.docs.map(doc => doc.data());
          
          allPdfs = [...allPdfs, ...pdfData];
        } catch (err) {
          console.error('Error fetching from pdfCategories:', err);
          debug.collections.pdfCategories.error = err instanceof Error ? err.message : String(err);
        }
        
        // Fetch PDF documents from "PDFCategory" collection (alternative casing)
        try {
          const pdfQueryAlt = query(
            collection(db, 'PDFCategory'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const pdfSnapshotAlt = await getDocs(pdfQueryAlt);
          console.log("PDF documents found (PDFCategory):", pdfSnapshotAlt.docs.length);
          
          if (pdfSnapshotAlt.docs.length > 0) {
            console.log("Sample PDF data from PDFCategory:", pdfSnapshotAlt.docs[0].data());
            
            // Try the exact search with different field cases
            const testQuery = query(
              collection(db, 'PDFCategory'),
              where('organizationID', '==', userProfile.organizationId)
            );
            const testSnapshot = await getDocs(testQuery);
            console.log("Test with 'organizationID' (capital ID):", testSnapshot.docs.length);
          }
          
          const pdfDataAlt = pdfSnapshotAlt.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
            };
          }) as PDFCategory[];
          
          debug.collections.pdfCategories.count += pdfSnapshotAlt.docs.length;
          allPdfs = [...allPdfs, ...pdfDataAlt];
        } catch (err) {
          console.error('Error fetching from PDFCategory:', err);
        }

        // Last attempt - try with no filters to see if collection exists and has documents
        if (allPdfs.length === 0) {
          try {
            const pdfQueryNoFilter = query(collection(db, 'PDFCategory'));
            const pdfSnapshotNoFilter = await getDocs(pdfQueryNoFilter);
            console.log("PDF documents total (no filter):", pdfSnapshotNoFilter.docs.length);
            
            if (pdfSnapshotNoFilter.docs.length > 0) {
              // Check what organizationId values exist in the collection
              const orgIds = new Set(pdfSnapshotNoFilter.docs.map(doc => {
                const data = doc.data();
                return data.organizationId || data.organizationID;
              }));
              console.log("Available organizationIds in PDFCategory:", Array.from(orgIds));
              
              // Try to match PDFs with current organization even if field name differs
              const matchingPdfs = pdfSnapshotNoFilter.docs
                .filter(doc => {
                  const data = doc.data();
                  return (data.organizationId === userProfile.organizationId || 
                          data.organizationID === userProfile.organizationId);
                })
                .map(doc => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    ...data,
                    uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt,
                    // Ensure organizationId is correctly set
                    organizationId: userProfile.organizationId
                  };
                });
              
              if (matchingPdfs.length > 0) {
                console.log("Found matching PDFs with flexible organizationId field:", matchingPdfs.length);
                allPdfs = [...allPdfs, ...matchingPdfs];
              }
            }
          } catch (err) {
            console.error('Error fetching from PDFCategory with no filter:', err);
          }
        }
        
        // Set all collected PDFs to state
        setCategories(allPdfs);
        
        // Set debug info
        setDebugInfo(debug);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        setDebugInfo({error: err instanceof Error ? err.message : String(err)});
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
          // The fetchCategories logic is already in the useEffect
          // This is a bit of duplication, but for simplicity we'll repeat it
          const debug: any = {
            organizationId: userProfile.organizationId,
            collections: {
              sopCategories: { attempted: true, count: 0, error: null },
              pdfCategories: { attempted: true, count: 0, error: null, results: [] },
              refreshTriggered: true
            }
          };
          
          // Fetch folders first
          try {
            const foldersQuery = query(
              collection(db, 'sopFolders'),
              where('organizationId', '==', userProfile.organizationId)
            );
            
            const foldersSnapshot = await getDocs(foldersQuery);
            console.log("Folders refreshed:", foldersSnapshot.docs.length);
            
            const foldersData = foldersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Folder[];
            
            setFolders(foldersData);
          } catch (err) {
            console.error('Error refreshing folders:', err);
          }
          
          // Just try PDFCategory this time for simplicity in the refresh
          const pdfQueryAlt = query(
            collection(db, 'pdfCategories'),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const pdfSnapshotAlt = await getDocs(pdfQueryAlt);
          console.log("PDF documents refreshed:", pdfSnapshotAlt.docs.length);
          
          const pdfDataAlt = pdfSnapshotAlt.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
            };
          }) as PDFCategory[];
          
          setCategories(pdfDataAlt);
          debug.collections.pdfCategories.count = pdfSnapshotAlt.docs.length;
          
          // Try with organizationID capitalized if no results
          if (pdfSnapshotAlt.docs.length === 0) {
            const testQuery = query(
              collection(db, 'PDFCategory'),
              where('organizationID', '==', userProfile.organizationId)
            );
            const testSnapshot = await getDocs(testQuery);
            console.log("Refresh: Test with 'organizationID' (capital ID):", testSnapshot.docs.length);
            
            if (testSnapshot.docs.length > 0) {
              const capitalizedData = testSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  ...data,
                  uploadedAt: data.uploadedAt instanceof Timestamp ? data.uploadedAt.toDate() : data.uploadedAt
                };
              }) as PDFCategory[];
              
              setCategories(capitalizedData);
              debug.collections.pdfCategories.count = testSnapshot.docs.length;
              debug.hasCapitalizedIDField = true;
            }
          }
          
          setDebugInfo(debug);
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
    folders,
    isLoading,
    error,
    deletePDF,
    selectedCategory,
    setSelectedCategory,
    refreshCategories,
    debugInfo
  };
};
