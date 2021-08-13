import bcrypt from 'bcrypt'

export const hashPassword = (plaintextPassword: string, salt: number): Promise<string> => bcrypt.hash(plaintextPassword, salt);
export const checkPasswordMatch = (plaintextPassword: string, hash: string): Promise<boolean> => bcrypt.compare(plaintextPassword, hash);

