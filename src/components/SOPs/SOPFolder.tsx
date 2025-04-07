
import React, { useState } from "react";
import { Folder, FolderOpen, ChevronDown, ChevronRight, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PDFCategory } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SOPFolderProps {
  name: string;
  sopItems: PDFCategory[];
  onViewPDF: (pdf: PDFCategory) => void;
  onDeletePDF: (id: string) => Promise<void>;
}

export const SOPFolder: React.FC<SOPFolderProps> = ({ 
  name, 
  sopItems, 
  onViewPDF,
  onDeletePDF
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (sopItems.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-4 pb-0">
          <CollapsibleTrigger className="flex items-center w-full text-left">
            <Button
              variant="ghost"
              className="h-auto p-0 hover:bg-transparent"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
              {isOpen ? <FolderOpen className="h-5 w-5 mr-2 text-amber-500" /> : <Folder className="h-5 w-5 mr-2 text-amber-500" />}
              <span className="text-lg font-medium">{name} ({sopItems.length})</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="grid gap-3 p-4 pt-2">
            {sopItems.map((sop) => (
              <div key={sop.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div className="flex items-start gap-2">
                  <File className="h-4 w-4 mt-1 text-blue-500" />
                  <div>
                    <p className="font-medium">{sop.pdfName}</p>
                    {sop.uploadedAt && (
                      <p className="text-xs text-muted-foreground">
                        Uploaded {formatDistanceToNow(new Date(sop.uploadedAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onViewPDF(sop)}>
                    View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDeletePDF(sop.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SOPFolder;
