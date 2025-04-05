
import React from "react";
import { BookOpen, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: "book" | "check";
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = "book", 
  title, 
  description 
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon === "book" ? (
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        ) : (
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        )}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
