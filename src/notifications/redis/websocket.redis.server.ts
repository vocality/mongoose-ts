import 'reflect-metadata'
import { Service } from 'typedi'

import { createServer } from 'http'

import Redis from 'ioredis'
import { Server } from 'ws'

@Service()
export class WebSocketRedisService {
    private redisClient: any;
    private redisChannel: string;

    constructor(websocket_port: number, redis_port: number, redis_channel: string) {
        this.redisClient = new Redis(redis_port);
        this.redisChannel = redis_channel;

        this.initWebSocket(websocket_port)

        console.log(`[WebSocketRedisService.constructor()] WebSocketServer started at port ${websocket_port}...`) 
    }

    private initWebSocket = (websocket_port: number) => {
        const onConnection = (ws: any) => {
            console.log(`[WebSocketRedisService.onConnection] Connected to socket...`)
            this.redisClient.subscribe(this.redisChannel);
        }

        const onMessage = (ws: any, channel: string, data: any) => {
            console.log(`[WebSocketRedisService.onMessage] Received ${data} on ${channel}...`);
            ws.send(data)
        }

        const onError = (err: any) => console.log(`[WebSocketRedisService.onError] ${err}`)

        const onClose = (code: number, reason: string) => {
            console.log(`[WebSocketRedisService.onClose] code: ${code} - reason: ${reason}`)
            this.redisClient.unsubscribe(this.redisChannel)
        }

        const wss = new Server({ port: websocket_port });

        wss.on('connection', ws => {
            onConnection(ws);

            // listening for Redis PUB/SUB Event
            this.redisClient.on('message', (channel: string, data: any) => onMessage(ws, channel, data))

            ws.on('error', err => onError(err))
            ws.on('close', (code: number, reason: string) => {
                onClose(code, reason);
                /*
                ws.terminate()
                ws.close();
                */
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

