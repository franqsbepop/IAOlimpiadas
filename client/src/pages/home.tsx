import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FeatureCard } from "@/components/FeatureCard";
import { LearningPath } from "@/components/LearningPath";
import { Challenge } from "@/components/Challenge";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { InteractiveLessonDemo } from "@/components/InteractiveLessonDemo";
import { Feature, LearningPath as LearningPathType, Challenge as ChallengeType, LeaderboardEntry } from "@/lib/types";
import { useContext } from "react";
import { AuthContext } from "@/App";

export default function Home() {
  const { user } = useContext(AuthContext);
  
  // Fetch learning paths
  const { data: learningPaths } = useQuery({
    queryKey: ["/api/learning-paths"],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Fetch challenges
  const { data: challenges } = useQuery({
    queryKey: ["/api/challenges"],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Fetch leaderboard
  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard"],
    queryParams: { limit: 5 },
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Feature cards
  const features: Feature[] = [
    {
      icon: "fa-graduation-cap",
      title: "Aprendizagem Interativa",
      description: "Cursos dinâmicos com visualizações interativas e exercícios práticos para reforçar conceitos.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: "fa-trophy",
      title: "Competições e Desafios",
      description: "Participe em desafios semanais e olimpíadas nacionais para testar suas habilidades.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: "fa-users",
      title: "Comunidade Diversificada",
      description: "Conecte-se com estudantes de todas as áreas acadêmicas interessados em IA.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Olimpíadas Nacionais de Inteligência Artificial</h1>
              <p className="text-xl md:text-2xl font-light mb-6">Aprenda, pratique e compita em desafios de IA para estudantes portugueses de todas as áreas.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/learning-paths">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                    Começar a Aprender
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-transparent text-white border border-white hover:bg-white/10">
                  Sobre as Olimpíadas
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-accent rounded-full opacity-40 blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary rounded-full opacity-30 blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="IA visualização científica"
                  className="relative z-10 rounded-xl shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Uma Nova Forma de Aprender IA</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A nossa plataforma foi projetada para tornar a aprendizagem de conceitos de IA acessível e envolvente para estudantes de todas as áreas académicas.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Learning Paths Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Caminhos de Aprendizagem</h2>
              <p className="text-gray-600">Percursos personalizados para diferentes áreas de estudo e níveis de experiência.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/learning-paths">
                <a className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition">
                  Ver todos os caminhos <i className="fas fa-arrow-right"></i>
                </a>
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths ? (
              learningPaths.slice(0, 3).map((path: LearningPathType) => (
                <LearningPath 
                  key={path.id} 
                  learningPath={path} 
                />
              ))
            ) : (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Interactive Lesson Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aprenda com Visualizações Interativas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A nossa abordagem combina teoria e prática com visualizações inspiradas no estilo 3Blue1Brown para melhor compreensão de conceitos complexos.</p>
          </div>
          
          <InteractiveLessonDemo />
        </div>
      </section>
      
      {/* Challenges Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Desafios Semanais</h2>
              <p className="text-gray-600">Teste as suas competências e prepare-se para as Olimpíadas Nacionais de IA.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/challenges">
                <a className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition">
                  Ver todos os desafios <i className="fas fa-arrow-right"></i>
                </a>
              </Link>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges ? (
              challenges.slice(0, 3).map((challenge: ChallengeType) => (
                <Challenge key={challenge.id} challenge={challenge} />
              ))
            ) : (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
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
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Leaderboard Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Classificação das Olimpíadas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Acompanhe os melhores participantes de todas as instituições em Portugal.</p>
          </div>
          
          {leaderboard ? (
            <LeaderboardTable entries={leaderboard} />
          ) : (
            <div className="bg-background rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="px-6 py-4 bg-primary text-white">
                <h3 className="font-semibold">Melhores Participantes</h3>
              </div>
              <div className="p-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Committee Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comité Organizador das Olimpíadas Portuguesas de IA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Prof. Inês Lynce</h3>
              <p className="text-gray-500 mb-3">Instituto Superior Técnico</p>
              <p className="text-gray-600">
                Especialista em Inteligência Artificial Simbólica e coordenadora científica das Olimpíadas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Prof. Mário Figueiredo</h3>
              <p className="text-gray-500 mb-3">Instituto Superior Técnico</p>
              <p className="text-gray-600">
                Especialista em Aprendizagem Automática e responsável pelo desenvolvimento dos desafios técnicos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Prof. André Martins</h3>
              <p className="text-gray-500 mb-3">Instituto Superior Técnico</p>
              <p className="text-gray-600">
                Especialista em Processamento de Linguagem Natural e diretor técnico da plataforma educativa.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              O comité organizador das Olimpíadas Portuguesas de IA reúne especialistas do Instituto Superior Técnico, 
              trabalhando em conjunto para promover a literacia em IA entre os jovens estudantes de todas as áreas.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Conheça a Nossa Equipa Completa
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Está pronto para iniciar a sua jornada em IA?</h2>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
            Junte-se a estudantes de todo Portugal para aprender, praticar e competir nas Olimpíadas Nacionais de IA.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link href="/learning-paths">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                  Explorar Caminhos de Aprendizagem
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
                  Criar Conta Gratuita
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="bg-transparent text-white border border-white hover:bg-white/10">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
