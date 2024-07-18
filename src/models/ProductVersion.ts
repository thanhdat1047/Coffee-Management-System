import mongoose,{Document} from "mongoose";
import mongooseDelete, {SoftDeleteModel} from "mongoose-delete";

interface IProductVersion extends Document {
    productId : mongoose.Schema.Types.ObjectId,
    body: {
        name: string,
        size: string,
        price: number,
        categoryId: mongoose.Schema.Types.ObjectId[] ,
    } 
};

const ProductVersionSchema = new mongoose.Schema({
    productId : {type : mongoose.Schema.Types.ObjectId, ref: 'Product',required: true},
    body: {
        name: {type :String, required: true},
        size:  {type :String, required: true},
        price:  {type :String, required: true},
        categoryId:[{type: mongoose.Schema.Types.ObjectId,ref:'Category',required: true}]
    } 
},{
    timestamps: true
});

ProductVersionSchema.plugin(mongooseDelete, {   
    deletedAt: true, 
    overrideMethods: 'all'
});

export const ProductVerModel = mongoose.model<IProductVersion>('ProductVersion',ProductVersionSchema) as SoftDeleteModel<IProductVersion>;

//Create 
export const createProductVersion = async (values : Record<string, any>)=>{
    return await new ProductVerModel(values).save()
    .then((proVer) => proVer.toObject())
}

