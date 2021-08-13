import { UserModel } from './user.model'
import { User } from './user.interface'

describe('UserModel testing', () => {
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

    it('should return hidden cardNumber', () => {
        const userModel = new UserModel({
            email: mockUsers[0].email,
            firstName: mockUsers[0].firstName,
            lastName: mockUsers[0].lastName,
            creditCardNumber: mockUsers[0].creditCardNumber,
            password: mockUsers[0].password
        });

        const plainCreditCardNumber = userModel.get('creditCardNumber', null, { getters: false })
        console.log(plainCreditCardNumber)
        console.log(userModel.creditCardNumber)
    })
    
})
