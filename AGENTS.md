# PSS Taekwondo

Proyecto personal de `karatekah`. Mantener el sistema global `git-profile`: perfil `personal`, nombre `karatekah`, correo `systems.mj1906@gmail.com`. Revisar con `git-profile current` y `git-profile check`; no cambiar credenciales, configuración global ni origin manualmente.

## Alpha publicada

- Alpha web para entrenamiento y exhibición: un PC, un operador, puntos acumulados y pantalla externa.
- Mantener el proyecto existente de Vercel. No crear otro alojamiento ni preparar un ZIP local en esta entrega.
- No anunciar sensores, homologación, sincronización entre dispositivos ni cumplimiento de un reglamento WT.
- Si se pide torneo o red, resolver reglas y autoridad del combate antes de extender el dominio.

## Producto objetivo confirmado

- Software de torneos con varias áreas, jueces y pantallas; funcionamiento en la LAN del recinto sin Internet.
- Los jueces envían propuestas; la mesa del área confirma los puntos. El servidor del recinto es la autoridad del reloj y los resultados.
- Stack objetivo: React + TypeScript + Vite, React Router, CSS con tokens/CSS Modules; Go, SQLite local y API HTTPS/WebSocket.
- La alpha 0.1 todavía utiliza DOM nativo, almacenamiento de navegador y ventanas locales. No afirmar que React, el servidor ni la LAN ya están implementados.
- Seguir docs/stack.md, docs/adr/0002-tournament-lan.md y docs/migration.md al iniciar cada fase. Sensores, reglamento automático y distribución ZIP siguen pendientes.
- SQLite solo se abre en el servidor local; nunca se comparte el archivo por red. Jueces y pantallas acceden por la API.
- Mantener una sola autoridad de puntuación en modo torneo; los estados locales del cliente no confirman puntos.

## Implementación

- `src/match.ts`: dominio, validación y migración; sin DOM.
- `src/main.ts`: interfaz, reloj, almacenamiento y ventanas.
- Mantener TypeScript estricto, HTML semántico y CSS con tokens.
- La ventana `?view=public` es de solo lectura: no escribe almacenamiento ni solicita el lock de operador.
- Los snapshots para deshacer no contienen historial ni archivos. Los resúmenes no contienen snapshots de deshacer.
- Datos locales o importados son entradas no confiables: validar antes de reemplazar el estado.
- El reloj se basa en tiempo monotónico transcurrido; no descontar un segundo por callback.

## Comprobar

```sh
npm ci
npm run check
npm run build
npx playwright install chromium firefox
npm run test:e2e
```

Documentar lo probado y los límites reales en `docs/verification.md`. No confundir pruebas automatizadas con una sesión física de dos monitores.
