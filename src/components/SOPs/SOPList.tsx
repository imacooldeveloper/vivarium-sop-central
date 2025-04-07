
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFCategory } from '@/types';
import { AlertCircle, FileText, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SOPListProps {
  sops: PDFCategory[];
  loading: boolean;
  error?: Error | null;
  onDelete?: (id: string) => Promise<void>;
  onRefresh?: () => void;
  emptyMessage: string;
}

export function SOPList({ 
  sops, 
  loading, 
  error, 
  onDelete, 
  onRefresh, 
  emptyMessage 
}: SOPListProps) {
  if (loading) {
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading SOPs</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred while loading SOPs."}
        </AlertDescription>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" className="mt-2">
            Try Again
          </Button>
        )}
      </Alert>
    );
  }

  if (sops.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center min-h-[200px] text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sops.map((sop) => {
        const pdfName = sop.pdfName || sop.fileName || 'Untitled SOP';
        const uploadDate = sop.uploadedAt ? 
          formatDistanceToNow(new Date(sop.uploadedAt), { addSuffix: true }) : 
          'Date unknown';
          
        return (
          <Card key={sop.id} className="overflow-hidden flex flex-col">
            <div className="p-4 pb-2">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium line-clamp-2">{pdfName}</h3>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {uploadDate}
                  </p>
                </div>
              </div>
            </div>
            
            <CardContent className="pt-0 pb-2 flex-grow">
              {sop.subcategory && (
                <p className="text-sm line-clamp-3">
                  {sop.subcategory}
                </p>
              )}
            </CardContent>
            
            <div className="p-4 pt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-2"
                onClick={() => window.open(sop.pdfURL || sop.fileUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" /> View
              </Button>
              
              {onDelete && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex gap-2"
                  onClick={() => onDelete(sop.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
