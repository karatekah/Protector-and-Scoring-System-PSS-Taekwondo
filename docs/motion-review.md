# Revisión de movimiento de portada

Fecha: 2026-11-04. Registro de la revisión inicial con controles de pausa. Posteriormente el usuario solicitó retirarlos del ribbon y del monitor; la demo se reinicia automáticamente cada minuto. Esta tabla conserva evidencia histórica, no describe los controles actuales. Ver [diseño vigente](design-preview.md) y [verificación](verification.md).

Modo full de make-interfaces-feel-better y better-ui. Alcance inicial: ribbon, gráficos del hero, entradas de las secciones de inicio, pausa y preferencia de movimiento reducido. HTML/TypeScript nativos y CSS con tokens; sin nuevas dependencias. La mesa y la pantalla pública conservan su comportamiento operativo.

## Cobertura

| Categoría   | Evidencia                                                                                      | Resultado                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Tipografía  | Familias locales existentes, texto repetido de ribbon y etiqueta de pausa                      | Sin cambio de familias; la copia para lectores de pantalla no se repite        |
| Superficies | Control de pausa en la franja, foco visible y reflujo                                          | Control nativo integrado en la banda; no desplaza el hero                      |
| Animaciones | Ciclo de ribbon, tres flotaciones, entradas y pausa; revisión de entradas al 10 % de velocidad | Bucle continuo; entrada única y secuenciada                                    |
| Iconos      | Dobok, peto y sello originales; símbolo de pausa/reanudación con currentColor                  | Desplazamiento y giro conservan la inclinación base; nombre accesible textual  |
| Rendimiento | CSS transform; IntersectionObserver; suspensión fuera del hero/pestaña y en vistas operativas  | Sin listeners de scroll, bucles JavaScript por frame ni will-change permanente |

## Cambios revisados

Son adaptaciones de diseño solicitadas por el usuario, no fallos de la dirección visual anterior.

| Severidad | Lugar                                       | Antes                                   | Después                                                                                            | Motivo                                                          |
| --------- | ------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| LOW       | css/arena.css:45, index.html:20             | Franja estática con cuatro repeticiones | Dos grupos idénticos recorren −50 % del track en 32 segundos                                       | Mantener continuidad al reiniciar el ciclo                      |
| LOW       | css/arena.css:111                           | Tres gráficos estáticos                 | Flotación y giro con duración, amplitud y fase propias                                             | Dar movimiento al recurso original de Taekwondo                 |
| LOW       | src/landing-motion.ts:49                    | Secciones estáticas al desplazarse      | Una entrada por bloque de 300 ms; desfase de 100 ms donde hay secuencia                            | Expresar la jerarquía sin repetir la animación al volver        |
| LOW       | css/arena.css:80, src/landing-motion.ts:30  | No había ciclos continuos               | Botón accesible; pausa en el fotograma actual y muestra bloques pendientes                         | Permitir detener movimiento automático (WCAG 2.2.2)             |
| LOW       | src/landing-motion.ts:24, css/arena.css:121 | No existían entradas de scroll          | Movimiento condicionado a la preferencia; el foco revela el contenido y la alternativa es estática | Evitar movimiento no solicitado y controles visualmente ocultos |

## Opciones descartadas

| Opción                                                | Motivo                                                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Añadir GSAP, Motion, React o una librería de carrusel | CSS e IntersectionObserver resuelven el alcance en el stack actual                            |
| Parallax del fondo y reacción continua al cursor      | El usuario pidió movimiento de gráficos y entradas al desplazarse; el fondo permanece estable |
| Volver a ocultar cada sección al salir del viewport   | Repetiría el coste de atención y dificultaría releer el contenido                             |

## Verificación y límites

Ver comandos, resultados y límites en [verification.md](verification.md). El criterio de revisión visual se limita al navegador: no sustituye una prueba con lector de pantalla, un teléfono físico ni la prueba del marcador con dos monitores.

Veredicto: **Approve** para el alcance inspeccionado; no quedan hallazgos accionables en esa cobertura. No verificados: NVDA/VoiceOver, hardware móvil ni sesión física de dos monitores.
