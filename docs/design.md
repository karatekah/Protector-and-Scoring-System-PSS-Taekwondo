# Identidad visual y experiencia de PSS

Dirección elegida con el usuario: deportivo claro, portada editorial y marcador oscuro. La portada presenta el proyecto brevemente y ofrece acceso rápido al combate.

## Identidad

El azul y el rojo identifican a los competidores. El blanco, el gris claro y el negro estructuran la interfaz. El reloj usa un amarillo cálido sobre fondo oscuro. La marca original combina dos trazos en movimiento; no utiliza logotipos de federaciones ni anuncia homologación.

La portada combina un titular, imagen de Taekwondo, acción principal y resumen real del combate guardado. La presentación diferencia la alpha disponible del objetivo de torneos todavía pendiente. El control agrupa los botones de cada competidor y permite abrir el registro mediante un disclosure nativo.

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
