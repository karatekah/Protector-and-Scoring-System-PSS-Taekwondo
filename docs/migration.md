# Plan de migración del stack

La evolución funcional descrita en este documento corresponde a Pro. Free 1.0 mantiene el [alcance cerrado](free-1.0.md) después de su aprobación y publicación.

La alpha 0.1 sigue siendo la demo de entrenamiento publicada. La migración hacia torneos se divide en entregas que conservan datos y separan capacidades comprobadas de diseño pendiente.

| Etapa                  | Entrega concreta                                                                                                                    | Condición de salida                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0 · Reformulación      | Stack, ADR 0002, autoridad, permisos, protocolo, fallos y backlog                                                                   | Requisitos de producto documentados; cada tecnología tiene una responsabilidad               |
| 1 · Frontend React     | Migrar las cuatro vistas a componentes, añadir rutas y pruebas de interacción, conservar el perfil de entrenamiento y sus respaldos | Los flujos actuales pasan; la ventana pública sigue en lectura y se preservan los datos      |
| 2 · Servidor y archivo | Go, SQLite, migraciones, contratos HTTP, perfiles de reglas y copia/restauración                                                    | Comandos y revisiones transaccionales; pruebas reales de caída y restauración                |
| 3 · Un área en LAN     | Mesa, jueces proponentes y marcador en varios dispositivos; TLS, emparejamiento y recuperación                                      | La mesa confirma; duplicados, revocación y desconexiones pasan pruebas de integración        |
| 4 · Varias áreas       | Asignaciones, cola de combates y aislamiento; objetivo inicial de validación de cuatro áreas                                        | 21 sesiones simuladas y sesión física del recinto, con resultados medidos                    |
| 5 · Beta de torneo     | Edición de reglamento acordada, decisiones arbitrales, resultados y prueba de operación completa                                    | Casos revisados por responsable deportivo; soporte, recuperación y límites publicados        |
| 6 · Sensores           | Investigación de protocolo, adaptador y calibración con equipos reales                                                              | Evidencia de hardware; las capacidades y la eventual homologación se documentan con sustento |

## Primer backlog implementable

1. Añadir React y rutas preservando el dominio de entrenamiento, la clave de almacenamiento existente y los respaldos v4/v5.
2. Extraer Scoreboard, Clock, ScoreControls, MatchSetup y Archive como componentes compartidos con etiquetas y foco existentes.
3. Separar estado, almacenamiento y canales de la representación. Mantener un único operador de la demo.
4. Añadir ESLint y React Testing Library donde aporten cobertura de comportamiento; conservar Playwright/axe.
5. Describir API y eventos, generar tipos del cliente y probar casos de contrato antes de conectar una mesa a un servidor.
6. Incorporar Go y SQLite con una operación completa y transaccional de combate, su respaldo y su prueba de recuperación. No considerar terminado un backend que solo exponga health.
7. Implementar roles y el flujo propuesta → confirmación → snapshot del primer área.

## Migración de datos

Los respaldos v4 y v5 de entrenamiento se conservan y se validan, incluidas las decisiones manuales de KO en v5. Importarlos en el futuro servidor creará registros identificados como entrenamiento; no los convierte en resultados oficiales ni asigna jueces retroactivamente.

Cada cambio de esquema tendrá migración versionada, copia previa y una prueba de actualización desde el formato soportado. Se documentará si el rollback del binario requiere restaurar una copia; no se promete downgrade automático del esquema.

## Política de entregas

La documentación puede anunciar el diseño con su estado de implementación. Las notas de una release solo anuncian funciones ejecutables y verificadas. No se cambiará la alpha 0.1 a una etiqueta de torneo por actualizar esta arquitectura.

El objetivo es Windows para el servidor del recinto en la primera prueba física; el código Go debe evitar dependencias del sistema innecesarias. La matriz adicional de sistemas operativos se ampliará con pruebas, no por inferencia de que el lenguaje compila en ellos.

La preparación de una distribución local corresponde a la fase del servidor y necesita su flujo de instalación, datos, certificados y actualización. El ZIP continúa pospuesto en la actualización actual.
