import 'reflect-metadata'
import { Service } from 'typedi'

import Redis from 'ioredis'
import { Server } from 'ws'

@Service()
export class WebSocketRedisService {
    private redisClient: any;

    constructor(websocket_port: number, redis_port: number, redis_channel: string) {
        this.redisClient = new Redis(redis_port);
        this.redisClient.subscribe(redis_channel);

        this.initWebSocket(websocket_port)

        console.log(`[WebSocketRedisService] WebSocketServer started at port ${websocket_port}...`) 
    }

    private initWebSocket = (websocket_port: number) => {
        const onConnection = (ws: any) => console.log(`Connected to socket...`)

        const onMessage = (ws: any, channel: string, data: any) => {
            console.log(`Received ${data} on ${channel}...`);
            ws.send(data)
        }

        const onError = (err: any) => { }
        const onClose = () => { }

        const wss = new Server({ port: websocket_port });
        wss.on('connection', ws => {
            onConnection(ws);

            // listening for Redis PUB/SUB Event
            this.redisClient.on('message', (channel: string, data: any) => onMessage(ws, channel, data))

            ws.on('error', err => onError(err))
            ws.on('close', ws => onClose())
        });
    }
}

