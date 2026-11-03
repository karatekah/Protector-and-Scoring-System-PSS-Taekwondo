# Roadmap

El objetivo confirmado es software de torneos con varias áreas, jueces y pantallas en LAN, sin depender de Internet. Los jueces proponen y la mesa confirma. Sensores después.

| Hito                               | Trabajo                                                                                          | Condición de salida                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Alpha 0.1 · Publicada              | Marcador de entrenamiento, un PC y ventana externa; stack y CI del prototipo estabilizados       | Demo Vercel y pruebas registradas en verificación                          |
| Reformulación · Documentada        | Stack objetivo, autoridad local, datos, permisos, protocolo, respaldo y ruta de migración        | Decisiones y límites explícitos; no anunciar LAN como implementada         |
| Frontend React                     | Componentes, rutas, formularios, suscripciones y pruebas; conservar entrenamiento y respaldos v4 | Flujos existentes y accesibilidad aprobados                                |
| Servidor local                     | Go, SQLite, contratos, revisiones, comandos idempotentes y recuperación                          | Operación transaccional completa y copia/restauración probada              |
| Alpha LAN · Un área                | Dispositivos de mesa, jueces y público; TLS, roles y propuestas confirmadas por mesa             | Desconexiones, duplicados y revocación verificados en varios dispositivos  |
| Alpha LAN · Varias áreas           | Aislamiento, cola de combates y objetivo de carga inicial                                        | Presupuesto de cuatro áreas/21 sesiones medido y prueba física del recinto |
| Beta de torneo                     | Reglamento identificado, resultados, decisiones arbitrales y operación completa                  | Matriz revisada por responsable deportivo y sesión real documentada        |
| Hardware · Investigación posterior | Protocolo, adaptador y calibración                                                               | Evidencia con equipos físicos; homologación solo con sustento              |

El [plan de migración](migration.md) detalla el backlog y la conservación de datos. No hay fechas prometidas ni capacidades certificadas por este roadmap.

## Decisiones que faltan para la primera prueba de torneo

- Cantidad real de áreas, jueces y dispositivos; cuatro áreas/21 sesiones es una hipótesis técnica de validación.
- Edición y perfil de reglamento, correcciones, cierre de combate y desempates.
- PC, router, monitores, alimentación y preparación de certificados del recinto.
- Retención de datos de participantes y responsable de los respaldos.

Estas decisiones se cierran antes de las fases que dependen de ellas. La reformulación no exige generar un ZIP ni añadir servicios de nube.
