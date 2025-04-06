import { LearningPath as LearningPathType, UserProgress } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/App";

interface LearningPathProps {
  learningPath: LearningPathType;
  userProgress?: UserProgress;
}

export function LearningPath({ learningPath, userProgress }: LearningPathProps) {
  const { user } = useContext(AuthContext);
  
  const progressPercent = userProgress ? 
    Math.round((userProgress.completedModules / learningPath.totalModules) * 100) : 0;
  
  const primaryColorStyle = learningPath.primaryColor ? 
    { backgroundColor: learningPath.primaryColor } : {};
    
  const buttonColorStyle = learningPath.primaryColor ? 
    { color: learningPath.primaryColor } : {};
    
  const progressColorStyle = learningPath.primaryColor ? 
    { backgroundColor: learningPath.primaryColor } : {};

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col">
      <div className="h-40 relative overflow-hidden" style={primaryColorStyle}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
          <i className={`fas ${learningPath.icon} text-white text-5xl opacity-30`}></i>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <span className="bg-white/90 text-primary px-2 py-1 rounded-md text-sm font-medium">
            {learningPath.level}
          </span>
          <h3 className="text-white text-xl mt-2 font-bold">{learningPath.title}</h3>
        </div>
      </div>
      <div className="p-5 flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <i className="fas fa-book mr-2"></i> {learningPath.totalModules} módulos
          <span className="mx-2">•</span>
          <i className="fas fa-clock mr-2"></i> {learningPath.estimatedHours} horas
        </div>
        <p className="text-gray-600 mb-4">{learningPath.description}</p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-gray-500">{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2" 
            indicatorColor={learningPath.primaryColor ? "progress-indicator" : undefined}
            style={{ "--progress-indicator": progressColorStyle.backgroundColor } as React.CSSProperties}
          />
        </div>
      </div>
      <div className="border-t border-gray-100 p-4">
        <Link href={`/learning-paths/${learningPath.id}`}>
          <Button 
            variant="outline" 
            className="w-full bg-light hover:bg-gray-100 font-medium py-2 rounded-lg transition"
            style={buttonColorStyle}
          >
            {userProgress && userProgress.completedModules > 0 
              ? "Continuar Trilha" 
              : "Iniciar Trilha"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
