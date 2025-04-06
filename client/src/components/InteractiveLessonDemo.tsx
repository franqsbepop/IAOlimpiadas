import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Hourglass, Play, RotateCcw } from "lucide-react";
import { GradientDescentViz } from "./GradientDescentViz";
import { GradientDescentExplanation } from "./GradientDescentExplanation";

export function InteractiveLessonDemo() {
  const [learningRate, setLearningRate] = useState(3);
  const [epochs, setEpochs] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [explanationStep, setExplanationStep] = useState(0);
  
  const handleStartSimulation = () => {
    setIsSimulating(true);
  };
  
  const handleSimulationComplete = () => {
    setIsSimulating(false);
  };
  
  // Cycle through explanation steps during simulation
  useEffect(() => {
    if (!isSimulating) return;
    
    const explanationTimer = setInterval(() => {
      setExplanationStep(prev => (prev + 1) % 5);
    }, 5000);
    
    return () => clearInterval(explanationTimer);
  }, [isSimulating]);

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
      <div className="border-b border-border px-6 py-4 flex justify-between items-center bg-background">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-foreground font-medium">Redes Neuronais: Visualizando o Gradiente Descendente</div>
        <div className="w-20"></div>
      </div>
      
      <div className="p-6 md:p-8 bg-background">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="aspect-video bg-card rounded-lg border border-border overflow-hidden">
              <GradientDescentViz 
                learningRate={learningRate / 100}
                epochs={epochs}
                isRunning={isSimulating}
                onComplete={handleSimulationComplete}
              />
            </div>
            
            <Card className="bg-card">
              <div className="p-4">
                <h3 className="font-mono text-sm border-b border-border pb-2 mb-3 text-muted-foreground">Interaja com o algoritmo</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="w-full md:w-auto flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Taxa de aprendizagem: {(learningRate / 100).toFixed(2)}
                    </label>
                    <Slider
                      value={[learningRate]}
                      onValueChange={(values) => setLearningRate(values[0])}
                      max={30}
                      step={1}
                      disabled={isSimulating}
                    />
                  </div>
                  <div className="w-full md:w-auto flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Épocas: {epochs}
                    </label>
                    <Slider
                      value={[epochs]}
                      onValueChange={(values) => setEpochs(values[0])}
                      max={100}
                      min={10}
                      step={5}
                      disabled={isSimulating}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="px-4 py-2 h-10"
                      onClick={handleStartSimulation}
                      disabled={isSimulating}
                      variant="default"
                    >
                      {isSimulating ? (
                        <>
                          <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                          A simular...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Iniciar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="bg-muted p-4 rounded-lg border border-border space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-foreground">
                <ArrowRight className="h-4 w-4 text-primary" />
                Pseudocódigo para Gradiente Descendente
              </h4>
              <pre className="font-mono text-xs text-foreground bg-card p-3 rounded-md">
                <code>{`function gradientDescent(f, initial_params, learning_rate, epochs):
  params = initial_params
  for i from 1 to epochs:
    gradient = compute_gradient(f, params)
    params = params - learning_rate * gradient
  return params`}</code>
              </pre>
              <p className="text-xs text-muted-foreground">
                Este algoritmo ajusta iterativamente os parâmetros através do cálculo do gradiente 
                (derivada) da função de custo, movendo-se na direção que diminui o erro.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <GradientDescentExplanation currentStep={explanationStep} />
            
            <div className="mt-6 text-xs text-muted-foreground rounded-lg border border-border p-4 bg-card">
              <h4 className="font-medium text-sm mb-2 text-foreground">Nota do instrutor:</h4>
              <p className="mb-2">
                Esta visualização demonstra como um algoritmo de gradiente descendente encontra
                o mínimo de uma função de custo simples. Na prática, as redes neuronais otimizam
                funções muito mais complexas em espaços de alta dimensão.
              </p>
              <p>
                Observe como a taxa de aprendizagem afeta o comportamento do algoritmo. 
                Experimente valores diferentes para ver a diferença na trajetória!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
