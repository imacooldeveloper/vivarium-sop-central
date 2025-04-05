
import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import AvailableQuizzesTab from "@/components/Quizzes/AvailableQuizzesTab";
import CompletedQuizzesTab from "@/components/Quizzes/CompletedQuizzesTab";
import RequiredTrainingTab from "@/components/Quizzes/RequiredTrainingTab";
import ManageQuizzesTab from "@/components/Quizzes/ManageQuizzesTab";

const Quizzes = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for UI development - replace with real data fetching
  React.useEffect(() => {
    if (userProfile?.organizationId) {
      setIsLoading(true);
      
      // Simulate data loading
      setTimeout(() => {
        const mockQuizzes = [
          {
            id: "quiz1",
            title: "Mice Handling Procedures",
            description: "Learn proper handling techniques for laboratory mice",
            categoryId: "cat1",
            subcategory: "Handling",
            organizationId: userProfile.organizationId,
            passingScore: 80,
            timeLimit: 15,
            isRequired: true,
            createdAt: new Date(),
            createdBy: "admin",
            questions: [
              {
                id: "q1",
                question: "What is the proper way to handle a mouse?",
                options: ["By the tail", "By the scruff", "By the ears", "By the feet"],
                correctAnswerIndex: 1
              },
              {
                id: "q2",
                question: "What PPE should be worn when handling mice?",
                options: ["No PPE required", "Gloves only", "Gloves and lab coat", "Full protective gear including face mask"],
                correctAnswerIndex: 2
              }
            ]
          },
          {
            id: "quiz2",
            title: "Equipment Sterilization",
            description: "Procedures for proper sterilization of laboratory equipment",
            categoryId: "cat2",
            subcategory: "Equipment Maintenance",
            organizationId: userProfile.organizationId,
            passingScore: 75,
            timeLimit: 20,
            isRequired: false,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            createdBy: "supervisor",
            questions: [
              {
                id: "q1",
                question: "What temperature should the autoclave reach for proper sterilization?",
                options: ["100°C", "121°C", "150°C", "200°C"],
                correctAnswerIndex: 1
              }
            ]
          },
          {
            id: "quiz3",
            title: "Animal Welfare Regulations",
            description: "Overview of regulations regarding animal welfare in laboratory settings",
            categoryId: "cat3",
            subcategory: "Regulations",
            organizationId: userProfile.organizationId,
            passingScore: 90,
            timeLimit: 30,
            isRequired: true,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            createdBy: "admin",
            questions: [
              {
                id: "q1",
                question: "Which organization sets the standards for animal care in research?",
                options: ["FDA", "IACUC", "USDA", "All of the above"],
                correctAnswerIndex: 3
              }
            ]
          }
        ];
        
        setQuizzes(mockQuizzes);
        setIsLoading(false);
      }, 1000);
    }
  }, [userProfile]);

  // Start quiz function
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    toast({
      title: "Quiz Started",
      description: `Starting ${quiz.title} - You have ${quiz.timeLimit} minutes to complete.`,
    });
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
          <p>Loading user data...</p>
        </div>
      </MainLayout>
    );
  }

  // Show message if user is not part of an organization
  if (!authLoading && (!userProfile || !userProfile.organizationId)) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Required</AlertTitle>
            <AlertDescription>
              You need to be part of an organization to view quizzes. Please contact your administrator.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Assessment</h1>
            <p className="text-muted-foreground">Complete quizzes to assess your understanding of SOPs</p>
          </div>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
            <TabsTrigger value="required">Required Training</TabsTrigger>
            {userProfile?.accountType === "Admin" && (
              <TabsTrigger value="manage">Manage Quizzes</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="available">
            <AvailableQuizzesTab 
              quizzes={quizzes}
              isLoading={isLoading}
              error={error}
              onStartQuiz={handleStartQuiz}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <CompletedQuizzesTab 
              userProfile={userProfile}
              quizzes={quizzes}
            />
          </TabsContent>
          
          <TabsContent value="required">
            <RequiredTrainingTab
              quizzes={quizzes}
              userProfile={userProfile}
              onStartQuiz={handleStartQuiz}
            />
          </TabsContent>
          
          {userProfile?.accountType === "Admin" && (
            <TabsContent value="manage">
              <ManageQuizzesTab quizzes={quizzes} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Quizzes;
