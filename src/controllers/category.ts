import express , {Request, Response, NextFunction} from "express";
import { createCategory, getCategories, getCategoriesById, getCategoriesByName } from "../models/Category";

//[GET] categories/
export const getCates =async (req : Request, res: Response) =>{
    try {
        const data = await getCategories();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400).json({message: 'Invalid category'});
    }
    
}
//[PATH]
export const editCates =async (req : Request, res: Response) =>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        if(!name){
            return res.status(400).json({message: 'Invalid category'});
        }
        const category = await getCategoriesById(id);

        category.name = name;
        category.slug =name.toLowerCase().replace(/\s+/g, '-');
        await category.save();
        return res.status(200).json(category).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

//[POST] categories/
export const postCates = async (req : Request, res: Response) => {
    try {
        const {name} =req.body;
        const existingCate = await getCategoriesByName(name);
        if(existingCate){
            return res.status(400).json({message: 'Category already exists'});
        }
        const data = await createCategory({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
        });
        return res.status(201).json(data).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400).json({message: 'Invalid category'});
    }
}