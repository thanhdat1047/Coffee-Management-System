import express, {Request, Response, NextFunction, response} from 'express';
import { createUser, getUserByEmail, getUserByUsername } from '../models/User';
import { random, authenticationFunc } from '../helpers';
import jwt from 'jsonwebtoken';

const AUTH_KEY = process.env.AUTH_KEY;
const JWT_KEY = process.env.JWT_KEY;

export const login = async (req: Request, res: Response) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return response.status(401).json({message: 'Invalid credentials'});
        }
        const expectedHash = authenticationFunc(user.authentication.salt,password);
        
        if(user.authentication.password !== expectedHash){
            return res.status(401).json({message: 'Password is wrong'})
        }
        const role = 'ADMIN';
        const username = user.username
        const payload = {username, role}
        user.authentication.sessionToken = jwt.sign(payload, JWT_KEY,{expiresIn: '1d'});
        // user.authentication.sessionToken = authenticationFunc(salt, user._id.toString());
        await user.save();
    
        res.cookie(AUTH_KEY as string, user.authentication.sessionToken,{
            domain: 'localhost', path: '/'
        })
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const register = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const {email, username, password, address} = req.body;

        if(!email || !password || !username){
            
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        const existingUsername = await getUserByUsername(username);
        if(existingUser || existingUsername){
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            username,
            email,
            address,
            authentication: {
                password: authenticationFunc( salt,password),
                salt
            }

        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

