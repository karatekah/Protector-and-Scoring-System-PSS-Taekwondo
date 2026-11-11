# Dirección visual de Octajang

Este documento conserva la dirección visual anterior. El [diseño Octajang Arena inspirado en Slush](design-preview.md) fue revisado por el usuario y aprobado para subir a GitHub.

## Editorial de competición

Dirección confirmada el 2026-11-03: marfil, carbón y rojo señal. El usuario pidió una renovación del diseño completo: colores, header, hero y secciones, con una identidad propia del Taekwondo y sin una cuadrícula de tarjetas genéricas. La mesa mantiene la prioridad de puntos y reloj.

La señal principal de la portada es el nombre Taekwondo a todo el ancho, compuesto como un cartel deportivo. La explicación y la acción acompañan una ilustración de equipamiento del deporte. El encabezado usa navegación segmentada con selección oscura y una superficie elevada.

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

- Header con marca original carbón/rojo, navegación segmentada y enlace a la guía.
- Hero de cartel en una superficie de papel; ilustración propia de hogu/cinturón, resumen del estado real y acceso directo a preparar un combate.
- Franja de sesión conectada al estado real: evento, atletas, puntos, reloj y acceso al control.
- Presentación de las dos vistas mediante una pantalla dibujada con CSS. Sus cifras reflejan el combate actual; no son métricas ni resultados de ejemplo inventados.
- Inicio en tres pasos verticales. La numeración solo se utiliza donde hay una secuencia real.
- Una banda de proyecto distingue la alpha disponible de los torneos/LAN pendientes.
- Preparación como una hoja de combate: formato arriba, atletas juntos y acción de guardar al final. Sin tres tarjetas flotantes ni sombras.
- Control y pantalla pública conservan su estructura operativa, adaptados al nuevo carbón, marfil y colores de competidor. La guía usa filas de información para el stack, en lugar de tarjetas repetidas.

Barlow Condensed 600/700 aporta la voz deportiva; Manrope variable sirve a la lectura y controles. Ambas familias se sirven localmente desde public/fonts, con sus licencias. Las cifras son tabulares. Se mantienen etiquetas visibles, foco por teclado, controles nativos y reflujo hasta 320 px.

La puntuación no usa escala de pulsación. El resto de botones solo escala .96/150 ms cuando el sistema permite movimiento. No hay parallax, carruseles ni apariciones animadas de cada sección. Los espacios y formas agrupan antes que las sombras. La profundidad diferencia navegación, controles y objetos de presentación; las teclas de puntuación no se desplazan al pulsarlas.

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

El hero anterior usaba una ilustración original de protectores de pecho azul/rojo y cinturón negro. Se conserva en docs/assets/taekwondo-kit-previous.jpg. Exportación JPEG 82, 1536 × 1024, 197 833 bytes. Representa equipamiento tradicional del deporte, sin sensores ni afirmaciones de integración. La fotografía anterior se conserva en docs/assets/taekwondo-hero-previous.jpg. Todos los recursos publicados se sirven localmente.

Se revisaron accesibilidad, distribución, tipografía, color y escritura. La dirección visual prioriza una identidad vinculada al deporte, una decisión visual dominante y la revisión del resultado renderizado.

La entrevista se realizó con preguntas directas. El plan descartó repetir el titular lateral más tres tarjetas; la implementación se revisó con capturas de las cuatro vistas en escritorio y móvil.

La vista pública sigue siendo de solo lectura. Alcance funcional, arquitectura y migración se conservan en sus documentos. La revisión y límites reales se registran en [interface-review.md](interface-review.md) y [verification.md](verification.md).

## Componentes y materialidad

La revisión posterior toma como referencias las superficies táctiles de Slush y los catálogos propuestos por el usuario. Se mantienen marfil/carbón/rojo y las familias locales; Manrope gana protagonismo en el mensaje del hero y Barlow Condensed queda en el nombre del deporte y las cifras. La escala separa lectura, secundarios, controles y marcador.

| Recurso inspeccionado                                                                                                                               | Decisión para Octajang                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [Slush](https://slush.app/)                                                                                                                         | Profundidad visual y recurso de marca protagonista, adaptados al equipamiento de Taekwondo                                                     |
| [Kobra Button](https://kobra.systems/components/button)                                                                                             | Botones con estados de superficie y relieve; implementación nativa propia                                                                      |
| [Rare UI Duration Picker](https://www.rareui.com/components/durationpicker)                                                                         | Se estudió la agrupación de duración; se implementaron presets propios 1:00/1:30/2:00 con entradas manuales, sin portar su código ni animación |
| [EasyUI UnfoldAccordion](https://easyui.site/components/unfold-accordion)                                                                           | Desplegables nativos para explicar las dos vistas, con indicador que responde a la preferencia de movimiento                                   |
| [Aceternity Floating Navbar](https://ui.aceternity.com/components/floating-navbar) y [3D Card](https://ui.aceternity.com/components/3d-card-effect) | Segmentos de navegación elevados y profundidad de la presentación; sin ocultar el menú ni mover los controles de puntuación                    |
| [Pin UI](https://pinui.xyz/)                                                                                                                        | Se revisó el acabado de componentes renderizados y la separación de lectura/acción                                                             |

No se incorpora código de los catálogos ni se instala React/Tailwind/Motion para esta iteración. css/components.css contiene los componentes propios de la alpha. El selector actualiza el formulario; la configuración solo se guarda al enviar. Los presets se deshabilitan para un segundo operador. Las teclas de puntuación conservan posición fija, respuesta inmediata y una sola autoridad.

El componente de resumen sobre la ilustración muestra el reloj y puntos reales del combate. No contiene cifras de éxito ni estadísticas inventadas. Los bordes, radios e iluminación distinguen superficies de papel, controles y pantalla. No hay animaciones automáticas, parallax ni transformaciones continuas con el cursor.
