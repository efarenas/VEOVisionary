# 🔑 Guía Completa: API Key y Facturación VEO3

## 📋 Paso 1: Obtener tu API Key de Google AI Studio

### 1.1 Crear cuenta en Google AI Studio
1. **Ve a [Google AI Studio](https://ai.google.dev)**
2. **Haz clic en "Get started"**
3. **Inicia sesión** con tu cuenta de Google personal o empresarial
4. **Acepta los términos** de servicio de Google AI

### 1.2 Generar API Key
1. **Una vez dentro**, busca el botón **"Get API key"** en la parte superior
2. **Haz clic en "Create API key"**
3. **Selecciona un proyecto** de Google Cloud (si no tienes uno, se creará automáticamente)
4. **Copia la API key** generada (se ve así: `AIzaSyD...`)
5. **¡IMPORTANTE!** Guarda esta clave en un lugar seguro, no la compartas

### 1.3 Configurar facturación en Google Cloud
1. **Ve a [Google Cloud Console](https://console.cloud.google.com)**
2. **Selecciona tu proyecto** (el mismo donde creaste la API key)
3. **Ve a "Billing" (Facturación)**
4. **Vincula una tarjeta de crédito o débito**
   - Google requiere un método de pago para APIs pagas
   - No se cobrará hasta que uses la API

## 📱 Paso 2: Configurar API Key en tu Aplicación

### 2.1 En la aplicación web
1. **Abre tu aplicación** de generación de videos
2. **Verás un panel naranja** que dice "Conectar VEO3 para Videos Reales"
3. **En el campo "API Key de Google AI Studio"**, pega tu clave
4. **Haz clic en "Conectar con VEO3"**
5. **Si la clave es válida**, verás un panel verde que dice "VEO3 Conectado"

### 2.2 Verificación exitosa
✅ **Indicadores de éxito:**
- Panel verde "VEO3 Conectado"
- Badge en el header que dice "VEO3 Conectado"
- Botón cambia a "Generar Video con VEO3"
- Costos mostrados son los reales de Google

## 💰 Paso 3: Cómo Funciona la Facturación

### 3.1 Modelo de Precios VEO3
| Modelo | Precio por Segundo | Precio 1080p (con +50%) |
|--------|-------------------|-------------------------|
| **VEO 3** | $0.75 USD | $1.125 USD |
| **VEO 3 Fast** | $0.40 USD | $0.60 USD |

### 3.2 Ejemplos de Costos Reales
```
Video 5 segundos, 720p, VEO 3:        $3.75 USD
Video 10 segundos, 720p, VEO 3 Fast:  $4.00 USD
Video 15 segundos, 1080p, VEO 3:      $16.875 USD
Video 10 segundos, 1080p, VEO 3 Fast: $6.00 USD
```

### 3.3 ¿Cuándo se cobra?
- **Inmediatamente** después de generar cada video exitosamente
- **Solo se cobra** si el video se genera correctamente
- **No hay cargos** por videos fallidos o errores
- **Facturación mensual** en tu tarjeta vinculada a Google Cloud

### 3.4 ¿Cómo aparece en tu factura?
- **Descripción:** "Google AI Platform - Generative AI"
- **Detalle:** Especifica modelo VEO3 usado y duración
- **Frecuencia:** Consolidado mensualmente

## 🛡️ Paso 4: Control de Gastos

### 4.1 Monitoreo en Google Cloud
1. **Ve a Google Cloud Console > Billing**
2. **Revisa "Reports"** para ver gastos por servicio
3. **Configura alertas** de gasto para recibir notificaciones

### 4.2 Configurar Límites de Gasto
1. **En Google Cloud Console**, ve a "Billing"
2. **Haz clic en "Budgets & alerts"**
3. **Crea un presupuesto** (ej: $50 USD/mes)
4. **Configura alertas** al 50%, 80% y 100% del presupuesto

### 4.3 En la Aplicación
- **Calculadora de costos** muestra el precio exacto antes de generar
- **Selector de modelo** te permite elegir VEO 3 Fast para ahorrar
- **Historial de videos** muestra costos acumulados

## 🔒 Paso 5: Seguridad de tu API Key

### 5.1 ¿Dónde se guarda?
- **Solo en tu navegador** (localStorage)
- **NUNCA** se envía a servidores externos
- **Se mantiene** entre sesiones hasta que la desconectes

### 5.2 Buenas Prácticas
✅ **Hacer:**
- Usar solo en dispositivos personales
- Desconectar API en computadoras públicas
- Rotar la clave periódicamente

❌ **NO hacer:**
- Compartir tu API key con otros
- Usar en sitios web de terceros
- Dejar sesiones abiertas en equipos compartidos

## 🚨 Paso 6: Solución de Problemas

### 6.1 "API key inválida"
- Verifica que copiaste la clave completa
- Asegúrate de que el proyecto tiene facturación habilitada
- Revisa que la API de Generative AI esté habilitada

### 6.2 "Error de facturación"
- Verifica que tu tarjeta esté vigente
- Confirma que no hayas excedido límites de gasto
- Revisa el estado de tu cuenta de Google Cloud

### 6.3 Videos no se generan
- Confirma que tienes fondos disponibles
- Verifica que el prompt cumple las políticas de Google
- Intenta con VEO 3 Fast si VEO 3 falla

## 💡 Consejos para Optimizar Costos

### 6.1 Estrategias de Ahorro
1. **Usa VEO 3 Fast** para pruebas y iteraciones
2. **Genera videos cortos** primero (5s) antes de hacer largos
3. **Usa 720p** para la mayoría de contenido
4. **Optimiza prompts** para evitar regeneraciones

### 6.2 Cuándo Usar Cada Modelo
- **VEO 3**: Videos finales, alta calidad, presentaciones importantes
- **VEO 3 Fast**: Pruebas, iteraciones, contenido casual, redes sociales

---

## 🎯 Resumen de Acción

1. ✅ **Crear API key** en [Google AI Studio](https://ai.google.dev)
2. ✅ **Configurar facturación** en Google Cloud Console
3. ✅ **Pegar clave** en la aplicación
4. ✅ **Configurar límites** de gasto
5. ✅ **¡Comenzar a crear videos!**

**¿Necesitas ayuda con algún paso específico?** Puedo guiarte en detalle con cualquier parte del proceso.