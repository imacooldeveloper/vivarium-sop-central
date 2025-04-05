
import React from "react";
import { User, Quiz } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import EmptyState from "./EmptyState";

interface CompletedQuizzesTabProps {
  userProfile: User | null;
  quizzes: Quiz[];
}

export const CompletedQuizzesTab: React.FC<CompletedQuizzesTabProps> = ({
  userProfile,
  quizzes
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completion History</CardTitle>
          <CardDescription>View your quiz attempts and scores</CardDescription>
        </CardHeader>
        <CardContent>
          {userProfile?.quizScores && userProfile.quizScores.length > 0 ? (
            <div className="space-y-4">
              {userProfile.quizScores.map(score => {
                const quiz = quizzes.find(q => q.id === score.quizId);
                return (
                  <Card key={`${score.quizId}-${score.completedAt.toString()}`} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">{quiz?.title || 'Unknown Quiz'}</CardTitle>
                          <CardDescription>
                            Completed on {new Date(score.completedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={score.passed ? "default" : "destructive"}>
                          {score.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="flex justify-between items-center mb-2">
                        <span>Score: {score.score}%</span>
                        <span>Passing: {quiz?.passingScore || 70}%</span>
                      </div>
                      <Progress value={score.score} className="h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Quiz History"
              description="You haven't completed any quizzes yet. Go to the Available Quizzes tab to get started."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedQuizzesTab;
