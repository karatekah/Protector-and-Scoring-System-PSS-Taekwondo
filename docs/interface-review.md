# Revisión de la aplicación completa

Fecha: 2026-11-03. Alcance: portada, preparación, control, marcador público, ventana externa y guía. Implementación inspeccionada: HTML semántico, TypeScript con DOM nativo y CSS con tokens; sin nuevas dependencias. Convenciones consultadas: CONTRIBUTING.md y docs/design.md.

La entrevista confirmó aplicación completa y prioridad de puntos/reloj. Se revisaron la accesibilidad y la composición de la interfaz. Las decisiones visuales acordadas se registran en [diseño](design.md); esta tabla recoge problemas observados, no preferencias de estilo.

## Cobertura

| Dominio       | Evidencia inspeccionada                                                                                                                                    | Resultado                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Accesibilidad | index.html; renderControls/createButtons en src/main.ts; axe en las cuatro vistas y guía; foco, enlace para saltar, Enter en Gestión y movimiento reducido | Sin bloqueos detectados en las comprobaciones realizadas                     |
| Layout        | Capturas de las cuatro vistas a 1366 y 390 px; reflujo a 320, 390 y 768 px; ventana pública a 1920 px                                                      | Dos problemas de densidad/estabilidad corregidos                             |
| Escritura     | Etiquetas, mensajes de importación/operador, confirmaciones y estado vacío; instrucciones de los tres README y guía                                        | Ruta para guardar y estado vacío actualizados                                |
| Tipografía    | Fuentes locales, pesos, cifras tabulares, nombres largos, reloj y puntuación de tres cifras a 320 px                                                       | Sin recorte observado; nombres con interlineado 1.4                          |
| Colores       | Fondos efectivos del marcador y botones; contraste calculado con luminancia sRGB de los pares documentados en design.md                                    | Los pares de texto medidos superan 4.5:1                                     |
| UI            | Superficies, navegación activa, hover, disabled, foco; código y emulación de movimiento reducido; controles de puntuación sin escala                       | Estados revisados; no se incorporaron animaciones de entrada ni dependencias |

## Hallazgos corregidos

| Severidad | Dominio   | Lugar                                                       | Antes                                                                                                                      | Después                                                                                                                              | Motivo                                                                                                    |
| --------- | --------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Media     | Layout    | css/styles.css:1033, css/styles.css:1117                    | El marcador y las cuatro filas de acciones por atleta llevaban parte de la puntuación fuera del primer alto de un portátil | Marcador compacto y seis incrementos en una fila cuando caben; puntuación completa visible en 1366 × 768 con nombres predeterminados | Priorizar las acciones frecuentes y reducir el desplazamiento durante un combate                          |
| Media     | Layout    | css/styles.css:321                                          | El aviso vacío desaparecía; al puntuar aparecía un bloque encima del control y movía los botones                           | Espacio mínimo reservado, verificado con una confirmación corta en ambos navegadores                                                 | Posición predecible de controles que se pulsan repetidamente; los mensajes largos conservan todo el texto |
| Baja      | Escritura | src/main.ts:223, guide.html:88, README.md:44 y traducciones | El estado vacío no indicaba dónde guardar; las instrucciones no nombraban el nuevo desplegable                             | Estado vacío e instrucciones señalan Gestión del combate y la exportación desde Preparar combate                                     | Ofrecer un siguiente paso concreto y mantener la documentación alineada con la interfaz                   |

## Verificación

- `npm run check`: tipos, Prettier y cuatro pruebas unitarias.
- `npm run build`: build de producción.
- `npm run test:e2e`: seis flujos, tres en Chromium y tres en Firefox. Cubren puntuación, reloj, deshacer, ventana pública, propietario único, persistencia, archivo y respaldo JSON, teclado y axe.
- Capturas e inspección del reflujo con Playwright a 320, 390, 768, 1366 y 1920 px. Los elementos visualmente ocultos para lectores de pantalla no se trataron como desbordamientos visibles.
- Gestión abierta/cerrada con Enter; los botones internos quedan disponibles al desplegarla. La puntuación y el reloj conservan sus selectores y nombres accesibles.

No verificado: NVDA/VoiceOver, zoom nativo del navegador al 200 %, espejo RTL, móvil físico, reproducción de movimiento al 10 % en DevTools ni sesión física con dos monitores. La app sigue dirigida a un operador en PC; el reflujo móvil no confirma ergonomía de mesa arbitral en un teléfono.

Approve para los dominios y comprobaciones descritos. No quedan hallazgos altos detectados en esa cobertura; los límites de verificación anteriores permanecen abiertos.
