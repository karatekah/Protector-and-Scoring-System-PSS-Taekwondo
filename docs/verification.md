# Verificación de la alpha

Última revisión: 2026-11-12. Entorno local: Windows, Node 24.22.1 y npm 11.19.1.

## Evidencia automatizada

### Páginas independientes y movimiento más pausado

Revisión del 2026-11-12: tipos, formato, doce pruebas unitarias, build y 38 casos E2E en Chromium/Firefox aprobados. Cada ruta (`/`, `/preparar`, `/control`, `/marcador` y `/guia`) devuelve su propio HTML con un único módulo inicial. Se comprobaron entrada directa, recarga, enlaces anteriores con `?view=...`, marcadores de la guía y rechazo de nombres de vista heredados del prototipo de objetos.

El reloj continúa durante la navegación interna a la Guía y con Atrás/Adelante. La ventana externa recibe los cambios; recargar el operador conserva la pausa de seguridad y los puntos. Abrir directamente Guía o Marcador no escribe datos ni reserva el lock de operador. La cobertura previa de Free, KO, deshacer, JSON, recuperación y pantalla completa sigue pasando.

Se midieron las cinco páginas a 320/390/768/1440 px en Chromium y Firefox: 40 casos sin desbordamiento horizontal. Axe no detectó infracciones dentro de su cobertura en las cinco páginas con movimiento normal. Se inspeccionaron capturas de escritorio y móvil. Un paquete autónomo adicional pasó diez recorridos a 320/1440 px, con enlaces `.html` bajo una subcarpeta, navegación y sincronización de la pantalla externa. No hubo errores de JavaScript ni recursos fallidos.

El título entra durante 1100 ms, los gráficos durante 900 ms y los grupos no operativos durante 420 ms. Ribbon y flotación usan ciclos más largos. Las teclas de puntuación, reloj, movimiento reducido y foco mantienen su respuesta anterior. Estas comprobaciones no sustituyen móvil físico, lector de pantalla, zoom nativo ni una sesión física de dos monitores.

### Movimiento compartido de la interfaz

Revisión del 2026-11-12: tipos, formato, diez pruebas unitarias, build y 30 casos E2E en Chromium/Firefox aprobados. Se comprueban la entrada del título y los tres gráficos, la reacción al hover y la pulsación, la entrada única de cada vista, la estabilidad de las teclas de puntuación, la pantalla pública y las secciones de la Guía. Con movimiento reducido, las entradas no incluyen desplazamiento, escala, desenfoque ni recorte.

Se midieron Inicio, Preparación, Control, Marcador y Guía a 320/390/768/1440 px en Chromium y Firefox: 40 casos sin desbordamiento horizontal. La revisión adicional de axe en las cinco vistas con movimiento normal no encontró infracciones dentro de su cobertura. No hubo errores de JavaScript ni recursos fallidos. Se inspeccionaron capturas de escritorio y móvil y la entrada del hero a velocidad 0.1; la emulación táctil comprobó navegación sin activar el hover de ratón.

Las pruebas de puntuación, reloj, KO, respaldo, operador único y pantalla completa siguen pasando. Los datos y los controles mantienen su lógica anterior. La revisión automatizada no sustituye móvil físico, lector de pantalla ni una sesión física de dos monitores.

### Política del firewall del alojamiento

Revisión del 2026-11-12 sobre el proyecto existente de Vercel, en plan Hobby. Se publicó la regla de 300 solicitudes por IP y región en ventanas fijas de 60 segundos, con respuesta 429. El estado activo muestra el WAF habilitado, una regla válida y ningún borrador pendiente; las protecciones del sistema siguen activas. La regla leída desde Vercel coincide con la política versionada.

Producción, guía, robots, sitemap y la dirección anterior respondieron HTTP 200. Una sesión independiente de Chromium puntuó 3:1, comprobó el resultado en la franja de sesión y en la pantalla externa, y verificó que la demo sigue siendo independiente, sin errores de JavaScript.

La comprobación acotada envió 570 solicitudes HEAD a un recurso estático, con un máximo de cuatro conexiones concurrentes y detención al primer 429: 566 respuestas 200 y cuatro 429, incluidas las solicitudes que ya estaban en curso. El tráfico pasó por una sola región; el total enviado puede abarcar más de una ventana fija de conteo. El acceso normal volvió a responder 200 en la segunda comprobación, 30 segundos después del bloqueo observado.

