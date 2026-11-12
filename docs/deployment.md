# Publicación en Vercel

Se conserva el repositorio personal y el mismo proyecto Vercel, renombrado como `octajang`, bajo el equipo actual `karatekah`.

Producción: <https://octajang.vercel.app>. La dirección anterior <https://protector-and-scoring-system-pss-tkdrolando.vercel.app> se mantiene sin redirección para permitir la exportación de sus datos locales.

La marca y el repositorio se presentan como **Octajang** (`karatekah/octajang`). El despliegue automático continúa en el proyecto existente; su enlace Git identifica el mismo repositorio renombrado. Consultar [identidad y compatibilidad](branding.md).

## Configuración versionada

`vercel.json` especifica preset Vite, `npm ci`, `npm test && npm run build` y salida `dist/`. El build incluye tipos estrictos. El proyecto no necesita variables de entorno, base de datos ni secretos. Usar Node 24.x; el desarrollo está fijado en 24.22.1.

Vite genera una página HTML para cada ruta: `/`, `/preparar`, `/control`, `/marcador` y `/guia`. Vercel sirve esos archivos con `cleanUrls: true` y retira la barra final con `trailingSlash: false`; no hay una reescritura general hacia `index.html`. Cada archivo incluye únicamente el contenido de su módulo y comparte los estilos y el motor del combate.

La navegación interna usa History API para conservar el reloj y el operador en la misma pestaña. Los enlaces permiten abrir cada módulo directamente, en otra pestaña o después de recargar. Una recarga del operador conserva la pausa de seguridad. `/marcador` es de solo lectura; la Guía abierta directamente tampoco solicita el control ni escribe datos. Los enlaces anteriores `?view=...` se convierten a las rutas actuales y `/guide.html` conduce a `/guia`, conservando el fragmento de sección.

Las cabeceras restringen scripts, estilos y conexiones al origen y deshabilitan cámara, micrófono y geolocalización. El CSP está pensado para producción estática; Vite dev utiliza su servidor habitual. Una herramienta de preview que inyecte scripts podría no ser compatible con el CSP de producción.

## Antes de publicar

1. `npm ci`, `npm run check`, `npm run build`.
2. `npx playwright install chromium firefox`, `npm run test:e2e`.
3. Revisar el diff, notas de versión, alcance y pendientes.
4. Enviar el commit a la rama conectada a Vercel. Comprobar el estado Vercel de ese SHA, abrir las cinco rutas y recargar cada una. Comprobar también un enlace anterior y la ventana externa.

GitHub Actions es un control separado. La integración de Vercel no espera necesariamente a que finalice Actions; el build de Vercel repite tipos y pruebas unitarias, pero no instala navegadores. El formato se revisa en CI sobre el checkout original: el builder de Vercel introduce archivos en `.vercel` y su copia de `vercel.json` no pasó Prettier. Por ello las pruebas de navegador y el formato deben aprobarse antes del envío, además de ejecutarse en CI.

## Protección frente a abuso

La mitigación automática de DDoS de Vercel protege el alojamiento. La política adicional [ops/vercel-firewall-rule.json](../ops/vercel-firewall-rule.json) contiene una única regla del WAF para el proyecto existente:

| Campo        | Valor                                                              |
| ------------ | ------------------------------------------------------------------ |
| Nombre       | `octajang-request-limit`                                           |
| Solicitudes  | Todas las rutas que empiezan por `/`, incluidos recursos estáticos |
| Conteo       | IP de origen, compartida por las personas que usen esa IP pública  |
| Ventana      | Fija, 60 segundos                                                  |
| Límite       | 300 solicitudes por IP y región de Vercel                          |
| Al excederlo | HTTP 429 hasta el siguiente periodo de conteo                      |

La regla es del proyecto, sin una condición que la restrinja a un hostname. Comprende la dirección actual y los alias del mismo proyecto. No se añade middleware, una función ni una base de datos a la aplicación estática.

El archivo es la política prevista y usa el formato de regla de la CLI. Editarlo o desplegar `vercel.json` no actualiza el WAF. Aplicar la regla existente desde Firewall o desde `vercel firewall rules`, revisar el borrador con `vercel firewall diff` y publicar los efectos revisados mediante `vercel firewall publish`. No publicar si aparecen cambios pendientes de otra operación. Conservar los controles existentes al actualizar una regla y comprobar después el estado activo, el límite y la ausencia de borradores pendientes.

Mantener la mitigación automática del proveedor activa. Attack Mode desafía a todos los visitantes y se reserva para responder a un incidente; no es necesario activarlo permanentemente. Evitar reglas de bypass generales. Ante falsos positivos del límite, revisar el tráfico y ajustar la regla; para retirar únicamente esta protección, deshabilitarla y publicar el cambio revisado, sin pausar las mitigaciones del proveedor.

Las comprobaciones deben ser acotadas: verificar acceso normal y, al comprobar un 429, detener las solicitudes al observarlo. No realizar pruebas distribuidas ni de saturación. La validación funcional del límite no certifica resistencia ante un DDoS real.

Referencias: [mitigación de DDoS](https://vercel.com/docs/vercel-firewall/ddos-mitigation), [rate limiting del WAF](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) y [CLI del firewall](https://vercel.com/docs/cli/firewall).

## Verificación y rollback

Comprobar que producción muestra `v0.1.0-alpha.1`, carga recursos sin errores, configura un combate y sincroniza la ventana pública. No usar el estado de un despliegue anterior como prueba del commit nuevo.

Si falla la publicación, revisar los logs del despliegue. Corregir mediante un nuevo commit. Para revertir un cambio publicado, usar un revert del commit o promover el despliegue previo desde Vercel si se tiene acceso. No reescribir main.

El rollback de código no convierte automáticamente datos v5 a formatos anteriores. Antes de volver a un build anterior, exporta JSON y comprueba qué formatos admite: un lector que solo acepta v4 no puede restaurar v5 ni conservar su decisión de KO. Las claves de almacenamiento se mantienen; no abras un control antiguo sobre los datos actualizados.
