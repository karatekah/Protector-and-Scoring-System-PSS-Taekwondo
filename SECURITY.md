# Seguridad y datos

La alpha no autentica usuarios ni cifra el almacenamiento. Quien tenga acceso al perfil del navegador puede acceder al combate y sus copias JSON. Usa datos de entrenamiento y evita guardar información sensible.

Los JSON importados y los mensajes entre ventanas se validan antes de reemplazar el estado. El texto de atletas y eventos se representa mediante `textContent`. Web Locks coordina un operador; no es una frontera de autorización frente a otra persona con acceso al mismo dispositivo/origen.

La aplicación no incorpora telemetría ni envía los combates a una API. Vercel puede procesar solicitudes y metadatos del alojamiento según la configuración de la cuenta. Exportaciones, caché del navegador, capturas y copias del equipo dependen del usuario.

Para un fallo de seguridad, utiliza el reporte privado de vulnerabilidades de GitHub si está habilitado. Si no lo está, abre un issue solicitando un canal privado sin publicar datos sensibles ni detalles explotables.

Versiones soportadas: rama main de la alpha actual. El prototipo anterior no recibe correcciones independientes.

## Protección del alojamiento

Vercel proporciona mitigación automática de DDoS en su infraestructura. La política adicional de Octajang está definida en [ops/vercel-firewall-rule.json](ops/vercel-firewall-rule.json): 300 solicitudes por IP en ventanas fijas de 60 segundos, con respuesta HTTP 429 al exceder el límite. Los contadores de Vercel son regionales; varias personas bajo una misma IP pública comparten el cupo de esa región.

La regla se configura en el firewall del proyecto y requiere publicación independiente del código. Su presencia en Git no demuestra que esté activa. El alcance, su activación y los controles de operación se explican en [publicación](docs/deployment.md#protección-frente-a-abuso). Los resultados comprobados se registran en [verificación](docs/verification.md).

Los puntos, el reloj y la sincronización entre ventanas del mismo navegador no hacen peticiones al alojamiento. El límite afecta a las solicitudes web, incluidas las páginas y sus recursos. No sustituye la mitigación distribuida del proveedor ni garantiza disponibilidad ante cualquier ataque.
