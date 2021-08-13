import bcrypt from 'bcrypt'
import { hashPassword, checkPasswordMatch } from './bcryptUtils'

describe('bcrypt_1 testing', () => {
    const saltRounds: number = 10;
    const plaintextPwd: string = 'secret';
    let hash: string;

    test('should hash', async () => {
        const spy = jest.spyOn(bcrypt, 'hash');
        hash = await hashPassword(plaintextPwd, saltRounds)

        expect(spy).toHaveBeenCalled();
    })

    test('should return true', async () => {
        const spy = jest.spyOn(bcrypt, 'compare');
        const result = await checkPasswordMatch(plaintextPwd, hash);

        expect(spy).toHaveBeenCalled();
        expect(result).toBe(true);
    })
    
    test('should return false', async () => {
        const spy = jest.spyOn(bcrypt, 'compare');
        const result = await checkPasswordMatch(plaintextPwd, 'falsy');

        expect(spy).toHaveBeenCalled();
        expect(result).toBe(false);
    })
    
    
})
