import 'reflect-metadata'
import { Container } from 'typedi'

import express, { Application, NextFunction, Request, Response } from 'express';
import { validatedEnv } from './utils/validatedEnv'
import morgan from 'morgan'

import { MongoDbHandler } from './utils/MongoDbHandler'
import { UserService } from './users/users.service';
import { User } from './users/user.interface';

import { SuppliersService } from './suppliers/suppliers.service'

let userService: UserService;
let supplierService: SuppliersService;

let app: Application;

const postUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    const newUser: User = req.body;

    const { email, firstName, lastName, creditCardNumber, password, fullName } = await userService.createUser(newUser);
    const savedUser = { email, firstName, lastName, creditCardNumber, fullName, password };

    res.status(200).json(savedUser);
}

const bootstrap = async () => {
    // setup env
    require('dotenv-safe').config()
    validatedEnv()

    // setup mongodb
    await MongoDbHandler.connectDb()

    // init services (typeDI)
    userService = Container.get(UserService)
    supplierService = Container.get(SuppliersService)

    // init app
    app = express();
    app.use(express.json())
    app.use(morgan('dev'))

    // routes
    app.post('/users', postUserHandler)
    app.get('/', async (req: Request, res: Response) => {
        res.status(200).send('Hello server.ts !');
    })

    // launch server
    const SERVER_PORT = process.env.SERVER_PORT
    app.listen(SERVER_PORT, () => {
        console.log(`[bootstrap] HTTP Server listens for incoming requests at port ${SERVER_PORT}`);
    })
}

bootstrap()