
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Folder } from "@/types";

interface SOPUploadFormProps {
  folders: Folder[];
  onUploadComplete: () => void;
}

export function SOPUploadForm({ folders, onUploadComplete }: SOPUploadFormProps) {
  const [title, setTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    // Prevent form submission which might cause page reload or dialog close
    e.preventDefault();
    
    if (!file || !title || !selectedFolder || !userProfile) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique file path in Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(storage, `sops/${selectedFolder}/${timestamp}_${file.name}`);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      // Add document to Firestore
      await addDoc(collection(db, "pdfCategories"), {
        title,
        pdfName: file.name,
        fileName: file.name,
        folderId: selectedFolder,
        fileUrl: downloadURL,
        pdfURL: downloadURL,
        uploadedBy: userProfile.id,
        uploadedByName: userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}` : userProfile.email,
        organizationId: userProfile.organizationId,
        createdAt: serverTimestamp(),
        uploadedAt: serverTimestamp(),
        nameOfCategory: folders.find(folder => folder.id === selectedFolder)?.name || "Unknown Category",
        SOPForStaffTittle: title,
      });

      toast({
        title: "SOP uploaded successfully",
        description: "Your SOP has been uploaded and is now available",
      });

      // Reset form
      setTitle("");
      setSelectedFolder("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Notify parent component
      onUploadComplete();
    } catch (error) {
      console.error("Error uploading SOP:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your SOP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload New SOP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">SOP Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter SOP title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder">Select Folder</Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder} required>
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.length > 0 ? (
                  folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-folders" disabled>
                    No folders available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {folders.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                You need to create a folder before uploading SOPs.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">PDF File</Label>
            <Input
              id="file"
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name}
              </p>
            )}
          </div>
          
          <Button 
            type="submit"
            disabled={uploading || !file || !title || !selectedFolder || folders.length === 0}
            className="w-full"
          >
            {uploading ? (
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
        </CardContent>
      </Card>
    </form>
  );
}
