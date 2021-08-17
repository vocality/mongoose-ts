import 'reflect-metadata'
import { Container } from 'typedi'

import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan'

import Redis from 'ioredis'

import { validatedEnv } from './utils/validatedEnv'
import { MongoDbHandler } from './utils/MongoDbHandler'

import { UserService } from './users/users.service';
import { User } from './users/user.interface';

import { WebSocketRedisService } from './notifications/redis/websocket.redis.server'

let userService: UserService;

let app: Application;
let redisClient: any;
let REDIS_CHANNEL = 'app:notifications'

const postHandlerRedis = async (req: Request, res: Response, next: NextFunction) => {
    const newUser: User = req.body;

    const { email, firstName, lastName, creditCardNumber, password, fullName } = await userService.createUser(newUser);
    const savedUser = { email, firstName, lastName, creditCardNumber, fullName, password };

    // publish notification to redis
    redisClient.publish(REDIS_CHANNEL, 'New user saved !')

    // send response
    res.status(200).json(savedUser);
}

const bootstrap = async () => {
    // setup env
    require('dotenv-safe').config()
    validatedEnv()

    // setup mongodb
    await MongoDbHandler.connectDb()

    // init redis client
    const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT!)
    redisClient = new Redis(REDIS_PORT)

    // init websocket service
    const WEBSOCKET_PORT = Number.parseInt(process.env.WEBSOCKET_PORT!)
    new WebSocketRedisService(WEBSOCKET_PORT, REDIS_PORT, REDIS_CHANNEL)

    // init services (typeDI)
    userService = Container.get(UserService)

    // init app
    app = express();
    app.use(express.json())
    app.use(morgan('dev'))

    // routes
    app.post('/users/wsredis', postHandlerRedis)

    // serving static files
    app.use(express.static('public'))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile('index_redis.html', {root: 'public'});
    });

    // launch server
    const SERVER_PORT = process.env.SERVER_PORT
    app.listen(SERVER_PORT, () => {
        console.log(`Server listens for incoming requests at port ${SERVER_PORT}`);
    })
}

bootstrap()