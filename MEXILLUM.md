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

Se instalaron Meteor 3.5.2 y las dependencias con Node 24.19.0 y Yarn 4.18.0. La compilación de paquetes compartidos terminó con 78 tareas correctas. Yarn normalizó ocho referencias de peer dependencies de workspaces desde sus versiones RC a las versiones estables declaradas en los manifiestos; no se actualizaron versiones de paquetes externos.

El servidor se inició y se verificaron la respuesta de `/api/info` y el asistente de configuración en español. Login, canales, mensajes y adjuntos siguen pendientes de crear el primer administrador. El MongoDB integrado de Meteor es 7.0.16 y se limita a esta prueba local inicial; antes de validar producción se debe usar MongoDB 8.x compatible con Rocket.Chat 8.9. Docker sigue pendiente para generar una imagen de producción. La configuración de Railway es una guía de preparación, no un despliegue verificado.

Para iniciar el entorno local después de activar Node compatible:

```sh
./scripts/mexillum/dev.sh
```

El script añade Meteor del directorio personal al PATH y establece nombre Mexillum, idioma español y registro público desactivado. El proxy HTTP escucha por defecto únicamente en `127.0.0.1:3000`. Ejecuta solo la aplicación Meteor, usando los paquetes ya compilados, para evitar watchers de todos los servicios. Después de editar librerías en `packages/`, recompilar los paquetes correspondientes o usar el comando `dev` original de la raíz.

En esta máquina, si Node 24 no está activo en la terminal:

```sh
PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH" ./scripts/mexillum/dev.sh
```

La base local de Meteor vive en `apps/meteor/.meteor/local/` y está excluida de Git. No ejecutar `meteor reset` si se quiere conservar esa base.

REA sigue instalado en el proyecto anterior y registrado en Codex. Para estudiar este repositorio usaremos directamente su código; reservaremos REA para investigar comportamiento o artefactos distribuidos cuando aporte evidencia útil.


## Corrección inicial del arranque local

La compilación de Livechat fallaba porque la llamada al shell y las rutas del script no admitían espacios en el checkout (`Mexillum Chat`). Se pasó el nombre del script como argumento independiente a `execFileSync` y se entrecomillaron sus rutas. Verificación: generación real de los assets de Livechat y arranque posterior del servidor desde la misma carpeta con espacios. La rama de Windows conserva su implementación original y no se verificó en macOS.
