import crypto from 'crypto'; 

const SECRET_KEY = process.env.JWT_SECRET; 
export const random = () => crypto.randomBytes(128).toString('base64');
export const authenticationFunc = (salt : string, password: string )=>{
    return crypto.createHmac('sha256', [salt,password].join('/'))
    .update(SECRET_KEY as string).digest('hex');
};

