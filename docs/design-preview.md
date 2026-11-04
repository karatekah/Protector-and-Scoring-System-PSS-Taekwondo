# Diseño aprobado · PSS Arena

Fecha: 2026-11-03. Diseño revisado por el usuario y aprobado para subir a GitHub. Sustituye la dirección editorial anterior con el cartel PSS, el cinturón azul y las secciones de presentación renovadas. [Historial de la dirección visual](design.md).

## Dirección

La referencia solicitada es [Slush](https://slush.app/): un hero envolvente, título de gran escala, navegación superpuesta en cápsulas y materialidad protagonista. Se adopta esa composición con identidad de Taekwondo: un cinturón de algodón azul, dobok y peto ilustrados. No se reutilizan imágenes, logotipo, tipografía propietaria ni código de Slush.

La idea dominante es un cartel PSS dentro del recorrido del cinturón. El resto de la portada organiza contenido real: sesión actual, mesa y pantalla, tres pasos de uso y estado del proyecto. Las secciones son bandas amplias con composiciones distintas. La pantalla representada muestra los puntos y reloj de la sesión, sin estadísticas inventadas.

## Sistema visual

| Color                 | Valor             | Uso                                                                     |
| --------------------- | ----------------- | ----------------------------------------------------------------------- |
| Negro                 | #08090b           | Marco de página, titular, botones principales y marcador                |
| Azul hielo            | #dbeeff           | Hero y secuencia de inicio                                              |
| Blanco                | #ffffff           | Navegación, formularios y superficies de lectura                        |
| Lila                  | #e9d2ff           | Franja de identificación; sección de presentación ligeramente más clara |
| Coral                 | #ff795e           | Invitación final                                                        |
| Azul / rojo de atleta | #1265d0 / #c92c3f | Identificación de los dos lados del combate                             |

Anton se utiliza exclusivamente en el gran PSS y numeración de cartel. Manrope mantiene la lectura y los controles; Barlow Condensed conserva las cifras del marcador. Las tres familias se sirven localmente. Anton procede de [Google Fonts](https://fonts.google.com/specimen/Anton); su licencia [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt) se conserva en public/fonts/anton-LICENSE.txt.

La navegación utiliza cápsulas blancas con borde negro de 2 px y selección oscura. El hero tiene radio de 52 px en escritorio y 30 px en móvil; las secciones usan 28–36 px y los controles operativos 8–18 px. Los campos mantienen etiquetas visibles. Los puntos no se desplazan ni escalan al pulsarlos. No hay marquesina animada, parallax ni movimiento automático de los gráficos.

## Contraste de superficies sólidas

Luminancia relativa sRGB. Estos pares no certifican todos los píxeles de la imagen del hero; el texto explicativo tiene una superficie azul sólida y las acciones tienen fondo opaco.

| Par                                       | Contraste |
| ----------------------------------------- | --------- |
| Negro / azul hielo                        | 16.78:1   |
| Negro / lila                              | 14.35:1   |
| Negro / coral                             | 7.73:1    |
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

El dobok y el peto son SVG propios en index.html. El fondo es una imagen original del cinturón azul sobre fondo opaco. Archivo final: public/assets/taekwondo-belt-sky.jpg, JPEG calidad 80, 1536 × 1024, 200 306 bytes. La ilustración anterior se conserva en docs/assets/taekwondo-kit-previous.jpg.

Se revisaron color, tipografía, distribución, escritura y accesibilidad. No se añadieron dependencias. Las comprobaciones y sus límites se registran en [verificación](verification.md).
