import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Leaderboard() {
  // Fetch general leaderboard
  const { data: generalLeaderboard, isLoading: loadingGeneral } = useQuery({
    queryKey: ["/api/leaderboard"],
  });
  
  // Fetch weekly leaderboard
  const { data: weeklyLeaderboard, isLoading: loadingWeekly } = useQuery({
    queryKey: ["/api/leaderboard/weekly"],
  });

  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Classificação das Olimpíadas</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe os melhores competidores de todas as instituições em Portugal. Complete desafios e ganhe pontos para melhorar sua posição.
          </p>
        </div>
        
        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Classificação Geral</TabsTrigger>
            <TabsTrigger value="weekly">Classificação Semanal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            {loadingGeneral ? (
              <div className="bg-background rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-primary text-white">
                  <h3 className="font-semibold">Melhores Competidores</h3>
                </div>
                <div className="p-6 animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : generalLeaderboard && generalLeaderboard.length > 0 ? (
              <LeaderboardTable entries={generalLeaderboard} isWeekly={false} />
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sem dados de classificação</h3>
                <p className="text-gray-600">
                  Ainda não há dados suficientes para mostrar a classificação geral.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weekly">
            {loadingWeekly ? (
              <div className="bg-background rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-primary text-white">
                  <h3 className="font-semibold">Melhores Competidores Semanais</h3>
                </div>
                <div className="p-6 animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : weeklyLeaderboard && weeklyLeaderboard.length > 0 ? (
              <LeaderboardTable entries={weeklyLeaderboard} isWeekly={true} />
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sem dados semanais</h3>
                <p className="text-gray-600">
                  Ainda não há dados suficientes para mostrar a classificação semanal.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mt-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Como funciona a pontuação?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <i className="fas fa-tasks text-green-600"></i>
                </div>
                <h3 className="font-semibold">Completar Desafios</h3>
              </div>
              <p className="text-gray-600">Ganhe de 100 a 500 pontos por completar desafios, dependendo do nível de dificuldade.</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <i className="fas fa-graduation-cap text-blue-600"></i>
                </div>
                <h3 className="font-semibold">Concluir Trilhas</h3>
              </div>
              <p className="text-gray-600">Ganhe 300 pontos por concluir uma trilha de aprendizado completa.</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <i className="fas fa-medal text-purple-600"></i>
                </div>
                <h3 className="font-semibold">Medalhas</h3>
              </div>
              <p className="text-gray-600">Ganhe medalhas por estar entre os 3 primeiros colocados em desafios competitivos.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
