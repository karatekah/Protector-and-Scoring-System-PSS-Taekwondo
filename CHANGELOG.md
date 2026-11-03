# Changelog

## Sin publicar como nueva versión

Nueva dirección editorial de competición: marfil, carbón y rojo señal; header tipográfico, hero de cartel, fotografía amplia, sesión real en una franja y presentación del marcador en uso. Se sustituyen tarjetas repetidas por secciones con funciones y composiciones distintas, y la preparación pasa a una hoja de combate. Marca, guía y captura del README alineadas con la nueva identidad.

Refinamiento de la aplicación completa: marcador de contraste alto con fondos azul/rojo profundos, puntuación compacta, gestión del combate bajo demanda y avisos con espacio reservado. Los controles de puntos no se desplazan con las confirmaciones cortas ni usan escala de pulsación. Preparación, portada y pantalla externa comparten la identidad deportiva; captura e instrucciones de los tres README actualizadas.

Rediseño UI/UX deportivo: portada editorial, marca e imagen originales, tipografía local, paleta azul/rojo, marcador oscuro, reloj adaptable y controles agrupados. El registro pasa a un desplegable nativo y la navegación conserva el foco y vuelve al inicio.

Reformulación de la arquitectura objetivo para software de torneos: varias áreas, operación en LAN sin Internet, propuestas de jueces y confirmación por mesa.

- Stack objetivo React/TypeScript/Vite, servidor Go y SQLite local.
- ADR 0002, contratos, autoridad, permisos, respaldo y recuperación.
- Fases de migración con criterios de aceptación y documentación de lo implementado frente a lo previsto.
- Guía pública actualizada con el plan. Esta revisión documental no incorpora React ni funciones LAN al marcador publicado.

## 0.1.0-alpha.1 · 2026-11-02

Primera estandarización del prototipo para entrenamiento/exhibición y demo web existente en Vercel.

- TypeScript estricto, Vite, dependencias fijadas y lockfile.
- Dominio separado, reloj por tiempo transcurrido y un único operador.
- Pantalla pública de solo lectura; historial plano, limitado y reversible.
- Respaldo/importación JSON validada y migración compatible de v2/v3.
- Interfaz renovada, foco visible, adaptación móvil y movimiento reducido.
- Vitest, Playwright, axe, formato y CI.
- Guía pública, arquitectura, ADR, alcance, roadmap y proceso de publicación.

El ZIP local está pospuesto por decisión del usuario. No se anuncian sensores ni homologación WT.
