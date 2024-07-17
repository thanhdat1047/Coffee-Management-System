import express, {NextFunction, Request, Response} from 'express';
import { deleteUserById, getUserById, getUserByUsername, getUsers, getUsersDeleted, restoreUserById, softDeleteUserById } from '../models/User';

//[GET] users/
export const getAllUsers = async (req:Request, res: Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

//[DELETE] users/:id
export const softDeleteUser = async (req: Request, res:Response) => { 
    try {
        const {id} = req.params;
        const deleteUser = await softDeleteUserById(id);
        return res.json(deleteUser);
        
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
};

//[PATH] users/:id
export const updateUser = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const {username,address } = req.body;
        const {id} = req.params;
        if(!username || !address) {
            return res.status(401);
        }
        const user = await getUserById(id);

        user.username = username;
        user.address = address;
        await user.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

//[GET] users/deleted
export const getUserDeleted = async (req: Request, res: Response)=>{
    try {
        const user = await getUsersDeleted();
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

//[PATH] users/restore/:id
export const restoreUser = async (req: Request, res: Response)=>{
    try{
        const {id} = req.params;
        if(!id) { 
            return res.status(400).json({message: 'Invalid id provided'});
        }
        const user = await restoreUserById(id);
        
        return res.status(202).json(user).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};

