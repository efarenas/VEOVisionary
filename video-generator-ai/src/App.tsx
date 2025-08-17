import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Sparkles, Download, Play, Pause, RotateCcw, Clock, Monitor, DollarSign, Zap, AlertCircle, CheckCircle, Lightbulb, Key } from "lucide-react";
import { 
  VideoConfig, 
  ASPECT_RATIOS, 
  optimizePrompt, 
  calculateCost, 
  getRecommendedConfig, 
  validatePrompt,
  getSampleVideos 
} from "@/lib/video-utils";
import { PromptExamples } from "@/components/prompt-examples";
import { veoService } from "@/services/veo-service";
import { Switch } from "@/components/ui/switch";

interface GeneratedVideo {
  id: string;
  prompt: string;
  optimizedPrompt: string;
  config: VideoConfig;
  url: string;
  thumbnail: string;
  cost: number;
  status: 'generating' | 'completed' | 'error';
  progress: number;
}



export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState<VideoConfig>({
    duration: '10',
    aspectRatio: '16:9',
    resolution: '720p'
  });
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [promptError, setPromptError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [useVeoFast, setUseVeoFast] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);

  // Cargar configuración al iniciar
  useEffect(() => {
    const savedApiKey = localStorage.getItem('veo3_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      veoService.setApiKey(savedApiKey);
      setApiConfigured(true);
    }
  }, []);

  // Validar prompt cuando cambia
  useEffect(() => {
    if (prompt) {
      const validation = validatePrompt(prompt);
      setPromptError(validation.isValid ? null : validation.message || null);
      
      // Mostrar recomendaciones si el prompt es válido
      if (validation.isValid && prompt.length > 20) {
        setShowRecommendations(true);
        const recommendations = getRecommendedConfig(prompt);
        if (recommendations.aspectRatio || recommendations.duration) {
          // Aplicar recomendaciones automáticamente si el usuario no ha tocado la configuración
          setConfig(prev => ({
            ...prev,
            ...recommendations,
            resolution: recommendations.resolution || prev.resolution
          }));
        }
      } else {
        setShowRecommendations(false);
      }
    } else {
      setPromptError(null);
      setShowRecommendations(false);
    }
  }, [prompt]);

  const getCost = (): number => {
    if (apiConfigured) {
      return veoService.calculateVeoCost(config, useVeoFast);
    }
    return calculateCost(config);
  };

  const connectApi = async () => {
    if (!apiKey.trim()) return;
    
    const isValid = await veoService.validateApiKey(apiKey);
    if (isValid) {
      localStorage.setItem('veo3_api_key', apiKey);
      veoService.setApiKey(apiKey);
      setApiConfigured(true);
      setShowApiConfig(false);
    }
  };

  const disconnectApi = () => {
    localStorage.removeItem('veo3_api_key');
    setApiKey('');
    setApiConfigured(false);
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;

    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      setPromptError(validation.message || 'Prompt inválido');
      setIsGenerating(false);
      return;
    }
    
    setIsGenerating(true);
    const optimizedPrompt = optimizePrompt(prompt);
    const videoId = Date.now().toString();
    
    const newVideo: GeneratedVideo = {
      id: videoId,
      prompt,
      optimizedPrompt,
      config: { ...config },
      url: '',
      thumbnail: '',
      cost: getCost(),
      status: 'generating',
      progress: 0
    };

    setGeneratedVideos(prev => [newVideo, ...prev]);
    setCurrentVideo(newVideo);

    try {
      if (apiConfigured) {
        // Usar VEO3 real
        const result = useVeoFast 
          ? await veoService.generateVideoFast({ prompt: optimizedPrompt, config })
          : await veoService.generateVideo({ prompt: optimizedPrompt, config });
        
        if (result.success) {
          // Video generado exitosamente
          const completedVideo: GeneratedVideo = {
            ...newVideo,
            status: 'completed',
            progress: 100,
            url: result.videoUrl || '',
            thumbnail: result.thumbnailUrl || '',
            cost: result.estimatedCost
          };
          
          setGeneratedVideos(prev => prev.map(v => 
            v.id === videoId ? completedVideo : v
          ));
          setCurrentVideo(completedVideo);
        } else {
          // Error en la generación
          setGeneratedVideos(prev => prev.map(v => 
            v.id === videoId ? { ...v, status: 'error' as const } : v
          ));
          setPromptError(result.error || 'Error al generar el video');
        }
      } else {
        // Simulación de generación (modo demo)
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setGeneratedVideos(prev => prev.map(v => 
            v.id === videoId ? { ...v, progress: i } : v
          ));
        }

        // Simulación de video completado
        const completedVideo: GeneratedVideo = {
          ...newVideo,
          status: 'completed',
          progress: 100,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg'
        };

        setGeneratedVideos(prev => prev.map(v => 
          v.id === videoId ? completedVideo : v
        ));
        setCurrentVideo(completedVideo);
      }
    } catch (error) {
      console.error('Error generando video:', error);
      setGeneratedVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, status: 'error' as const } : v
      ));
      setPromptError('Error al generar el video');
    }
    
    setIsGenerating(false);
  };

  const downloadVideo = (video: GeneratedVideo) => {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `video-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectPrompt = (selectedPrompt: string, recommendedConfig?: any) => {
    setPrompt(selectedPrompt);
    if (recommendedConfig) {
      setConfig(prev => ({ ...prev, ...recommendedConfig }));
    }
    setShowExamples(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                VEO3 Video Generator
              </h1>
              <p className="text-sm text-muted-foreground">Genera videos increíbles con inteligencia artificial</p>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center gap-2">
              {apiConfigured ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  VEO3 Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Modo Demo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Generator */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Crear Nuevo Video
                </CardTitle>
                <CardDescription>
                  Describe lo que quieres crear y nuestro sistema optimizará tu prompt automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="prompt" className="text-sm font-medium">Descripción del Video</Label>
                    {prompt && !promptError && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="Ej: Un gato naranja jugando en un jardín soleado con flores de colores, corriendo alegremente entre las plantas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className={`min-h-[100px] resize-none border-0 bg-muted/30 focus:bg-muted/50 transition-colors ${
                      promptError ? 'ring-2 ring-destructive/50' : ''
                    }`}
                  />
                  {promptError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{promptError}</span>
                    </div>
                  )}
                  {showRecommendations && !promptError && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-primary mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Configuración recomendada aplicada</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hemos optimizado la configuración basándose en tu descripción
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Duración
                    </Label>
                    <Select value={config.duration} onValueChange={(value: '5' | '10' | '15') => setConfig(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger className="border-0 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 segundos</SelectItem>
                        <SelectItem value="10">10 segundos</SelectItem>
                        <SelectItem value="15">15 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Monitor className="w-4 h-4" />
                      Aspecto
                    </Label>
                    <Select value={config.aspectRatio} onValueChange={(value: keyof typeof ASPECT_RATIOS) => setConfig(prev => ({ ...prev, aspectRatio: value }))}>
                      <SelectTrigger className="border-0 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Resolución</Label>
                    <Select value={config.resolution} onValueChange={(value: '480p' | '720p' | '1080p') => setConfig(prev => ({ ...prev, resolution: value }))}>
                      <SelectTrigger className="border-0 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p (SD)</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* API Configuration */}
                {!apiConfigured ? (
                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Conectar VEO3 para Videos Reales
                      </CardTitle>
                      <CardDescription className="text-orange-600 dark:text-orange-400">
                        Conecta tu API de Google AI Studio para generar videos reales con VEO3
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>API Key de Google AI Studio</Label>
                        <Input
                          type="password"
                          placeholder="Ingresa tu API key..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="border-0 bg-muted/30"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={connectApi} disabled={!apiKey.trim()} className="flex-1">
                          <Key className="w-4 h-4 mr-2" />
                          Conectar con VEO3
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowApiConfig(!showApiConfig)}
                          className="px-3"
                        >
                          {showApiConfig ? 'Ocultar' : 'Ayuda'}
                        </Button>
                      </div>
                      {showApiConfig && (
                        <div className="bg-muted/30 rounded p-3 text-sm space-y-2">
                          <p className="font-medium">¿Cómo obtener tu API Key?</p>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Ve a <a href="https://ai.google.dev" target="_blank" className="text-primary hover:underline">Google AI Studio</a></li>
                            <li>Inicia sesión con tu cuenta de Google</li>
                            <li>Ve a "Get API Key" y crea una nueva clave</li>
                            <li>Copia la clave y pégala aquí</li>
                          </ol>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Tu API key se guarda localmente y nunca se comparte
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        VEO3 Conectado
                      </CardTitle>
                      <CardDescription className="text-green-600 dark:text-green-400">
                        Listo para generar videos reales con inteligencia artificial
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Modo VEO3 Fast</Label>
                          <p className="text-xs text-muted-foreground">
                            Más rápido y económico ($0.40/seg vs $0.75/seg)
                          </p>
                        </div>
                        <Switch
                          checked={useVeoFast}
                          onCheckedChange={setUseVeoFast}
                        />
                      </div>
                      
                      <div className="bg-muted/30 rounded p-3">
                        <div className="flex justify-between items-center text-sm">
                          <span>Modelo activo:</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {useVeoFast ? 'VEO 3 Fast' : 'VEO 3'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={disconnectApi}
                        className="w-full"
                      >
                        Desconectar API
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Cost Calculator */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">Costo estimado:</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      ${getCost().toFixed(2)} USD
                    </Badge>
                  </div>
                  {apiConfigured && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Usando {useVeoFast ? 'VEO 3 Fast' : 'VEO 3'} - Costo real de Google
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateVideo} 
                  disabled={!prompt.trim() || isGenerating || !!promptError}
                  className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      {apiConfigured ? 'Generando con VEO3...' : 'Generando...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {apiConfigured ? 'Generar Video con VEO3' : 'Generar Video (Demo)'}
                    </>
                  )}
                </Button>
                
                {!apiConfigured && (
                  <p className="text-xs text-center text-muted-foreground">
                    Modo demo activo. Conecta VEO3 para generar videos reales.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Results */}
          <div className="space-y-6">
            {currentVideo ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Vista Previa</span>
                    <Badge variant={currentVideo.status === 'completed' ? 'default' : 'secondary'}>
                      {currentVideo.status === 'generating' ? 'Generando' : 
                       currentVideo.status === 'completed' ? 'Completado' : 'Error'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentVideo.status === 'generating' ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                          <p className="text-sm text-muted-foreground">Generando tu video...</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{currentVideo.progress}%</span>
                        </div>
                        <Progress value={currentVideo.progress} className="h-2" />
                      </div>
                    </div>
                  ) : currentVideo.status === 'completed' ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative group video-preview">
                        <video 
                          src={currentVideo.url}
                          poster={currentVideo.thumbnail}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm space-y-1">
                          <p><strong>Prompt original:</strong> {currentVideo.prompt}</p>
                          <p className="text-muted-foreground"><strong>Optimizado:</strong> {currentVideo.optimizedPrompt}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Costo: <strong>${currentVideo.cost.toFixed(2)} USD</strong></span>
                          <span>{currentVideo.config.duration}s • {currentVideo.config.aspectRatio} • {currentVideo.config.resolution}</span>
                        </div>
                        
                        <Button onClick={() => downloadVideo(currentVideo)} className="w-full" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Video
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Video className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                      <p className="text-muted-foreground">Tu video aparecerá aquí</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Videos */}
            {generatedVideos.length > 0 && (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Videos Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedVideos.slice(0, 5).map((video) => (
                      <div key={video.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                           onClick={() => video.status === 'completed' && setCurrentVideo(video)}>
                        <div className="w-16 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          {video.status === 'completed' && video.thumbnail && (
                            <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{video.prompt}</p>
                          <p className="text-xs text-muted-foreground">
                            {video.config.duration}s • {video.config.resolution} • ${video.cost.toFixed(2)}
                          </p>
                        </div>
                        <Badge variant={video.status === 'completed' ? 'default' : 'secondary'} className="flex-shrink-0">
                          {video.status === 'generating' ? `${video.progress}%` :
                           video.status === 'completed' ? 'Listo' : 'Error'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Examples Panel - Show when no current video or when toggled */}
            {(showExamples || !currentVideo) && (
              <PromptExamples onSelectPrompt={handleSelectPrompt} />
            )}
          </div>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="bg-background/80 backdrop-blur-sm shadow-lg"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            {showExamples ? 'Ocultar' : 'Ver'} Ejemplos
          </Button>
          {generatedVideos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPrompt('');
                setCurrentVideo(null);
                setShowExamples(true);
              }}
              className="bg-background/80 backdrop-blur-sm shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Nuevo Video
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
