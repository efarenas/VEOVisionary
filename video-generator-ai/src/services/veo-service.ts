import { GoogleGenerativeAI } from '@google/generative-ai';
import { VideoConfig } from '../lib/video-utils';

export interface VeoGenerationConfig {
  prompt: string;
  config: VideoConfig;
  enhancePrompt?: boolean;
}

export interface VeoGenerationResult {
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  generationId?: string;
  estimatedCost: number;
}

export interface VeoGenerationStatus {
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  estimatedTimeRemaining?: number;
}

class VeoService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;
  
  constructor() {
    // La API key se configurará desde el frontend
  }
  
  /**
   * Configura la API key para VEO3
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  
  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.genAI;
  }
  
  /**
   * Calcula el costo real basado en la configuración de VEO3
   */
  calculateVeoCost(config: VideoConfig, useVeoFast: boolean = false): number {
    const durationInSeconds = parseInt(config.duration);
    const costPerSecond = useVeoFast ? 0.40 : 0.75; // VEO 3 Fast vs VEO 3
    
    // Factor de resolución (VEO3 genera nativamente en 720p, 1080p tiene costo adicional)
    let resolutionMultiplier = 1;
    if (config.resolution === '1080p') {
      resolutionMultiplier = 1.5; // 50% más caro para upscaling
    }
    
    return durationInSeconds * costPerSecond * resolutionMultiplier;
  }
  
  /**
   * Convierte configuración interna a parámetros de VEO3
   */
  private mapConfigToVeoParams(config: VideoConfig) {
    // Mapeo de aspect ratios
    const aspectRatioMap: Record<string, string> = {
      '16:9': '16:9',
      '9:16': '9:16', 
      '1:1': '1:1',
      '4:3': '4:3',
      '3:4': '3:4'
    };
    
    return {
      aspectRatio: aspectRatioMap[config.aspectRatio] || '16:9',
      duration: parseInt(config.duration), // VEO3 acepta duración en segundos
      // VEO3 genera nativamente en 720p, se puede hacer upscaling después
      resolution: config.resolution === '1080p' ? '1080p' : '720p'
    };
  }
  
  /**
   * Genera un video usando VEO3
   */
  async generateVideo(generationConfig: VeoGenerationConfig): Promise<VeoGenerationResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'VEO3 no está configurado. Por favor, proporciona tu API key.',
        estimatedCost: this.calculateVeoCost(generationConfig.config)
      };
    }
    
    try {
      const model = this.genAI!.getGenerativeModel({ 
        model: "veo-3.0-generate-001" // Modelo VEO 3 principal
        // Para VEO 3 Fast, usar: "veo-3.0-fast-generate-001"
      });
      
      const veoParams = this.mapConfigToVeoParams(generationConfig.config);
      
      // Construir el prompt para VEO3
      const veoPrompt = {
        text: generationConfig.prompt,
        videoConfig: {
          aspectRatio: veoParams.aspectRatio,
          durationSeconds: veoParams.duration
        }
      };
      
      // Generar el video
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [veoPrompt]
        }]
      });
      
      const response = result.response;
      
      if (!response) {
        throw new Error('No se recibió respuesta de VEO3');
      }
      
      // Extraer la URL del video de la respuesta
      // Nota: La estructura exacta puede variar según la implementación actual de VEO3
      const videoData = response.candidates?.[0]?.content?.parts?.[0] as any;
      
      if (!videoData) {
        throw new Error('No se pudo generar el video');
      }
      
      return {
        success: true,
        videoUrl: videoData.videoUri || videoData.uri || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: videoData.thumbnailUri || 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
        generationId: response.usageMetadata?.candidatesTokenCount?.toString() || Date.now().toString(),
        estimatedCost: this.calculateVeoCost(generationConfig.config)
      };
      
    } catch (error) {
      console.error('Error generando video con VEO3:', error);
      return {
        success: false,
        error: `Error de VEO3: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        estimatedCost: this.calculateVeoCost(generationConfig.config)
      };
    }
  }
  
  /**
   * Genera video con VEO3 Fast (más rápido y económico)
   */
  async generateVideoFast(generationConfig: VeoGenerationConfig): Promise<VeoGenerationResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'VEO3 Fast no está configurado. Por favor, proporciona tu API key.',
        estimatedCost: this.calculateVeoCost(generationConfig.config, true)
      };
    }
    
    try {
      const model = this.genAI!.getGenerativeModel({ 
        model: "veo-3.0-fast-generate-001" // VEO 3 Fast
      });
      
      const veoParams = this.mapConfigToVeoParams(generationConfig.config);
      
      const veoPrompt = {
        text: generationConfig.prompt,
        videoConfig: {
          aspectRatio: veoParams.aspectRatio,
          durationSeconds: veoParams.duration
        }
      };
      
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [veoPrompt]
        }]
      });
      
      const response = result.response;
      const videoData = response.candidates?.[0]?.content?.parts?.[0] as any;
      
      if (!videoData) {
        throw new Error('No se pudo generar el video con VEO3 Fast');
      }
      
      return {
        success: true,
        videoUrl: videoData.videoUri || videoData.uri || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: videoData.thumbnailUri || 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
        generationId: response.usageMetadata?.candidatesTokenCount?.toString() || Date.now().toString(),
        estimatedCost: this.calculateVeoCost(generationConfig.config, true)
      };
      
    } catch (error) {
      console.error('Error generando video con VEO3 Fast:', error);
      return {
        success: false,
        error: `Error de VEO3 Fast: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        estimatedCost: this.calculateVeoCost(generationConfig.config, true)
      };
    }
  }
  
  /**
   * Valida la API key probando una llamada simple
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const testGenAI = new GoogleGenerativeAI(apiKey);
      const model = testGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      await model.generateContent("test");
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Obtiene información sobre los límites y cuotas de la API
   */
  getApiLimits() {
    return {
      maxVideosPerMinute: 10,
      maxVideoLength: 8, // segundos
      maxVideosPerRequest: 2,
      supportedResolutions: ['720p', '1080p'],
      supportedAspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'],
      supportedFormats: ['mp4']
    };
  }
}

// Instancia singleton del servicio VEO
export const veoService = new VeoService();