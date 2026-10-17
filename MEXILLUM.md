# Mexillum · Rocket.Chat

Trabajamos directamente sobre un fork de Rocket.Chat. Conservamos su aplicación, componentes, modelo de datos y funciones. No continuamos el prototipo de aplicación propia.

## Base del proyecto

- Fork: https://github.com/dlucca/Rocket.Chat
- Rama del producto: `mexillum/main`.
- Base inicial: etiqueta oficial `8.9.0`, commit `057a927`.
- `origin`: fork de dlucca. `upstream`: repositorio oficial de Rocket.Chat.
- Equipo interno de Mexillum: hasta 20 personas.
- Identidad propuesta: sobria y minimalista; marfil, grafito y verde pino.
- Hosting previsto: Railway.

El README y las licencias originales se conservan. Los directorios `ee/` y `apps/meteor/ee/` tienen sus propias condiciones, descritas en `LICENSE`; crear un fork no habilita funciones comerciales.

## Desarrollo desde el código fuente

Versiones declaradas por esta base:

- Node.js: 24.15.0 en `package.json#volta`; el rango admite 24.x desde 24.15.0 o 22.x desde 22.22.3.
- Yarn: 4.18.0, incluido en `.yarn/releases/yarn-4.18.0.cjs`.
- Meteor: 3.5.2 en `apps/meteor/.meteor/release`.

Usar un gestor de versiones para activar Node compatible. No usar Node 25 o 26 con este fork, aunque REA use Node 26 de forma independiente.

Con Node y Meteor instalados, desde la raíz:

```sh
node --version
node .yarn/releases/yarn-4.18.0.cjs --version
node .yarn/releases/yarn-4.18.0.cjs install
node .yarn/releases/yarn-4.18.0.cjs build
node .yarn/releases/yarn-4.18.0.cjs dev
```

El comando `dev` ejecuta el flujo original de Turbo y Meteor. El primer arranque descarga y compila dependencias; no es un bundle precompilado. Revisar `.github/CONTRIBUTING.md`, `CLAUDE.md` y los documentos de `docs/frontend/` antes de modificar componentes.

## Dónde hacer las mejoras

| Objetivo | Código o ajuste |
| --- | --- |
| Identidad, idioma, registro de usuarios | Ajustes de administración; valores iniciales en `deploy/mexillum/railway.env.example` |
| Navegación, canales, mensajes y pantallas | `apps/meteor/client/` |
| Componentes compartidos | `packages/` y la biblioteca Fuselage existente |
| Funciones, endpoints y permisos | `apps/meteor/server/` |
| Pruebas de navegación y mensajes | `apps/meteor/tests/e2e/` |
| Entrega en Railway | `deploy/mexillum/RAILWAY.md` |

Primera iteración prevista: levantar la versión original, configurar el espacio privado, aplicar identidad Mexillum y medir navegación/carga de canales antes de optimizar. Aún no se han aplicado cambios visuales ni medido rendimiento.

## Flujo de cambios

```sh
git switch mexillum/main
git pull --ff-only origin mexillum/main
git switch -c mexillum/nombre-de-la-mejora
# Modificar, ejecutar las pruebas relevantes y abrir PR contra mexillum/main.
```

Cada mejora debe ser pequeña y conservar compatibilidad con Rocket.Chat. Para actualizar la base, traer una etiqueta estable y fusionarla en una rama de actualización; probar antes de incorporarla a `mexillum/main`. El checkout inicial es superficial (`--depth=1`): usar `git fetch --unshallow upstream` cuando se necesite el historial completo para una actualización.

## Estado de preparación

El fork y la rama inicial están publicados en GitHub. El código fuente está disponible en la carpeta de trabajo Mexillum Chat. No hay un servidor iniciado ni un despliegue de Railway.

En esta máquina existe Node 24.19.0 compatible; no se encontraron Meteor ni Docker en PATH durante la preparación. No se ha ejecutado instalación completa de dependencias, compilación ni pruebas funcionales. La configuración de Railway es una guía de preparación, no un despliegue verificado.

REA sigue instalado en el proyecto anterior y registrado en Codex. Para estudiar este repositorio usaremos directamente su código; reservaremos REA para investigar comportamiento o artefactos distribuidos cuando aporte evidencia útil.
