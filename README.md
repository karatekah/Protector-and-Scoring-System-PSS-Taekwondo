# PSS Taekwondo

**Marcador manual para entrenamiento y exhibición. Un PC, un operador y una pantalla externa.**

Alpha experimental `0.1.0-alpha.1`. [Demo web](https://protector-and-scoring-system-pss-ta.vercel.app) · [Guía](https://protector-and-scoring-system-pss-ta.vercel.app/guide.html) · [Reportar un problema](https://github.com/karatekah/Protector-and-Scoring-System-PSS-Taekwondo/issues).

Prepara atletas, rondas y duración; registra puntos y penalizaciones; abre un marcador de solo lectura en el segundo monitor. Los puntos se acumulan entre rondas y el operador toma las decisiones.

La alpha no integra protectores electrónicos ni está homologada por World Taekwondo. El nombre histórico del repositorio expresa la dirección del proyecto; la funcionalidad actual es un marcador manual. Esta actualización se distribuye como demo web en el proyecto de Vercel existente. El ZIP local queda fuera de esta entrega.

## Probar la alpha

1. Abre la demo en Chrome, Edge o Firefox actualizado.
2. En **Preparar combate**, indica evento, competidores, de 1 a 5 rondas y de 00:10 a 09:59 por ronda.
3. Guarda la configuración. En **Control**, abre la pantalla externa y muévela al segundo monitor.
4. Inicia/pausa el reloj y registra incrementos manuales de +1 a +6. **Gam-jeom** penaliza al atleta y suma un punto al rival; **Impacto** no suma puntos.
5. Guarda un resumen y exporta JSON desde **Preparar combate**.

Ambas ventanas deben usar el mismo equipo, origen, navegador y perfil. Enviar el enlace a otro equipo crea una sesión independiente. Mantén abierta la pestaña de control. Recargarla pausa el reloj; la segunda ventana no controla ni modifica el combate.

## Stack

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

Las dependencias directas están fijadas en `package.json`; `package-lock.json` fija su resolución. No se incorporan backend, cuentas, base de datos ni analítica. [ADR 0001](docs/adr/0001-foundation.md) explica el alcance.

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

La documentación de KARATTY se usó como referencia de estructura, decisiones y evidencia. El stack y las reglas de PSS se eligieron para este producto.

Licencia: [GNU GPL v3](LICENSE), conservada del repositorio original.
