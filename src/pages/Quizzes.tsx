
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Quiz } from "@/types";

const Quizzes = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (userProfile?.organizationId) {
        setIsLoading(true);
        try {
          // Here you would fetch quizzes from Firestore
          // For now we'll use mock data
          setTimeout(() => {
            setQuizzes([
              {
                id: "quiz1",
                title: "Animal Handling Quiz",
                description: "Test your knowledge on proper animal handling procedures",
                categoryId: "cat1",
                subcategory: "Handling",
                organizationId: userProfile.organizationId,
                passingScore: 80,
                timeLimit: 30,
                isRequired: true,
                createdAt: new Date(),
                createdBy: "admin",
                questions: [
                  {
                    id: "q1",
                    question: "What is the proper way to handle a mouse?",
                    options: ["By the tail", "By the scruff", "By the ears", "By the feet"],
                    correctAnswerIndex: 1
                  }
                ]
              }
            ]);
            setIsLoading(false);
          }, 1000);
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Failed to fetch quizzes"));
          setIsLoading(false);
        }
      }
    };

    if (userProfile) {
      fetchQuizzes();
    }
  }, [userProfile]);

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
          <h1 className="text-3xl font-bold">Quizzes</h1>
          
          {userProfile?.accountType === "Admin" && (
            <Button>Create Quiz</Button>
          )}
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList>
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
            {userProfile?.accountType === "Admin" && (
              <TabsTrigger value="manage">Manage Quizzes</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="available">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      <Skeleton className="h-10 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ) : quizzes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No quizzes available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map(quiz => (
                  <Card key={quiz.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{quiz.title}</CardTitle>
                        {quiz.isRequired && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{quiz.subcategory}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{quiz.description}</p>
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Passing score:</span>
                          <span className="font-medium">{quiz.passingScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time limit:</span>
                          <span className="font-medium">{quiz.timeLimit} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span className="font-medium">{quiz.questions.length}</span>
                        </div>
                      </div>
                      <Button className="mt-4 w-full">Take Quiz</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No completed quizzes yet</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {userProfile?.accountType === "Admin" && (
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Quiz management tools will be available soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Quizzes;
