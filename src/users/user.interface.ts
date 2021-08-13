export interface User {
    email: string;
    firstName: string;
    lastName: string;
    fullName?: string; // mongoose virtual
    creditCardNumber?: string;
    password: string;
}