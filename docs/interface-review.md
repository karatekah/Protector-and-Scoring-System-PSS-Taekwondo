# Revisión del rediseño editorial de competición

## Sesión y monitor de demostración · 2026-11-04

Revisión posterior: fondo de resaltado amarillo #fff08a y nombres alineados hacia el resultado en un grupo de hasta 360 px. La demo mantiene 0–16 por lado y muestra las dos correcciones solicitadas, sin modificar la sesión real. Se aplicó better-colors; los pares medidos y la evidencia están en [verificación](verification.md). La revisión de escritorio/móvil no dejó hallazgos accionables en esa cobertura. La tabla siguiente conserva las propuestas anteriores.

Alcance: franja de sesión, botón de pantalla externa, monitor ilustrativo, pasos de inicio y enlace al plan. Se aplicó better-ui sobre el HTML, TypeScript y CSS existentes, sin dependencias nuevas. Corrección solicitada después: el fondo azul solo cubre los datos; «Ir al control» queda fuera. La demo repite ciclos de un minuto y se retiraron sus botones y el de pausa del ribbon. La tabla siguiente conserva la revisión de la propuesta inicial; el comportamiento vigente está en [diseño](design-preview.md).

| Severidad | Lugar                                | Antes                                            | Después                                                                  | Motivo                                                    |
| --------- | ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| LOW       | css/arena.css:412                    | Datos de sesión sobre una superficie uniforme    | Panel azul hielo con superficies para resultado y reloj, y acción negra  | La agrupación hace reconocible el resumen del combate     |
| LOW       | css/arena.css:473                    | Acción de pantalla externa como texto            | Botón de contorno con monitor, flecha y estados de hover/foco            | Dar una señal visual acorde con su función                |
| LOW       | index.html, src/scoreboard-demo.ts:1 | El monitor repetía los datos reales de la sesión | Demo etiquetada, reloj independiente, puntos simulados, pausa y reinicio | Cumplir la demostración solicitada sin alterar el combate |
| LOW       | css/arena.css:585                    | Numeración tipográfica simple                    | Números en círculos en una secuencia vertical                            | Reforzar la jerarquía de los pasos                        |
| LOW       | css/arena.css:624                    | Enlace y nota futura como texto                  | Enlace con contorno y nota con fondo y borde lila                        | Distinguir la navegación del estado de implementación     |

Se revisaron capturas a 1440 y 390 px, reflujo de las cuatro vistas a 320/390/768/1440 px, hover y apertura real de la pantalla externa. Axe no detectó infracciones en la portada inspeccionada. Se conserva el movimiento reducido, la pausa global y el foco nativo. El reloj de demo usa tiempo monotónico y solo se refresca cuando el bloque del monitor y sus controles se ve; no usa almacenamiento ni el dominio.

Las decisiones de identidad y tipografía del hero y del cierre coral se mantuvieron: no necesitaban otra superficie ni decoración. No se añadieron bibliotecas de componentes ni imágenes. No quedan hallazgos accionables de UI-polish dentro de la cobertura inspeccionada. **Approve**; no verificado en móvil físico, lector de pantalla ni dos monitores.

## Historial de la revisión anterior

La siguiente revisión conserva evidencia del diseño anterior. Para PSS Arena, aprobado por el usuario para subir a GitHub, consultar [dirección visual](design-preview.md) y [verificación](verification.md).

La revisión local posterior comprobó el hero con cinturón azul, el cartel PSS, los SVG propios y los estados de navegación; preparación y control mantienen la agrupación funcional. Se corrigieron el reflujo de navegación a 768 px y el color del foco sobre el marco negro. El acceso desde Control usa ahora la misma presentación nativa que Marcador; una prueba real de Fullscreen API verifica las tres rutas en Chromium/Firefox. No se añadieron dependencias. El recurso principal pesa 200 306 bytes y la nueva fuente Anton 18 612 bytes. El alcance de producto sigue siendo la alpha manual, con torneos/LAN pendientes.

Fecha: 2026-11-03. Alcance: header, hero, todas las secciones de inicio, preparación, control, marcador público, ventana externa y guía. Stack inspeccionado: HTML semántico, TypeScript con DOM nativo y CSS con tokens. Sin dependencias nuevas. Convenciones consultadas: AGENTS.md, CONTRIBUTING.md y docs/design.md.

