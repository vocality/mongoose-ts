import { model, Model, Schema } from 'mongoose';

import { User } from './user.interface'
import { hashPassword } from '../utils/bcryptUtils';

const UserSchema = new Schema<User, Model<User>, User>(
    {
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        creditCardNumber: {
            type: String,
            required: false,
            get: (creditCardNumber: string) => {
                return creditCardNumber === undefined ? null: `xxxx-xxxx-xxxx-${creditCardNumber.substr(creditCardNumber.length - 4)}`
            }
        },
        password: {
            type: String,
            get: () => undefined
        }
    },
    /*
    {
        toJSON: { 
            virtuals: true,
            getters: false
        },
        toObject: {
            virtuals: true,
            getters: false
        }
    }
    */
);

//
// virtuals
//
UserSchema.virtual('fullName').get(function(this: { firstName: string, lastName: string}) {
    return this.firstName + ' ' + this.lastName
})

//
// middlewares
//
UserSchema.pre('save', async function() {
    const plainTextPassword = this.get('password', null, { getters: false })
    this.password = await hashPassword(plainTextPassword, 10)
})

export const UserModel = model<User>('User', UserSchema);

