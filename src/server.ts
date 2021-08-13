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

const postHandler = async (req: Request, res: Response, next: NextFunction) => {
    const newUser: User = req.body;

    const { email, firstName, lastName, creditCardNumber, password, fullName } = await userService.createUser(newUser);
    const savedUser = { email, firstName, lastName, creditCardNumber, fullName, password };

    res.status(200).json(savedUser);
}

const postHandlerObservable = async (req: Request, res: Response, next: NextFunction) => {
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
    require('dotenv-safe').config()
    validatedEnv()

    await MongoDbHandler.connectDb()

    // init services and listeners
    userService = Container.get(UserService)
    userService .onSave()
                .subscribe({
                    next: savedUser => {
                        console.log(`From userService subscriber: ${savedUser}`)
                    }
                })  

    supplierService = Container.get(SuppliersService)
    supplierService .onSave()
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
    app.post('/users', postHandler)
    app.post('/users/rxjs', postHandlerObservable)
    app.get('/', async (req: Request, res: Response) => {
        res.status(200).send('Hello server.ts !');
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server listens for incoming requests at port ${process.env.PORT}`);
    })
}

bootstrap();

