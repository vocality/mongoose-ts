## Features
- Relationships between collections
- Notifications when a new user is created
- IOC container (TypeDI)
- Full typescript

## Notifications
- Websocket/Redis notification (pub/sub pattern)
    - server: `src\server.redis.ts`
    - client: `public\index_redis.html`
    - Browse `http://localhost:4500/index_redis.html`

## Usage in development mode
> Server without notifications: `npm run serve:dev`

> Websocket/Redis server: `npm run serve-redis:dev`

