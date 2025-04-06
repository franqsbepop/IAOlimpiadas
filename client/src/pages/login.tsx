import { useState, FormEvent, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha ao fazer login");
      }
      
      const userData = await response.json();
      
      // Store user in context and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a) de volta, ${userData.name}!`,
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="container px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <CardTitle className="text-2xl">Entrar</CardTitle>
            </div>
            <CardDescription>
              Entre na sua conta para acessar as trilhas de aprendizado e participar de desafios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Ainda não tem uma conta?{" "}
              <Link href="/register">
                <a className="text-primary hover:underline">Registrar</a>
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
