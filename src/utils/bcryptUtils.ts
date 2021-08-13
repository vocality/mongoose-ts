import bcrypt from 'bcrypt'

export const hashPassword = (plaintextPassword: string, salt: number) => bcrypt.hash(plaintextPassword, salt);
export const checkPasswordMatch = (plaintextPassword: string, hash: string) => bcrypt.compare(plaintextPassword, hash);

