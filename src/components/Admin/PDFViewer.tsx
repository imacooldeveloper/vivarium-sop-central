
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PDFViewerProps {
  pdf: PDFCategory;
  onClose: () => void;
}

export function PDFViewer({ pdf, onClose }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{pdf.pdfName}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <p>Loading PDF...</p>
          </div>
        )}
        <iframe 
          src={`${pdf.pdfURL}#toolbar=0&navpanes=0`} 
          className="w-full h-full min-h-[70vh]" 
          title={pdf.pdfName}
          onLoad={() => setLoading(false)}
        />
      </CardContent>
    </Card>
  );
}
