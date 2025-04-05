
import React, { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { usePDFCategoryViewModel } from "@/viewmodels/usePDFCategoryViewModel";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SOPList } from "@/components/SOPs/SOPList";
import { SOPUploadForm } from "@/components/SOPs/SOPUploadForm";
import { Toaster } from "@/components/ui/toaster";

const SOPs = () => {
  const { categories, isLoading, error, deletePDF, refreshCategories } = usePDFCategoryViewModel();
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  const handleDeletePDF = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this SOP?")) {
      try {
        await deletePDF(id);
      } catch (error) {
        console.error("Failed to delete PDF:", error);
      }
    }
  };

  const handleUploadComplete = () => {
    setUploadSheetOpen(false);
    refreshCategories();
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
          
          <Sheet open={uploadSheetOpen} onOpenChange={setUploadSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Upload SOP
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader className="mb-4">
                <SheetTitle>Upload New SOP</SheetTitle>
                <SheetDescription>
                  Add a new standard operating procedure document to your organization.
                </SheetDescription>
              </SheetHeader>
              <SOPUploadForm onUploadComplete={handleUploadComplete} />
            </SheetContent>
          </Sheet>
        </div>

        <SOPList 
          categories={categories}
          isLoading={isLoading}
          error={error}
          onDelete={handleDeletePDF}
          onRefresh={refreshCategories}
        />
      </div>
      <Toaster />
    </MainLayout>
  );
};

export default SOPs;
