import { useEffect, useState, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LearningPath as LearningPathType, Module, UserProgress } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface LessonProps {
  id: number;
}

export default function Lesson({ id }: LessonProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  
  // Fetch learning path
  const { data: learningPath, isLoading: loadingPath } = useQuery<LearningPathType>({
    queryKey: [`/api/learning-paths/${id}`],
    enabled: !!id,
  });
  
  // Fetch modules for the learning path
  const { data: modules, isLoading: loadingModules } = useQuery<Module[]>({
    queryKey: [`/api/learning-paths/${id}/modules`],
    enabled: !!id,
  });
  
  // Fetch user progress if user is logged in
  const { data: userProgress, isLoading: loadingProgress } = useQuery<UserProgress>({
    queryKey: [`/api/users/${user?.id}/progress/${id}`],
    enabled: !!user && !!id,
    on401: "returnNull"
  });
  
  // Set active module based on user progress when data is loaded
  useEffect(() => {
    if (modules?.length && !activeModule) {
      if (userProgress && userProgress.completedModules > 0) {
        // Find the first incomplete module
        const moduleIndex = Math.min(userProgress.completedModules, modules.length - 1);
        setActiveModule(modules[moduleIndex].id);
        
        // Initialize completed modules set
        const completedSet = new Set<number>();
        for (let i = 0; i < userProgress.completedModules; i++) {
          if (modules[i]) {
            completedSet.add(modules[i].id);
          }
        }
        setCompletedModules(completedSet);
      } else {
        // Start with the first module
        setActiveModule(modules[0].id);
      }
    }
  }, [modules, userProgress, activeModule]);
  
  // Update user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (completedCount: number) => {
      if (!user) throw new Error("User must be logged in");
      
      return apiRequest("POST", "/api/user-progress", {
        userId: user.id,
        learningPathId: id,
        completedModules: completedCount,
        isCompleted: completedCount === learningPath?.totalModules,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/progress/${id}`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao atualizar progresso: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mark module as complete
  const markAsComplete = async (moduleId: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para acompanhar seu progresso.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!modules) return;
    
    // Add module to completed set
    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(moduleId);
    setCompletedModules(newCompletedModules);
    
    // Find index of current module and go to next module
    const currentModuleIndex = modules.findIndex(m => m.id === moduleId);
    const nextModuleIndex = currentModuleIndex + 1;
    
    if (nextModuleIndex < modules.length) {
      setActiveModule(modules[nextModuleIndex].id);
    }
    
    // Update progress in the database
    await updateProgressMutation.mutate(newCompletedModules.size);
    
    toast({
      title: "Módulo concluído",
      description: nextModuleIndex < modules.length 
        ? "Prosseguindo para o próximo módulo!" 
        : "Parabéns! Você concluiu esta trilha de aprendizado!",
    });
    
    // If all modules are completed
    if (newCompletedModules.size === modules.length) {
      toast({
        title: "Trilha concluída!",
        description: "Parabéns por concluir toda a trilha de aprendizado!",
        variant: "default",
      });
    }
  };
  
  // Get progress percentage
  const getProgressPercentage = () => {
    if (!modules) return 0;
    return Math.round((completedModules.size / modules.length) * 100);
  };
  
  // Check if module is completed
  const isModuleCompleted = (moduleId: number) => {
    return completedModules.has(moduleId);
  };
  
  // Get active module content
  const getActiveModuleContent = () => {
    if (!modules) return null;
    return modules.find(m => m.id === activeModule);
  };
  
  const activeModuleContent = getActiveModuleContent();
  const isLoading = loadingPath || loadingModules;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="md:col-span-3">
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Trilha não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">A trilha de aprendizado solicitada não foi encontrada.</p>
            <Button onClick={() => navigate("/learning-paths")}>
              Voltar para Trilhas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{learningPath.title}</h1>
            <p className="text-gray-600">{learningPath.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm font-medium mr-3">Progresso: {getProgressPercentage()}%</span>
            <Progress value={getProgressPercentage()} className="w-32 h-2" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Module navigation sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h2 className="font-semibold text-lg mb-4">Módulos</h2>
              <ul className="space-y-2">
                {modules?.map((module, index) => (
                  <li key={module.id}>
                    <button
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                        activeModule === module.id
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`
                        w-6 h-6 rounded-full mr-2 flex items-center justify-center text-xs
                        ${isModuleCompleted(module.id) 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-700"}
                      `}>
                        {isModuleCompleted(module.id) ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="truncate">{module.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Module content */}
          <div className="md:col-span-3">
            {activeModuleContent ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                  <div className="font-semibold">{activeModuleContent.title}</div>
                  <div className="text-sm text-gray-500">
                    <i className="fas fa-clock mr-1"></i> {activeModuleContent.estimatedMinutes} min
                  </div>
                </div>
                
                <div className="p-6">
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                      <TabsTrigger value="exercises">Exercícios</TabsTrigger>
                      <TabsTrigger value="resources">Recursos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <p className="text-gray-600">{activeModuleContent.description}</p>
                      
                      <div className="mt-4 prose max-w-none">
                        {/* Use content from module */}
                        <div dangerouslySetInnerHTML={{ __html: activeModuleContent.content }} />
                        
                        {/* Placeholder content for demo */}
                        {activeModuleContent.content.length < 50 && (
                          <>
                            <h2>Introdução ao tópico</h2>
                            <p>
                              Este módulo explora os conceitos fundamentais e aplica técnicas
                              interativas para ajudar no aprendizado. Os conceitos são apresentados
                              de forma gradual, com visualizações para reforçar o entendimento.
                            </p>
                            
                            <h3>Conceitos principais</h3>
                            <ul>
                              <li>Componente fundamental 1</li>
                              <li>Componente fundamental 2</li>
                              <li>Aplicações práticas</li>
                            </ul>
                            
                            <h3>Visualização Interativa</h3>
                            <div className="bg-gray-100 p-4 rounded-lg text-center my-4">
                              <i className="fas fa-chart-line text-3xl text-primary mb-2"></i>
                              <p className="text-sm text-gray-600">
                                Visualização interativa do conceito (elemento interativo seria implementado aqui)
                              </p>
                            </div>
                            
                            <Separator className="my-6" />
                            
                            <h2>Aplicações Práticas</h2>
                            <p>
                              Vamos explorar como estes conceitos são aplicados em situações reais
                              em diferentes áreas como medicina, finanças, e tecnologia.
                            </p>
                          </>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="exercises">
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Exercício 1</h3>
                          <p className="text-gray-600 mb-4">
                            Complete o exercício abaixo para testar seu entendimento dos conceitos apresentados.
                          </p>
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <p className="font-mono text-sm mb-4">
                              // Implemente a função para resolver o problema descrito
                            </p>
                            <Button className="mt-2">Verificar Resposta</Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Exercício 2</h3>
                          <p className="text-gray-600 mb-4">
                            Responda à pergunta de múltipla escolha abaixo.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="radio" id="option1" name="question" className="mr-2" />
                              <label htmlFor="option1">Opção A</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="option2" name="question" className="mr-2" />
                              <label htmlFor="option2">Opção B</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="option3" name="question" className="mr-2" />
                              <label htmlFor="option3">Opção C</label>
                            </div>
                            <Button className="mt-2">Verificar Resposta</Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="resources">
                      <div className="space-y-4">
                        <h3 className="font-medium">Materiais Complementares</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                            <a href="#" className="text-primary hover:underline">Artigo sobre o tópico (PDF)</a>
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-video text-blue-500 mr-2"></i>
                            <a href="#" className="text-primary hover:underline">Vídeo explicativo</a>
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-link text-green-500 mr-2"></i>
                            <a href="#" className="text-primary hover:underline">Link para recursos externos</a>
                          </li>
                        </ul>
                        
                        <h3 className="font-medium mt-6">Referências</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li>Referência 1: Autor, Título, Ano</li>
                          <li>Referência 2: Autor, Título, Ano</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = modules.findIndex(m => m.id === activeModule);
                      if (currentIndex > 0) {
                        setActiveModule(modules[currentIndex - 1].id);
                      }
                    }}
                    disabled={modules.findIndex(m => m.id === activeModule) === 0}
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Módulo Anterior
                  </Button>
                  
                  <Button
                    onClick={() => markAsComplete(activeModuleContent.id)}
                    disabled={isModuleCompleted(activeModuleContent.id) || updateProgressMutation.isPending}
                  >
                    {isModuleCompleted(activeModuleContent.id) 
                      ? "Módulo Concluído" 
                      : updateProgressMutation.isPending 
                        ? "Processando..." 
                        : "Marcar como Concluído"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = modules.findIndex(m => m.id === activeModule);
                      if (currentIndex < modules.length - 1) {
                        setActiveModule(modules[currentIndex + 1].id);
                      }
                    }}
                    disabled={modules.findIndex(m => m.id === activeModule) === modules.length - 1}
                  >
                    Próximo Módulo <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                <i className="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum módulo selecionado</h3>
                <p className="text-gray-500 text-center">
                  Selecione um módulo da lista para começar a aprender.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
