
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
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
import { SOPFolderList } from "@/components/SOPs/SOPFolderList";
import { Skeleton } from "@/components/ui/skeleton";

const SOPs = () => {
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sops, setSOPs] = useState<PDFCategory[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [allSops, setAllSops] = useState<PDFCategory[]>([]);
  const [isLoadingSops, setIsLoadingSops] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch folders when component mounts
  useEffect(() => {
    const fetchFolders = async () => {
      if (!userProfile?.organizationId) return;
      
      setIsLoadingFolders(true);
      try {
        // Try both collection names to ensure compatibility
        const collections = ['sopFolders', 'SOPFolders'];
        let folderList: FolderType[] = [];
        
        for (const collectionName of collections) {
          const q = query(
            collection(db, collectionName),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const querySnapshot = await getDocs(q);
          const foldersFromCollection = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FolderType[];
          
          folderList = [...folderList, ...foldersFromCollection];
        }
        
        console.log(`Found ${folderList.length} folders`);
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
        setError(error instanceof Error ? error : new Error("Failed to load folders"));
        toast({
          title: "Error",
          description: "Failed to load SOP folders",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchAllSops();
    fetchFolders();
  }, [userProfile?.organizationId, toast]);

  // Fetch all SOPs
  const fetchAllSops = async () => {
    if (!userProfile?.organizationId) return;

    setIsLoadingSops(true);
    try {
      const sopsQuery = query(
        collection(db, "pdfCategories"),
        where("organizationId", "==", userProfile.organizationId)
      );
      const sopsSnapshot = await getDocs(sopsQuery);
      const sopsData = sopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as PDFCategory[];
      
      console.log(`Found ${sopsData.length} total SOPs`);
      setAllSops(sopsData);
    } catch (error) {
      console.error("Error fetching SOPs:", error);
      setError(error instanceof Error ? error : new Error("Failed to load SOPs"));
      toast({
        title: "Error",
        description: "Failed to load SOPs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSops(false);
    }
  };

  // Fetch SOPs when a folder is selected
  useEffect(() => {
    if (!selectedFolder || !allSops.length) {
      setSOPs([]);
      return;
    }

    const filteredSops = allSops.filter(sop => sop.folderId === selectedFolder);
    console.log(`Found ${filteredSops.length} SOPs in folder ${selectedFolder}`);
    setSOPs(filteredSops);
  }, [selectedFolder, allSops]);

  const handleDeletePDF = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this SOP?")) {
      try {
        // Implement delete functionality
        // After deletion, refresh the SOPs list
        fetchAllSops();
        toast({
          title: "SOP deleted",
          description: "The SOP has been successfully deleted",
        });
      } catch (error) {
        console.error("Failed to delete PDF:", error);
        toast({
          title: "Error",
          description: "Failed to delete SOP",
          variant: "destructive",
        });
      }
    }
  };

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    fetchAllSops();
    toast({
      title: "Upload complete",
      description: "Your SOP has been successfully uploaded",
    });
  };

  const handleFolderCreated = () => {
    const fetchFolders = async () => {
      if (!userProfile?.organizationId) return;
      
      setIsLoadingFolders(true);
      try {
        // Try both collection names to ensure compatibility
        const collections = ['sopFolders', 'SOPFolders'];
        let folderList: FolderType[] = [];
        
        for (const collectionName of collections) {
          const q = query(
            collection(db, collectionName),
            where('organizationId', '==', userProfile.organizationId)
          );
          
          const querySnapshot = await getDocs(q);
          const foldersFromCollection = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FolderType[];
          
          folderList = [...folderList, ...foldersFromCollection];
        }
        
        console.log(`Found ${folderList.length} folders after creation`);
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  };

  const handleViewPDF = (pdf: PDFCategory) => {
    const url = pdf.pdfURL || pdf.fileUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "PDF URL not found",
        variant: "destructive",
      });
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  // Group PDFs by folder
  const groupedPDFs: Record<string, PDFCategory[]> = {};
  const unassignedPDFs: PDFCategory[] = [];

  allSops.forEach(pdf => {
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
        <div className="container mx-auto p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
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
              <DialogContent className="sm:max-w-[550px]">
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
              <Button variant="outline" size="sm" onClick={fetchAllSops} className="flex gap-2">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
            
            <Separator className="mb-4" />

            {isLoadingSops || isLoadingFolders ? (
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
            ) : (
              <>
                <TabsContent value="folders" className="mt-0">
                  {/* Show folders with their SOPs */}
                  {folders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <SOPFolderList 
                          folders={folders} 
                          selectedFolder={selectedFolder}
                          onSelectFolder={handleFolderSelect}
                          loading={isLoadingFolders}
                        />
                      </div>
                      
                      <div className="md:col-span-3">
                        {selectedFolder ? (
                          sops.length > 0 ? (
                            <SOPFolder
                              name={folders.find(f => f.id === selectedFolder)?.name || "Selected Folder"}
                              sopItems={sops}
                              onViewPDF={handleViewPDF}
                              onDeletePDF={handleDeletePDF}
                            />
                          ) : (
                            <EmptyState
                              icon="file"
                              title="No SOPs in this folder"
                              description="Upload a SOP to this folder to get started."
                            />
                          )
                        ) : (
                          <EmptyState
                            icon="folder"
                            title="Select a folder"
                            description="Choose a folder from the list to view its SOPs."
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon="folder"
                      title="No SOP Folders Created"
                      description="Create a folder to start organizing your SOPs."
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="all" className="mt-0">
                  {/* Show all SOPs without folders */}
                  {allSops.length > 0 ? (
                    <div className="space-y-4">
                      {Object.keys(groupedPDFs).map((folderId) => {
                        const folderName = folders.find(f => f.id === folderId)?.name || "Unknown Folder";
                        return (
                          <SOPFolder
                            key={folderId}
                            name={folderName}
                            sopItems={groupedPDFs[folderId]}
                            onViewPDF={handleViewPDF}
                            onDeletePDF={handleDeletePDF}
                          />
                        );
                      })}
                      
                      {unassignedPDFs.length > 0 && (
                        <SOPFolder
                          name="Unassigned SOPs"
                          sopItems={unassignedPDFs}
                          onViewPDF={handleViewPDF}
                          onDeletePDF={handleDeletePDF}
                        />
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon="file"
                      title="No SOPs Available"
                      description="Upload your first SOP document to get started."
                    />
                  )}
                </TabsContent>
              </>
            )}
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
