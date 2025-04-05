
import React from "react";
import { Quiz } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FileText, 
  Timer, 
  PenLine, 
  CheckCircle 
} from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quiz: Quiz) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card className="relative overflow-hidden border border-border h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-20" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.isRequired && (
            <Badge variant="destructive">Required</Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {quiz.subcategory}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{quiz.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{quiz.timeLimit}</span> min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{quiz.questions.length}</span> questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{quiz.passingScore}%</span> to pass
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onStartQuiz(quiz)} 
          className="w-full"
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
