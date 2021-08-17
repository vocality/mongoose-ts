import WebSocket from 'ws'
import Redis from 'ioredis'

//global.WebSocket = require('ws'); // <-- FIX ALL ERRORS

//
// event handlers
//
const onOpen = () => {
    console.log('socket opened...')
}

const onMessage = (msg: any) => {
    console.log(`Received ${msg}`)
}

//
// main
//
try {
    const ws = new WebSocket('ws://localhost:8081')

    ws.on('open', () => onOpen())
    ws.on('message', msg => onMessage(msg))
    
} catch (error) {
    console.log(error)
}
