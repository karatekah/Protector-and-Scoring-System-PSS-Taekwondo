# Changelog

## Sin publicar como nueva versión

Demo con marcadores entre 0 y 16 y ejemplos de corrección de −1 y ajuste de −1/+1 entre lados. Las etiquetas muestran el cambio efectivo y se conserva el reinicio de un minuto. Azul y Rojo se acercan al resultado y el fondo de la sesión pasa a amarillo cítrico. El dominio del combate no cambia.

Corrección de la franja: fondo azul solo bajo los datos, con «Ir al control» fuera. Demo automática en ciclos de un minuto con reinicio de reloj y puntos, sin botones de reproducción o reinicio. Retirado el control de pausa del ribbon por indicación del usuario; se conserva la preferencia de movimiento reducido.

Refinamiento de las secciones de portada: panel azul para la sesión real, superficies para resultado y reloj, botón de pantalla externa con contorno e icono y pasos de uso más definidos. El monitor de presentación pasa a una Demo etiquetada con cuenta atrás, puntos simulados, pausa y reinicio; conserva estado efímero independiente del combate y respeta movimiento reducido y pausa global.

Movimiento de portada inspirado en Slush: ribbon infinito sin salto, flotación independiente de los gráficos y entradas progresivas al desplazarse. Incluye pausa por teclado, respeto de movimiento reducido y suspensión de los ciclos cuando el hero o la pestaña no se ven. El marcador y los controles del combate conservan su respuesta inmediata; sin dependencias nuevas.

PSS Arena: hero envolvente con cinturón azul original, gran cartel PSS con Anton, navegación en cápsulas, paleta azul hielo/negro/lila/coral y secciones renovadas. Preparación, control, guía y captura de README comparten la dirección aprobada. Sin nuevas dependencias.

Control incorpora «Marcador a pantalla completa» con la misma Fullscreen API que Marcador y regreso a Control al salir. La ventana externa sigue siendo de solo lectura. Diez flujos E2E en Chromium/Firefox cubren también las tres rutas de presentación; se corrigió el reflujo de navegación a 768 px.

Componentes táctiles e ilustración de equipamiento Taekwondo propia: navegación segmentada, botones con relieve, desplegables, duración por presets con edición manual y tipografía diferenciada por función. Los presets respetan el modo de solo lectura; ocho flujos E2E cubren también su selección y persistencia. Sin nuevas dependencias de interfaz.

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
