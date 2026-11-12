# Países y banderas

El selector contiene 250 países y territorios, ordenados por su nombre en español. Los valores guardados son códigos de tres letras; no cambia el formato del respaldo.

La bandera de preparación se actualiza al elegir una opción. Guardar el combate confirma la selección en Control y Marcador. Intercambiar lados, deshacer, recargar e importar un respaldo conservan la relación entre atleta, país y bandera.

Los códigos anteriores se mantienen sin sustituirlos automáticamente. Se reconocen también los alias deportivos GRE, GER, NED, SUI, POR, RSA y TPE. Un código desconocido se conserva como opción y se muestra sin bandera hasta seleccionar un país reconocido.

## Recursos incluidos

- Nombres y códigos: [i18n-iso-countries 7.14.0](https://github.com/michaelwittig/node-i18n-iso-countries), licencia MIT. La copia utilizada está en `src/country-data.ts`; su aviso se conserva en `public/flags/country-data-LICENSE.txt`.
- Banderas: [flag-icons 7.6.0](https://github.com/lipis/flag-icons), licencia MIT. Los SVG y su aviso se conservan en `public/flags/`.

Se incluyen únicamente los datos y archivos necesarios. No se añadieron dependencias de ejecución ni solicitudes a servicios externos para mostrar las banderas.
