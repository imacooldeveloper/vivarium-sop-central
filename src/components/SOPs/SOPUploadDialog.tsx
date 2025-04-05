
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SOPCategory } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePDFUploadViewModel } from '@/viewmodels/usePDFUploadViewModel';
import { useToast } from '@/hooks/use-toast';

interface SOPUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: SOPCategory[];
}

const SOPUploadDialog: React.FC<SOPUploadDialogProps> = ({
  open,
  onOpenChange,
  categories,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { uploadPDF } = usePDFUploadViewModel();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !pdfTitle || !selectedCategory || !subcategory) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
      
      if (!selectedCategoryObj) {
        throw new Error("Selected category not found");
      }

      await uploadPDF(
        selectedFile, 
        pdfTitle,
        selectedCategory,
        selectedCategoryObj.nameOfCategory, 
        subcategory
      );

      toast({
        title: "SOP Uploaded",
        description: "Your SOP has been successfully uploaded.",
      });
      
      // Reset form and close dialog
      setSelectedFile(null);
      setPdfTitle('');
      setSubcategory('');
      setSelectedCategory('');
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your SOP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload New SOP</DialogTitle>
            <DialogDescription>
              Upload a PDF file and add relevant details for your new SOP.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">PDF File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">SOP Title</Label>
              <Input
                id="title"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="Enter SOP title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameOfCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="Enter subcategory"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload SOP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SOPUploadDialog;
