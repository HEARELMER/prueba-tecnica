# ms-emails

Consumidor de RabbitMQ que registra en BD el intento de envío de correo para cada cliente. Incluye un endpoint de healthcheck.

## Estructura

- `src/domain`: entidad y puerto de logs.
- `src/application`: caso de uso `ProcessEmailRequest`.
- `src/infrastructure`: consumidor RabbitMQ, repositorio TypeORM, rutas Hapi.
- `src/config`: variables de entorno y DataSource.

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
docker build -t ms-emails .
docker run --env-file .env -p 3000:3000 ms-emails
```
