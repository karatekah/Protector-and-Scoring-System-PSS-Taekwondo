# Identidad visual y experiencia de PSS

Dirección elegida con el usuario: deportivo claro, portada editorial y marcador oscuro. La portada presenta el proyecto brevemente y ofrece acceso rápido al combate.

## Identidad

El azul y el rojo identifican a los competidores. El blanco, el gris claro y el negro estructuran la interfaz. El reloj usa un amarillo cálido sobre fondo oscuro. La marca original combina dos trazos en movimiento; no utiliza logotipos de federaciones ni anuncia homologación.

La portada combina un titular, imagen de Taekwondo, acción principal y resumen real del combate guardado. La presentación diferencia la alpha disponible del objetivo de torneos todavía pendiente. El resumen oscuro anticipa la identidad del marcador; las tarjetas de preparación usan superficies claras azul y roja para reconocer al atleta antes de guardar.

## Refinamiento de la aplicación completa · 2026-11-03

La entrevista confirmó dos decisiones: trabajar la aplicación completa y priorizar puntos/reloj con mínima distracción. La propuesta mantiene la dirección deportiva acordada y mejora la densidad del control.

- Marcador con superficies azul y roja profundas, cifras blancas, etiquetas de lado y reloj amarillo. El estado del reloj siempre tiene texto; «En combate» añade un borde amarillo estático, sin parpadeo.
- Los seis incrementos de cada atleta caben en una fila cuando su contenedor tiene espacio. Los botones mantienen etiquetas de puntos y no se animan con escala, porque se usan repetidamente.
- Registro y Gestión del combate son desplegables nativos. Deshacer sigue visible junto al reloj; guardar, intercambiar lados y nuevo combate quedan en Gestión.
- El espacio reservado para mensajes evita el desplazamiento de los controles con las confirmaciones cortas en escritorio. Los mensajes largos pueden ocupar más líneas; no se truncan.
- En la configuración por defecto, los dos paneles de puntos terminan dentro de una ventana de 1366 × 768. Los nombres largos conservan todo el texto y pueden aumentar la altura.
- La ventana externa aprovecha el alto disponible. La marca también identifica la pestaña mediante un favicon SVG local.

La entrevista se realizó con preguntas directas. Se revisaron accesibilidad, distribución, tipografía, color, escritura y acabado visual.

## Tipografía y recursos locales

- Manrope variable para interfaz y lectura; Barlow Condensed 600/700 para titulares, cifras y marcador.
- Fuentes obtenidas de @fontsource-variable/manrope y @fontsource/barlow-condensed 5.3.0. Se alojan en public/fonts junto con sus licencias originales.
- Marca original: public/assets/pss-mark.svg.
- Imagen final: public/assets/taekwondo-hero.jpg, 198 515 bytes. Formato JPEG para su entrega web.
- La imagen se identifica como ilustrativa; no representa un torneo real documentado. No hay peticiones de fuentes ni imágenes a terceros durante el uso.

## Paleta y contrastes medidos

| Uso                        | Colores           | Contraste |
| -------------------------- | ----------------- | --------- |
| Texto principal / fondo    | #141b25 / #f6f7f9 | 16.15:1   |
| Texto secundario / fondo   | #53606f / #f6f7f9 | 5.99:1    |
| Texto secundario / blanco  | #53606f / #ffffff | 6.42:1    |
| Blanco / marcador azul     | #ffffff / #112442 | 15.50:1   |
| Blanco / marcador rojo     | #ffffff / #371b29 | 15.54:1   |
| Etiqueta / marcador azul   | #a6c7ff / #112442 | 9.03:1    |
| Etiqueta / marcador rojo   | #ffb1bd / #371b29 | 9.08:1    |
| Secundario / marcador azul | #b8c4d5 / #112442 | 8.78:1    |
| Secundario / marcador rojo | #b8c4d5 / #371b29 | 8.80:1    |
| Puntos / superficie azul   | #0d3d93 / #edf3ff | 8.96:1    |
| Puntos / superficie roja   | #98182e / #fff0f2 | 7.58:1    |
| Texto azul / blanco        | #0d3d93 / #ffffff | 9.97:1    |
| Texto rojo / blanco        | #98182e / #ffffff | 8.38:1    |
| Reloj / fondo del marcador | #ffe177 / #0c1119 | 14.68:1   |
| Foco / fondo claro         | #a57200 / #f6f7f9 | 3.91:1    |
| Foco / blanco              | #a57200 / #ffffff | 4.19:1    |
| Foco / marcador oscuro     | #a57200 / #0c1119 | 4.51:1    |
| Borde de entrada / blanco  | #7a8696 / #ffffff | 3.70:1    |

Los tokens están definidos en css/styles.css. Los números de reloj y puntaje utilizan cifras tabulares. El reloj se adapta al ancho de su contenedor para conservar los cinco caracteres en pantallas estrechas.

## Comportamiento y accesibilidad

Controles nativos, foco visible y enlace para saltar al contenido. Cambiar de sección mueve el foco al panel y vuelve al inicio de la página. El registro conserva control por teclado mediante details/summary. No hay carruseles ni movimiento automático. La escala de pulsación .96/150 ms solo se aplica con prefers-reduced-motion: no-preference; los estados de hover solo aparecen en punteros compatibles.

La interfaz usa etiquetas además de color para identificar competidores y estados. Los nombres se pueden envolver con interlineado 1.4; no se ocultan con puntos suspensivos. La vista pública mantiene solo lectura. Las verificaciones realizadas y los pendientes físicos o con lector de pantalla se registran en docs/verification.md.
