# Octajang Free 1.0

Estado: Free 1.0 aprobada, incluido el rediseño de Control y Marcador. La versión incorpora países, banderas locales, puntuación manual y la firma «Made by Karatekah».

## Alcance cerrado

Free 1.0 permite dirigir entrenamientos y exhibiciones desde un PC, con un operador y una pantalla externa del mismo navegador. Incluye:

- Atletas, selector de país y bandera automática con recursos locales.
- Rondas de 1, 2 o 3 minutos; elección de 1 o 3 rondas.
- Puntos manuales +1, +2, +3, +4 y +6; corrección −1 sin negativos y Gam-jeom con un punto al rival.
- Reloj, tiempo técnico, avance de ronda, intercambio de lados y deshacer.
- Ganador por puntos acumulados o empate al terminar las rondas, y KO manual confirmado por el operador.
- Control y marcador de solo lectura, ventana externa y pantalla completa.
- Marcador con rojo a la izquierda, azul a la derecha, líder en amarillo y reloj central. Control mantiene el mismo orden de lados.
- Diez resúmenes nuevos y respaldo/restauración JSON v5, conservando los respaldos anteriores admitidos.

No incorpora sensores, revisión de vídeo, reglamento automático ni operación de torneos o dispositivos en LAN. Los iconos de cámara son decorativos; MATCH muestra «—» porque Free no asigna números de combate. HITS conserva los impactos de respaldos anteriores; Free no ofrece nuevos controles de impactos.

## Continuidad del producto

Free 1.0 queda como versión de alcance fijo. Los nuevos desarrollos funcionales continúan en Pro: configuración avanzada, gestión de eventos, informes, jueces, varias áreas y servidor local.

Pro mantiene una base local independiente, con el marcador, los países, las banderas y la firma compartidos. Su copia de trabajo y sus opciones adicionales permanecen fuera del repositorio público. La publicación de Free no incluye esos archivos.

El cierre se identifica mediante la etiqueta `v1.0.0` y las [notas de versión](releases/v1.0.0.md). La prueba física con PC y dos monitores sigue pendiente; el número de versión no acredita esa validación.
