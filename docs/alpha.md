# Contrato de la alpha 0.1

Fecha de definición: 2026-11-02. Distribución acordada: demo web en el Vercel existente; ZIP local pospuesto.

Este contrato se conserva para la versión publicada. El objetivo posterior de torneos en LAN está confirmado y se planifica en [la migración del stack](migration.md); no convierte las funciones previstas en funciones de la alpha 0.1.

## Usuario y resultado

Una persona controla un combate de entrenamiento o exhibición desde un PC. El público ve una segunda ventana, en un monitor conectado al mismo PC. Los puntos se acumulan durante todas las rondas.

## Incluido

- Evento y dos atletas con nombre y país; 1–5 rondas, 10–599 segundos.
- Incrementos manuales +1 a +6, penalización Gam-jeom e impactos sin punto.
- Inicio, pausa, tiempo técnico y siguiente ronda; el operador decide cuándo avanzar.
- Intercambio de lados, deshacer disponible, archivo y nuevo combate.
- Pantalla externa de solo lectura, pantalla completa y un operador por navegador.
- Guardado local, exportación/importación JSON validada y migración compatible del prototipo.
- Interfaz adaptable, navegación por teclado, movimiento reducido y guía pública.

## Fuera del alcance acordado

Reglamento WT automático, ganador oficial, victorias por asalto, desempates, sensores, homologación, jueces en red, varias áreas, cuentas, nube de combates y descarga ZIP.

## Criterios de aceptación

| Flujo                          | Resultado                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| Configurar                     | El control muestra los atletas, tiempo y rondas guardados                                |
| Puntuar / penalizar / deshacer | Los dos marcadores reflejan el mismo resultado; deshacer no devuelve tiempo transcurrido |
| Abrir / recargar público       | El reloj y los puntos del operador continúan; la pantalla pública no escribe             |
| Abrir segundo control          | Solo la pestaña propietaria del lock modifica el combate                                 |
| Guardar / exportar / importar  | El resumen persiste, el JSON puede restaurarse y un archivo inválido no reemplaza datos  |
| Recargar operador              | Se conserva el combate y se pausa el reloj                                               |
| Responsive / teclado           | Las vistas son utilizables a 320 px, con foco visible y controles nativos                |
| Publicar                       | Vercel sirve el build nuevo y la guía; se verifica la URL de producción                  |

## Criterios para abandonar la etiqueta experimental

Se requiere una prueba física con PC y dos monitores, observación de al menos una sesión completa, revisión de los fallos encontrados y conformidad del responsable de entrenamiento con el flujo. Las pruebas automáticas no sustituyen esta validación.
