import { Challenge as ChallengeType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChallengeProps {
  challenge: ChallengeType;
}

export function Challenge({ challenge }: ChallengeProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800";
      case "Médio":
        return "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const difficultyClass = getDifficultyColor(challenge.difficulty);
  
  const daysRemaining = challenge.endDate ? getDaysRemaining(challenge.endDate) : 0;
  
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to participate in challenges");
      }
      
      // Join the challenge
      return apiRequest("POST", "/api/challenge-submissions", {
        userId: user.id,
        challengeId: challenge.id,
        status: "started",
        solution: "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      toast({
        title: "Participação confirmada!",
        description: "Você agora está participando deste desafio. Boa sorte!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao participar do desafio. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const handleParticipate = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para participar dos desafios.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate();
  };
  
  const primaryColorStyle = challenge.primaryColor ? 
    { color: challenge.primaryColor, borderColor: challenge.primaryColor } : {};
  
  const primaryBgStyle = challenge.primaryColor ? 
    { backgroundColor: challenge.primaryColor } : {};

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
            <i className={`fas ${challenge.icon} text-primary`}></i>
          </div>
          <h3 className="font-semibold">{challenge.title}</h3>
        </div>
        <div>
          <span className={`${difficultyClass} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {challenge.difficulty}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 mb-4">{challenge.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags && challenge.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            <i className="fas fa-users mr-1"></i> {challenge.participants} participantes
          </div>
          <div>
            <i className="fas fa-clock mr-1"></i> Termina em {daysRemaining} dias
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-4">
        <Button 
          onClick={handleParticipate}
          disabled={mutation.isPending} 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition"
          style={primaryBgStyle}
        >
          {mutation.isPending ? "Processando..." : "Participar do Desafio"}
        </Button>
      </div>
    </div>
  );
}
