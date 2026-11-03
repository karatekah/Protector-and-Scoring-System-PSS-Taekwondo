# Verificación de la alpha

Fecha: 2026-11-02. Entorno local: Windows, Node 24.22.1 y npm 11.19.1.

## Evidencia automatizada

### Rediseño UI/UX deportivo

Se verificaron tipos, formato, cuatro pruebas unitarias, build y seis flujos en Chromium/Firefox después del rediseño de portada, control, marcador y guía. Los flujos conservan puntuación, reloj, sincronización, persistencia, bloqueo de segundo operador y respaldo JSON. Axe no detectó infracciones en las vistas evaluadas.

Se inspeccionaron capturas a 1440 px y 390 px. A 320 px se comprobó reflujo y que el reloj no excede su columna: 66 px de contenido y 66 px de scrollWidth. El registro desplegable muestra las acciones del combate. Los contrastes actuales y la procedencia de imagen, marca y fuentes se documentan en [diseño](design.md).

La tabla de contraste de la revisión original más abajo es evidencia histórica. Los valores vigentes del rediseño están en docs/design.md. Continúan pendientes las verificaciones físicas y con lector de pantalla enumeradas en este documento.

### Revisión de arquitectura posterior a la alpha

Se documentó el stack objetivo y se actualizó la guía con su estado de implementación. Para ese cambio se comprobaron formato, tipos y build; los 14 documentos revisados no tenían enlaces locales rotos. Pasaron los dos flujos existentes de teclado, reflujo y accesibilidad de Chromium/Firefox, incluidos los controles automatizados sobre la guía.

Esa evidencia valida la documentación y las vistas actuales. No valida React, Go, SQLite ni la comunicación LAN, que todavía no están implementados. Los escenarios de [arquitectura de torneos](tournament-architecture.md) son criterios de aceptación futuros.

### Evidencia de la alpha publicada

| Comprobación                                           | Resultado local                                           |
| ------------------------------------------------------ | --------------------------------------------------------- |
| TypeScript estricto                                    | Aprobado                                                  |
| Prettier                                               | Aprobado                                                  |
| Vitest                                                 | 4 pruebas aprobadas                                       |
| Build Vite de producción                               | Aprobado                                                  |
| Playwright Chromium                                    | 3 flujos aprobados                                        |
| Playwright Firefox                                     | 3 flujos aprobados                                        |
| axe en inicio, configuración, control, marcador y guía | Sin infracciones en los criterios evaluados               |
| Reflujo a 320 px                                       | Sin desbordamiento horizontal en las cuatro vistas        |
| Tab, enlace para saltar y movimiento reducido          | Comprobados en las pruebas de navegador                   |
| Dependencias al instalar                               | npm audit: 0 vulnerabilidades conocidas en la instalación |

Las pruebas cubren puntuación, Gam-jeom, impactos, deshacer sin devolver tiempo, crecimiento acotado del historial, archivo sin snapshots anidados, validación y migración, callbacks retrasados, persistencia, segundo operador, ventana pública, recarga de la ventana pública durante el combate y exportación/importación JSON.

La prueba del reloj usa tiempo controlado por Playwright. Se congeló explícitamente la referencia antes del flujo para que la duración de navegación de Firefox no alterara los segundos esperados; no se cambiaron las expectativas para ocultar un defecto.

## Revisión visual

Se inspeccionaron capturas de inicio y control a 1440 px, control a 390 px y guía pública. Se midieron estos pares:

| Par                       | Contraste |
| ------------------------- | --------- |
| Texto principal / blanco  | 16.27:1   |
| Texto secundario / blanco | 6.29:1    |
| Texto secundario / fondo  | 5.56:1    |
| Blanco / azul             | 6.53:1    |
| Blanco / rojo             | 5.92:1    |
| Blanco / acción principal | 7.45:1    |
| Borde de entrada / blanco | 3.64:1    |
| Foco / blanco             | 4.19:1    |
| Foco / fondo              | 3.71:1    |
| Foco / superficie oscura  | 3.88:1    |

Los resultados de axe y los contrastes no constituyen una auditoría completa WCAG ni sustituyen una prueba con lector de pantalla.

## No verificado

- PC físico con dos monitores, pantalla completa y visibilidad a distancia.
- Sesión completa de entrenamiento, suspensión/hibernación y comportamiento bajo carga.
- NVDA/VoiceOver y zoom de navegador al 200 % con observación manual.
- Safari/WebKit, móvil físico y dispositivos de entrada especiales.

## Publicación

GitHub Actions aprobó el commit `6a8a021146b13a9c7f829895ff2eae45f0a0a81e` en Linux: instalación, tipos, formato, pruebas unitarias, build y los seis flujos de navegador. [Ejecución](https://github.com/karatekah/Protector-and-Scoring-System-PSS-Taekwondo/actions/runs/41549006931).

Vercel marcó Ready el despliegue `dpl_2KfE9DhFZGEGhpKy9rjrTjWLSz3f` del commit `70e8788bce3144086ee366125778d51b5d620b1e`. [Producción](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/) y [guía](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/guide.html) respondieron HTTP 200 sin autenticación, con las cabeceras previstas.

Una sesión nueva de Chromium abrió producción, tomó el lock de operador, sumó dos puntos al azul y comprobó el mismo puntaje en otra ventana pública. No se detectaron errores JavaScript. El problema inicial de formato del builder quedó corregido manteniendo Prettier en CI; consultar [despliegue](deployment.md).
