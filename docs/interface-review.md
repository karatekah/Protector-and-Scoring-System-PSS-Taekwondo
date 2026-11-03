# Revisión UI/UX del rediseño deportivo

Skills: better-ui, better-colors, better-typography, better-layout, better-writing y better-accessibility. Dirección elegida mediante entrevista: deportivo claro, presentación breve y acceso rápido al combate.

| Severidad original              | Lugar                          | Antes                                                         | Después                                                                   | Principio e impacto                                            |
| ------------------------------- | ------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Media                           | index.html, portada            | Presentación genérica y sin recurso visual de Taekwondo       | Marca original, imagen ilustrativa, titular editorial y acceso al combate | Identidad y jerarquía: reconocer el deporte y la función       |
| Media                           | css/styles.css, tipografía     | Fuente declarada sin archivo local y escala poco diferenciada | Manrope/Barlow locales, pesos disponibles y cifras tabulares              | Consistencia tipográfica y recursos independientes de terceros |
| Media                           | index.html, controles          | Registro entre los competidores                               | Controles azul/rojo juntos y registro en details/summary                  | Agrupar por tarea y mostrar el registro bajo demanda           |
| Media                           | src/main.ts, navegación        | El foco podía desplazar el encabezado fuera de vista          | Foco en panel con preventScroll y retorno al inicio                       | Navegación comprensible y posición predecible                  |
| Alta corregida durante revisión | css/styles.css, reloj a 320 px | El ancho de los dígitos superaba la columna del reloj         | Tamaño basado en el contenedor, sin desbordamiento                        | Reflujo y legibilidad: WCAG 1.4.10                             |
| Baja                            | guide.html y css/guide.css     | Identidad de la guía distinta de la nueva portada             | Marca, tipografía, acciones y superficies compartidas                     | Consistencia entre presentación, aplicación y documentación    |

Approve para la cobertura inspeccionada. Tipos, formato, pruebas unitarias, build y seis flujos de navegador aprobados. Axe no detectó infracciones en las vistas evaluadas. Se inspeccionaron capturas de escritorio y móvil y se midieron los contrastes de [la paleta](design.md).

No verificado: lectura con NVDA/VoiceOver, zoom nativo del navegador al 200 %, móvil físico y legibilidad desde el público en dos monitores reales. Las pruebas de navegador no sustituyen esas pruebas de campo.
