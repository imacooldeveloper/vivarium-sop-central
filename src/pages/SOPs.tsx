
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { usePDFCategoryViewModel } from "@/viewmodels/usePDFCategoryViewModel";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Folder, FolderPlus, Plus, RefreshCw } from "lucide-react";
import { SOPUploadForm } from "@/components/SOPs/SOPUploadForm";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PDFCategory, Folder as FolderType } from '@/types';
import SOPFolder from "@/components/SOPs/SOPFolder";
import CreateFolderDialog from "@/components/SOPs/CreateFolderDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EmptyState from "@/components/Quizzes/EmptyState";

const SOPs = () => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const { categories, isLoading, error, deletePDF, refreshCategories } = usePDFCategoryViewModel();
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<PDFCategory | null>(null);
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");

  // Fetch folders when component mounts or refreshes
  useEffect(() => {
    const fetchFolders = async () => {
      if (!userProfile?.organizationId) return;
      
      setIsLoadingFolders(true);
      try {
        const q = query(
          collection(db, 'sopFolders'),
          where('organizationId', '==', userProfile.organizationId)
        );
        
        const querySnapshot = await getDocs(q);
        const folderList: FolderType[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FolderType[];
        
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [userProfile?.organizationId, categories]); // Refresh when categories change

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

  const handleFolderCreated = () => {
    refreshCategories();
  };

  const handleViewPDF = (pdf: PDFCategory) => {
    window.open(pdf.pdfURL, '_blank');
  };

  // Group PDFs by folder
  const groupedPDFs: Record<string, PDFCategory[]> = {};
  const unassignedPDFs: PDFCategory[] = [];

  categories.forEach(pdf => {
    if (pdf.folderId) {
      if (!groupedPDFs[pdf.folderId]) {
        groupedPDFs[pdf.folderId] = [];
      }
      groupedPDFs[pdf.folderId].push(pdf);
    } else {
      unassignedPDFs.push(pdf);
    }
  });

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
          <div>
            <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
            <p className="text-muted-foreground mt-1">
              Manage and access your organization's standard operating procedures
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline" 
              onClick={() => setCreateFolderDialogOpen(true)}
            >
              <FolderPlus className="mr-2 h-4 w-4" /> Create Folder
            </Button>
            
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
        </div>

        <Tabs defaultValue="folders" className="w-full" onValueChange={(value) => setViewMode(value as "folders" | "all")}>
          <TabsList>
            <TabsTrigger value="folders">
              <Folder className="h-4 w-4 mr-2" /> 
              Folders View
            </TabsTrigger>
            <TabsTrigger value="all">
              All Documents
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {viewMode === "folders" ? "SOP Folders" : "All SOP Documents"}
              </h2>
              <Button variant="outline" size="sm" onClick={refreshCategories} className="flex gap-2">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
            
            <Separator className="mb-4" />

            {isLoading || isLoadingFolders ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="h-6 bg-muted/50 rounded animate-pulse mb-2 w-1/3"></div>
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load SOPs. Please try refreshing.
                </AlertDescription>
              </Alert>
            ) : categories.length === 0 ? (
              <EmptyState
                title="No SOPs Available"
                description="Upload your first SOP document to get started."
              />
            ) : (
              <TabsContent value="folders" className="mt-0">
                {/* Show folders with their SOPs */}
                {folders.length > 0 ? (
                  <>
                    {folders.map(folder => (
                      <SOPFolder
                        key={folder.id}
                        name={folder.name}
                        sopItems={groupedPDFs[folder.id] || []}
                        onViewPDF={handleViewPDF}
                        onDeletePDF={handleDeletePDF}
                      />
                    ))}
                    
                    {/* Unassigned SOPs */}
                    {unassignedPDFs.length > 0 && (
                      <SOPFolder
                        name="Unassigned SOPs"
                        sopItems={unassignedPDFs}
                        onViewPDF={handleViewPDF}
                        onDeletePDF={handleDeletePDF}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    icon="book"
                    title="No SOP Folders Created"
                    description="Create a folder to start organizing your SOPs. You can also view all SOPs in the All Documents tab."
                  />
                )}
              </TabsContent>
            )}
            
            <TabsContent value="all" className="mt-0">
              {/* Show all SOPs without folders */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(sop => (
                  <Card key={sop.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-2">{sop.pdfName}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sop.nameOfCategory}
                      </p>
                      {sop.uploadedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded {new Date(sop.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-4 bg-muted/30 flex justify-end border-t">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewPDF(sop)}>
                          View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeletePDF(sop.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {categories.length === 0 && (
                <EmptyState
                  icon="book"
                  title="No SOPs Available"
                  description="Upload your first SOP document to get started."
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <CreateFolderDialog 
        open={createFolderDialogOpen} 
        onOpenChange={setCreateFolderDialogOpen}
        onFolderCreated={handleFolderCreated} 
      />
      
      <Toaster />
    </MainLayout>
  );
};

export default SOPs;
