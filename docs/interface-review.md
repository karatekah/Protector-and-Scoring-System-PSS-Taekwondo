# Revisión de interfaz

Alcance: las cuatro vistas de la aplicación y la guía pública.

| Severidad original | Lugar                        | Antes                                                        | Después                                                                  | Principio e impacto                                             |
| ------------------ | ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Alta               | src/main.ts, ventana pública | La carga del marcador podía persistir sobre el estado activo | Solo lectura y un operador con Web Locks                                 | Interacción: abrir la segunda pantalla no interrumpe el control |
| Alta               | css/styles.css, botones      | Hover con movimiento sin respetar reducción de movimiento    | Hover solo en punteros compatibles, escala .96/150 ms bajo no-preference | Movimiento reducido y uso táctil                                |
| Media              | index.html, navegación       | Cambio visual de sección sin foco ni estado de navegación    | Foco en la vista, título de documento y aria-current                     | WCAG 2.4.3 y navegación comprensible                            |
| Media              | index.html, marcadores       | Sensores simulados y marca WT sin integración                | Puntuación manual y alcance de entrenamiento explícitos                  | Estado veraz y expectativas de producto                         |
| Media              | css/styles.css, formularios  | Bordes poco contrastados y estilo inconsistente              | Tokens y bordes de entrada de 3.64:1 contra blanco                       | WCAG 1.4.11                                                     |
| Baja               | css/styles.css, superficies  | Tarjetas y espaciados inconsistentes                         | Radios, sombras, separación y números tabulares consistentes             | Jerarquía y legibilidad                                         |

Verificación: axe automatizado, navegación inicial por teclado, inspección visual de capturas, reflujo a 320 px, movimiento reducido y medición de los pares documentados. No se ejecutó un recorrido con lector de pantalla ni la sesión física de dos monitores. Consultar [la matriz de verificación](verification.md).

Approve para la cobertura inspeccionada; los pendientes manuales siguen abiertos.
