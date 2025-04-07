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
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { SOPList } from "@/components/SOPs/SOPList";
import { SOPFolderList } from "@/components/SOPs/SOPFolderList";

const SOPs = () => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const { categories, isLoading, error, deletePDF, refreshCategories } = usePDFCategoryViewModel();
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<PDFCategory | null>(null);
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sops, setSOPs] = useState<any[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to load SOP folders",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [userProfile?.organizationId, categories, toast]); // Refresh when categories change

  // Fetch SOPs when a folder is selected
  useEffect(() => {
    const fetchSOPs = async () => {
      if (!selectedFolder) {
        setSOPs([]);
        return;
      }

      setIsLoadingFolders(true);
      try {
        const sopsQuery = query(
          collection(db, "pdfCategories"),
          where("folderId", "==", selectedFolder)
        );
        const sopsSnapshot = await getDocs(sopsQuery);
        const sopsData = sopsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSOPs(sopsData);
      } catch (error) {
        console.error("Error fetching SOPs:", error);
        toast({
          title: "Error",
          description: "Failed to load SOPs",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchSOPs();
  }, [selectedFolder, toast]);

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

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
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
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload SOP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <SOPUploadForm 
                  folders={folders} 
                  onUploadComplete={handleUploadComplete} 
                />
              </DialogContent>
            </Dialog>
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
                    <SOPFolderList 
                      folders={folders} 
                      selectedFolder={selectedFolder}
                      onSelectFolder={handleFolderSelect}
                      loading={isLoadingFolders}
                    />
                    
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
              <SOPList 
                sops={sops} 
                loading={isLoadingFolders} 
                emptyMessage={selectedFolder ? "No SOPs in this folder" : "Select a folder to view SOPs"}
              />
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
