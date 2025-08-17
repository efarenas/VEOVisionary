// Utilidades para generación de videos con VEO3

export interface VideoConfig {
  duration: '5' | '10' | '15';
  aspectRatio: '4:3' | '3:4' | '16:9' | '1:1' | '9:16';
  resolution: '480p' | '720p' | '1080p';
}

export interface PricingTier {
  '480p': number;
  '720p': number;
  '1080p': number;
}

export const PRICING: Record<string, PricingTier> = {
  '5': { '480p': 2.5, '720p': 4.0, '1080p': 6.5 },
  '10': { '480p': 4.5, '720p': 7.5, '1080p': 12.0 },
  '15': { '480p': 6.5, '720p': 11.0, '1080p': 18.0 }
};

export const ASPECT_RATIOS = {
  '4:3': 'Clásico (4:3)',
  '16:9': 'Widescreen (16:9)',
  '1:1': 'Cuadrado (1:1)',
  '3:4': 'Vertical (3:4)',
  '9:16': 'Stories/Reels (9:16)'
};

// Palabras clave para optimización de prompts
const CINEMATIC_TERMS = [
  'cinematografía profesional',
  'iluminación dinámica',
  'movimiento fluido',
  'composición artística',
  'enfoque cinematográfico'
];

const QUALITY_TERMS = [
  'alta calidad visual',
  'colores vibrantes',
  'detalles nítidos',
  'textura realista',
  'profundidad de campo'
];

const STYLE_TERMS = [
  'estilo épico',
  'atmósfera dramática',
  'lighting profesional',
  'producción de alto presupuesto',
  'calidad de estudio'
];

/**
 * Optimiza un prompt de usuario añadiendo términos técnicos y de calidad
 */
export function optimizePrompt(originalPrompt: string): string {
  const allTerms = [...CINEMATIC_TERMS, ...QUALITY_TERMS, ...STYLE_TERMS];
  const selectedTerms: string[] = [];
  
  // Seleccionar 2-3 términos aleatorios
  for (let i = 0; i < 3; i++) {
    const randomTerm = allTerms[Math.floor(Math.random() * allTerms.length)];
    if (!selectedTerms.includes(randomTerm)) {
      selectedTerms.push(randomTerm);
    }
  }
  
  return `${originalPrompt}, ${selectedTerms.join(', ')}, 4K ultra HD, fotorrealista`;
}

/**
 * Calcula el costo de generación basado en la configuración
 */
export function calculateCost(config: VideoConfig): number {
  return PRICING[config.duration][config.resolution];
}

/**
 * Genera configuración de video recomendada basada en el prompt
 */
export function getRecommendedConfig(prompt: string): Partial<VideoConfig> {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detectar si es para redes sociales
  if (lowerPrompt.includes('story') || lowerPrompt.includes('reel') || lowerPrompt.includes('tiktok')) {
    return {
      aspectRatio: '9:16',
      duration: '10'
    };
  }
  
  // Detectar si es para YouTube
  if (lowerPrompt.includes('youtube') || lowerPrompt.includes('vlog')) {
    return {
      aspectRatio: '16:9',
      duration: '15'
    };
  }
  
  // Detectar si es para Instagram post
  if (lowerPrompt.includes('instagram') && !lowerPrompt.includes('story')) {
    return {
      aspectRatio: '1:1',
      duration: '10'
    };
  }
  
  // Configuración por defecto
  return {
    aspectRatio: '16:9',
    duration: '10',
    resolution: '720p'
  };
}

/**
 * Formatea el tiempo de duración para mostrar
 */
export function formatDuration(seconds: string): string {
  return `${seconds} segundo${seconds !== '1' ? 's' : ''}`;
}

/**
 * Genera samples de video de demostración
 */
export function getSampleVideos() {
  return [
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
      prompt: 'Un conejo animado en un paisaje colorido'
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://orange.blender.org/wp-content/uploads/2006/05/teaser.jpg',
      prompt: 'Paisaje futurista con elementos surrealistas'
    }
  ];
}

/**
 * Valida que el prompt tenga contenido suficiente
 */
export function validatePrompt(prompt: string): { isValid: boolean; message?: string } {
  if (!prompt.trim()) {
    return { isValid: false, message: 'El prompt no puede estar vacío' };
  }
  
  if (prompt.length < 10) {
    return { isValid: false, message: 'El prompt debe tener al menos 10 caracteres' };
  }
  
  if (prompt.length > 500) {
    return { isValid: false, message: 'El prompt no puede exceder 500 caracteres' };
  }
  
  return { isValid: true };
}