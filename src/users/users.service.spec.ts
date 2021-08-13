import { validatedEnv } from '../utils/validatedEnv';
import { MongoDbHandler } from '../utils/MongoDbHandler';
import { UserService } from './users.service';
import { User } from './user.interface'
import chalk from 'chalk';
import { checkPasswordMatch } from '../utils/bcryptUtils'

describe('mongoose testing suite', () => {
    const mockUsers: User[] = [
        {
            email: 'pat@voc.fr',
            firstName: 'pat',
            lastName: 'raz',
            creditCardNumber: '4310 7851 8745 1452',
            password: 'secret-pat'
        },
        {
            email: 'joe@voc.fr',
            firstName: 'joe',
            lastName: 'rap',
            creditCardNumber: '4317 9451 2425 8545',
            password: 'secret-joe'
        } 
    ]

    // TODO: Use DI instead
    const userService = new UserService();

    beforeAll(async () => {
        require('dotenv-safe').config()
        validatedEnv()

        await MongoDbHandler.connectDb()
    })

    afterAll(async () => {
        await MongoDbHandler.disconnectDb()
    })

    it('should match', async () => {
        const res = await checkPasswordMatch('secret-pat', '$2b$10$e4c5P11kjQDy692.ahwQIuVnX6UqhX8j11Imwn3iTPlg4v2IbRcMi')
        console.log(res)
    })
    
    test.skip('should save user to db ', async () => {
        const { email, firstName, lastName, creditCardNumber, password, fullName } = await userService.createUser(mockUsers[0]);
        const savedUser = { email, firstName, lastName, creditCardNumber, fullName, password };
        console.log(savedUser)
        //expect(savedUser).toEqual(mockUsers[0]);
    })



    test.skip('should findOne user from db ', async () => {
        const foundUser = await userService.findOne({ firstName: 'pat' });
        expect(foundUser?.firstName).toBeTruthy();
        expect(foundUser?.firstName).toBe('pat');
    })

    test.skip('should get all users from db ', async () => {
        let allUsers = await userService.findAll();
        expect(allUsers.length).toBe(1);

        // create another user
        await userService.createUser(mockUsers[1]);
        allUsers = await userService.findAll();
        expect(allUsers.length).toBe(2);
    })
})
