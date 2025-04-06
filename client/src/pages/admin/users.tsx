import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types";

export default function AdminUsers() {
  const { user, isAdmin } = useContext(AuthContext);
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAdmin,
  });
  
  // Filter users based on search term
  const filteredUsers = users 
    ? users.filter((u) => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.institution && u.institution.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="pl-64">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <i className="fas fa-plus mr-2"></i> Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-gray-500 text-sm mb-4">
                      Esta funcionalidade não está implementada nesta versão de demonstração.
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button>Fechar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="w-64">
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-filter mr-2"></i> Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-download mr-2"></i> Exportar
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ) : users && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Username</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Instituição</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{user.id}</td>
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center">
                              <img 
                                className="w-8 h-8 rounded-full mr-3" 
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} 
                                alt={user.name}
                              />
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">@{user.username}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.institution || "N/A"}</td>
                          <td className="px-6 py-4">
                            <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                              {user.role === "admin" ? "Admin" : "Student"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <i className="fas fa-eye"></i>
                              </Button>
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
                  <p className="text-gray-500">Nenhum usuário encontrado.</p>
                </div>
              )}
              
              {users && users.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {filteredUsers.length} de {users.length} usuários
                  </p>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" disabled>
                      <i className="fas fa-chevron-left mr-1"></i> Anterior
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Próximo <i className="fas fa-chevron-right ml-1"></i>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Papéis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  {users ? (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium">Estudantes</span>
                        <span className="text-sm text-gray-500">
                          {users.filter(u => u.role === "student").length}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full">
                        <div 
                          className="h-4 bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${users.filter(u => u.role === "student").length / users.length * 100}%` 
                          }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4 mt-6">
                        <span className="text-sm font-medium">Administradores</span>
                        <span className="text-sm text-gray-500">
                          {users.filter(u => u.role === "admin").length}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full">
                        <div 
                          className="h-4 bg-red-500 rounded-full" 
                          style={{ 
                            width: `${users.filter(u => u.role === "admin").length / users.length * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-4 w-full">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários por Instituição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 overflow-auto">
                  {users ? (
                    <div>
                      {Array.from(new Set(users.map(u => u.institution || "Não Informado")))
                        .map(institution => ({
                          name: institution,
                          count: users.filter(u => (u.institution || "Não Informado") === institution).length
                        }))
                        .sort((a, b) => b.count - a.count)
                        .map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500">{item.count}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-green-500 rounded-full" 
                                style={{ width: `${item.count / users.length * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
