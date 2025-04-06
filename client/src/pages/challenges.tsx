import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/components/Challenge";
import { Challenge as ChallengeType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Challenges() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  
  // Fetch challenges
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });
  
  // Filter challenges based on search term and filters
  const filteredChallenges = challenges 
    ? challenges.filter((challenge: ChallengeType) => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter;
        const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
    : [];
    
  // Sort challenges by end date (closest to expiration first)
  const sortedChallenges = [...(filteredChallenges || [])].sort((a, b) => {
    if (!a.endDate || !b.endDate) return 0;
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
  });
  
  // Extract unique categories and difficulties
  const categories = challenges 
    ? [...new Set(challenges.map((challenge: ChallengeType) => challenge.category))]
    : [];
    
  const difficulties = challenges 
    ? [...new Set(challenges.map((challenge: ChallengeType) => challenge.difficulty))]
    : [];

  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Desafios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participe de desafios semanais para testar e melhorar suas habilidades em IA. Complete desafios para ganhar pontos e melhorar sua classificação.
          </p>
        </div>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Desafios Ativos</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos Desafios</TabsTrigger>
            <TabsTrigger value="completed">Desafios Completados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {/* Search and filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Pesquisar desafios..."
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
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as dificuldades</SelectItem>
                      {difficulties.map((difficulty, index) => (
                        <SelectItem key={index} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Challenges grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 h-64 animate-pulse">
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedChallenges.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedChallenges.map((challenge: ChallengeType) => (
                  <Challenge key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum desafio encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar seus filtros ou buscar por outros termos.</p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setDifficultyFilter("all");
                }}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Em Breve</h3>
              <p className="text-gray-600 mb-6">Fique atento para novos desafios que serão lançados em breve.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Histórico de Desafios</h3>
              <p className="text-gray-600 mb-6">Você ainda não completou nenhum desafio.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
