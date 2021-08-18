## Features
- Relationships between collections
- Notifications when a new user is created
- IOC container (TypeDI)
- Full typescript

## Notifications
- Websocket/Redis notification (pub/sub pattern)
    - server: `server.redis.ts`
    - client: `public\index_redis.html`
    - Browse `http://localhost:4500`

## Usage in development mode
> Server without notifications: `npm run serve:dev`
> Websocket/Redis server: `npm run serve-redis:dev`

