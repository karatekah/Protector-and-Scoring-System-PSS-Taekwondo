# Contribuir

Lee [el alcance](docs/alpha.md) y [la decisión de stack](docs/adr/0001-foundation.md) antes de proponer tecnologías o funciones.

Usa Node 24.22.1, npm 11 y `npm ci`. Mantén lógica pura en `src/match.ts`, entrada/salida en `src/main.ts` y estilos en CSS con tokens existentes.

Antes de enviar cambios ejecuta `npm run check`, `npm run build` y `npm run test:e2e`. Instala Chromium/Firefox de Playwright cuando sea necesario. Añade una prueba pequeña para lógica de puntuación, tiempo, almacenamiento o sincronización que cambies.

Un PR debe explicar el problema, el comportamiento resultante, las comprobaciones ejecutadas y cualquier límite pendiente. No presentes una comprobación manual pendiente como aprobada.

Para reportar un error incluye navegador/versión, sistema operativo, pasos, resultado esperado y observado. Evita adjuntar JSON con nombres reales sin consentimiento.

El repositorio es personal de `karatekah`. Conservar `git-profile personal` y no modificar configuración global ni credenciales.
