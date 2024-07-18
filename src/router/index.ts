import express from 'express';
import authentication from './authentication';
import users from './users';
import category from './category';
const router = express.Router();

export default (): express.Router =>{
    authentication(router);
    users(router);
    category(router);
    return router;
}