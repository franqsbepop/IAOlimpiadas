import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function InteractiveLessonDemo() {
  const [learningRate, setLearningRate] = useState(30);
  const [epochs, setEpochs] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const handleStartSimulation = () => {
    setIsSimulating(true);
    
    // Simulate a delay for the visualization
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="bg-background rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-900 font-medium">Redes Neurais: Visualizando o Gradiente Descendente</div>
        <div className="w-20"></div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <i className="fas fa-chart-line text-5xl mb-4 text-primary"></i>
                <p className="text-white">Visualização interativa do gradiente descendente</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-mono text-sm border-b border-gray-200 pb-2 mb-3 text-gray-500">Interaja com o algoritmo</h3>
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de aprendizagem: {learningRate / 100}</label>
                  <Slider
                    value={[learningRate]}
                    onValueChange={(values) => setLearningRate(values[0])}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Épocas: {epochs}</label>
                  <Slider
                    value={[epochs]}
                    onValueChange={(values) => setEpochs(values[0])}
                    max={100}
                    step={1}
                  />
                </div>
                <Button 
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                >
                  {isSimulating ? "Simulando..." : "Iniciar Simulação"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-xl mb-4">O que é Gradiente Descendente?</h3>
            <p className="text-gray-600 mb-4">O gradiente descendente é um algoritmo de otimização utilizado para encontrar o mínimo de uma função, ajustando iterativamente os seus parâmetros.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <pre className="font-mono text-sm">
                <code className="text-primary">// Pseudocódigo para Gradiente Descendente</code>
                <div>function gradientDescent(f, initial_params, learning_rate, epochs):</div>
                <div className="pl-4">params = initial_params</div>
                <div className="pl-4">for i from 1 to epochs:</div>
                <div className="pl-8">gradient = compute_gradient(f, params)</div>
                <div className="pl-8">params = params - learning_rate * gradient</div>
                <div className="pl-4">return params</div>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Aplicações em IA:</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Treino de redes neuronais</li>
                <li>Regressão logística</li>
                <li>Máquinas de vetores de suporte (SVM)</li>
                <li>Muitos outros algoritmos de aprendizagem automática</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
