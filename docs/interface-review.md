# Revisión del rediseño editorial de competición

Fecha: 2026-11-03. Alcance: header, hero, todas las secciones de inicio, preparación, control, marcador público, ventana externa y guía. Stack inspeccionado: HTML semántico, TypeScript con DOM nativo y CSS con tokens. Sin dependencias nuevas. Convenciones consultadas: AGENTS.md, CONTRIBUTING.md y docs/design.md.

El usuario confirmó la dirección marfil/carbón/rojo señal. Se aplicaron better-ui y las skills better-* de accesibilidad, layout, escritura, tipografía y color, junto con la guía frontend-design oficial de Anthropic. Las decisiones estéticas responden al brief y se documentan en [diseño](design.md); no se presentan como errores de la versión anterior.

## Cobertura

| Dominio       | Evidencia inspeccionada                                                                                                                        | Resultado                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Accesibilidad | index.html y guide.html; foco en src/main.ts; axe en cuatro vistas y guía; teclado en navegación y Gestión; media query de movimiento reducido | Sin bloqueos detectados en las comprobaciones realizadas                                                         |
| Layout        | Cuatro vistas a 1440 y 390 px; reflujo a 320 px; control a 1366 × 768; ventana pública a 1920 × 1080                                           | Sin desbordamiento horizontal de la página; franja de proyecto con sangrado intencional hasta el margen exterior |
| Escritura     | Hero, sesión, presentación de las dos vistas, pasos y alcance del plan; mensajes y formularios existentes                                      | Alpha manual y torneo futuro claramente diferenciados                                                            |
| Tipografía    | Barlow Condensed/Manrope locales; título de cartel y lectura; nombres largos, 999 puntos y reloj a 320 px                                      | Texto completo y cifras dentro de su columna                                                                     |
| Colores       | Fondos renderizados y tokens de texto, entradas, marcador y foco; pares en design.md                                                           | Pares de texto documentados por encima de 4.5:1; borde de entrada 4.13:1                                         |
| UI            | Header sin cápsulas, estados activos, hoja de combate, monitor CSS, hover, disabled y foco; escala solo en botones de uso no repetido          | Composición coherente y estados visibles; no hay animación automática                                            |

## Correcciones durante la revisión

| Severidad | Dominio    | Lugar                                  | Antes                                                        | Después                                              | Motivo                                    |
| --------- | ---------- | -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------- |
| Baja      | Tipografía | css/styles.css, hero a menos de 480 px | Al ocultar el salto de línea, se unían «Tu mesa.Tu combate.» | Se conserva el salto entre las dos frases            | Mantener separación y lectura correcta    |
| Baja      | Layout     | index.html, navegación móvil           | El enlace a la guía quedaba solo en una tercera fila         | Guía integrada en la misma navegación que las vistas | Mantener agrupadas las rutas del producto |

Las mejoras de identidad —paleta, header, cartel, secuencia y hoja de combate— se registran como decisiones de diseño en design.md. No se atribuyen a fallos de accesibilidad que no se hayan observado.

## Verificación

- Tipos, formato, cuatro pruebas unitarias y build de producción.
- Seis flujos Playwright de Chromium/Firefox: puntuación, reloj, deshacer, ventana pública, propietario único, persistencia, archivo, importación/exportación, teclado, reflujo y axe.
- Confirmación corta sin desplazar el botón de puntuación. Gestión abre/cierra mediante Enter.
- Capturas de escritorio y móvil y medición del ancho de documento: 320, 390 y 1440 px, sin scroll horizontal. La vista previa de portada está enlazada al estado del combate; no introduce otra autoridad de puntuación.
- Control por defecto: paneles de puntos hasta 759.69 px de alto en 1366 × 768. Los nombres largos pueden aumentar la altura.
- A 320 px, los puntajes 999 ocupan 112 px sin exceder su columna; reloj 02:00 ocupa 70 px sin desbordar.

No verificado: lector de pantalla NVDA/VoiceOver, zoom nativo al 200 %, espejo RTL, teléfono físico ni sesión física con dos monitores. Las pruebas de navegador no certifican el uso deportivo ni sustituyen una prueba de campo.

Approve para las comprobaciones y dominios descritos. No quedan hallazgos altos detectados en esta cobertura.
