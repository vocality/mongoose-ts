import { createServer } from 'http'

import Redis from 'ioredis'
import { Server } from 'ws'

export class WebSocketRedisServer {
    private redisClient: any;
    private redisChannel: string;

    constructor(websocket_port: number, redis_port: number, redis_channel: string) {
        this.redisClient = new Redis(redis_port);
        this.redisChannel = redis_channel;

        this.initWebSocket(websocket_port)

        console.log(`[WebSocketRedisService.constructor()] WebSocketServer started at port ${websocket_port}...`) 
    }

    private onConnection = (ws: any) => {
        console.log(`[WebSocketRedisService.onConnection] Connected to socket...`)
        this.redisClient.subscribe(this.redisChannel);
    }

    private onMessage = (ws: any, channel: string, data: any) => {
        console.log(`[WebSocketRedisService.onMessage] Received ${data} on ${channel}...`);
        ws.send(data)
    }

    private onError = (err: any) => console.log(`[WebSocketRedisService.onError] ${err}`)

    private onClose = (code: number, reason: string) => {
        console.log(`[WebSocketRedisService.onClose] code: ${code} - reason: ${reason}`)
        this.redisClient.unsubscribe(this.redisChannel)
    }

    private initWebSocket = (websocket_port: number) => {
        const wss = new Server({ port: websocket_port });

        wss.on('connection', ws => {
            this.onConnection(ws);

            // listening for Redis PUB/SUB Event
            this.redisClient.on('message', (channel: string, data: any) => this.onMessage(ws, channel, data))

            ws.on('error', err => this.onError(err))
            ws.on('close', (code: number, reason: string) => {
                this.onClose(code, reason);
                
/*                 ws.terminate()
                ws.close(); */
                
            });
        });

        // create Websocket server completly detached from HTTP server
/*         const server = createServer();
        const wss = new Server({ noServer: true });
        wss.on('connection', ws => {
            onConnection(ws);

            // listening for Redis PUB/SUB Event
            this.redisClient.on('message', (channel: string, data: any) => onMessage(ws, channel, data))

            ws.on('error', err => onError(err))
            ws.on('close', ws => onClose(ws))
        });

        server.listen(websocket_port) */

    }
}

