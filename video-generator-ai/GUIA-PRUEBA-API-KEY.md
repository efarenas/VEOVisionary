# 🔍 Guía Completa: Cómo Probar tu API Key de VEO3

## ✅ Validación Automática en la Aplicación

### 1. Indicadores Visuales de Éxito
Tu aplicación **automáticamente** valida la API key cuando la ingresas. Busca estos indicadores:

#### 🟢 API Key VÁLIDA:
- **Panel verde** aparece: "VEO3 Conectado"
- **Badge en el header** cambia a "VEO3 Conectado" con ícono ✅
- **Botón de generar** cambia a "Generar Video con VEO3"
- **Costos mostrados** cambian a precios reales de Google
- **Selector VEO3 Fast** aparece para elegir modelo

#### 🔴 API Key INVÁLIDA:
- **Mensaje de error** aparece
- **Panel sigue naranja** pidiendo conexión
- **Badge dice** "Modo Demo"
- **Botón sigue** diciendo "Generar Video (Demo)"

### 2. Proceso de Validación Automática
```
1. Ingresas API key → 2. App la prueba con Google → 3. Resultado instantáneo
```

## 🧪 Pruebas Adicionales (Sin Costo)

### Método 1: Validación en Google AI Studio
1. **Ve a [Google AI Studio](https://ai.google.dev)**
2. **Inicia sesión** con la misma cuenta
3. **En el lado izquierdo**, busca "API key"
4. **Verifica** que tu clave aparece como "Active"
5. **Prueba** hacer una consulta simple en el chat (gratis)

### Método 2: Verificación en Google Cloud Console
1. **Ve a [Google Cloud Console](https://console.cloud.google.com)**
2. **Selecciona tu proyecto**
3. **Ve a APIs & Services → Credentials**
4. **Busca tu API key** en la lista
5. **Verifica** que esté habilitada y sin restricciones problemáticas

### Método 3: Test de Permisos
1. **En Google Cloud Console** → APIs & Services → Library
2. **Busca** "Generative Language API"
3. **Verifica** que esté habilitada (debe decir "DISABLE", no "ENABLE")
4. **Si dice "ENABLE"**, haz clic para habilitarla

## 🔧 Solución de Problemas Comunes

### Problema: "API key inválida"
#### Posibles causas y soluciones:

**1. API key copiada incorrectamente**
- ✅ **Solución**: Vuelve a copiar la clave completa desde Google AI Studio
- ✅ **Verifica**: Que no tenga espacios al inicio o final
- ✅ **Formato**: Debe empezar con `AIza` y tener ~39 caracteres

**2. Proyecto sin facturación**
- ✅ **Solución**: Ve a Google Cloud Console → Billing
- ✅ **Acción**: Vincula una tarjeta de crédito/débito al proyecto
- ✅ **Verifica**: Que el proyecto tenga billing activo

**3. API no habilitada**
- ✅ **Solución**: Google Cloud Console → APIs & Services → Library
- ✅ **Busca**: "Generative Language API"
- ✅ **Habilita**: Si no está activa

**4. Restricciones de API key**
- ✅ **Solución**: Google Cloud Console → APIs & Services → Credentials
- ✅ **Encuentra** tu API key → Edit
- ✅ **Revisa** "API restrictions" (debería estar en "None" o incluir Generative Language API)

### Problema: "Error de permisos"
**Causa**: Tu cuenta no tiene permisos en el proyecto
- ✅ **Solución**: Usa la misma cuenta de Google que creó la API key
- ✅ **O**: Pide al admin del proyecto que te dé permisos

### Problema: "Quota exceeded"
**Causa**: Has excedido los límites gratuitos o de facturación
- ✅ **Solución**: Revisa tu billing en Google Cloud Console
- ✅ **Verifica**: Que no hayas alcanzado límites de gasto configurados

## 🎯 Prueba de Conectividad Paso a Paso

### Método Recomendado:
```
1. 📋 Copia API key desde Google AI Studio
2. 🔌 Pégala en tu aplicación
3. ⏱️ Espera validación automática (2-3 segundos)
4. ✅ Verifica indicadores visuales verdes
5. 🔄 Si falla, revisa los problemas comunes arriba
```

## 💡 Consejos Preventivos

### Antes de Generar Videos Costosos:
1. **Empieza con VEO 3 Fast** (más barato: $0.40/seg)
2. **Genera un video corto** (5 segundos) como prueba
3. **Usa un prompt simple** como "Un perro corriendo en el parque"
4. **Verifica** que el video se genera correctamente
5. **Solo entonces** procede con videos largos o complejos

### Configurar Alertas de Gasto:
1. **Google Cloud Console** → Billing → Budgets & alerts
2. **Crea un presupuesto** bajo (ej: $10 USD) para empezar
3. **Configura alertas** al 50% y 80%
4. **Recibirás emails** si te acercas al límite

## 🛡️ Checklist de Verificación

Antes de generar tu primer video, verifica:

- [ ] ✅ **Panel verde** "VEO3 Conectado" visible
- [ ] ✅ **Badge del header** dice "VEO3 Conectado"
- [ ] ✅ **Botón dice** "Generar Video con VEO3"
- [ ] ✅ **Costos reales** aparecen en calculadora
- [ ] ✅ **Selector VEO3 Fast** está disponible
- [ ] ✅ **Facturación configurada** en Google Cloud
- [ ] ✅ **Límites de gasto** establecidos
- [ ] ✅ **Generative Language API** habilitada

## 🚀 Tu Primera Prueba Recomendada

### Configuración para Primera Prueba:
```
✅ Prompt: "Un gatito jugando con una pelota de yarn"
✅ Duración: 5 segundos
✅ Resolución: 720p  
✅ Aspecto: 16:9
✅ Modelo: VEO 3 Fast
✅ Costo estimado: $2.00 USD
```

Esta configuración es:
- **Económica** ($2 USD)
- **Rápida** de generar
- **Fácil de evaluar** si funciona
- **Buen indicador** de la calidad del servicio

## ❓ ¿Qué Hacer Si Todo Falla?

### Opción 1: Crear Nueva API Key
1. **Ve a Google AI Studio**
2. **Crea una nueva** API key
3. **Prueba con la nueva** clave

### Opción 2: Verificar Cuenta de Google
1. **Asegúrate** de usar la cuenta correcta
2. **Verifica** que no tengas restricciones de facturación
3. **Intenta** desde un navegador diferente

### Opción 3: Contactar Soporte
Si nada funciona:
1. **Google AI Studio** tiene un botón de "Help"
2. **Google Cloud Support** puede revisar tu configuración
3. **Documentación oficial** en [ai.google.dev/docs](https://ai.google.dev/docs)

---

## 🎯 Resumen Rápido

**Para probar tu API key SIN GASTAR dinero:**

1. ✅ **Ingresa la clave** en tu aplicación
2. ✅ **Verifica** que aparezca el panel verde "VEO3 Conectado"
3. ✅ **Confirma** que el botón cambie a "Generar Video con VEO3"
4. ✅ **Revisa** que los costos mostrados sean los reales de Google
5. ✅ **Opcional**: Haz una prueba barata (5s, VEO3 Fast = $2 USD)

**¡La validación automática de tu aplicación es muy confiable!** Si aparece el panel verde, tu API key funciona perfectamente.