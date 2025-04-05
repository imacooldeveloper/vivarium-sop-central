
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Search, 
  Upload, 
  FileText, 
  Folder, 
  Edit, 
  Trash2,
  Plus,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { usePDFCategoryViewModel } from '@/viewmodels/usePDFCategoryViewModel';
import { PDFCategory, SOPCategory } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import SOPUploadDialog from '@/components/SOPs/SOPUploadDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SOPs = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Use our PDF Category view model
  const { 
    categories,
    sopCategories,
    isLoading,
    error,
    deletePDF,
    setSelectedCategory
  } = usePDFCategoryViewModel();

  // Filter PDFs based on search term
  const filteredCategories = categories?.filter(cat => 
    cat.nameOfCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.SOPForStaffTittle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.pdfName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    setSelectedCategory(categoryId === activeCategory ? null : categoryId);
  };

  // Handle SOP deletion
  const handleDeleteSOP = async (id: string) => {
    try {
      await deletePDF(id);
      toast({
        title: "SOP Deleted",
        description: "The SOP has been successfully deleted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the SOP. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render debug info in development
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <details className="mb-4 p-2 border border-gray-200 rounded text-xs">
        <summary className="font-mono cursor-pointer">Debug Info</summary>
        <div className="p-2 bg-gray-50 mt-2 rounded">
          <p>Organization ID: {userProfile?.organizationId || 'Not available'}</p>
          <p>Categories loaded: {categories?.length || 0}</p>
          <p>SOP Categories loaded: {sopCategories?.length || 0}</p>
          <p>Loading state: {isLoading ? 'true' : 'false'}</p>
          <p>Error: {error ? error.message : 'None'}</p>
        </div>
      </details>
    );
  };

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          {renderDebugInfo()}
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load SOPs: {error.message}
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {renderDebugInfo()}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Standard Operating Procedures</h1>
            <p className="text-muted-foreground">
              Manage PDF SOPs, assign to categories, and upload new ones.
            </p>
          </div>

          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New SOP
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search SOPs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories sidebar */}
          <Card className="col-span-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh] p-2">
                {isLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading categories...</span>
                  </div>
                ) : sopCategories?.length ? (
                  <div className="space-y-1">
                    {sopCategories.map((category: SOPCategory) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md ${
                          activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        <Folder className="h-4 w-4" />
                        <span className="flex-1 truncate">{category.nameOfCategory}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    No categories found
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* SOPs list */}
          <Card className="col-span-1 md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {activeCategory 
                  ? `SOPs - ${sopCategories?.find(c => c.id === activeCategory)?.nameOfCategory}` 
                  : 'All SOPs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p>Loading SOPs...</p>
                </div>
              ) : filteredCategories?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories
                      .filter(pdf => !activeCategory || pdf.quizCategoryID === activeCategory)
                      .map((pdf: PDFCategory) => (
                        <TableRow key={pdf.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{pdf.pdfName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{pdf.nameOfCategory}</TableCell>
                          <TableCell>{pdf.SOPForStaffTittle}</TableCell>
                          <TableCell className="space-x-2">
                            <a 
                              href={pdf.pdfURL} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </a>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteSOP(pdf.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">No SOPs found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchTerm 
                      ? "No SOPs match your search criteria" 
                      : !userProfile?.organizationId 
                        ? "You need to be part of an organization to view SOPs" 
                        : "Get started by uploading your first SOP"}
                  </p>
                  {userProfile?.organizationId && (
                    <Button onClick={() => setIsUploadDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add SOP
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SOP Upload Dialog */}
      <SOPUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        categories={sopCategories || []}
      />
    </MainLayout>
  );
};

export default SOPs;
