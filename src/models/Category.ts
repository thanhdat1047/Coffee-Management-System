import mongoose, {Document} from "mongoose";
import mongooseDelete , {SoftDeleteModel}from "mongoose-delete";

interface ICategory extends Document {
    name: string;
    slug: string
}

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }
},{
    timestamps: true,
});
CategorySchema.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all'  // see below for options
})

export const CategoryModel =  mongoose.model<ICategory>("Category", CategorySchema) as SoftDeleteModel<ICategory>;

//GET
export const getCategories = async () =>{
    return await CategoryModel.find();
}
export const getCategoriesById = async (id: String) => await CategoryModel.findById(id);
export const getCategoriesByName = async (name:String) => await CategoryModel.findOne({name})
//CREATE 
export const createCategory = (values : Record<string,any>) => new CategoryModel(values).save().then((cate)=>cate.toObject());
//UPDATE
export const updateCategoryById = (id: String, values: Record<string,any>) =>CategoryModel.findByIdAndUpdate(id,values);
