# Verificación de la alpha

Fecha: 2026-11-02. Entorno local: Windows, Node 24.22.1 y npm 11.19.1.

## Evidencia automatizada

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

Los resultados de axe y los contrastes no constituyen una auditoría completa WCAG ni sustituyen una prueba con lector de pantalla.

## No verificado

- PC físico con dos monitores, pantalla completa y visibilidad a distancia.
- Sesión completa de entrenamiento, suspensión/hibernación y comportamiento bajo carga.
- NVDA/VoiceOver y zoom de navegador al 200 % con observación manual.
- Safari/WebKit, móvil físico y dispositivos de entrada especiales.

## Publicación

La conexión original Vercel/GitHub está confirmada. El enlace homepage antiguo devolvió 404 y la URL histórica de despliegue redirigió a login. No confundir esos datos con evidencia de una demo nueva publicada. La comprobación del despliegue de esta actualización debe registrar su SHA y URL final.
