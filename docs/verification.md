# Verificación de la alpha

Última revisión: 2026-11-08. Entorno local: Windows, Node 24.22.1 y npm 11.19.1.

## Evidencia automatizada

### PSS Arena en Preparación, Control, Marcador y Guía

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y 14 flujos E2E en Chromium/Firefox con un worker. Se extendió el flujo de la guía para seguir sus enlaces nativos a Control y Preparación y comprobar la vista inicial. Se conservaron las aserciones de puntuación, reloj, deshacer sin devolver tiempo, posición de las teclas, archivo, respaldo, operador único, lectura pública y las tres entradas/salidas de Fullscreen API.

Se inspeccionaron capturas de las cinco vistas a 1440 y 390 px. Los 20 casos de 320/390/768/1440 px no desbordan horizontalmente. La ampliación del texto al 200 % mediante CSS a 320 px detectó desbordamientos en la marca, datos y palabras largas; tras corregirlos, las cuatro vistas internas mantienen el ancho de documento en 320 px. Esa prueba no es zoom nativo del navegador.

En Control por defecto a 1366×768, el borde inferior de los grupos de puntuación está en 765.58 px; nombres largos pueden aumentar la altura. La primera revisión mostró botones de presentación demasiado altos en columna móvil; se corrigió su flex-basis. La ventana pública se comprobó a 1920×1080 con Fullscreen API: ancho/alto completos, padding 0, cabecera oculta y ningún control de mutación habilitado. El recorrido visual no produjo errores JavaScript. Axe no detectó infracciones dentro de su cobertura automatizada en las cuatro vistas y guía.

La dirección y límites se detallan en [workspace-design.md](workspace-design.md). No se incorporaron dependencias, imágenes nuevas, React, servidor ni funciones LAN. La prueba física de dos monitores, NVDA/VoiceOver, zoom nativo al 200 % y móvil físico siguen pendientes.

### Demo acotada y resaltado de sesión

Tipos, formato, cuatro pruebas unitarias, build y 14 flujos E2E en Chromium/Firefox aprobados. La prueba de demo fuerza premios máximos hacia un lado con azar controlado y registra los estados renderizados durante un ciclo. Verifica que se alcanza 16 y nunca se sale de 0–16; comprueba una resta de −1 sin cambio del rival y un ajuste simultáneo de −1/+1, junto con sus etiquetas. Conserva la verificación de reinicio cada minuto, ausencia de controles, movimiento reducido, independencia del reloj real y ausencia de cambios en localStorage.

Se inspeccionaron capturas a 1440 y 390 px, con Azul y Rojo cerca del resultado y fondo amarillo. Las cuatro vistas mantienen el ancho del documento en los 16 casos de 320/390/768/1440 px. Axe no detectó infracciones en los criterios automatizados evaluados y no hubo errores JavaScript. El botón de control sigue fuera del panel de color.

better-colors: fondo renderizado #fff08a; contrastes sRGB calculados de 17.15:1 para el texto principal, 7.16:1 para Azul y 7.10:1 para Rojo. El tope de 16 y los ajustes pertenecen a la demostración; no se modificó el dominio de combate. Las comprobaciones no equivalen a una prueba de campo ni a una auditoría completa de accesibilidad.

### Corrección: fondo solo para datos y reproducción automática

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y los 14 flujos E2E de Chromium/Firefox con un worker. La demo recorre ciclos de 60 segundos, reinicia reloj y puntos automáticamente y no tiene controles de reproducción o reinicio; el ribbon tampoco contiene botones. La prueba comprueba el límite exacto del ciclo, ciclos posteriores, pausa fuera de la portada, movimiento reducido y reanudación automática al cambiar esa preferencia. La sesión real y su almacenamiento permanecen intactos.

Se verificó que «Ir al control» es hermano del panel azul y que este solo contiene atletas, resultado, reloj y ronda. Se inspeccionaron capturas a 1440 y 390 px; las cuatro vistas no desbordaron en los 16 casos de 320/390/768/1440 px. Axe no detectó infracciones dentro de sus comprobaciones automatizadas sobre la portada. Estos controles no equivalen a una auditoría completa de accesibilidad. No se detectaron errores JavaScript y el botón de pantalla externa conserva su apertura real.

Las secciones siguientes conservan la evidencia histórica de las propuestas con botones, retirados por solicitud del usuario. El comportamiento actual está en [diseño](design-preview.md). Siguen pendientes móvil físico, NVDA/VoiceOver y dos monitores.

