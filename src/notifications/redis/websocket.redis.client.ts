import WebSocket from 'ws'
import { validatedEnv } from '../../utils/validatedEnv'

//
// init env
//
require('dotenv-safe').config()
validatedEnv()

const WS_PORT = Number.parseInt(process.env.WEBSOCKET_PORT!)

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
    const ws = new WebSocket(`ws://localhost:${WS_PORT}`)

    ws.on('open', () => onOpen())
    ws.on('message', msg => onMessage(msg))
    
} catch (error) {
    console.log(error)
}
