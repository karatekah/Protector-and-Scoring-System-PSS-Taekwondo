# Arquitectura

Este documento describe la alpha 0.1 implementada. El producto objetivo de torneos utiliza una arquitectura distinta, definida en [stack](stack.md), [ADR 0002](adr/0002-tournament-lan.md) y [arquitectura LAN](tournament-architecture.md). React, Go y SQLite todavía no forman parte de este runtime.

La alpha es una aplicación estática servida por Vercel. Cada navegador mantiene sus propios datos; el servidor de alojamiento no es una autoridad de combate.

```text
Operador con Web Lock
  → src/match.ts: acciones y snapshots planos
  → src/main.ts: representación y persistencia
  → localStorage v4 + BroadcastChannel
  → ventana ?view=public: validación y representación, sin escritura
```

## Módulos

| Archivo                    | Responsabilidad                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| src/match.ts               | Tipos, puntuación, penalizaciones, archivo, deshacer, validación y migración              |
| src/main.ts                | Eventos DOM, propiedad del operador, temporización, respaldo e intercambio entre ventanas |
| index.html                 | Vistas semánticas: inicio, configuración, control y marcador                              |
| css/styles.css             | Tokens, estados, tamaños adaptables, foco y movimiento reducido                           |
| guide.html / css/guide.css | Guía pública de uso, límites y evolución                                                  |
| tests                      | Invariantes del dominio y flujos de navegador                                             |
| vercel.json / .github      | Compilación, cabeceras y comprobaciones                                                   |

## Reloj

Al iniciar se guarda una referencia de `performance.now()` y el tiempo restante. Los callbacks calculan la diferencia transcurrida; su frecuencia no determina el tiempo descontado. Una pestaña en segundo plano puede recibir callbacks con retraso: al volver, el reloj calcula el tiempo correspondiente, pero la pantalla puede haber mostrado un valor anterior durante esa suspensión. No es un reloj distribuido ni una garantía de tiempo real.

El operador publica aproximadamente una vez por segundo mientras corre el reloj y ante cada acción. Al recargar el operador, el tiempo guardado queda pausado. Al cerrar normalmente la página se intenta persistir el estado pausado; ante una caída puede perderse el último intervalo no guardado.

## Propiedad y sincronización

Web Locks concede un único operador por origen y perfil. Otra pestaña de control queda en lectura; para tomar el control debe cerrarse el operador anterior y recargarse. Una ventana pública nunca solicita el lock ni guarda el estado.

BroadcastChannel acelera las actualizaciones. El evento `storage` sirve como canal adicional. No cruzan equipos, perfiles, navegación privada separada ni dominios de preview/producción.

## Esquema y límites

`pss-taekwondo-match-v4` guarda configuración, combate y 120 acciones. Free permite guardar hasta 10 resúmenes sin retirar automáticamente los anteriores: `archive` devuelve `false` al llenarse. La eliminación de resúmenes requiere confirmación. Cada acción reversible captura solo configuración y combate. Cada resumen guarda registros sin snapshots anteriores.

`parseState` mantiene la compatibilidad de lectura de hasta 80 resúmenes, impactos y formatos anteriores. `parseFreeConfig` valida los nuevos combates: 1 o 3 rondas y 60, 120 o 180 segundos. `freeConfig` propone un formato compatible para el siguiente combate sin modificar el actual ni los registros restaurados.

`matchResult` deriva el resultado de los puntajes cuando la última ronda ha terminado con tiempo cero. Control, pantalla externa y resúmenes comparten esta función; un empate permanece como empate. No se almacena un ganador duplicado que pueda quedar desactualizado después de corregir o deshacer puntos. El respaldo JSON conserva el esquema v4 y los datos necesarios para reconstruir el resultado.

Octajang conserva los identificadores de almacenamiento, canal, lock y ventana de la alpha para mantener compatibilidad en el mismo origen. El nombre del archivo exportado cambia a `octajang-combates-AAAA-MM-DD.json`; su esquema v4 sigue siendo compatible. Un dominio distinto tiene su propio almacenamiento: exportar desde la dirección anterior e importar en la nueva, sin mezclar ventanas de orígenes distintos.

JSON se valida estructuralmente y por límites numéricos antes de restaurar. La importación admite hasta 5 MB. La escritura puede fallar por cuota o política del navegador; se muestra un aviso y se ofrece exportación. Los datos del navegador no son secretos cifrados.

v2/v3 se leen sin borrar sus claves. Se preservan configuración, puntos y resúmenes compatibles. Los antiguos registros anidados de acciones se omiten. Un resumen antiguo dañado se omite sin descartar un combate activo válido.