### Sesión y demostración del marcador · 2026-11-04

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y 14 flujos E2E de Chromium/Firefox con `npm run test:e2e -- --workers=1`. El flujo nuevo verifica reloj de demo, puntos simulados, pausa, reinicio, fin en 00:00 y repetición, salida a Control, pausa global y reproducción explícita con movimiento reducido. Comprueba también que la franja y Control mantienen sus puntos/reloj reales y que el contenido de localStorage no cambia al ejecutar la demo.

La revisión detectó y corrigió una pausa de visibilidad al pulsar los controles: se observa el bloque completo del monitor y sus controles. También se corrigió la transición del estado inicial de los bloques: solo la entrada revelada tiene transición, de modo que no hay un desvanecimiento inicial hacia oculto. La prueba de foco del ribbon se acotó a ese control porque ahora existe una segunda acción contextual para reanudar animaciones; no se eliminaron sus aserciones.

Se inspeccionaron capturas a 1440 y 390 px, hover del botón y apertura de la pantalla pública real. Las cuatro vistas se midieron a 320, 390, 768 y 1440 px: ninguno de los 16 casos desborda el documento. Axe no detectó infracciones en la portada evaluada y la suite conserva la auditoría de las cuatro vistas y guía. No se detectaron errores JavaScript en el recorrido. La insignia Demo permanece visible también en móvil.

El estado del monitor es efímero y no modifica puntuación, resúmenes, archivo, reloj ni comunicaciones del combate. No se añadieron dependencias. Ver [revisión de interfaz](interface-review.md) y [dirección visual](design-preview.md). No verificado: móvil físico, NVDA/VoiceOver ni sesión física de dos monitores.

### Movimiento de portada · 2026-11-04

Se comprobaron tipos, formato, cuatro pruebas unitarias y build. Los 12 flujos de Chromium/Firefox pasaron con `npm run test:e2e -- --workers=1`. El flujo nuevo comprueba avance real del ribbon, continuidad de los grupos a menos de 1 px del límite del ciclo, pausa/reanudación por teclado, entrada única al desplazarse, pausa fuera del hero, cambio de prefers-reduced-motion con la página abierta, carga inicial con movimiento reducido y ausencia del módulo en la pantalla pública. Se usan animaciones reales del navegador, sin mocks.

La ejecución inicial con cuatro workers produjo errores de renderizador/protocolo de Firefox y agotó el tiempo de dos flujos. La repetición secuencial pasó sin cambiar las aserciones, los timeouts ni la configuración de Playwright. Los resultados de esa ejecución concurrente no se consideran una validación aprobada.

Las decisiones y límites de la revisión están en [motion-review.md](motion-review.md). Las preferencias de presentación no se guardan en los datos del combate ni cambian su puntuación o reloj. La verificación física con dos monitores, NVDA/VoiceOver y teléfono real sigue pendiente.

Se inspeccionaron capturas del hero en dos fases y de las entradas al 10 % de velocidad. La portada se comprobó con movimiento normal y en pausa. Axe sobre la portada con el nuevo control visible no detectó infracciones en sus criterios evaluados; la suite conserva su revisión de las cuatro vistas y guía con movimiento reducido. El foco de teclado sobre la acción final revela el bloque inmediatamente, con opacidad 1 y sin desenfoque. Se midieron las cuatro vistas a 320, 390, 768 y 1800 px: los 16 casos mantienen el ancho del documento igual al viewport. El recorrido visual no produjo errores JavaScript.

### PSS Arena y pantalla completa

Diseño revisado por el usuario y aprobado para subir a GitHub. Las comprobaciones siguientes se realizaron antes de publicar. La captura del README se actualizó con el hero aprobado. La nueva dirección, colores y recursos se documentan en [PSS Arena](design-preview.md).

Se comprobaron TypeScript, formato, cuatro pruebas unitarias y build de producción. Diez flujos Playwright en Chromium/Firefox cubren los comportamientos anteriores y la regresión de pantalla completa: desde Control se presenta el elemento público a todo el ancho y alto, sin navegación; salir devuelve a Control. Desde Marcador se conserva esa vista al salir. La ventana externa también presenta sin márgenes y mantiene ocultos los controles de mutación. No se sustituyó la Fullscreen API por un mock.

La primera ejecución concurrente del flujo nuevo agotó el límite total de 30 segundos en Firefox; pasó aislado en 15.1 segundos. Se asignaron 60 segundos al flujo que realiza tres entradas/salidas nativas y la ejecución completa posterior pasó. Las aserciones de resultado no se modificaron.

