# Dirección visual de PSS Taekwondo

## Editorial de competición

Dirección confirmada el 2026-11-03: marfil, carbón y rojo señal. El usuario pidió una renovación del diseño completo: colores, header, hero y secciones, con una identidad propia del Taekwondo y sin una cuadrícula de tarjetas genéricas. La mesa mantiene la prioridad de puntos y reloj.

La señal principal de la portada es el nombre Taekwondo a todo el ancho, compuesto como un cartel deportivo. La explicación y la acción quedan en el margen de la fotografía; no se colorea una palabra de un titular para simular identidad. El encabezado usa navegación tipográfica y un subrayado rojo para la sección actual.

## Paleta

| Token     | Valor   | Papel                                  |
| --------- | ------- | -------------------------------------- |
| --bg      | #f1efe7 | Marfil de la página                    |
| --surface | #fbfaf5 | Papel de formularios y controles       |
| --ink     | #25251f | Carbón: texto, marca y marcador        |
| --accent  | #b62d20 | Rojo señal: acción principal y acentos |
| --muted   | #65665a | Piedra: texto secundario               |
| --blue    | #215aa7 | Competidor azul                        |

El azul queda asociado al atleta. El rojo identifica también el lado rojo; las acciones destructivas conservan tratamiento de contorno y confirmación explícita. Los estados tienen texto, además de cualquier cambio de color. En superficies oscuras se usan texto claro, fondos de competidor profundos y reloj marfil.

## Composición y componentes

- Header con marca original carbón/rojo, navegación sin cápsulas y enlace a la guía.
- Hero de cartel, fotografía sin tarjeta ni etiqueta superpuesta y acceso directo a preparar un combate.
- Franja de sesión conectada al estado real: evento, atletas, puntos, reloj y acceso al control.
- Presentación de las dos vistas mediante una pantalla dibujada con CSS. Sus cifras reflejan el combate actual; no son métricas ni resultados de ejemplo inventados.
- Inicio en tres pasos verticales. La numeración solo se utiliza donde hay una secuencia real.
- Una banda de proyecto distingue la alpha disponible de los torneos/LAN pendientes.
- Preparación como una hoja de combate: formato arriba, atletas juntos y acción de guardar al final. Sin tres tarjetas flotantes ni sombras.
- Control y pantalla pública conservan su estructura operativa, adaptados al nuevo carbón, marfil y colores de competidor. La guía usa filas de información para el stack, en lugar de tarjetas repetidas.

Barlow Condensed 600/700 aporta la voz deportiva; Manrope variable sirve a la lectura y controles. Ambas familias se sirven localmente desde public/fonts, con sus licencias. Las cifras son tabulares. Se mantienen etiquetas visibles, foco por teclado, controles nativos y reflujo hasta 320 px.

La puntuación no usa escala de pulsación. El resto de botones solo escala .96/150 ms cuando el sistema permite movimiento. No hay parallax, carruseles ni apariciones animadas de cada sección. Los espacios y formas agrupan antes que las sombras; la única sombra de presentación identifica el monitor de vista previa.

## Contrastes medidos

Luminancia relativa sRGB, calculada sobre estos pares de colores sólidos:

| Uso                      | Par               | Contraste |
| ------------------------ | ----------------- | --------- |
| Texto / marfil           | #25251f / #f1efe7 | 13.38:1   |
| Secundario / marfil      | #65665a / #f1efe7 | 5.06:1    |
| Secundario / papel       | #65665a / #fbfaf5 | 5.58:1    |
| Papel / rojo señal       | #fbfaf5 / #b62d20 | 5.94:1    |
| Rojo señal / marfil      | #b62d20 / #f1efe7 | 5.39:1    |
| Borde de entrada / papel | #797b6d / #fbfaf5 | 4.13:1    |
| Reloj / carbón           | #f4edce / #25251f | 13.10:1   |
| Texto / marcador azul    | #fbfaf5 / #17344b | 12.33:1   |
| Texto / marcador rojo    | #fbfaf5 / #4a281f | 12.45:1   |
| Secundario / carbón      | #c6c5b9 / #25251f | 8.87:1    |
| Puntos / superficie azul | #17477f / #edf2f7 | 8.31:1    |
| Puntos / superficie roja | #922217 / #f8ece7 | 7.37:1    |
| Foco / marfil            | #25251f / #f1efe7 | 13.38:1   |
| Foco claro / carbón      | #fbfaf5 / #25251f | 14.74:1   |

En la banda oscura y en pantalla completa se cambia el foco a claro. En las vistas claras se mantiene carbón. La marca usa dos trazos originales; no se utilizan logotipos de federaciones ni se anuncia homologación.

## Recursos y proceso

Se reutiliza public/assets/taekwondo-hero.jpg, imagen ilustrativa generada previamente para el proyecto; no se presenta como fotografía documental de un torneo. La tipografía, marca y fotografía se sirven localmente, sin peticiones a terceros durante el uso.

Se revisaron accesibilidad, distribución, tipografía, color y escritura. La dirección visual prioriza una identidad vinculada al deporte, una decisión visual dominante y la revisión del resultado renderizado.

La entrevista se realizó con preguntas directas. El plan descartó repetir el titular lateral más tres tarjetas; la implementación se revisó con capturas de las cuatro vistas en escritorio y móvil.

La vista pública sigue siendo de solo lectura. Alcance funcional, arquitectura y migración se conservan en sus documentos. La revisión y límites reales se registran en [interface-review.md](interface-review.md) y [verification.md](verification.md).
