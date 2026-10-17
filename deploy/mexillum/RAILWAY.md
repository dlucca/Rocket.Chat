# Despliegue de Mexillum en Railway

## Arquitectura inicial

Una instancia de Rocket.Chat y MongoDB 8.x compatible configurado como replica set. No basta un MongoDB standalone. Empezar con el monolito y medir el uso real del equipo de hasta 20 personas antes de separar servicios.

Para adjuntos, usar almacenamiento S3 compatible; alternativamente, filesystem con volumen persistente y permisos del usuario del contenedor. No guardar adjuntos en el filesystem efímero de Railway. MongoDB necesita persistencia y respaldos propios.

## Diferencia entre probar Rocket.Chat y desplegar el fork

La imagen `registry.rocket.chat/rocketchat/rocket.chat:8.9.0` sirve para verificar infraestructura con la versión oficial. **No contiene las modificaciones de este fork.**

Para publicar mejoras de Mexillum, compilar el código de la rama elegida y generar una imagen propia, fijada por commit, que Railway pueda descargar. El Dockerfile oficial `apps/meteor/.docker/Dockerfile.debian` empaqueta un bundle Meteor ya construido; no compila por sí solo el repositorio completo.

El flujo de referencia está en `.github/actions/meteor-build/action.yml` y `.github/actions/build-docker/action.yml`: build de paquetes del monorepo, build Meteor, empaquetado del bundle y construcción de imagen. No apuntar Railway directamente al Dockerfile del runtime esperando que compile las fuentes.

## Configuración del servicio

1. Elegir MongoDB con replica set y autenticación. Usar red privada cuando la base esté en el mismo proyecto de Railway, o una conexión TLS si es un proveedor externo.
2. Construir y publicar la imagen del fork para Linux amd64, o usar temporalmente la imagen oficial para probar la infraestructura.
3. Crear el servicio de Railway desde esa imagen. Una instancia inicial; no habilitar suspensión automática para un chat de uso continuo.
4. Establecer puerto `3000` y `ROOT_URL` con la URL HTTPS pública definitiva.
5. Configurar `MONGO_URL` en Variables/Secrets; no incluir credenciales en Git. Revisar `MONGO_OPLOG_URL` según la configuración de esta versión y del proveedor.
6. Usar `railway.env.example` como referencia de ajustes verificados contra el código de 8.9.0. Completar primero el asistente de instalación para crear al administrador, sin registro público, y habilitar al equipo mediante invitaciones o creación administrativa.
7. Configurar adjuntos S3 y SMTP desde administración. Probar subida/descarga y entrega de invitaciones.
8. Comprobar login, WebSocket, canales, mensajes entre dos sesiones, permisos, adjuntos y persistencia tras un redeploy antes de invitar al equipo.

No se creó un proyecto de Railway ni se ejecutó una compilación de contenedor durante esta preparación. La imagen propia y la validación de infraestructura quedan pendientes del primer arranque.

## Referencias

- https://docs.rocket.chat/docs/system-requirements
- https://docs.rocket.chat/docs/configure-external-mongodb-for-rocket-chat
- https://docs.rocket.chat/docs/deploy-with-docker-docker-compose
- https://docs.railway.com/builds/dockerfiles
- https://docs.railway.com/volumes
