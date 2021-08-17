import Redis from 'ioredis'
import { Server } from 'ws'
import { validatedEnv } from '../../utils/validatedEnv'


//
// env init
//
require('dotenv-safe').config()
validatedEnv()

const WS_PORT = Number.parseInt(process.env.WEBSOCKET_PORT!)
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT!)

//
// redis init
//
const redisClient = new Redis(REDIS_PORT);
redisClient.subscribe('app:notifications')

// 
// websocket init
//
const onConnection = (ws: any) => console.log(`Connected to socket...`)

const onMessage = (ws: any, channel: string, data: any) => {
    console.log(`Received ${data} on ${channel}...`);
    ws.send(data)
}

const onError = (err: any) => {}
const onClose = () => {}

const wss = new Server({ port: WS_PORT });
wss.on('connection', ws => {
    onConnection(ws);

    // listening for Redis PUB/SUB Event
    redisClient.on('message', (channel: string, data: any) => onMessage(ws, channel, data))
    
    ws.on('error', err => onError(err))
    ws.on('close', ws => onClose())
});

console.log(`[wsRedisServer.ts] WebSocketServer started at port ${WS_PORT}...`)

