import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFCategory } from '@/types';
import { AlertCircle, File, FileText, Trash2, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SOPListProps {
  categories: PDFCategory[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  emptyMessage: string;
}

export const SOPList = ({ categories, isLoading, error, onDelete, onRefresh, emptyMessage }: SOPListProps) => {
  // Group SOPs by category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const uniqueCategories = [...new Set(categories.map(sop => sop.nameOfCategory))];
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Error loading SOPs</CardTitle>
          </div>
          <CardDescription>
            {error.message || "An unexpected error occurred while loading SOPs."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onRefresh} variant="outline" className="flex gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px] text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Standard Operating Procedures ({categories.length})
        </h2>
        <Button variant="outline" size="sm" onClick={onRefresh} className="flex gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {uniqueCategories.length > 1 && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 overflow-auto">
            <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
              All
            </TabsTrigger>
            {uniqueCategories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories
          .filter(sop => !selectedCategory || sop.nameOfCategory === selectedCategory)
          .map((sop) => (
            <Card key={sop.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span className="line-clamp-2">{sop.pdfName}</span>
                </CardTitle>
                <CardDescription>
                  {sop.nameOfCategory && (
                    <Badge variant="secondary" className="mr-2">
                      {sop.nameOfCategory}
                    </Badge>
                  )}
                  {sop.uploadedAt && (
                    <span className="text-xs text-muted-foreground">
                      Uploaded {formatDistanceToNow(new Date(sop.uploadedAt), { addSuffix: true })}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm line-clamp-3">
                  {sop.subcategory || "No subcategory specified"}
                </p>
              </CardContent>
              
              <CardFooter className="pt-2 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex gap-2"
                  onClick={() => window.open(sop.pdfURL, '_blank')}
                >
                  <File className="h-4 w-4" /> View
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex gap-2"
                  onClick={() => onDelete(sop.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};
