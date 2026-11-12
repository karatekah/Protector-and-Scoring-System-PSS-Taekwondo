# Octajang Arena · Vistas internas

Fecha: 2026-11-08. Alcance: Preparar combate, Control, Marcador, ventana pública y Guía. Se extiende la dirección visual aprobada de la portada, sin cambiar el dominio ni el stack.

## Dirección

Tinta #08090b, blanco, azul hielo #dbeeff, lila #e9d2ff, amarillo #fff08a y coral #ff795e. Anton se reserva para la presentación de Preparación y Guía; Manrope mantiene acciones/lectura y Barlow Condensed los datos de combate. Se reutilizan la imagen original del cinturón y las fuentes locales con sus licencias.

- Cabecera común sobre azul hielo, marca en círculo y navegación en cápsulas. Los enlaces de la Guía abren directamente la vista de Preparación o Control con el parámetro nativo view; no se incorpora un router ni React.
- Preparación como hoja de combate: título de cartel con cinturón, formato sobre lila, dos lados azul/rojo y guardado sobre amarillo. Campos con etiquetas visibles y bordes definidos; presets y utilidades usan el mismo lenguaje de botones.
- Control como consola lila: marcador negro, grupos de teclas identificados por atleta, acción de reloj amarilla, herramientas de presentación en cápsulas y registros desplegables. Los grupos tienen una entrada breve de opacidad al abrir la vista; las teclas de puntuación mantienen posición y respuesta inmediata durante el combate, sin flotación.
- Marcador con superficies oscuras, cifras de alto contraste y controles de presentación reconocibles. El modo público y la pantalla completa conservan su comportamiento de solo lectura y uso del viewport.
- Guía con cabecera de cinturón, titular de cartel, lectura en bandas blancas/hielo/lila, navegación de temas en cápsulas y cierre coral. Las listas solo se numeran donde hay una secuencia; el stack sigue separado entre alpha implementada y objetivo pendiente.

## Revisión del plan

El movimiento compartido de cabecera, botones, iconos, desplegables y Guía se detalla en [diseño](design-preview.md#movimiento-compartido). Las entradas ocurren una vez por vista y las vistas operativas mantienen estables las cifras y los controles.

Se descartó repetir el hero gigante en Control y se conservaron superficies sólidas detrás de reloj y puntos. No se convirtió la documentación en una cuadrícula de tarjetas. El sello Octajang de Preparación y la cabecera de la Guía llevan la personalidad de la portada; la mesa mantiene la densidad necesaria para operar.

## Hallazgos y correcciones

| Severidad | Lugar                                                              | Antes                                                                          | Después                                                                      | Motivo                                       |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------- |
| MEDIUM    | css/workspace.css:624                                              | El flex-basis en una columna hacía demasiado altos los botones de presentación | Altura natural y hit area conservada                                         | Mantener las acciones cerca del marcador     |
| MEDIUM    | css/workspace.css:188                                              | La cabecera renovada desplazaba parte de las teclas fuera de 1366×768          | Cabecera compacta; borde inferior del grupo en 765.58 px                     | Priorizar puntuación y reloj en la mesa      |
| HIGH      | css/workspace.css:14, css/workspace.css:227, css/workspace.css:458 | La marca y palabras largas desbordaban al duplicar el texto en 320 px          | Anchuras mínimas flexibles y ajuste de palabras; reloj adaptado a su columna | Evitar pérdida de contenido al ampliar texto |

Las tres incidencias quedaron corregidas. Se comprobaron las vistas a 320, 390, 768 y 1440 px, y el crecimiento de texto al 200 % a 320 px. Esto último es una prueba de tamaño de texto en CSS, no zoom nativo de navegador. La pantalla pública se inspeccionó a 1920×1080 en Fullscreen API. Se conservan teclado, estados disabled/selección y foco sobre superficies claras y oscuras.

Implementación: css/workspace.css, index.html, guide.html y la selección inicial de vista en src/main.ts. Sin dependencias ni recursos gráficos nuevos. Resultados detallados en [verification.md](verification.md). No se verificaron NVDA/VoiceOver, zoom nativo al 200 %, móvil físico ni dos monitores físicos.
