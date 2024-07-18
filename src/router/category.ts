import express from 'express';
import { postCates , getCates, editCates} from '../controllers/category';
import router from 'router';

export default (router : express.Router)=>{
    router.get('/categories', getCates);
    router.post('/categories', postCates);
    router.patch('/categories/:id',editCates)
};