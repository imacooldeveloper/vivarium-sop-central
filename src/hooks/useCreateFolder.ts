
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useCreateFolder = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { userProfile } = useAuth();

  const createFolder = async (folderName: string) => {
    if (!userProfile?.organizationId) {
      toast.error('No organization ID available');
      throw new Error('No organization ID available');
    }

    setIsCreating(true);
    
    try {
      // Check if folder with same name exists
      const existingFoldersQuery = query(
        collection(db, 'sopFolders'),
        where('name', '==', folderName),
        where('organizationId', '==', userProfile.organizationId)
      );
      
      const existingFolders = await getDocs(existingFoldersQuery);
      
      if (!existingFolders.empty) {
        toast.error('Folder with this name already exists');
        throw new Error('Folder with this name already exists');
      }
      
      // Create the folder
      const newFolderRef = await addDoc(collection(db, 'sopFolders'), {
        name: folderName,
        organizationId: userProfile.organizationId,
        createdBy: userProfile.id,
        createdAt: serverTimestamp(),
      });
      
      console.log("Created folder with ID:", newFolderRef.id);
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createFolder,
    isCreating
  };
};
