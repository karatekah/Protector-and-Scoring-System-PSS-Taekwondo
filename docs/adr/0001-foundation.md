# ADR 0001 · Fundación de la alpha

Estado: aceptada. Fecha: 2026-11-02.

Vigencia: registra la decisión inicial de la alpha 0.1. Las funciones actuales de Free, incluido el resultado por puntos y el KO manual, se describen en [el alcance vigente](../alpha.md). La dirección del producto se amplió después a torneos en LAN en [ADR 0002](0002-tournament-lan.md), con React, servidor Go y SQLite. La decisión original sobre cuatro vistas locales no excluye esa evolución.

## Contexto

El repositorio contenía un prototipo en HTML, CSS y un único archivo JavaScript, sin manifiesto, README, pruebas ni CI. Existía una demo desplegada por la integración de GitHub con Vercel.

El usuario eligió explícitamente un marcador manual para un PC y pantalla externa, orientado a entrenamiento/exhibición con puntos acumulados. Confirmó conservar Vercel y posponer el ZIP local.

## Decisión

TypeScript estricto + Vite, con HTML y CSS nativos. Dominio separado del DOM. Guardado local con esquema validado, un operador mediante Web Locks y una ventana pública de solo lectura mediante canales del navegador.

Vitest verifica invariantes del combate; Playwright verifica flujos reales en Chromium y Firefox; axe comprueba criterios automatizables de accesibilidad. Prettier mantiene formato. GitHub Actions ejecuta comprobaciones reproducibles.

La infraestructura de la alpha es estática. `vercel.json` fija compilación, salida y cabeceras para el proyecto existente. No se requiere base de datos ni secretos.

## Alternativas

| Opción                                | Evaluación                                                                                                       |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Continuar JavaScript sin herramientas | Mantiene el prototipo, pero deja contratos, regresiones y distribución sin verificar                             |
| React / Next.js                       | No resuelve una necesidad de esta alpha; añade estado y dependencias de ejecución para cuatro vistas locales     |
| Backend + PostgreSQL / WebSockets     | Se justifica con varios dispositivos o cuentas; exige autoridad, permisos y reconexión fuera del alcance elegido |
| Aplicación de escritorio / ZIP        | Distribución pospuesta por el usuario                                                                            |

## Consecuencias

Se conserva el flujo y el historial compatible del prototipo, con límites explícitos. La primera entrega no determinaba ganadores. Free incorporó después el ganador por puntos acumulados o empate al finalizar las rondas, la corrección −1 y el KO confirmado por el operador. Las victorias por asalto y los desempates reglamentarios siguen fuera de alcance. Los incrementos +1 a +6 son herramientas manuales.

Si el alcance cambia a red, se diseñará un servidor autoritativo con secuencias, deduplicación y roles. Si cambia a sensores, se documentarán protocolo y calibración con hardware real. Ninguno de estos componentes se instala anticipadamente.

## Referencias

- [Vite](https://vite.dev/guide/).
- [TypeScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html).
- [Node LTS](https://nodejs.org/en/about/previous-releases).
- [Playwright](https://playwright.dev/docs/intro).
- [Configuración de Vercel](https://vercel.com/docs/project-configuration).
- [KARATTY](https://github.com/karatekah/karatty): referencia de organización documental.
