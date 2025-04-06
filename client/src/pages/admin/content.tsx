import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LearningPath, Module, Challenge } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const { user, isAdmin } = useContext(AuthContext);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Fetch data for content management
  const { data: learningPaths, isLoading: loadingPaths } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
    enabled: isAdmin,
  });
  
  const { data: challenges, isLoading: loadingChallenges } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    enabled: isAdmin,
  });
  
  // Initialize form states
  const [newLearningPath, setNewLearningPath] = useState({
    title: "",
    description: "",
    level: "",
    category: "",
    totalModules: 0,
    estimatedHours: 0,
    primaryColor: "hsl(216, 90%, 60%)",
    icon: "fa-robot",
  });
  
  const [newModule, setNewModule] = useState({
    learningPathId: 0,
    title: "",
    description: "",
    content: "",
    order: 1,
    estimatedMinutes: 30,
  });
  
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    difficulty: "Médio",
    category: "",
    tags: [""],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    icon: "fa-code",
  });
  
  // Mutations for content management
  const createLearningPathMutation = useMutation({
    mutationFn: async (learningPath: typeof newLearningPath) => {
      return apiRequest("POST", "/api/learning-paths", learningPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Sucesso",
        description: "Caminho de aprendizagem criado com sucesso!",
      });
      setNewLearningPath({
        title: "",
        description: "",
        level: "",
        category: "",
        totalModules: 0,
        estimatedHours: 0,
        primaryColor: "hsl(216, 90%, 60%)",
        icon: "fa-robot",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar caminho de aprendizagem",
        variant: "destructive",
      });
    },
  });
  
  const createModuleMutation = useMutation({
    mutationFn: async (module: typeof newModule) => {
      return apiRequest("POST", "/api/modules", module);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Sucesso",
        description: "Módulo criado com sucesso!",
      });
      setNewModule({
        learningPathId: 0,
        title: "",
        description: "",
        content: "",
        order: 1,
        estimatedMinutes: 30,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar módulo",
        variant: "destructive",
      });
    },
  });
  
  const createChallengeMutation = useMutation({
    mutationFn: async (challenge: typeof newChallenge) => {
      return apiRequest("POST", "/api/challenges", challenge);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      toast({
        title: "Sucesso",
        description: "Desafio criado com sucesso!",
      });
      setNewChallenge({
        title: "",
        description: "",
        difficulty: "Médio",
        category: "",
        tags: [""],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        icon: "fa-code",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar desafio",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateLearningPath = () => {
    if (!newLearningPath.title || !newLearningPath.description || !newLearningPath.level || !newLearningPath.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    createLearningPathMutation.mutate(newLearningPath);
  };
  
  const handleCreateModule = () => {
    if (!newModule.learningPathId || !newModule.title || !newModule.description || !newModule.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    createModuleMutation.mutate(newModule);
  };
  
  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.description || !newChallenge.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    createChallengeMutation.mutate(newChallenge);
  };
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="pl-64">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Conteúdo</h1>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <i className="fas fa-plus mr-2"></i> Novo Caminho
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Caminho de Aprendizagem</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título*</Label>
                      <Input 
                        id="title" 
                        value={newLearningPath.title}
                        onChange={(e) => setNewLearningPath({...newLearningPath, title: e.target.value})}
                        placeholder="Título do caminho"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição*</Label>
                      <Textarea 
                        id="description" 
                        value={newLearningPath.description}
                        onChange={(e) => setNewLearningPath({...newLearningPath, description: e.target.value})}
                        placeholder="Descrição do caminho"
                        required
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Nível*</Label>
                        <Select 
                          value={newLearningPath.level}
                          onValueChange={(value) => setNewLearningPath({...newLearningPath, level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Para Iniciantes">Para Iniciantes</SelectItem>
                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                            <SelectItem value="Avançado">Avançado</SelectItem>
                            <SelectItem value="Para Matemáticos">Para Matemáticos</SelectItem>
                            <SelectItem value="Para Biólogos">Para Biólogos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria*</Label>
                        <Select 
                          value={newLearningPath.category}
                          onValueChange={(value) => setNewLearningPath({...newLearningPath, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AI Fundamentals">AI Fundamentals</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                            <SelectItem value="NLP">NLP</SelectItem>
                            <SelectItem value="Domain Specific">Domain Specific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalModules">Total de Módulos*</Label>
                        <Input 
                          id="totalModules" 
                          type="number"
                          value={newLearningPath.totalModules}
                          onChange={(e) => setNewLearningPath({
                            ...newLearningPath, 
                            totalModules: parseInt(e.target.value)
                          })}
                          min={1}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimatedHours">Horas Estimadas*</Label>
                        <Input 
                          id="estimatedHours" 
                          type="number"
                          value={newLearningPath.estimatedHours}
                          onChange={(e) => setNewLearningPath({
                            ...newLearningPath, 
                            estimatedHours: parseInt(e.target.value)
                          })}
                          min={1}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="icon">Ícone*</Label>
                        <Select 
                          value={newLearningPath.icon}
                          onValueChange={(value) => setNewLearningPath({...newLearningPath, icon: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fa-robot">
                              <i className="fas fa-robot mr-2"></i> Robot
                            </SelectItem>
                            <SelectItem value="fa-brain">
                              <i className="fas fa-brain mr-2"></i> Brain
                            </SelectItem>
                            <SelectItem value="fa-dna">
                              <i className="fas fa-dna mr-2"></i> DNA
                            </SelectItem>
                            <SelectItem value="fa-chart-network">
                              <i className="fas fa-project-diagram mr-2"></i> Network
                            </SelectItem>
                            <SelectItem value="fa-microchip">
                              <i className="fas fa-microchip mr-2"></i> Microchip
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Cor Primária</Label>
                        <Input 
                          id="primaryColor" 
                          type="color"
                          value={newLearningPath.primaryColor.startsWith("hsl") 
                            ? "#3B82F6" 
                            : newLearningPath.primaryColor}
                          onChange={(e) => setNewLearningPath({
                            ...newLearningPath, 
                            primaryColor: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleCreateLearningPath} disabled={createLearningPathMutation.isPending}>
                      {createLearningPathMutation.isPending ? "Criando..." : "Criar Caminho"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <i className="fas fa-plus mr-2"></i> Novo Módulo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Módulo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="learningPathId">Caminho de Aprendizagem*</Label>
                      <Select 
                        value={newModule.learningPathId.toString()}
                        onValueChange={(value) => setNewModule({
                          ...newModule, 
                          learningPathId: parseInt(value)
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o caminho" />
                        </SelectTrigger>
                        <SelectContent>
                          {learningPaths?.map((path) => (
                            <SelectItem key={path.id} value={path.id.toString()}>
                              {path.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moduleTitle">Título do Módulo*</Label>
                      <Input 
                        id="moduleTitle" 
                        value={newModule.title}
                        onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                        placeholder="Título do módulo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moduleDescription">Descrição*</Label>
                      <Textarea 
                        id="moduleDescription" 
                        value={newModule.description}
                        onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                        placeholder="Descrição do módulo"
                        required
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moduleContent">Conteúdo*</Label>
                      <Textarea 
                        id="moduleContent" 
                        value={newModule.content}
                        onChange={(e) => setNewModule({...newModule, content: e.target.value})}
                        placeholder="Conteúdo do módulo (HTML suportado)"
                        required
                        rows={5}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="moduleOrder">Ordem*</Label>
                        <Input 
                          id="moduleOrder" 
                          type="number"
                          value={newModule.order}
                          onChange={(e) => setNewModule({
                            ...newModule, 
                            order: parseInt(e.target.value)
                          })}
                          min={1}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moduleEstimatedMinutes">Minutos Estimados*</Label>
                        <Input 
                          id="moduleEstimatedMinutes" 
                          type="number"
                          value={newModule.estimatedMinutes}
                          onChange={(e) => setNewModule({
                            ...newModule, 
                            estimatedMinutes: parseInt(e.target.value)
                          })}
                          min={1}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleCreateModule} disabled={createModuleMutation.isPending}>
                      {createModuleMutation.isPending ? "Criando..." : "Criar Módulo"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <i className="fas fa-plus mr-2"></i> Novo Desafio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Desafio</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="challengeTitle">Título*</Label>
                      <Input 
                        id="challengeTitle" 
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                        placeholder="Título do desafio"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challengeDescription">Descrição*</Label>
                      <Textarea 
                        id="challengeDescription" 
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                        placeholder="Descrição do desafio"
                        required
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="challengeDifficulty">Dificuldade*</Label>
                        <Select 
                          value={newChallenge.difficulty}
                          onValueChange={(value) => setNewChallenge({...newChallenge, difficulty: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fácil">Fácil</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Difícil">Difícil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="challengeCategory">Categoria*</Label>
                        <Select 
                          value={newChallenge.category}
                          onValueChange={(value) => setNewChallenge({...newChallenge, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                            <SelectItem value="NLP">NLP</SelectItem>
                            <SelectItem value="Time Series">Time Series</SelectItem>
                            <SelectItem value="Reinforcement Learning">Reinforcement Learning</SelectItem>
                            <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challengeTags">Tags (separadas por vírgula)</Label>
                      <Input 
                        id="challengeTags" 
                        value={newChallenge.tags.join(", ")}
                        onChange={(e) => setNewChallenge({
                          ...newChallenge, 
                          tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                        })}
                        placeholder="Python, TensorFlow, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="challengeStartDate">Data de Início*</Label>
                        <Input 
                          id="challengeStartDate" 
                          type="date"
                          value={newChallenge.startDate}
                          onChange={(e) => setNewChallenge({...newChallenge, startDate: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="challengeEndDate">Data de Término*</Label>
                        <Input 
                          id="challengeEndDate" 
                          type="date"
                          value={newChallenge.endDate}
                          onChange={(e) => setNewChallenge({...newChallenge, endDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challengeIcon">Ícone*</Label>
                      <Select 
                        value={newChallenge.icon}
                        onValueChange={(value) => setNewChallenge({...newChallenge, icon: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fa-code">
                            <i className="fas fa-code mr-2"></i> Code
                          </SelectItem>
                          <SelectItem value="fa-chart-line">
                            <i className="fas fa-chart-line mr-2"></i> Chart
                          </SelectItem>
                          <SelectItem value="fa-comments">
                            <i className="fas fa-comments mr-2"></i> Comments
                          </SelectItem>
                          <SelectItem value="fa-image">
                            <i className="fas fa-image mr-2"></i> Image
                          </SelectItem>
                          <SelectItem value="fa-flask">
                            <i className="fas fa-flask mr-2"></i> Flask
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleCreateChallenge} disabled={createChallengeMutation.isPending}>
                      {createChallengeMutation.isPending ? "Criando..." : "Criar Desafio"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Tabs defaultValue="learning-paths" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="learning-paths">Caminhos de Aprendizagem</TabsTrigger>
              <TabsTrigger value="challenges">Desafios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learning-paths">
              <Card>
                <CardHeader>
                  <CardTitle>Caminhos de Aprendizagem</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPaths ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  ) : learningPaths && learningPaths.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Título</th>
                            <th className="px-6 py-3">Nível</th>
                            <th className="px-6 py-3">Categoria</th>
                            <th className="px-6 py-3">Módulos</th>
                            <th className="px-6 py-3">Horas</th>
                            <th className="px-6 py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {learningPaths.map((path) => (
                            <tr key={path.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4">{path.id}</td>
                              <td className="px-6 py-4 font-medium">{path.title}</td>
                              <td className="px-6 py-4">{path.level}</td>
                              <td className="px-6 py-4">{path.category}</td>
                              <td className="px-6 py-4">{path.totalModules}</td>
                              <td className="px-6 py-4">{path.estimatedHours}</td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <i className="fas fa-edit"></i>
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum caminho de aprendizagem encontrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="challenges">
              <Card>
                <CardHeader>
                  <CardTitle>Desafios</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingChallenges ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  ) : challenges && challenges.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Título</th>
                            <th className="px-6 py-3">Dificuldade</th>
                            <th className="px-6 py-3">Categoria</th>
                            <th className="px-6 py-3">Participantes</th>
                            <th className="px-6 py-3">Data Término</th>
                            <th className="px-6 py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {challenges.map((challenge) => (
                            <tr key={challenge.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4">{challenge.id}</td>
                              <td className="px-6 py-4 font-medium">{challenge.title}</td>
                              <td className="px-6 py-4">{challenge.difficulty}</td>
                              <td className="px-6 py-4">{challenge.category}</td>
                              <td className="px-6 py-4">{challenge.participants}</td>
                              <td className="px-6 py-4">
                                {challenge.endDate 
                                  ? new Date(challenge.endDate).toLocaleDateString() 
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <i className="fas fa-edit"></i>
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum desafio encontrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
