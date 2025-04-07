
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePDFUploadViewModel } from '@/viewmodels/usePDFUploadViewModel';
import { FileUp, Loader2, FolderPlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder } from '@/types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import CreateFolderDialog from './CreateFolderDialog';

interface SOPUploadFormProps {
  onUploadComplete: () => void;
}

export const SOPUploadForm = ({ onUploadComplete }: SOPUploadFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [folderId, setFolderId] = useState<string>('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const { uploadPDF, isUploading, uploadProgress } = usePDFUploadViewModel();
  const { userProfile } = useAuth();

  // Fetch folders when component mounts
  useEffect(() => {
    const fetchFolders = async () => {
      if (!userProfile?.organizationId) return;
      
      try {
        const q = query(
          collection(db, 'sopFolders'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const querySnapshot = await getDocs(q);
        const folderList: Folder[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Folder[];
        
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
        toast.error("Failed to load folders");
      }
    };

    fetchFolders();
  }, [userProfile?.organizationId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      // If no name is entered yet, use the filename (without extension)
      if (!pdfName) {
        const filename = file.name.replace(/\.[^/.]+$/, "");
        setPdfName(filename);
      }
    }
  };

  const handleFolderCreated = () => {
    // Refetch folders after creating a new one
    const fetchFolders = async () => {
      if (!userProfile?.organizationId) return;
      
      try {
        const q = query(
          collection(db, 'sopFolders'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const querySnapshot = await getDocs(q);
        const folderList: Folder[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Folder[];
        
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    try {
      await uploadPDF(
        pdfFile,
        pdfName,
        '', // No quiz category ID for now
        categoryName,
        subcategoryTitle,
        folderId // Pass the selected folder ID
      );
      
      // Reset form after successful upload
      setPdfFile(null);
      setPdfName('');
      setCategoryName('');
      setSubcategoryTitle('');
      setFolderId('');
      
      // Notify parent component
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Upload SOP Document</CardTitle>
            <CardDescription>
              Upload a PDF file for your standard operating procedure.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="pdfFile">PDF File</Label>
              <Input 
                id="pdfFile" 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {pdfFile.name} ({Math.round(pdfFile.size / 1024)} KB)
                </p>
              )}
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="pdfName">Document Title</Label>
              <Input 
                id="pdfName" 
                value={pdfName} 
                onChange={(e) => setPdfName(e.target.value)}
                placeholder="e.g., Mouse Handling Protocol"
                disabled={isUploading}
              />
            </div>

            <div className="grid w-full gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="folder">Folder</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => setCreateFolderDialogOpen(true)}
                >
                  <FolderPlus className="h-3.5 w-3.5 mr-1" />
                  New Folder
                </Button>
              </div>
              <Select
                value={folderId} 
                onValueChange={setFolderId}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No folder (Root)</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="categoryName">Category</Label>
              <Input 
                id="categoryName" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Animal Handling"
                disabled={isUploading}
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="subcategoryTitle">Description</Label>
              <Textarea 
                id="subcategoryTitle" 
                value={subcategoryTitle} 
                onChange={(e) => setSubcategoryTitle(e.target.value)}
                placeholder="Brief description of this SOP document"
                disabled={isUploading}
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              disabled={!pdfFile || !pdfName || !categoryName || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload SOP
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <CreateFolderDialog 
        open={createFolderDialogOpen} 
        onOpenChange={setCreateFolderDialogOpen} 
        onFolderCreated={handleFolderCreated}
      />
    </>
  );
};
