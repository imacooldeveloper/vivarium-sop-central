
import React from "react";
import { Quiz } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EmptyState from "./EmptyState";

interface ManageQuizzesTabProps {
  quizzes: Quiz[];
}

export const ManageQuizzesTab: React.FC<ManageQuizzesTabProps> = ({ quizzes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Management</CardTitle>
        <CardDescription>Create and manage quizzes for your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button>
            Create New Quiz
          </Button>
        </div>
        <Separator className="mb-4" />
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map(quiz => (
              <Card key={quiz.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>
                        {quiz.subcategory} • {quiz.questions.length} questions
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge variant={quiz.isRequired ? "default" : "outline"}>
                        {quiz.isRequired ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Results</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Quizzes Created"
            description="Your organization hasn't created any quizzes yet. Click the 'Create New Quiz' button to get started."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ManageQuizzesTab;
