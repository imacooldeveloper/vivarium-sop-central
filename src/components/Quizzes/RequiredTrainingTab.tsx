
import React from "react";
import { User, Quiz } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Timer } from "lucide-react";
import EmptyState from "./EmptyState";

interface RequiredTrainingTabProps {
  quizzes: Quiz[];
  userProfile: User | null;
  onStartQuiz: (quiz: Quiz) => void;
}

export const RequiredTrainingTab: React.FC<RequiredTrainingTabProps> = ({
  quizzes,
  userProfile,
  onStartQuiz
}) => {
  const requiredQuizzes = quizzes.filter(q => q.isRequired);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Training</CardTitle>
        <CardDescription>Mandatory quizzes that need to be completed</CardDescription>
      </CardHeader>
      <CardContent>
        {requiredQuizzes.length > 0 ? (
          <div className="space-y-4">
            {requiredQuizzes.map(quiz => {
              const completed = userProfile?.quizScores?.find(s => s.quizId === quiz.id && s.passed);
              return (
                <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${completed ? "bg-green-100" : "bg-amber-100"}`}>
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Timer className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => onStartQuiz(quiz)}
                      >
                        Take Quiz
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="check"
            title="No Required Training"
            description="There are no required quizzes for you at this time."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RequiredTrainingTab;
