import express from 'express';
import { softDeleteUser, getAllUsers, updateUser, getUserDeleted, restoreUser } from '../controllers/user';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users/deleted',isAuthenticated,getUserDeleted);
    router.get('/users',isAuthenticated, getAllUsers);
    router.patch('/users/restore/:id',isAuthenticated,restoreUser);
    router.patch('/users/:id',isAuthenticated,isOwner,updateUser);
    router.delete('/users/:id',isAuthenticated,isOwner,softDeleteUser);
};