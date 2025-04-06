import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LearningPath } from "@/components/LearningPath";
import { LearningPath as LearningPathType, UserProgress } from "@/lib/types";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LearningPaths() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  
  // Fetch learning paths
  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ["/api/learning-paths"],
  });
  
  // Fetch user progress if user is logged in
  const { data: userProgress } = useQuery({
    queryKey: ["/api/users", user?.id, "progress"],
    enabled: !!user,
  });
  
  // Filter learning paths based on search term and filters
  const filteredLearningPaths = learningPaths 
    ? learningPaths.filter((path: LearningPathType) => {
        const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              path.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || path.category === categoryFilter;
        const matchesLevel = levelFilter === "all" || path.level === levelFilter;
        
        return matchesSearch && matchesCategory && matchesLevel;
      })
    : [];
  
  // Extract unique categories and levels
  const categories = learningPaths 
    ? [...new Set(learningPaths.map((path: LearningPathType) => path.category))]
    : [];
    
  const levels = learningPaths 
    ? [...new Set(learningPaths.map((path: LearningPathType) => path.level))]
    : [];
  
  // Get user progress for a specific learning path
  const getProgressForPath = (pathId: number) => {
    if (!userProgress) return undefined;
    return userProgress.find((progress: UserProgress) => progress.learningPathId === pathId);
  };

  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Caminhos de Aprendizagem</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore os nossos caminhos de aprendizagem personalizados para diferentes áreas de estudo e níveis de experiência.
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Pesquisar caminhos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={levelFilter}
                onValueChange={setLevelFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  {levels.map((level, index) => (
                    <SelectItem key={index} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Learning paths grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLearningPaths.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLearningPaths.map((path: LearningPathType) => (
              <LearningPath
                key={path.id}
                learningPath={path}
                userProgress={getProgressForPath(path.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum caminho encontrado</h3>
            <p className="text-gray-600 mb-6">Tente ajustar seus filtros ou buscar por outros termos.</p>
            <Button onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setLevelFilter("all");
            }}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