El usuario confirmó la dirección marfil/carbón/rojo señal. Se aplicaron better-ui y las skills better-* de accesibilidad, layout, escritura, tipografía y color, junto con la guía frontend-design oficial de Anthropic. Las decisiones estéticas responden al brief y se documentan en [diseño](design.md); no se presentan como errores de la versión anterior.

## Revisión de componentes

La actualización incorpora css/components.css y el selector de duración de src/main.ts. Se comprobaron presets y entrada manual con guardado al enviar; una pestaña secundaria no puede usar los presets para alterar la configuración. El teclado y los nombres accesibles se conservan con botones, inputs y details nativos. El estado de selección usa aria-pressed; el hover mantiene el contraste del segmento activo.

Se corrigió un desbordamiento de 2 px del documento a 320 px reduciendo el espaciado de navegación móvil. Se alineó el campo de evento al inicio para que no se estirara con el selector de duración. La revisión visual posterior no encontró scroll horizontal en las cuatro vistas.

## Cobertura

| Dominio       | Evidencia inspeccionada                                                                                                                        | Resultado                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Accesibilidad | index.html y guide.html; foco en src/main.ts; axe en cuatro vistas y guía; teclado en navegación y Gestión; media query de movimiento reducido | Sin bloqueos detectados en las comprobaciones realizadas                                                         |
| Layout        | Cuatro vistas a 1440 y 390 px; reflujo a 320 px; control a 1366 × 768; ventana pública a 1920 × 1080                                           | Sin desbordamiento horizontal de la página; franja de proyecto con sangrado intencional hasta el margen exterior |
| Escritura     | Hero, sesión, presentación de las dos vistas, pasos y alcance del plan; mensajes y formularios existentes                                      | Alpha manual y torneo futuro claramente diferenciados                                                            |
| Tipografía    | Barlow Condensed/Manrope locales; título de cartel y lectura; nombres largos, 999 puntos y reloj a 320 px                                      | Texto completo y cifras dentro de su columna                                                                     |
| Colores       | Fondos renderizados y tokens de texto, entradas, marcador y foco; pares en design.md                                                           | Pares de texto documentados por encima de 4.5:1; borde de entrada 4.13:1                                         |
| UI            | Header segmentado, estados activos, hoja de combate, monitor CSS, hover, disabled y foco; escala solo en botones de uso no repetido            | Composición coherente y estados visibles; no hay animación automática                                            |

## Correcciones durante la revisión

| Severidad | Dominio    | Lugar                                  | Antes                                                        | Después                                              | Motivo                                    |
| --------- | ---------- | -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------- |
| Baja      | Tipografía | css/styles.css, hero a menos de 480 px | Al ocultar el salto de línea, se unían «Tu mesa.Tu combate.» | Se conserva el salto entre las dos frases            | Mantener separación y lectura correcta    |
| Baja      | Layout     | index.html, navegación móvil           | El enlace a la guía quedaba solo en una tercera fila         | Guía integrada en la misma navegación que las vistas | Mantener agrupadas las rutas del producto |

Las mejoras de identidad —paleta, header, cartel, secuencia y hoja de combate— se registran como decisiones de diseño en design.md. No se atribuyen a fallos de accesibilidad que no se hayan observado.

## Verificación

- Tipos, formato, cuatro pruebas unitarias y build de producción.
- Ocho flujos Playwright de Chromium/Firefox: puntuación, reloj, deshacer, ventana pública, propietario único, persistencia, archivo, importación/exportación, teclado, reflujo y axe.
- Confirmación corta sin desplazar el botón de puntuación. Gestión abre/cierra mediante Enter.
- Capturas de escritorio y móvil y medición del ancho de documento: 320, 390 y 1440 px, sin scroll horizontal. La vista previa de portada está enlazada al estado del combate; no introduce otra autoridad de puntuación.
- Control por defecto: paneles de puntos hasta 763.69 px de alto en 1366 × 768. Los nombres largos pueden aumentar la altura.
- A 320 px, los puntajes 999 ocupan 112 px sin exceder su columna; reloj 02:00 ocupa 70 px sin desbordar.

No verificado: lector de pantalla NVDA/VoiceOver, zoom nativo al 200 %, espejo RTL, teléfono físico ni sesión física con dos monitores. Las pruebas de navegador no certifican el uso deportivo ni sustituyen una prueba de campo.

Approve para las comprobaciones y dominios descritos. No quedan hallazgos altos detectados en esta cobertura.
