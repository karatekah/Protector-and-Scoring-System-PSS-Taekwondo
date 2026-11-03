# Identidad visual y experiencia de PSS

Dirección elegida con el usuario: deportivo claro, portada editorial y marcador oscuro. La portada presenta el proyecto brevemente y ofrece acceso rápido al combate.

## Identidad

El azul y el rojo identifican a los competidores. El blanco, el gris claro y el negro estructuran la interfaz. El reloj usa un amarillo cálido sobre fondo oscuro. La marca original combina dos trazos en movimiento; no utiliza logotipos de federaciones ni anuncia homologación.

La portada combina un titular, imagen de Taekwondo, acción principal y resumen real del combate guardado. La presentación diferencia la alpha disponible del objetivo de torneos todavía pendiente. El control agrupa los botones de cada competidor y permite abrir el registro mediante un disclosure nativo.

## Tipografía y recursos locales

- Manrope variable para interfaz y lectura; Barlow Condensed 600/700 para titulares, cifras y marcador.
- Fuentes obtenidas de @fontsource-variable/manrope y @fontsource/barlow-condensed 5.3.0. Se alojan en public/fonts junto con sus licencias originales.
- Marca original: public/assets/pss-mark.svg.
- Imagen final: public/assets/taekwondo-hero.jpg, 198 515 bytes. Generada con la herramienta integrada imagegen y convertida a JPEG para su entrega web; el original generado se conserva fuera del checkout.
- La imagen se identifica como ilustrativa; no representa un torneo real documentado. No hay peticiones de fuentes ni imágenes a terceros durante el uso.

## Paleta y contrastes medidos

| Uso                        | Colores           | Contraste |
| -------------------------- | ----------------- | --------- |
| Texto principal / fondo    | #141b25 / #f6f7f9 | 16.15:1   |
| Texto secundario / fondo   | #53606f / #f6f7f9 | 5.99:1    |
| Texto secundario / blanco  | #53606f / #ffffff | 6.42:1    |
| Texto blanco / azul        | #ffffff / #1255cf | 6.51:1    |
| Texto blanco / rojo        | #ffffff / #c9253d | 5.50:1    |
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

La interfaz usa etiquetas además de color para identificar competidores y estados. La vista pública mantiene solo lectura. Las verificaciones realizadas y los pendientes físicos o con lector de pantalla se registran en docs/verification.md.

## Prompt final del recurso generado

Herramienta: imagegen integrada, generación nueva, fondo opaco. Prompt:

> Use case: photorealistic-natural. Asset type: editorial hero photograph for a professional Taekwondo scoring software website. Create a premium, believable sports editorial photograph of two adult Taekwondo athletes sparring in a spacious modern dojang. White V-neck doboks, black belts, one athlete with a royal-blue hogu and matching blue head protector, the other with a red hogu and matching red head protector, barefoot on light gray competition mats. Capture a beautiful controlled turning kick toward the opponent's chest protector, accurate athletic anatomy and plausible balance, full bodies and feet visible. Camera slightly low, 50mm sports photography, crisp fabric detail and a little natural movement in the uniform, soft directional daylight, pale warm-gray gym background, subtle floor shadows. Composition: landscape 4:3, athletes arranged in a dynamic diagonal, centered with generous breathing room for responsive cropping, suitable as a rectangular image on the right side of a white editorial landing page; no copy will be embedded in the photograph. Palette: white doboks and neutral gray surroundings with strong red and blue equipment. Contemporary, focused, disciplined, energetic. No lettering, no logos, no watermarks, no federation marks, no flags, no medals, no extra limbs, no weapons, no visible injury. This is an illustrative original scene, not a documentary image of a particular event.
