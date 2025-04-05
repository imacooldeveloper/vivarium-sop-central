
import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { usePDFCategoryViewModel } from "@/viewmodels/usePDFCategoryViewModel";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { PDFCategory } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/Admin/CategoryManager";
import { PDFViewer } from "@/components/Admin/PDFViewer";
import { QuizAssignmentForm, QuizFormData } from "@/components/Admin/QuizAssignmentForm";
import { toast } from "sonner";

const Admin = () => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const { categories, sopCategories, isLoading, error, deletePDF, refreshCategories } = usePDFCategoryViewModel();
  
  const [selectedPDF, setSelectedPDF] = useState<PDFCategory | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizTargetCategory, setQuizTargetCategory] = useState<string>('');
  const [quizTargetSubcategory, setQuizTargetSubcategory] = useState<string>('');

  const handleSelectPDF = (pdf: PDFCategory) => {
    setSelectedPDF(pdf);
  };

  const handleDeletePDF = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this SOP?")) {
      try {
        await deletePDF(id);
        if (selectedPDF?.id === id) {
          setSelectedPDF(null);
        }
      } catch (error) {
        console.error("Failed to delete PDF:", error);
      }
    }
  };

  const handleAddQuiz = (categoryId: string, subcategory: string) => {
    setQuizTargetCategory(categoryId);
    setQuizTargetSubcategory(subcategory);
    setQuizDialogOpen(true);
  };

  const handleAssignQuiz = async (quizData: QuizFormData) => {
    try {
      console.log("Quiz assignment data:", quizData);
      // Here you would implement the Firebase logic to save the quiz
      // This is a placeholder for the actual implementation
      
      toast.success("Quiz assigned successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Error assigning quiz:", error);
      toast.error("Failed to assign quiz.");
      return Promise.reject(error);
    }
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
              You need to be part of an organization to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <Button 
            variant="outline" 
            onClick={refreshCategories}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${selectedPDF ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <CategoryManager 
              sopCategories={sopCategories}
              pdfDocuments={categories}
              onSelectPDF={handleSelectPDF}
              onDeletePDF={handleDeletePDF}
              onAddQuiz={handleAddQuiz}
            />
          </div>
          
          {selectedPDF && (
            <div className="lg:col-span-5">
              <PDFViewer 
                pdf={selectedPDF}
                onClose={() => setSelectedPDF(null)}
              />
            </div>
          )}
        </div>
      </div>
      
      <QuizAssignmentForm 
        open={quizDialogOpen}
        onOpenChange={setQuizDialogOpen}
        categoryId={quizTargetCategory}
        subcategory={quizTargetSubcategory}
        onAssignQuiz={handleAssignQuiz}
      />
      
      <Toaster />
    </MainLayout>
  );
};

export default Admin;
