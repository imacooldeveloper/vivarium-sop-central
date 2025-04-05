
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { usePDFCategoryViewModel } from "@/viewmodels/usePDFCategoryViewModel";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SOPList } from "@/components/SOPs/SOPList";
import { SOPUploadForm } from "@/components/SOPs/SOPUploadForm";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SOPs = () => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const { categories, isLoading, error, deletePDF, refreshCategories } = usePDFCategoryViewModel();
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.organizationId) {
      console.log("User organization ID:", userProfile.organizationId);
    }
  }, [userProfile]);

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

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
          <p>Loading user data...</p>
        </div>
      </MainLayout>
    );
  }

  // Show message if user is not part of an organization
  if (!authLoading && (!userProfile || !userProfile.organizationId)) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Required</AlertTitle>
            <AlertDescription>
              You need to be part of an organization to view SOPs. Please contact your administrator.
            </AlertDescription>
          </Alert>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Organization Access</h2>
            <p className="text-gray-600">
              Your user account is not associated with any organization.
              {currentUser && <span> Current UID: {currentUser.uid}</span>}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
