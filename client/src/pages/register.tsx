import { useState, FormEvent, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name || !username || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }
    
    // Simple password validation
    if (password.length < 6) {
      toast({
        title: "Senha fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          institution,
          role: "student",
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha ao registrar");
      }
      
      const userData = await response.json();
      
      // Store user in context and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso!",
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao registrar",
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
              <CardTitle className="text-2xl">Criar Conta</CardTitle>
            </div>
            <CardDescription>
              Crie uma conta para acessar os caminhos de aprendizagem e participar das Olimpíadas Nacionais de IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo*</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário*</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Escolha um nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu endereço de email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição de Ensino</Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder="Sua universidade ou escola"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha*</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Escolha uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? "Processando..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login">
                <a className="text-primary hover:underline">Entrar</a>
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
