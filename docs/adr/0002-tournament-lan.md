# ADR 0002 · Torneos con servidor local

Estado: arquitectura objetivo definida; pendiente de implementación.

## Contexto y alcance

El usuario amplió explícitamente el objetivo: torneos con varias áreas, jueces y pantallas; operación sin Internet en la red del recinto; los jueces proponen y la mesa confirma; sensores en una fase posterior.

ADR 0001 sigue describiendo la alpha 0.1 publicada. Esta decisión establece su evolución y sustituye la suposición de que el navegador será la autoridad permanente del producto.

## Decisión

Interfaz React/TypeScript/Vite y servidor Go con SQLite local. Un único proceso del recinto valida los comandos, mantiene el reloj oficial por combate, persiste decisiones y difunde snapshots por WebSocket. La API y los recursos de interfaz comparten origen.

El torneo tiene varias áreas. Cada una conserva su combate activo y una mesa con propiedad explícita; cada dispositivo de juez recibe permisos sobre un área. La mesa confirma o rechaza propuestas. Una propuesta, un clic repetido o una reconexión no suman puntos por sí mismos.

Los cambios de puntuación confirmados registran autor, área, combate, revisión y propuesta asociada. Las correcciones posteriores se representan como decisiones nuevas que referencian el cambio corregido.

## Contratos y reglas

Los comandos se identifican y validan en el servidor. La repetición del mismo identificador con el mismo contenido devuelve el resultado anterior; un contenido diferente con ese identificador se rechaza. Las revisiones impiden confirmar sobre un estado obsoleto sin revisión de la mesa.

Los reglamentos se identifican por perfil y versión. El perfil inicial de entrenamiento sigue siendo manual y acumulativo. No se anuncia cumplimiento WT, consenso automático, ganador por asalto ni resolución de empates hasta acordar y probar esos casos.

## Consecuencias

Se necesita migrar la interfaz, extraer contratos e implementar el dominio autoritativo en Go con pruebas. El código TypeScript de entrenamiento sirve como referencia, no como una segunda autoridad independiente durante un torneo.

La disponibilidad del evento depende del servidor, su disco, energía y router local. La caída de Internet se tolera; la caída de la red local o del servidor obliga a detener y recuperar el combate. Se requiere un procedimiento de respaldo y arranque pausado.

La distribución del servidor y su preparación de certificados se abordarán en la fase LAN. Esta entrega de reformulación no instala servicios, no crea otro hosting y no genera un ZIP local.

## Referencias

- [Stack y alternativas](../stack.md).
- [Autoridad, protocolo y fallos](../tournament-architecture.md).
- [Plan de migración](../migration.md).
