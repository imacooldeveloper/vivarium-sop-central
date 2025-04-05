
import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, CheckCircle, FileText, PenLine, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="relative overflow-hidden border border-border">
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
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Quizzes Available</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    There are currently no quizzes available for you. Check back later or contact your administrator.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map(quiz => (
                  <Card key={quiz.id} className="relative overflow-hidden border border-border h-full flex flex-col">
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
                        onClick={() => handleStartQuiz(quiz)} 
                        className="w-full"
                      >
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Quiz History</h3>
                      <p className="text-muted-foreground text-center">
                        You haven't completed any quizzes yet. Go to the Available Quizzes tab to get started.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="required">
            <Card>
              <CardHeader>
                <CardTitle>Required Training</CardTitle>
                <CardDescription>Mandatory quizzes that need to be completed</CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes.filter(q => q.isRequired).length > 0 ? (
                  <div className="space-y-4">
                    {quizzes
                      .filter(quiz => quiz.isRequired)
                      .map(quiz => {
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
                                  onClick={() => handleStartQuiz(quiz)}
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
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Required Training</h3>
                    <p className="text-muted-foreground text-center">
                      There are no required quizzes for you at this time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {userProfile?.accountType === "Admin" && (
            <TabsContent value="manage">
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Quizzes Created</h3>
                      <p className="text-muted-foreground text-center">
                        Your organization hasn't created any quizzes yet. Click the "Create New Quiz" button to get started.
                      </p>
                    </div>
                  )}
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
