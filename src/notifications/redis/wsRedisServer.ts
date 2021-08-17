import Redis from 'ioredis'
import { Server } from 'ws'

//global.WebSocket = require('ws'); // <-- FIX ALL ERRORS

//
// redis init
//
const redisClient = new Redis(6379);
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

const wss = new Server({ port: 8081 });
wss.on('connection', ws => {
    onConnection(ws);

    // listening for Redis PUB/SUB Event
    redisClient.on('message', (channel: string, data: any) => onMessage(ws, channel, data))
    
    ws.on('error', err => onError(err))
    ws.on('close', ws => onClose())
});

console.log(`wsRedisServer started at port 8081...`)

