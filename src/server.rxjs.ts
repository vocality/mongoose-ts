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

const postUserHandlerObservable = async (req: Request, res: Response, next: NextFunction) => {
    const newUser: User = req.body;

    userService .onSave()
                .subscribe({
                    next: savedUser => {
                        res.status(201).json(savedUser)
                    }
                })  

    await userService.createUserObservable(newUser)
}

const bootstrap = async () => {
    // setup env
    require('dotenv-safe').config()
    validatedEnv()

    // setup mongodb
    await MongoDbHandler.connectDb()

    // init services (typeDI) and 
    // register some subscribers
    userService = Container.get(UserService)
    userService .onSave()
                .subscribe({
                    next: savedUser => {
                        console.log(`From userService subscriber: ${savedUser}`)
                    }
                })  

    supplierService = Container.get(SuppliersService)
    supplierService .onUserSave()
                    .subscribe({
                        next: savedUser => {
                            console.log(`From supplierService subscriber: ${savedUser}`)
                        }
                    })  

    // init app
    app = express();
    app.use(express.json())
    app.use(morgan('dev'))

    // routes
    app.post('/users/rxjs', postUserHandlerObservable)
    app.get('/', async (req: Request, res: Response) => {
        res.status(200).send('Hello server.ts !');
    })

    // serving static files
    app.use(express.static('public'))
    app.get('*', (req: Request, res: Response) => {
        console.log(`[bootstrap] app.get()`)
        res.sendFile('index_rxjs.html', {root: 'public'});
    });

    // launch server
    app.listen(process.env.PORT, () => {
        console.log(`[bootstrap()] HTTP server listens for incoming requests at port ${process.env.PORT}`);
    })
}

bootstrap()