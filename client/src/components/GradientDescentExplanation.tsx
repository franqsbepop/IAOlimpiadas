import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LucideInfo, ExternalLink } from 'lucide-react';

interface GradientDescentExplanationProps {
  currentStep: number;
}

const explanationSteps = [
  {
    title: 'O que é o Gradiente Descendente?',
    content: 'O gradiente descendente é um algoritmo de otimização utilizado para encontrar o mínimo de uma função de custo, ajustando iterativamente os parâmetros do modelo. Este algoritmo é fundamental para treinar modelos de aprendizagem automática, incluindo redes neuronais profundas.',
  },
  {
    title: 'Como Funciona',
    content: 'O algoritmo calcula o gradiente (derivada) da função de custo em relação a cada parâmetro. Estes gradientes indicam a direção de maior crescimento da função, por isso, para minimizar a função, movemo-nos na direção oposta ao gradiente. A magnitude desse movimento é controlada pela taxa de aprendizagem.',
  },
  {
    title: 'Taxa de Aprendizagem',
    content: 'A taxa de aprendizagem determina o tamanho dos passos que damos na direção do gradiente. Uma taxa muito pequena pode resultar numa convergência lenta, enquanto uma taxa muito alta pode fazer o algoritmo saltar sobre o mínimo ou até mesmo divergir.',
  },
  {
    title: 'Épocas',
    content: 'As épocas representam o número de iterações que o algoritmo executa. Com mais épocas, o algoritmo tem mais oportunidades para ajustar os parâmetros e aproximar-se do mínimo global, mas demasiadas épocas podem resultar em sobreajustamento (overfitting).',
  },
  {
    title: 'Aplicações em IA',
    content: 'O gradiente descendente é utilizado para treinar uma variedade de modelos de IA, incluindo redes neuronais, algoritmos de classificação e modelos de regressão. É o motor que impulsiona a maioria dos modelos de aprendizagem profunda utilizados hoje.',
  },
];

export function GradientDescentExplanation({ currentStep }: GradientDescentExplanationProps) {
  const step = explanationSteps[currentStep % explanationSteps.length];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <LucideInfo className="h-5 w-5 text-primary" />
          {step.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
        
        {currentStep === 4 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-2">Para Saber Mais:</h4>
            <Button variant="outline" size="sm" className="w-full text-left flex items-center justify-between">
              <span>Matemática do Gradiente Descendente</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-full text-left flex items-center justify-between">
              <span>Variantes do Gradiente Descendente</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex space-x-1">
            {explanationSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-6 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} de {explanationSteps.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}