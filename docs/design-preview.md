# Diseño aprobado · Octajang Arena

La identidad actual de Octajang, el símbolo, los recursos de presentación y la compatibilidad del cambio de marca están documentados en [branding.md](branding.md). Este documento conserva la composición visual y sus revisiones.

Fecha: 2026-11-03. Diseño revisado por el usuario y aprobado para subir a GitHub. Sustituye la dirección editorial anterior con el cartel Octajang, el cinturón azul y las secciones de presentación renovadas. [Historial de la dirección visual](design.md).

## Dirección

La misma identidad se extiende a Preparar combate, Control, Marcador y Guía. La composición y revisión de esas vistas están en [workspace-design.md](workspace-design.md).

La referencia solicitada es [Slush](https://slush.app/): un hero envolvente, título de gran escala, navegación superpuesta en cápsulas y materialidad protagonista. Se adopta esa composición con identidad de Taekwondo: un cinturón de algodón azul, dobok y peto ilustrados. No se reutilizan imágenes, logotipo, tipografía propietaria ni código de Slush.

La idea dominante es un cartel Octajang dentro del recorrido del cinturón. El resto de la portada organiza la sesión actual, la presentación de mesa y pantalla, tres pasos de uso y el estado del proyecto. Las secciones son bandas amplias con composiciones distintas. La franja de sesión conserva los datos reales; el monitor de presentación es una simulación etiquetada como Demo e independiente del combate.

## Sistema visual

| Color                 | Valor             | Uso                                                                     |
| --------------------- | ----------------- | ----------------------------------------------------------------------- |
| Negro                 | #08090b           | Marco de página, titular, botones principales y marcador                |
| Azul hielo            | #dbeeff           | Hero y secuencia de inicio                                              |
| Blanco                | #ffffff           | Navegación, formularios y superficies de lectura                        |
| Lila                  | #e9d2ff           | Franja de identificación; sección de presentación ligeramente más clara |
| Coral                 | #ff795e           | Invitación final                                                        |
| Resaltado de sesión   | #fff08a           | Fondo del reloj de la sesión                                            |
| Azul / rojo de atleta | #1265d0 / #c92c3f | Identificación de los dos lados del combate                             |

Anton se utiliza exclusivamente en el gran Octajang y numeración de cartel. Manrope mantiene la lectura y los controles; Barlow Condensed conserva las cifras del marcador. Las tres familias se sirven localmente. Anton procede de [Google Fonts](https://fonts.google.com/specimen/Anton); su licencia [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt) se conserva en public/fonts/anton-LICENSE.txt.

La navegación utiliza cápsulas blancas con borde negro de 2 px y selección oscura. El hero tiene radio de 52 px en escritorio y 30 px en móvil; las secciones usan 28–36 px y los controles operativos 8–18 px. Los campos mantienen etiquetas visibles. Los puntos no se desplazan ni escalan al pulsarlos.

## Movimiento de portada

Por solicitud posterior del usuario, la portada incorpora movimiento inspirado en [Slush](https://slush.app/). No se agregaron dependencias ni se modificó el dominio del combate.

- Ribbon con dos grupos idénticos y un recorrido lineal de 32 segundos hasta −50 % del track. El segundo grupo ocupa la posición inicial al terminar cada ciclo; el ancho mínimo de cada grupo cubre el viewport.
- Dobok, peto y sello de dos pantallas con flotación independiente: 6, 7 y 5.6 segundos, recorridos de 10–18 px y giro de 3–5 grados alrededor de la inclinación original.
- Entradas al desplazarse mediante IntersectionObserver. Se prepara el contenido inicialmente bajo el viewport. Los bloques entran una sola vez, con opacidad, 12 px de desplazamiento y desenfoque de 4 px durante 300 ms, separados por 100 ms donde hay una secuencia.
- Por indicación del usuario, el ribbon y los gráficos funcionan automáticamente sin botón de pausa.
- Con prefers-reduced-motion, no se ejecutan desplazamientos ni ciclos y todos los contenidos son visibles. La preferencia también se respeta si cambia con la página abierta.
- La flotación y el ribbon se pausan al salir del hero, ocultar la pestaña o cambiar a una vista operativa. La pantalla pública no inicializa este módulo. No hay listeners de scroll ni bucles JavaScript por frame.

Los bloques se revelan inmediatamente al recibir foco. Sin JavaScript, sin IntersectionObserver o con movimiento reducido, el contenido continúa visible. No se animan los puntos, el reloj ni las teclas de puntuación de las vistas operativas. El código vive en src/landing-motion.ts y en css/arena.css.

## Movimiento compartido

El título OCTAJANG se descubre de izquierda a derecha durante 700 ms, conservando su texto y tipografía. Los tres gráficos llegan con opacidad, escala de 0.76 a 1 y 16 px de desplazamiento durante 600 ms; sus entradas se separan 80 ms y continúan con la flotación existente. La cabecera, el lema y las acciones tienen entradas breves con desenfoque de 2 px y desplazamiento de 8 px.

Preparación incorpora la misma entrada en títulos, sello y grupos del formulario. Control y Marcador usan únicamente una entrada de opacidad de 140 ms para sus grupos, una vez por vista durante la sesión de navegación. Los cambios de puntos y reloj mantienen su respuesta inmediata y sus teclas conservan la posición. Abrir un desplegable revela su contenido con opacidad durante 140 ms.

Botones, enlaces de navegación e iconos comparten transiciones reversibles. Con ratón, los botones de uso ocasional suben 2 px, las flechas avanzan y los iconos giran ligeramente. Pulsar reduce el botón a 0.96 durante 150 ms; las teclas de puntuación y el reloj responden mediante color y sombra interior, sin desplazarse ni escalar. El hover se limita a punteros compatibles para evitar estados persistentes en pantallas táctiles.

La Guía tiene entrada de cabecera, navegación y contenidos al recorrer sus secciones. Con movimiento reducido, las entradas usan solo opacidad durante 100 ms y se retiran los desplazamientos, giros y ciclos. Un cambio de preferencia cancela las entradas que siguen activas. Recibir foco muestra el contenido inmediatamente; no se bloquean acciones mientras se animan. La implementación compartida está en src/interface-motion.ts y css/motion.css, sin nuevas dependencias.

## Sesión y demostración del marcador

La franja «En la mesa» agrupa atletas, resultado y reloj en una superficie azul muy clara (#edf3fa) de hasta 680 px. Azul y Rojo se acercan al resultado, con petos del mismo estilo que el hero y cifras en el color de cada lado. El amarillo cítrico (#fff08a) se concentra en el reloj. «Ir al control» queda fuera del panel, sobre la superficie blanca, igual que el título de la sesión. Los datos siguen vinculados a la sesión real del navegador. En móvil, los petos quedan sobre los nombres y el reloj ocupa una fila bajo el resultado; el botón conserva su propio espacio.

Los petos de la sesión flotan 4 px y giran 3 grados en ciclos de 6 y 6.8 segundos. Solo se animan mientras la franja está visible, la pestaña está activa y la portada está abierta. Con movimiento reducido mantienen su inclinación estática.

«Probar la pantalla externa» es un botón de contorno negro, superficie blanca y sombra sólida, con icono de monitor y flecha en círculo azul. Conserva la apertura de la ventana pública real. Los pasos de inicio usan números circulares y el enlace al plan tiene contorno; el aviso de funciones futuras se distingue con una superficie oscura y borde lila. El hero y el cierre coral conservan su composición.

El monitor de presentación muestra «Combate de muestra» y una insignia Demo, visibles también en móvil. Su reloj de un minuto y puntos aleatorios de 1 a 3 son ilustrativos: no dependen del combate ni escriben datos locales, resúmenes o historial. Funciona automáticamente, sin botones de reproducción, pausa o reinicio. Cada 60 segundos de reproducción vuelve a 01:00 con puntos a cero. Solo avanza mientras se ve, la pestaña está activa y la portada está abierta. Con movimiento reducido se mantiene estático y reanuda automáticamente al desactivar esa preferencia.

La demo mantiene cada marcador entre 0 y 16. Alterna sumas con dos ejemplos pedidos: corrección de −1 a un lado y ajuste de −1 a un lado / +1 al rival. El lado se elige al azar entre los que admiten la operación; las etiquetas muestran el cambio efectivo y nunca se resta por debajo de cero. Los estados «Corrección» y «Ajuste» distinguen ambos casos. El límite y esos ejemplos se aplican únicamente al monitor ilustrativo: no representan un reglamento oficial ni cambian las acciones de puntuación del combate real.

src/scoreboard-demo.ts mantiene exclusivamente el estado efímero de la demostración. No importa el dominio, no usa almacenamiento ni envía mensajes a otras ventanas. Los segundos se calculan por tiempo monotónico transcurrido; el intervalo solo refresca la presentación. Los cambios de cifras no se anuncian cada segundo al lector de pantalla.

Al sumar puntos, la demo muestra trazos de impacto alrededor del número del lado que puntúa y lo amplía brevemente a 1.08 durante 420 ms. Las correcciones conservan sus etiquetas sin activar ese efecto. El impacto se cancela al reiniciar el ciclo, ocultar la demo o activar movimiento reducido. Los puntajes y la etiqueta del cambio siguen disponibles como información estática.

## Contraste de superficies sólidas

Luminancia relativa sRGB. Estos pares no certifican todos los píxeles de la imagen del hero; el texto explicativo tiene una superficie azul sólida y las acciones tienen fondo opaco.

| Par                                       | Contraste |
| ----------------------------------------- | --------- |
| Negro / azul hielo                        | 16.78:1   |
| Negro / lila                              | 14.35:1   |
| Negro / coral                             | 7.73:1    |
| Negro / resaltado de sesión #fff08a       | 17.15:1   |
| Azul #114c9a / panel de sesión #edf3fa    | 7.45:1    |
| Rojo #962030 / panel de sesión #edf3fa    | 7.38:1    |
| Secundario #536174 / reloj #fff08a        | 5.43:1    |
| Secundario #536174 / panel #f3f7fc        | 5.86:1    |
| Secundario #536174 / presentación #efdefd | 4.97:1    |
| Blanco / azul de atleta                   | 5.53:1    |
| Blanco / rojo de atleta                   | 5.36:1    |
| Reloj #ffe889 / marcador                  | 16.27:1   |
| Blanco / panel azul #102e52               | 13.68:1   |
| Blanco / panel rojo #4b1925               | 14.34:1   |
| Borde #718096 / blanco                    | 4.02:1    |

El foco es negro sobre superficies claras y blanco en el marco oscuro y el marcador. Los lados tienen nombre y etiqueta, además de color.

## Pantalla completa

Control incorpora «Marcador a pantalla completa», que utiliza la misma función y Fullscreen API que «Pantalla completa» en Marcador. Al entrar desde Control, salir devuelve a Control. Al entrar desde Marcador, salir conserva esa vista. «Abrir pantalla externa» sigue abriendo la ventana de solo lectura para trasladarla al segundo monitor.

La presentación solicita pantalla completa sobre el elemento del marcador, que ocupa el ancho y alto disponibles, y oculta la navegación de la aplicación. La ventana pública mantiene su comportamiento de solo lectura. No se modifica la puntuación, el reloj ni la persistencia al entrar o salir. La aplicación no controla los paneles del contenedor que la incrusta; una política del navegador o iframe puede denegar la Fullscreen API y se muestra un aviso.

## Recursos originales

El dobok y el peto del hero son SVG propios en index.html. El peto reutilizable de la sesión está en public/assets/hogu.svg. El fondo es una imagen original del cinturón azul sobre fondo opaco. Archivo final: public/assets/taekwondo-belt-sky.jpg, JPEG calidad 80, 1536 × 1024, 200 306 bytes. La ilustración anterior se conserva en docs/assets/taekwondo-kit-previous.jpg.

Se revisaron color, tipografía, distribución, escritura y accesibilidad. No se añadieron dependencias. Las comprobaciones y sus límites se registran en [verificación](verification.md).
