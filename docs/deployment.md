# Publicación en Vercel

Se conserva el repositorio personal y el proyecto `protector-and-scoring-system-pss-taekwondo`, bajo el equipo actual `karatekah`. ID del proyecto: `prj_EIsy3CrofU2qzmF0Zft9c5132feR`.

Producción: <https://protector-and-scoring-system-pss-tkdrolando.vercel.app>. Dominio confirmado mediante la API del proyecto y probado sin autenticación. El homepage anterior de GitHub apuntaba a un alias retirado; se actualizó al dominio activo.

## Configuración versionada

`vercel.json` especifica preset Vite, `npm ci`, `npm test && npm run build` y salida `dist/`. El build incluye tipos estrictos. El proyecto no necesita variables de entorno, base de datos ni secretos. Usar Node 24.x; el desarrollo está fijado en 24.22.1.

Las cabeceras restringen scripts, estilos y conexiones al origen y deshabilitan cámara, micrófono y geolocalización. El CSP está pensado para producción estática; Vite dev utiliza su servidor habitual. Una herramienta de preview que inyecte scripts podría no ser compatible con el CSP de producción.

## Antes de publicar

1. `npm ci`, `npm run check`, `npm run build`.
2. `npx playwright install chromium firefox`, `npm run test:e2e`.
3. Revisar el diff, notas de versión, alcance y pendientes.
4. Enviar el commit a la rama conectada a Vercel. Comprobar el estado Vercel de ese SHA y abrir producción y `/guide.html`.

GitHub Actions es un control separado. La integración de Vercel no espera necesariamente a que finalice Actions; el build de Vercel repite tipos y pruebas unitarias, pero no instala navegadores. El formato se revisa en CI sobre el checkout original: el builder de Vercel introduce archivos en `.vercel` y su copia de `vercel.json` no pasó Prettier. Por ello las pruebas de navegador y el formato deben aprobarse antes del envío, además de ejecutarse en CI.

## Verificación y rollback

Comprobar que producción muestra `v0.1.0-alpha.1`, carga recursos sin errores, configura un combate y sincroniza la ventana pública. No usar el estado de un despliegue anterior como prueba del commit nuevo.

Si falla la publicación, revisar los logs del despliegue. Corregir mediante un nuevo commit. Para revertir un cambio publicado, usar un revert del commit o promover el despliegue previo desde Vercel si se tiene acceso. No reescribir main.

El rollback de código no convierte automáticamente datos v4 a v3. Las claves antiguas se conservan; exportar JSON antes de modificar datos para diagnóstico.
