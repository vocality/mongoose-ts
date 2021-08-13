import 'reflect-metadata'
import { Service } from 'typedi'

import { FilterQuery } from 'mongoose';
import { Observable, Subject } from 'rxjs'

import { User } from './user.interface';
import { UserModel } from './user.model';

@Service()
export class UserService {
    subjectSave: Subject<any>

    constructor() {
        this.subjectSave = new Subject<any>()
    }

    onSave = (): Observable<any> => this.subjectSave.asObservable()

    createUser = (user: User)  => {
        const userModel = new UserModel({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            creditCardNumber: user.creditCardNumber,
            password: user.password
        });

        return userModel.save();
    }

    createUserObservable = async (user: User) => {
        const userModel = new UserModel({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            creditCardNumber: user.creditCardNumber,
            password: user.password
        });

        const savedUser = await userModel.save()

        return this.subjectSave.next(savedUser)
    }
    

    clearAll = () => UserModel.deleteMany();
    findOne = (filter: FilterQuery<User>) => UserModel.findOne(filter);
    findAll = () => UserModel.find();

    deleteOne = () => {}
    update = () => {}
}