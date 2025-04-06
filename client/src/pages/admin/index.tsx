import { useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/ui/chart";
import { User, LearningPath, Challenge } from "@/lib/types";

export default function AdminDashboard() {
  const { user, isAdmin } = useContext(AuthContext);
  const [, navigate] = useLocation();
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Fetch data for dashboard
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAdmin,
  });
  
  const { data: learningPaths } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
    enabled: isAdmin,
  });
  
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    enabled: isAdmin,
  });
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="pl-64">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <div>
              <Button className="ml-2">
                <i className="fas fa-sync-alt mr-2"></i> Atualizar Dados
              </Button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total de Usuários</p>
                  <h3 className="text-3xl font-bold">{users?.length || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-users text-blue-500"></i>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Trilhas de Aprendizado</p>
                  <h3 className="text-3xl font-bold">{learningPaths?.length || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-book text-green-500"></i>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Desafios Ativos</p>
                  <h3 className="text-3xl font-bold">{challenges?.length || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-trophy text-purple-500"></i>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Participações</p>
                  <h3 className="text-3xl font-bold">
                    {challenges?.reduce((acc, challenge) => acc + (challenge.participants || 0), 0) || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-chart-bar text-orange-500"></i>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Participação por Trilha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart 
                    type="bar"
                    data={{
                      labels: learningPaths?.map(path => path.title) || [],
                      datasets: [
                        {
                          label: 'Usuários',
                          data: new Array(learningPaths?.length || 0).fill(0).map(() => Math.floor(Math.random() * 100)),
                          backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Participação por Desafio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Chart 
                    type="bar"
                    data={{
                      labels: challenges?.map(challenge => challenge.title) || [],
                      datasets: [
                        {
                          label: 'Participantes',
                          data: challenges?.map(challenge => challenge.participants || 0) || [],
                          backgroundColor: 'rgba(139, 92, 246, 0.6)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Usuário</th>
                      <th className="px-6 py-3">Atividade</th>
                      <th className="px-6 py-3">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">Ana Silva</td>
                      <td className="px-6 py-4">Completou a trilha "Fundamentos de IA"</td>
                      <td className="px-6 py-4">Hoje, 15:32</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">João Santos</td>
                      <td className="px-6 py-4">Participou do desafio "Classificação de Imagens"</td>
                      <td className="px-6 py-4">Hoje, 14:45</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">Maria Costa</td>
                      <td className="px-6 py-4">Registrou-se na plataforma</td>
                      <td className="px-6 py-4">Hoje, 12:18</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">Pedro Oliveira</td>
                      <td className="px-6 py-4">Começou a trilha "Matemática para IA"</td>
                      <td className="px-6 py-4">Ontem, 18:05</td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">Sofia Martins</td>
                      <td className="px-6 py-4">Completou o módulo "Redes Neurais"</td>
                      <td className="px-6 py-4">Ontem, 16:30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
