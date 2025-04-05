
import React from "react";
import { Quiz } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QuizCard from "./QuizCard";
import QuizCardSkeleton from "./QuizCardSkeleton";
import EmptyState from "./EmptyState";

interface AvailableQuizzesTabProps {
  quizzes: Quiz[];
  isLoading: boolean;
  error: Error | null;
  onStartQuiz: (quiz: Quiz) => void;
}

export const AvailableQuizzesTab: React.FC<AvailableQuizzesTabProps> = ({
  quizzes,
  isLoading,
  error,
  onStartQuiz
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <QuizCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (quizzes.length === 0) {
    return (
      <EmptyState
        title="No Quizzes Available"
        description="There are currently no quizzes available for you. Check back later or contact your administrator."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map(quiz => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStartQuiz={onStartQuiz}
        />
      ))}
    </div>
  );
};

export default AvailableQuizzesTab;
