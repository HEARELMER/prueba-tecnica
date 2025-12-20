# ms-security

Servicio que genera y valida tokens de 8 dígitos. Diseñado con arquitectura hexagonal para aislar dominio, aplicación e infraestructura.

## Estructura

- `src/domain`: entidades y puertos (interfaces).
- `src/application`: casos de uso que orquestan reglas de negocio.
- `src/infrastructure`: adaptadores Hapi + TypeORM.
- `src/config`: carga de variables de entorno y conexión a base de datos.

## Variables de entorno

Ver `.env.example`.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build y ejecución

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t ms-security .
docker run --env-file .env -p 3000:3000 ms-security
```