Tipos, formato, diez pruebas unitarias, build y 133 enlaces locales aprobados. No se repitió localmente la suite E2E completa para este cambio de infraestructura y documentación. La configuración y el procedimiento de operación están en [publicación](deployment.md#protección-frente-a-abuso). Esta prueba funcional no certifica resistencia ante un ataque distribuido o de saturación.

### Sesión compacta y respuesta de la demo

Revisión local del 2026-11-11: tipos, formato, diez pruebas unitarias, build y 24 casos E2E en Chromium/Firefox aprobados. La demo activa el impacto solo al sumar puntos, lo retira al activar movimiento reducido y conserva su estado independiente del combate. Las pruebas de puntuación, correcciones, KO, pantalla externa, respaldos y fin de combate siguen pasando.

Se midió la franja de sesión a 320/390/768/1024/1120/1440/1920 px en Chromium y Firefox: catorce casos sin desbordamiento horizontal ni errores de JavaScript. Se comprobaron nombres largos y cifras de tres dígitos a 320 px, además de inspeccionar capturas de escritorio, móvil y un fotograma del impacto. Los petos solo se animan dentro de la zona visible y respetan movimiento reducido. Los contrastes medidos están en [diseño](design-preview.md). La prueba física con dos monitores, móvil físico y lector de pantalla sigue pendiente.

### Revisión de textos

Revisión local del 2026-11-11: tipos, formato, diez pruebas unitarias y build aprobados. Se acortaron tres textos de portada y preparación, se cambió el título de estado en la guía y se ajustó el pie de los README en inglés, español e italiano, conservando licencias y enlaces.

Se comprobaron portada, preparación y guía a 320, 390 y 1440 px en Chromium: nueve vistas sin desbordamiento horizontal, errores de JavaScript ni solicitudes externas en el paquete de vista previa. Se inspeccionaron capturas de escritorio y móvil y se validaron 127 enlaces locales de documentación. No se repitió la suite E2E completa para estos cambios de texto; las verificaciones físicas siguen pendientes.

### Corrección −1 y KO manual

Revisión del 2026-11-11: tipos, formato, diez pruebas unitarias, build y 22 casos E2E en Chromium/Firefox aprobados. −1 solo corrige el lado seleccionado y se deshabilita en cero; no modifica penalizaciones ni al rival. KO requiere confirmar explícitamente al ganador, detiene el reloj y bloquea puntuación, tiempo técnico e inicio/avance de ronda hasta deshacerlo. Cancelar la confirmación no cierra el combate.

La cobertura verifica un ganador por KO con menos puntos y en la primera ronda, ambos lados en dominio, conservación del tiempo al deshacer, propietario único, pantalla externa, intercambio de lados y su deshacer, guardado de resúmenes, JSON v5, restauración, recarga y nuevo combate. `parseState` recupera v4 y rechaza decisiones KO inválidas o con reloj activo, también dentro de resúmenes y snapshots reversibles. Las pruebas previas de fin normal, empate y recuperación v2/v3 siguen pasando.

Tras confirmar KO, el foco pasa al resultado para evitar que el navegador lo devuelva a «Saltar al contenido» al deshabilitar el botón. Se repitieron y aprobaron los dos casos KO de Chromium/Firefox con aserciones de foco, y la revisión visual completa del control y la pantalla externa.

Se inspeccionó el control a 1366 y 390 px y se midió a 1366/768/390/320 px: sin desbordamiento horizontal, texto de botones sin recorte y altura mínima de 44 px. Axe no detectó infracciones dentro de su cobertura sobre el estado KO. La pantalla pública con KO cabe a 1920 × 1080 en Fullscreen API. No hubo errores JavaScript durante el recorrido. La sesión física de dos monitores, móvil físico y lector de pantalla siguen pendientes; esta revisión no retira por sí sola la condición experimental.

### Barra de desplazamiento

Refinamiento del 2026-11-11 en los estilos compartidos de portada, preparación, control, marcador y guía. En escritorio con ratón, el carril se integra con el fondo y el deslizador usa azul grisáceo. Chromium presenta un carril de 12 px, un deslizador redondeado de 6 px y sin botones de flecha. Firefox dispone del estilo estándar `thin`. Las reglas no se aplican a punteros táctiles ni al modo de colores forzados; las barras internas conservan su comportamiento nativo.

Tipos, formato, siete pruebas unitarias y build aprobados. Se comprobaron las cinco vistas en Chromium y Firefox a 1440 px sin desbordamiento horizontal, y la portada a 320 px en ambos. La rueda y el teclado desplazan la página; también se verificó el arrastre de la barra en Chromium. La emulación táctil conserva los estilos nativos y la de alto contraste retira los colores personalizados. El paquete de vista previa carga sin solicitudes externas ni errores y conserva el flujo de preparación, puntuación y ganador final.

La inspección visual de la barra se realizó en Chromium. Firefox automatizado oculta las barras incluso en una página mínima con `scrollbar-width: thin`, por lo que su apariencia nativa queda pendiente de revisión manual. No se repitió la suite E2E completa para este cambio de CSS. Móvil físico y lector de pantalla siguen pendientes.

### Edición Free y resultado final

Revisión local del 2026-11-11, previa a la publicación. `npm ci` terminó sin vulnerabilidades; tipos, formato, siete pruebas unitarias y build aprobados. Los 20 casos E2E pasaron en Chromium y Firefox. Después de ajustar el espacio del resultado en pantalla completa, se repitieron y aprobaron los cuatro casos de presentación y resultado final en ambos navegadores.

La cobertura nueva comprueba los presets de 60/120/180 segundos y 1/3 rondas, el bloqueo de formatos nuevos fuera de esos valores, el límite de diez resúmenes sin eliminación automática y la restauración de formatos anteriores. Una copia con doce resúmenes, cinco rondas, 90 segundos e impactos conserva los datos en la exportación JSON; guardar permanece bloqueado hasta que el operador elimina explícitamente los resúmenes elegidos. La prueba unitaria conserva también una copia de 80 resúmenes. Otra pestaña de lectura no puede eliminarlos.

El resultado aparece solo al agotarse la última ronda; se comprueban ganador azul, ganador rojo, empate, correcciones y deshacer. La ventana pública refleja el mismo resultado, que se conserva al guardar, exportar, importar y recargar. El avance acelerado del reloj detectó que un callback tardío podía omitir la publicación terminal si coincidía con el último segundo publicado; ahora siempre se publica el fin de ronda.

Se inspeccionaron Preparación y los resultados de Control/Marcador a 320, 390 y 1366/1440 px: nueve casos sin desbordamiento horizontal ni errores JavaScript. Axe no detectó infracciones en su cobertura automatizada sobre el resultado final. Se corrigió un desbordamiento del campo oculto de importación causado por el ancho de los campos visibles. A 1920 × 1080, el marcador con resultado cabe completo dentro de Fullscreen API, sin desplazamiento vertical. No equivale a una prueba física con dos monitores; lectores de pantalla y zoom nativo siguen pendientes.

### Identidad Octajang y compatibilidad

Tipos, formato, cuatro pruebas unitarias y build aprobados. Los 16 flujos E2E de Chromium/Firefox pasaron con un worker. El nuevo flujo parte de datos v4 bajo la clave original, conserva nombres, puntos y reloj, exporta un archivo `octajang-combates-…json` y lo importa en otro origen con almacenamiento inicialmente vacío. La prueba detectó que los campos de preparación no se refrescaban al importar; se corrigió la actualización del formulario tras la restauración validada. El dominio y el esquema v4 permanecen intactos.

Se revisaron portada, preparación, control, marcador y guía a 320/390/768/1440 px: los 20 casos no desbordan horizontalmente. La revisión con texto al 200 % a 320 px detectó un desbordamiento del nombre largo en el pie; se corrigió su reflujo y las cuatro vistas internas mantienen ancho 320 px. Es ampliación de texto por CSS, no zoom nativo del navegador. Los grupos de puntos mantienen su borde inferior en 765.58 px para la configuración por defecto a 1366×768.

Un servidor de prueba con las cabeceras exactas de vercel.json comprobó carga de aplicación, JSON-LD, marca, canonical, robots, sitemap, imagen social y puntuación sin errores de script ni de CSP. Las pruebas de Fullscreen API y ventana de solo lectura siguen pasando; también se inspeccionó la presentación de 1920×1080 con padding cero y navegación oculta. Las capturas de README y enlaces compartidos se renderizaron desde los recursos locales del proyecto. Se revisaron los avisos de estructura y estilos contra el resultado renderizado y la dirección visual aprobada.

Identidad y traslado entre direcciones: [branding.md](branding.md). La prueba física de dos monitores, móvil físico, NVDA/VoiceOver y zoom nativo al 200 % continúan pendientes. Estas comprobaciones no certifican funciones LAN, sensores ni reglamentos deportivos.

Publicación comprobada el 2026-11-11: [GitHub Actions](https://github.com/karatekah/octajang/actions/runs/43073872395) aprobó el commit `10deb5c46097fed7ebff75c698e3285a8ebd335a`; Vercel marcó correcto su despliegue en el proyecto existente `octajang`. [Producción](https://octajang.vercel.app/) y la dirección anterior respondieron HTTP 200 sin redirección. Una sesión nueva de Chromium verificó marca, canonical, guía, recursos de identidad, robots y sitemap; puntuó y comprobó una ventana pública de solo lectura. Exportó desde el origen anterior e importó en el nuevo, conservando atletas y puntos; no hubo errores de JavaScript en la página controlada. Los datos utilizados fueron de prueba y la sesión de navegador fue independiente. El mismo proyecto Vercel conserva ambos dominios y su conexión al repositorio renombrado.

### Octajang Arena en Preparación, Control, Marcador y Guía

Se comprobaron tipos, formato, cuatro pruebas unitarias, build y 14 flujos E2E en Chromium/Firefox con un worker. Se extendió el flujo de la guía para seguir sus enlaces nativos a Control y Preparación y comprobar la vista inicial. Se conservaron las aserciones de puntuación, reloj, deshacer sin devolver tiempo, posición de las teclas, archivo, respaldo, operador único, lectura pública y las tres entradas/salidas de Fullscreen API.

Se inspeccionaron capturas de las cinco vistas a 1440 y 390 px. Los 20 casos de 320/390/768/1440 px no desbordan horizontalmente. La ampliación del texto al 200 % mediante CSS a 320 px detectó desbordamientos en la marca, datos y palabras largas; tras corregirlos, las cuatro vistas internas mantienen el ancho de documento en 320 px. Esa prueba no es zoom nativo del navegador.

En Control por defecto a 1366×768, el borde inferior de los grupos de puntuación está en 765.58 px; nombres largos pueden aumentar la altura. La primera revisión mostró botones de presentación demasiado altos en columna móvil; se corrigió su flex-basis. La ventana pública se comprobó a 1920×1080 con Fullscreen API: ancho/alto completos, padding 0, cabecera oculta y ningún control de mutación habilitado. El recorrido visual no produjo errores JavaScript. Axe no detectó infracciones dentro de su cobertura automatizada en las cuatro vistas y guía.

La dirección y límites se detallan en [workspace-design.md](workspace-design.md). No se incorporaron dependencias, imágenes nuevas, React, servidor ni funciones LAN. La prueba física de dos monitores, NVDA/VoiceOver, zoom nativo al 200 % y móvil físico siguen pendientes.

### Demo acotada y resaltado de sesión

Tipos, formato, cuatro pruebas unitarias, build y 14 flujos E2E en Chromium/Firefox aprobados. La prueba de demo fuerza premios máximos hacia un lado con azar controlado y registra los estados renderizados durante un ciclo. Verifica que se alcanza 16 y nunca se sale de 0–16; comprueba una resta de −1 sin cambio del rival y un ajuste simultáneo de −1/+1, junto con sus etiquetas. Conserva la verificación de reinicio cada minuto, ausencia de controles, movimiento reducido, independencia del reloj real y ausencia de cambios en localStorage.

Se inspeccionaron capturas a 1440 y 390 px, con Azul y Rojo cerca del resultado y fondo amarillo. Las cuatro vistas mantienen el ancho del documento en los 16 casos de 320/390/768/1440 px. Axe no detectó infracciones en los criterios automatizados evaluados y no hubo errores JavaScript. El botón de control sigue fuera del panel de color.

Colores: fondo renderizado #fff08a; contrastes sRGB calculados de 17.15:1 para el texto principal, 7.16:1 para Azul y 7.10:1 para Rojo. El tope de 16 y los ajustes pertenecen a la demostración; no se modificó el dominio de combate. Las comprobaciones no equivalen a una prueba de campo ni a una auditoría completa de accesibilidad.

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

### Octajang Arena y pantalla completa

Diseño revisado por el usuario y aprobado para subir a GitHub. Las comprobaciones siguientes se realizaron antes de publicar. La captura del README se actualizó con el hero aprobado. La nueva dirección, colores y recursos se documentan en [Octajang Arena](design-preview.md).

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

GitHub Actions aprobó el commit `6a8a021146b13a9c7f829895ff2eae45f0a0a81e` en Linux: instalación, tipos, formato, pruebas unitarias, build y los seis flujos de navegador. [Ejecución](https://github.com/karatekah/octajang/actions/runs/41549006931).

Vercel marcó Ready el despliegue `dpl_2KfE9DhFZGEGhpKy9rjrTjWLSz3f` del commit `70e8788bce3144086ee366125778d51b5d620b1e`. [Producción](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/) y [guía](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/guide.html) respondieron HTTP 200 sin autenticación, con las cabeceras previstas.

Una sesión nueva de Chromium abrió producción, tomó el lock de operador, sumó dos puntos al azul y comprobó el mismo puntaje en otra ventana pública. No se detectaron errores JavaScript. El problema inicial de formato del builder quedó corregido manteniendo Prettier en CI; consultar [despliegue](deployment.md).
