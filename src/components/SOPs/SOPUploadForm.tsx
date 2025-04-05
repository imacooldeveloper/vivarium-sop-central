
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePDFUploadViewModel } from '@/viewmodels/usePDFUploadViewModel';
import { FileUp, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SOPUploadFormProps {
  onUploadComplete: () => void;
}

export const SOPUploadForm = ({ onUploadComplete }: SOPUploadFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const { uploadPDF, isUploading, uploadProgress } = usePDFUploadViewModel();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    try {
      await uploadPDF(
        pdfFile,
        pdfName,
        '', // No quiz category ID for now
        categoryName,
        subcategoryTitle
      );
      
      // Reset form after successful upload
      setPdfFile(null);
      setPdfName('');
      setCategoryName('');
      setSubcategoryTitle('');
      
      // Notify parent component
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
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
  );
};
