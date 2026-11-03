# Arquitectura de torneos en LAN

Diseño objetivo; no describe una función publicada en la alpha 0.1.

## Autoridad del combate

El servidor del recinto acepta comandos, comprueba permisos y revisiones, aplica el perfil de reglas y confirma transacciones. El cliente muestra el estado confirmado. La proyección visual del reloj en cada pantalla no autoriza puntuación ni determina el final del combate.

La mesa de cada área tiene propiedad exclusiva sobre sus decisiones y reloj. Transferir esa propiedad requiere intervención del administrador y queda registrado; abrir otra pestaña no la transfiere.

## Roles

| Rol                      | Facultades                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| Administrador del evento | Configurar torneo, áreas, usuarios/dispositivos, permisos, respaldo y propiedad de mesas             |
| Mesa del área            | Preparar combate, manejar reloj, confirmar/rechazar propuestas y registrar correcciones justificadas |
| Juez del área            | Enviar propuestas para su combate asignado y observar su recepción/estado                            |
| Pantalla del público     | Recibir un snapshot de lectura con solo los datos necesarios del marcador                            |

Cada operación verifica evento, área y rol en el servidor. Un identificador de área recibido del navegador no concede permisos. La revocación invalida sesiones activas y sus conexiones.

## Flujo de una propuesta

1. El juez envía propuesta con identificador único, combate y revisión conocida.
2. El servidor valida la sesión, el área, el combate y el estado de la ronda; persiste la propuesta y devuelve un ACK.
3. La mesa recibe la propuesta pendiente y decide.
4. La confirmación se guarda junto con el cambio de puntos y la nueva revisión en una transacción.
5. El servidor devuelve ACK y publica el estado confirmado a la mesa, jueces y marcador del área.

El ACK de una propuesta confirma su registro, no su aprobación. La interfaz diferencia enviado, recibido, pendiente de decisión, confirmado y rechazado. Los mensajes pendientes de envío no se presentan como puntuación.

La mesa puede agrupar varias propuestas del mismo hecho en una sola decisión. Cada propuesta se resuelve una única vez: otra confirmación, aunque tenga un commandId nuevo, no vuelve a puntuar una propuesta ya resuelta. En esta primera modalidad la agrupación es una decisión de la mesa; no se infiere consenso automático a partir de la cercanía temporal.

## Formato mínimo de comandos y eventos

| Campo                      | Uso                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------- |
| commandId                  | Idempotencia; un reintento reutiliza identificador y contenido                        |
| eventId / areaId / matchId | Contexto del comando, verificado contra la sesión                                     |
| expectedRevision           | Detectar decisiones sobre un combate obsoleto                                         |
| kind / payload             | Comando tipado y validado por el servidor                                             |
| revision / sequence        | Orden de cambios confirmados y cursor de recuperación                                 |
| serverTimestamp            | Auditoría y referencia de sincronización; no sustituye al tiempo monotónico del reloj |

El contenido se valida también en ejecución; los tipos generados para TypeScript no sustituyen la validación del servidor. Se limitan tamaño, frecuencia y cola de propuestas por dispositivo.

## Reloj y fallos

Durante la ejecución, el servidor usa una referencia monotónica y publica snapshots con estado y revisión. Los clientes pueden interpolar el tiempo visible y deben corregirse con nuevos snapshots. No se escribirá un cambio de base de datos por cada frame ni se confiará en el reloj del teléfono.

Tras reconectar, el cliente obtiene un snapshot y cursor válidos; no reproduce ciegamente propuestas hechas cuando estaba desconectado. Se consultan los commandId sin ACK antes de reintentar; una propuesta nueva atrasada requiere revisión.

Si cae el proceso, los comandos confirmados se recuperan de la base. El combate arranca pausado, con un aviso de recuperación y confirmación de la mesa sobre el tiempo; no se reconstruye un reloj supuestamente exacto a partir del reloj civil del sistema.

Si falla Internet, la operación LAN continúa. Si falla la LAN, los jueces dejan de enviar y la mesa sigue el procedimiento de pausa. La pérdida del servidor no tiene failover automático en el primer diseño.

## Persistencia

Modelo inicial: evento, área, atleta inscrito, combate, sesión, asignación de dispositivo, propuesta, comando procesado y decisión confirmada. Cada combate referencia un perfil de reglas identificado. Se almacenan solo los datos de atletas necesarios para organizar el evento.

SQLite reside en el disco del servidor. No se comparte por SMB, carpeta sincronizada ni unidad de red. Un solo proceso abre la base y coordina transacciones cortas; se habilitan claves foráneas, política de espera ante contención y durabilidad explícita. El modo WAL y su versión se validarán con pruebas de caída y una versión mantenida del motor.

No se copia solo el archivo principal de una base WAL abierta para hacer un respaldo. Se utiliza una operación de copia consistente del motor y se prueba restauración, integridad, esquema y contenido antes de dar el backup por válido.

La política de conservación y borrado de participantes se definirá antes de usar datos reales. Los archivos del evento y sus respaldos deben quedar fuera del directorio público del servidor.

## Contratos y módulos previstos

| Módulo             | Responsabilidad                                                    |
| ------------------ | ------------------------------------------------------------------ |
| web                | Componentes React y vistas de administración, mesa, juez y público |
| cmd/pss-server     | Arranque, configuración y recursos estáticos embebidos             |
| internal/event     | Evento, áreas, inscripciones y cola de combates                    |
| internal/match     | Estado del combate, perfil de reglas y reloj                       |
| internal/judging   | Propuestas, decisiones y correcciones                              |
| internal/session   | Emparejamiento, sesiones, permisos y revocación                    |
| internal/transport | API, WebSocket, límites y snapshots                                |
| internal/storage   | SQLite, transacciones, migraciones y copias consistentes           |
| api                | OpenAPI y contratos versionados de eventos                         |
| tests/contracts    | Casos compartidos y compatibilidad durante la migración            |

Es un mapa de responsabilidades. Los directorios se crean cuando tengan código real; no implica separar servicios ni crear un monorepo con orquestación adicional.

## Seguridad y preparación del recinto

El modo LAN usa HTTPS/WSS con certificados confiables para los dispositivos del evento. La distribución de confianza y nombres/direcciones se prueba antes del torneo. No se normaliza ignorar alertas del navegador.

El administrador empareja dispositivos con códigos temporales de un uso y asigna rol/área. El canje se realiza sin colocar una credencial permanente en un enlace o log. Las sesiones web emplean cookies protegidas y revocables; las operaciones de escritura y el handshake WebSocket validan origen y permisos. La LAN no se considera de confianza por el solo hecho de ser local.

El frontend, iconos, fuentes y recursos necesarios se sirven localmente. No se requiere conexión al Vercel de la demo para abrir la mesa o el juez del torneo.

## Aceptación prevista

- Dos áreas puntuando simultáneamente no comparten propuestas, reloj ni resultados.
- Un juez no confirma puntos ni actúa en otra área manipulando la petición.
- Duplicar, retrasar o repetir un comando no duplica puntuación.
- Revocar una sesión retira sus facultades y suscripciones.
- Se corta Internet y la LAN sigue funcionando.
- Se corta la conexión de un cliente, se recupera y recibe el estado autorizado.
- Se reinicia el servidor y el combate vuelve pausado con las decisiones confirmadas.
- Se restaura una copia en otra máquina y se verifican los datos del evento.
- Se mide el presupuesto de cuatro áreas/21 sesiones antes de anunciar soporte.

Estos escenarios son requisitos de pruebas futuras, no resultados ya obtenidos.
