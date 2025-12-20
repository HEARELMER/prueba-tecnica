# ms-clients

Servicio para registro de clientes. Valida códigos en `ms-security`, consulta un flag en Redis para decidir si envía correos y publica eventos en RabbitMQ.

## Estructura

- `src/domain`: puertos y entidades.
- `src/application`: caso de uso `RegisterClient`.
- `src/infrastructure`: controladores Hapi, adaptadores HTTP/Redis/RabbitMQ, repositorio TypeORM.
- `src/config`: configuración de env y base de datos.

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
docker build -t ms-clients .
docker run --env-file .env -p 3000:3000 ms-clients
```
