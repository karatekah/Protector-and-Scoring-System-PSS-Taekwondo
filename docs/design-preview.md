# Diseño aprobado · PSS Arena

Fecha: 2026-11-03. Diseño revisado por el usuario y aprobado para subir a GitHub. Sustituye la dirección editorial anterior con el cartel PSS, el cinturón azul y las secciones de presentación renovadas. [Historial de la dirección visual](design.md).

## Dirección

La referencia solicitada es [Slush](https://slush.app/): un hero envolvente, título de gran escala, navegación superpuesta en cápsulas y materialidad protagonista. Se adopta esa composición con identidad de Taekwondo: un cinturón de algodón azul, dobok y peto ilustrados. No se reutilizan imágenes, logotipo, tipografía propietaria ni código de Slush.

La idea dominante es un cartel PSS dentro del recorrido del cinturón. El resto de la portada organiza la sesión actual, la presentación de mesa y pantalla, tres pasos de uso y el estado del proyecto. Las secciones son bandas amplias con composiciones distintas. La franja de sesión conserva los datos reales; el monitor de presentación es una simulación etiquetada como Demo e independiente del combate.

## Sistema visual

| Color                 | Valor             | Uso                                                                     |
| --------------------- | ----------------- | ----------------------------------------------------------------------- |
| Negro                 | #08090b           | Marco de página, titular, botones principales y marcador                |
| Azul hielo            | #dbeeff           | Hero y secuencia de inicio                                              |
| Blanco                | #ffffff           | Navegación, formularios y superficies de lectura                        |
| Lila                  | #e9d2ff           | Franja de identificación; sección de presentación ligeramente más clara |
| Coral                 | #ff795e           | Invitación final                                                        |
| Resaltado de sesión   | #fff08a           | Fondo de resultado, atletas y reloj de la sesión                        |
| Azul / rojo de atleta | #1265d0 / #c92c3f | Identificación de los dos lados del combate                             |

Anton se utiliza exclusivamente en el gran PSS y numeración de cartel. Manrope mantiene la lectura y los controles; Barlow Condensed conserva las cifras del marcador. Las tres familias se sirven localmente. Anton procede de [Google Fonts](https://fonts.google.com/specimen/Anton); su licencia [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt) se conserva en public/fonts/anton-LICENSE.txt.

La navegación utiliza cápsulas blancas con borde negro de 2 px y selección oscura. El hero tiene radio de 52 px en escritorio y 30 px en móvil; las secciones usan 28–36 px y los controles operativos 8–18 px. Los campos mantienen etiquetas visibles. Los puntos no se desplazan ni escalan al pulsarlos.

## Movimiento de portada

Por solicitud posterior del usuario, la portada incorpora movimiento inspirado en [Slush](https://slush.app/). No se agregaron dependencias ni se modificó el dominio del combate.

- Ribbon con dos grupos idénticos y un recorrido lineal de 32 segundos hasta −50 % del track. El segundo grupo ocupa la posición inicial al terminar cada ciclo; el ancho mínimo de cada grupo cubre el viewport.
- Dobok, peto y sello de dos pantallas con flotación independiente: 6, 7 y 5.6 segundos, recorridos de 10–18 px y giro de 3–5 grados alrededor de la inclinación original.
- Entradas al desplazarse mediante IntersectionObserver. Solo se prepara el contenido inicialmente bajo el viewport; título y acciones del hero se ven desde el primer render. Los bloques entran una sola vez, con opacidad, 12 px de desplazamiento y desenfoque de 4 px durante 300 ms, separados por 100 ms donde hay una secuencia.
- Por indicación del usuario, el ribbon y los gráficos funcionan automáticamente sin botón de pausa.
- Con prefers-reduced-motion, no se ejecutan desplazamientos ni ciclos y todos los contenidos son visibles. La preferencia también se respeta si cambia con la página abierta.
- La flotación y el ribbon se pausan al salir del hero, ocultar la pestaña o cambiar a una vista operativa. La pantalla pública no inicializa este módulo. No hay listeners de scroll ni bucles JavaScript por frame.

Los bloques se revelan inmediatamente al recibir foco. Sin JavaScript, sin IntersectionObserver o con movimiento reducido, el contenido continúa visible. No se animan los puntos, el reloj ni las teclas de puntuación de las vistas operativas. El código vive en src/landing-motion.ts y en css/arena.css.

## Sesión y demostración del marcador

La franja «En la mesa» reserva un panel amarillo cítrico (#fff08a) exclusivamente para Azul, resultado, Rojo, reloj y ronda. Azul y Rojo se alinean hacia el resultado, en un grupo de hasta 360 px y con 14 px de separación entre columnas. «Ir al control» queda fuera de ese fondo, sobre la superficie blanca, igual que el título de la sesión. Las cifras y el tiempo tienen superficies blancas; la acción principal usa negro. Los datos siguen vinculados a la sesión real del navegador. En móvil se apilan los datos y el botón se mantiene fuera del panel.

«Probar la pantalla externa» es un botón de contorno negro, superficie blanca y sombra sólida, con icono de monitor y flecha en círculo azul. Conserva la apertura de la ventana pública real. Los pasos de inicio usan números circulares y el enlace al plan tiene contorno; el aviso de funciones futuras se distingue con una superficie oscura y borde lila. El hero y el cierre coral conservan su composición.

El monitor de presentación muestra «Combate de muestra» y una insignia Demo, visibles también en móvil. Su reloj de un minuto y puntos aleatorios de 1 a 3 son ilustrativos: no dependen del combate ni escriben datos locales, resúmenes o historial. Funciona automáticamente, sin botones de reproducción, pausa o reinicio. Cada 60 segundos de reproducción vuelve a 01:00 con puntos a cero. Solo avanza mientras se ve, la pestaña está activa y la portada está abierta. Con movimiento reducido se mantiene estático y reanuda automáticamente al desactivar esa preferencia.

La demo mantiene cada marcador entre 0 y 16. Alterna sumas con dos ejemplos pedidos: corrección de −1 a un lado y ajuste de −1 a un lado / +1 al rival. El lado se elige al azar entre los que admiten la operación; las etiquetas muestran el cambio efectivo y nunca se resta por debajo de cero. Los estados «Corrección» y «Ajuste» distinguen ambos casos. El límite y esos ejemplos se aplican únicamente al monitor ilustrativo: no representan un reglamento oficial ni cambian las acciones de puntuación del combate real.

src/scoreboard-demo.ts mantiene exclusivamente el estado efímero de la demostración. No importa el dominio, no usa almacenamiento ni envía mensajes a otras ventanas. Los segundos se calculan por tiempo monotónico transcurrido; el intervalo solo refresca la presentación. Los cambios de cifras no se anuncian cada segundo al lector de pantalla.

## Contraste de superficies sólidas

Luminancia relativa sRGB. Estos pares no certifican todos los píxeles de la imagen del hero; el texto explicativo tiene una superficie azul sólida y las acciones tienen fondo opaco.

| Par                                       | Contraste |
| ----------------------------------------- | --------- |
| Negro / azul hielo                        | 16.78:1   |
| Negro / lila                              | 14.35:1   |
| Negro / coral                             | 7.73:1    |
| Negro / resaltado de sesión #fff08a       | 17.15:1   |
| Azul #114c9a / resaltado de sesión        | 7.16:1    |
| Rojo #962030 / resaltado de sesión        | 7.10:1    |
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

El dobok y el peto son SVG propios en index.html. El fondo es una imagen original generada con **imagegen integrada**, modo generación nueva y fondo opaco. Archivo final: public/assets/taekwondo-belt-sky.jpg, JPEG calidad 80, 1536 × 1024, 200 306 bytes. El original se conserva en .design.local/taekwondo-belt-sky-original.png. La ilustración anterior se conserva en docs/assets/taekwondo-kit-previous.jpg.

Prompt exacto del fondo:

> Use case: product-mockup. Asset type: full-bleed hero background for a bold Taekwondo scoring software website. Create an original, premium, sculptural macro studio render of ONE long blue Taekwondo martial-arts belt moving through a loose broad loop. It must be a flat, thick woven cotton martial-arts belt with a rectangular ribbon cross section, subtle stitched rows and tactile fabric grain, not a round tube, rope, balloon or inflated object. Bright saturated cobalt/royal blue cloth against a seamless pale ice-blue background, approximately #dbeeff. The broad belt sweeps diagonally in from the upper left, curves toward the upper right and reappears across the bottom edge, framing a large clear light-blue central area. Composition: wide landscape 3:2, extreme oversized close-up so part of the belt goes beyond the image edges; dynamic elegant curvature with some twists showing the flat cloth edges, generous uninterrupted negative space in the center for a huge black typographic title that will be added in HTML. Place the strongest belt forms along the upper-left and lower-right periphery. Light from upper left, refined highlights and rich material shadows, luxury sports editorial, believable soft textile. Image should feel vibrant, confident, tangible, and playful without becoming cartoonish. Equipment-inspired original art only. No people, no protectors, no hands, no logos, no letters, no numbers, no watermarks, no embedded interface or text. Background stays pale ice blue throughout, never white or cream. No black objects in the center. Do not add any other props or graphics.

Se aplicaron frontend-design, better-ui y las guías better-* de color, tipografía, layout, escritura y accesibilidad. No se añadieron dependencias. Las comprobaciones y sus límites se registran en [verificación](verification.md).
