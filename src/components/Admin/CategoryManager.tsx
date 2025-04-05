
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, FileText, Pencil, Plus, Trash } from 'lucide-react';
import { SOPCategory, PDFCategory } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryManagerProps {
  sopCategories: SOPCategory[];
  pdfDocuments: PDFCategory[];
  onSelectPDF: (pdf: PDFCategory) => void;
  onDeletePDF: (id: string) => void;
  onAddQuiz: (categoryId: string, subcategory: string) => void;
}

export function CategoryManager({ 
  sopCategories, 
  pdfDocuments, 
  onSelectPDF,
  onDeletePDF,
  onAddQuiz 
}: CategoryManagerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Group PDFs by category and subcategory
  const groupedPDFs: Record<string, Record<string, PDFCategory[]>> = {};
  
  pdfDocuments.forEach(pdf => {
    const categoryId = pdf.categoryId || '';
    const subcategory = pdf.subcategory || 'Uncategorized';
    
    if (!groupedPDFs[categoryId]) {
      groupedPDFs[categoryId] = {};
    }
    
    if (!groupedPDFs[categoryId][subcategory]) {
      groupedPDFs[categoryId][subcategory] = [];
    }
    
    groupedPDFs[categoryId][subcategory].push(pdf);
  });
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="documents">All Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          {sopCategories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No categories found.</p>
              </CardContent>
            </Card>
          ) : (
            sopCategories.map(category => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategories[category.id] ? 
                          <ChevronDown className="h-4 w-4 mr-2" /> : 
                          <ChevronRight className="h-4 w-4 mr-2" />}
                      </Button>
                      {category.nameOfCategory}
                    </div>
                    <div>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {category.SOPForStaffTittle || "Standard Operating Procedures"}
                  </CardDescription>
                </CardHeader>
                
                <Collapsible open={expandedCategories[category.id]}>
                  <CollapsibleContent>
                    <CardContent>
                      {!groupedPDFs[category.id] ? (
                        <p className="text-sm text-gray-500">No subcategories found.</p>
                      ) : (
                        Object.entries(groupedPDFs[category.id]).map(([subcategory, pdfs]) => (
                          <div key={subcategory} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-sm font-medium">{subcategory}</h3>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onAddQuiz(category.id, subcategory)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Quiz
                              </Button>
                            </div>
                            
                            <div className="border rounded-md divide-y">
                              {pdfs.map(pdf => (
                                <div 
                                  key={pdf.id} 
                                  className="flex justify-between items-center p-3 hover:bg-slate-50"
                                >
                                  <div 
                                    className="flex items-center cursor-pointer flex-1"
                                    onClick={() => onSelectPDF(pdf)}
                                  >
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm">{pdf.pdfName}</span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => onDeletePDF(pdf.id)}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
                
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subcategory
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>View and manage all SOP documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                {pdfDocuments.map(pdf => (
                  <div 
                    key={pdf.id} 
                    className="flex justify-between items-center p-3 hover:bg-slate-50"
                  >
                    <div 
                      className="flex items-center cursor-pointer flex-1"
                      onClick={() => onSelectPDF(pdf)}
                    >
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{pdf.pdfName}</p>
                        <p className="text-xs text-gray-500">
                          {pdf.nameOfCategory} {pdf.subcategory && `• ${pdf.subcategory}`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeletePDF(pdf.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {pdfDocuments.length === 0 && (
                  <p className="p-4 text-center text-gray-500">No documents found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