Se inspeccionaron capturas de portada, preparación, control y guía en escritorio, las cuatro vistas a 390 px y el marcador a pantalla completa desde Control. Se midió el ancho de las cuatro vistas a 320, 390 y 768 px. La revisión detectó inicialmente desbordamiento de navegación a 768 px; tras permitir su ajuste, los doce casos mantienen el ancho del documento igual al viewport. No se detectaron errores JavaScript durante el recorrido visual. Axe no detectó infracciones en las cuatro vistas y la guía dentro de sus criterios evaluados.

Esta evidencia es de navegador automatizado. No equivale a una prueba física con dos monitores, una auditoría completa de accesibilidad ni una comprobación de los paneles del contenedor que incrusta la aplicación. Si el contenedor deniega pantalla completa, se debe abrir la aplicación en su propia pestaña.

### Componentes y recursos de Taekwondo

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y ocho flujos Playwright en Chromium/Firefox. El flujo nuevo comprueba presets de duración, entrada manual, regreso a la configuración guardada y bloqueo de los presets en una segunda pestaña de solo lectura. Se conservaron las aserciones del reloj, puntuación, archivo, respaldo y autoridad única.

Se inspeccionaron las cuatro vistas a 1440 y 390 px y el reflujo a 320 px, sin scroll horizontal de documento. El control por defecto termina en 763.69 px dentro de una ventana de 1366 × 768; nombres largos pueden aumentar la altura. El recurso nuevo se exportó a JPEG de 197 833 bytes y se sirve desde el mismo sitio. La ilustración no representa sensores conectados a la alpha. La captura de README refleja el diseño actual.

### Rediseño editorial de competición

Dirección confirmada: marfil, carbón y rojo señal. Header y hero reconstruidos, secciones de inicio con composiciones distintas, hoja de combate en preparación y guía sin cuadrícula de tarjetas de stack. La captura de README muestra el nuevo hero y la franja de sesión real.

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y seis flujos de Chromium/Firefox. La ejecución local completa se realizó con un worker para no competir con capturas visuales. Una ejecución inicial concurrente agotó el límite de 30 segundos del flujo largo de Firefox; el mismo flujo pasó aislado sin modificar aserciones ni aumentar el timeout. La comprobación de CI se ejecuta de nuevo al publicar.

Se inspeccionaron las cuatro vistas a 1440 y 390 px y se midió reflujo a 320 px. No hubo scroll horizontal de documento. Se revisó la guía y una ventana pública a 1920 × 1080. El control predeterminado conserva todos los botones de puntos en 1366 × 768 (borde inferior 759.69 px). Nombres largos y 999 puntos a 320 px no excedieron las columnas; reloj de 70 px sin desbordamiento. Los pares de contraste actuales están en [diseño](design.md).

Las secciones siguientes conservan evidencia histórica de las iteraciones previas; la paleta vigente y el alcance inspeccionado están en design.md e interface-review.md.

### Refinamiento de la aplicación completa

`npm run check`, `npm run build` y `npm run test:e2e`: tipos, formato, cuatro pruebas unitarias y seis flujos de Chromium/Firefox aprobados. Se extendió el flujo de puntuación para comprobar que una confirmación corta conserva la posición vertical del botón; el flujo JSON abre Gestión del combate antes de guardar. La revisión de teclado comprueba el despliegue de Gestión con Enter.

Se inspeccionaron las cuatro vistas a 1366 px y 390 px, y la ventana pública independiente a 1920 × 1080. Se midió el reflujo a 320, 390 y 768 px: ninguna vista excedió el ancho disponible. En la configuración por defecto, todos los controles de puntos caben dentro de 1366 × 768; los nombres largos pueden aumentar la altura. A 320 px se comprobaron nombres de atletas largos y puntajes de tres cifras sin desbordamiento de reloj ni cifras.

La captura del README corresponde a la portada actual, renderizada desde la aplicación. Los pares medidos de la paleta están en [diseño](design.md), y la cobertura y límites de revisión en [revisión de interfaz](interface-review.md). Los resultados automatizados no equivalen a una auditoría completa de accesibilidad ni a una prueba física de dos monitores.

### Rediseño UI/UX deportivo

Se verificaron tipos, formato, cuatro pruebas unitarias, build y seis flujos en Chromium/Firefox después del rediseño de portada, control, marcador y guía. Los flujos conservan puntuación, reloj, sincronización, persistencia, bloqueo de segundo operador y respaldo JSON. Axe no detectó infracciones en las vistas evaluadas.

Se inspeccionaron capturas a 1440 px y 390 px. A 320 px se comprobó reflujo y que el reloj no excede su columna: 66 px de contenido y 66 px de scrollWidth. El registro desplegable muestra las acciones del combate. Los contrastes actuales y la procedencia de imagen, marca y fuentes se documentan en [diseño](design.md).

