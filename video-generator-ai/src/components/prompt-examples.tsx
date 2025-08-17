import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

interface PromptExample {
  title: string;
  description: string;
  prompt: string;
  category: string;
  estimatedCost: number;
  recommendedConfig: {
    duration: '5' | '10' | '15';
    aspectRatio: '4:3' | '3:4' | '16:9' | '1:1' | '9:16';
    resolution: '480p' | '720p' | '1080p';
  };
}

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    title: "Naturaleza Serena",
    description: "Perfecto para contenido relajante",
    prompt: "Un bosque místico al amanecer con rayos de sol filtrándose entre árboles antiguos, neblina suave flotando sobre un arroyo cristalino, pájaros volando pacíficamente",
    category: "Naturaleza",
    estimatedCost: 7.5,
    recommendedConfig: { duration: '10', aspectRatio: '16:9', resolution: '720p' }
  },
  {
    title: "Producto Comercial",
    description: "Ideal para marketing y publicidad",
    prompt: "Una elegante botella de perfume girando lentamente sobre una superficie de mármol blanco, con iluminación profesional y pétalos de rosa cayendo suavemente alrededor",
    category: "Comercial",
    estimatedCost: 12.0,
    recommendedConfig: { duration: '10', aspectRatio: '1:1', resolution: '1080p' }
  },
  {
    title: "Contenido Social",
    description: "Optimizado para redes sociales",
    prompt: "Una persona joven sonriendo mientras prepara un smoothie colorido en una cocina moderna y luminosa, ingredientes frescos saltando dinámicamente",
    category: "Social Media",
    estimatedCost: 7.5,
    recommendedConfig: { duration: '10', aspectRatio: '9:16', resolution: '720p' }
  },
  {
    title: "Tecnología Futurista",
    description: "Para contenido tech y ciencia ficción",
    prompt: "Una ciudad futurista con rascacielos holográficos brillando en la noche, vehículos voladores pasando entre los edificios, aurora boreal artificial en el cielo",
    category: "Sci-Fi",
    estimatedCost: 18.0,
    recommendedConfig: { duration: '15', aspectRatio: '16:9', resolution: '1080p' }
  },
  {
    title: "Food & Lifestyle",
    description: "Para contenido gastronómico",
    prompt: "Un chef profesional decorando un plato gourmet con precisión artística, vapor aromático elevándose, ingredientes frescos organizados elegantemente alrededor",
    category: "Gastronomía",
    estimatedCost: 11.0,
    recommendedConfig: { duration: '15', aspectRatio: '4:3', resolution: '720p' }
  },
  {
    title: "Animación Abstracta",
    description: "Arte digital y motion graphics",
    prompt: "Formas geométricas fluidas transformándose en patrones caleidoscópicos coloridos, partículas de luz danzando en un espacio tridimensional infinito",
    category: "Arte Digital",
    estimatedCost: 6.5,
    recommendedConfig: { duration: '15', aspectRatio: '1:1', resolution: '720p' }
  }
];

const CATEGORY_COLORS = {
  "Naturaleza": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "Comercial": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Social Media": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "Sci-Fi": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Gastronomía": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "Arte Digital": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
};

interface PromptExamplesProps {
  onSelectPrompt: (prompt: string, config?: any) => void;
}

export function PromptExamples({ onSelectPrompt }: PromptExamplesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Ejemplos de Prompts
        </CardTitle>
        <CardDescription>
          Inspírate con estos prompts profesionales y aplícalos con un clic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
          {PROMPT_EXAMPLES.map((example, index) => (
            <div
              key={index}
              className="border border-border/50 rounded-lg p-4 space-y-3 hover:bg-muted/20 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{example.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${CATEGORY_COLORS[example.category]}`}
                    >
                      {example.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{example.description}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>${example.estimatedCost}</div>
                  <div>{example.recommendedConfig.duration}s • {example.recommendedConfig.aspectRatio}</div>
                </div>
              </div>
              
              <p className="text-sm bg-muted/30 rounded p-2 font-mono leading-relaxed">
                {example.prompt}
              </p>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(example.prompt, `${index}`)}
                  className="h-7 text-xs"
                >
                  {copiedId === `${index}` ? (
                    <>
                      <CheckCheck className="w-3 h-3 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSelectPrompt(example.prompt, example.recommendedConfig)}
                  className="h-7 text-xs"
                >
                  Usar este prompt
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}