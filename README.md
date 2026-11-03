# PSS Taekwondo

**Marcador manual para entrenamiento y exhibición. Un PC, un operador y una pantalla externa.**

Alpha experimental `0.1.0-alpha.1`. [Demo web](https://protector-and-scoring-system-pss-tkdrolando.vercel.app) · [Guía](https://protector-and-scoring-system-pss-tkdrolando.vercel.app/guide.html) · [Notas de la alpha](docs/releases/v0.1.0-alpha.1.md) · [Reportar un problema](https://github.com/karatekah/Protector-and-Scoring-System-PSS-Taekwondo/issues).

Prepara atletas, rondas y duración; registra puntos y penalizaciones; abre un marcador de solo lectura en el segundo monitor. Los puntos se acumulan entre rondas y el operador toma las decisiones.

La alpha no integra protectores electrónicos ni está homologada por World Taekwondo. El nombre histórico del repositorio expresa la dirección del proyecto; la funcionalidad actual es un marcador manual. Esta actualización se distribuye como demo web en el proyecto de Vercel existente. El ZIP local queda fuera de esta entrega.

## Probar la alpha

1. Abre la demo en Chrome, Edge o Firefox actualizado.
2. En **Preparar combate**, indica evento, competidores, de 1 a 5 rondas y de 00:10 a 09:59 por ronda.
3. Guarda la configuración. En **Control**, abre la pantalla externa y muévela al segundo monitor.
4. Inicia/pausa el reloj y registra incrementos manuales de +1 a +6. **Gam-jeom** penaliza al atleta y suma un punto al rival; **Impacto** no suma puntos.
5. Guarda un resumen y exporta JSON desde **Preparar combate**.

Ambas ventanas deben usar el mismo equipo, origen, navegador y perfil. Enviar el enlace a otro equipo crea una sesión independiente. Mantén abierta la pestaña de control. Recargarla pausa el reloj; la segunda ventana no controla ni modifica el combate.

## Producto objetivo y stack

El objetivo confirmado es un software de torneos con varias áreas, jueces y pantallas que funcione en la red local del recinto sin Internet. Los jueces envían propuestas y la mesa confirma los puntos.

| Capa del producto objetivo | Elección                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Frontend                   | React + TypeScript + Vite, React Router y CSS con tokens/CSS Modules                |
| Datos HTTP                 | TanStack Query y tipos de cliente derivados de OpenAPI                              |
| Servidor del recinto       | Go, monolito modular que sirve interfaz, API y eventos                              |
| Datos del evento           | SQLite local del servidor, migraciones SQL y respaldo consistente                   |
| Comunicación               | HTTPS + WebSocket, revisiones e idempotencia por comando                            |
| Acceso                     | Sesiones locales revocables, emparejamiento y permisos por evento/área              |
| Calidad                    | Pruebas de dominio, contratos, concurrencia, recuperación, interfaz y accesibilidad |
| Distribución               | Demo en Vercel; servidor local y empaquetado en una fase posterior                  |

Este es el **stack objetivo, pendiente de migración**. La alpha que puedes abrir hoy conserva el stack que se detalla debajo. [Decisiones y alternativas](docs/stack.md) · [ADR 0002](docs/adr/0002-tournament-lan.md) · [Arquitectura LAN](docs/tournament-architecture.md) · [Plan de migración](docs/migration.md).

### Stack implementado en la alpha 0.1

| Capa               | Decisión                                                       |
| ------------------ | -------------------------------------------------------------- |
| Aplicación         | TypeScript 7.0.2 estricto y módulos ES                         |
| Interfaz           | HTML semántico y CSS con tokens, sin dependencias de ejecución |
| Compilación        | Vite 8.3.5                                                     |
| Herramientas       | Node 24.22.1 LTS, npm 11 y Prettier 3.9.10                     |
| Estado             | Dominio tipado; reloj con tiempo monotónico transcurrido       |
| Persistencia       | localStorage v4; exportación/importación JSON validada         |
| Coordinación local | Web Locks, BroadcastChannel y eventos de almacenamiento        |
| Verificación       | Vitest 5.1.0, Playwright 1.64.1 y axe-core 4.14.0              |
| CI / publicación   | GitHub Actions y proyecto existente en Vercel                  |

Las dependencias directas están fijadas en `package.json`; `package-lock.json` fija su resolución. La alpha publicada no incorpora backend, cuentas, base de datos ni analítica. [ADR 0001](docs/adr/0001-foundation.md) describe esa entrega; ADR 0002 define su evolución hacia torneos.

## Desarrollo

```sh
npm ci
npm run dev
```

Abre la URL local indicada por Vite. Para verificar el resultado de producción:

```sh
npm run check
npm run build
npx playwright install chromium firefox
npm run test:e2e
npm run preview
```

En Linux, CI instala los navegadores con `npx playwright install --with-deps chromium firefox`. El build genera `dist/`; abrir el HTML por `file://` no es un método de ejecución soportado.

## Datos y límites

- Hasta 120 acciones con deshacer por combate y hasta 80 resúmenes. Se retira primero lo más antiguo.
- Exporta JSON para conservar una copia fuera del navegador. Importar reemplaza los datos tras validación y confirmación; límite de archivo: 5 MB.
- Los formatos antiguos v2/v3 conservan el combate y los resúmenes válidos, sin migrar deshacer ni registros detallados anteriores. Las claves originales se mantienen.
- Borrar los datos del sitio, cambiar de dominio o usar otro perfil puede dejarte sin los registros locales. No hay respaldo en la nube.

## Documentación

| Necesidad                      | Referencia                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| Usar el marcador               | [Guía pública](guide.html)                                                              |
| Entender alcance y decisiones  | [Plan de alpha](docs/alpha.md) · [ADR](docs/adr/0001-foundation.md)                     |
| Entender módulos y datos       | [Arquitectura](docs/architecture.md)                                                    |
| Planificar el desarrollo       | [Roadmap](docs/roadmap.md)                                                              |
| Revisar evidencia y pendientes | [Verificación](docs/verification.md) · [Revisión de interfaz](docs/interface-review.md) |
| Publicar o revertir            | [Despliegue](docs/deployment.md)                                                        |
| Colaborar o reportar problemas | [Contribuir](CONTRIBUTING.md) · [Seguridad](SECURITY.md)                                |
| Ver cambios                    | [Changelog](CHANGELOG.md)                                                               |

KARATTY sirve como referencia de dominio compartido, contratos, transacciones, decisiones documentadas y evidencia. PSS adopta Go en su arquitectura objetivo y elige SQLite para el servidor del recinto; los detalles y el coste frente a PostgreSQL se explican en la decisión de stack.

Licencia: [GNU GPL v3](LICENSE), conservada del repositorio original.
