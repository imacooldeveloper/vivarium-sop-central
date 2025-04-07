
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export const useCreateFolder = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { userProfile } = useAuth();

  const createFolder = async (folderName: string) => {
    if (!userProfile?.organizationId) {
      throw new Error('No organization ID available');
    }

    setIsCreating(true);
    
    try {
      await addDoc(collection(db, 'sopFolders'), {
        name: folderName,
        organizationId: userProfile.organizationId,
        createdBy: userProfile.id,
        createdAt: serverTimestamp(),
      });
      
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
