
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Default Firebase configuration with placeholder values that will be overridden
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAkn1v3v1SrzKGLtRysew35rXjIpKm44vU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vivarium-sop-central.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vivarium-sop-central",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vivarium-sop-central.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "790385589295",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:790385589295:web:4325ce0b8b9a5e170ea613"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only if supported (prevents errors in environments that don't support it)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Now also fix the type errors in CreateFolderDialog.tsx
<lov-write file_path="src/components/SOPs/CreateFolderDialog.tsx">
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderCreated: () => void;
}

const CreateFolderDialog = ({ open, onOpenChange, onFolderCreated }: CreateFolderDialogProps) => {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile?.organizationId) {
      toast({
        title: "Organization required",
        description: "You must be part of an organization to create folders",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Add the new folder to Firestore
      await addDoc(collection(db, 'sopFolders'), {
        name: folderName.trim(),
        organizationId: userProfile.organizationId,
        createdBy: userProfile.id, // Fixed - use id instead of uid
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Folder created",
        description: `Folder "${folderName}" has been created successfully`,
      });

      // Reset form and close dialog
      setFolderName('');
      
      // Notify parent component
      onFolderCreated();
      
      // Add a small delay before closing to show success message
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        title: "Error creating folder",
        description: "There was a problem creating the folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateFolder}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your SOPs
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folderName" className="text-right">
                Folder Name
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-3"
                placeholder="Enter folder name"
                disabled={isCreating}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !folderName.trim()}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Folder"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
