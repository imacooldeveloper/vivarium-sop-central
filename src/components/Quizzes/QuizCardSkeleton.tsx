
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export const QuizCardSkeleton: React.FC = () => (
  <Card className="relative overflow-hidden border border-border">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-20" />
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="animate-pulse bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-5 w-20 rounded-full"></div>
      </div>
      <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="animate-pulse bg-gray-200 h-4 w-full mb-2 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-5/6 mb-4 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-2/3 mb-2 rounded"></div>
    </CardContent>
    <CardFooter>
      <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
    </CardFooter>
  </Card>
);

export default QuizCardSkeleton;