La tabla de contraste de la revisión original más abajo es evidencia histórica. Los valores vigentes del rediseño están en docs/design.md. Continúan pendientes las verificaciones físicas y con lector de pantalla enumeradas en este documento.

### Revisión de arquitectura posterior a la alpha

Se documentó el stack objetivo y se actualizó la guía con su estado de implementación. Para ese cambio se comprobaron formato, tipos y build; los 14 documentos revisados no tenían enlaces locales rotos. Pasaron los dos flujos existentes de teclado, reflujo y accesibilidad de Chromium/Firefox, incluidos los controles automatizados sobre la guía.

Esa evidencia valida la documentación y las vistas actuales. No valida React, Go, SQLite ni la comunicación LAN, que todavía no están implementados. Los escenarios de [arquitectura de torneos](tournament-architecture.md) son criterios de aceptación futuros.

### Evidencia de la alpha publicada

| Comprobación                                           | Resultado local                                           |
| ------------------------------------------------------ | --------------------------------------------------------- |
| TypeScript estricto                                    | Aprobado                                                  |
| Prettier                                               | Aprobado                                                  |
| Vitest                                                 | 4 pruebas aprobadas                                       |
| Build Vite de producción                               | Aprobado                                                  |
| Playwright Chromium                                    | 3 flujos aprobados                                        |
| Playwright Firefox                                     | 3 flujos aprobados                                        |
| axe en inicio, configuración, control, marcador y guía | Sin infracciones en los criterios evaluados               |
| Reflujo a 320 px                                       | Sin desbordamiento horizontal en las cuatro vistas        |
| Tab, enlace para saltar y movimiento reducido          | Comprobados en las pruebas de navegador                   |
| Dependencias al instalar                               | npm audit: 0 vulnerabilidades conocidas en la instalación |

Las pruebas cubren puntuación, Gam-jeom, impactos, deshacer sin devolver tiempo, crecimiento acotado del historial, archivo sin snapshots anidados, validación y migración, callbacks retrasados, persistencia, segundo operador, ventana pública, recarga de la ventana pública durante el combate y exportación/importación JSON.

La prueba del reloj usa tiempo controlado por Playwright. Se congeló explícitamente la referencia antes del flujo para que la duración de navegación de Firefox no alterara los segundos esperados; no se cambiaron las expectativas para ocultar un defecto.

## Revisión visual

Se inspeccionaron capturas de inicio y control a 1440 px, control a 390 px y guía pública. Se midieron estos pares:

| Par                       | Contraste |
| ------------------------- | --------- |
| Texto principal / blanco  | 16.27:1   |
| Texto secundario / blanco | 6.29:1    |
| Texto secundario / fondo  | 5.56:1    |
| Blanco / azul             | 6.53:1    |
| Blanco / rojo             | 5.92:1    |
| Blanco / acción principal | 7.45:1    |
| Borde de entrada / blanco | 3.64:1    |
| Foco / blanco             | 4.19:1    |
| Foco / fondo              | 3.71:1    |
| Foco / superficie oscura  | 3.88:1    |

Los resultados de axe y los contrastes no constituyen una auditoría completa WCAG ni sustituyen una prueba con lector de pantalla.

## No verificado

- PC físico con dos monitores, pantalla completa y visibilidad a distancia.
- Sesión completa de entrenamiento, suspensión/hibernación y comportamiento bajo carga.
- NVDA/VoiceOver y zoom de navegador al 200 % con observación manual.
- Safari/WebKit, móvil físico y dispositivos de entrada especiales.

## Publicación

GitHub Actions aprobó el commit `6a8a021146b13a9c7f829895ff2eae45f0a0a81e` en Linux: instalación, tipos, formato, pruebas unitarias, build y los seis flujos de navegador. [Ejecución](https://github.com/karatekah/Protector-and-Scoring-System-PSS-Taekwondo/actions/runs/41549006931).

Vercel marcó Ready el despliegue `dpl_2KfE9DhFZGEGhpKy9rjrTjWLSz3f` del commit `70e8788bce3144086ee366125778d51b5d620b1e`. [Producción](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/) y [guía](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/guide.html) respondieron HTTP 200 sin autenticación, con las cabeceras previstas.

Una sesión nueva de Chromium abrió producción, tomó el lock de operador, sumó dos puntos al azul y comprobó el mismo puntaje en otra ventana pública. No se detectaron errores JavaScript. El problema inicial de formato del builder quedó corregido manteniendo Prettier en CI; consultar [despliegue](deployment.md).
