
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface QuizAssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  subcategory: string;
  onAssignQuiz: (quizData: QuizFormData) => Promise<void>;
}

export interface QuizFormData {
  categoryId: string;
  subcategory: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  isRequired: boolean;
  questions: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
}

export function QuizAssignmentForm({
  open,
  onOpenChange,
  categoryId,
  subcategory,
  onAssignQuiz
}: QuizAssignmentFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState(30);
  const [isRequired, setIsRequired] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For simplicity, we'll start with just one sample question
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }
  ]);
  
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };
  
  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswerIndex = optionIndex;
    setQuestions(updatedQuestions);
  };
  
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0
      }
    ]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAssignQuiz({
        categoryId,
        subcategory,
        title,
        description,
        passingScore,
        timeLimit,
        isRequired,
        questions
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPassingScore(70);
      setTimeLimit(30);
      setIsRequired(true);
      setQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0
        }
      ]);
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Quiz to {subcategory}</DialogTitle>
          <DialogDescription>
            Create a quiz that users must complete after reading this SOP.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min={1}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min={1}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Quiz</Label>
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-4">Questions</h4>
            
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-md p-4 mb-4">
                <div className="grid gap-2 mb-3">
                  <Label htmlFor={`question-${qIndex}`}>Question {qIndex + 1}</Label>
                  <Textarea
                    id={`question-${qIndex}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter question text"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Answer Options</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`correct-${qIndex}-${oIndex}`}
                        name={`correct-answer-${qIndex}`}
                        checked={question.correctAnswerIndex === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        className="mr-1"
                      />
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addQuestion}
              className="w-full"
            >
              Add Question
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Assign Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
