import mongoose, { Document, Schema } from 'mongoose';
import mongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

interface IProduct extends Document {
    name: string;
    size: string;
    price: number;
    categoryId: mongoose.Schema.Types.ObjectId[];
}

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, {
    timestamps: true
});

ProductSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema) as SoftDeleteModel<IProduct> ;

//POST
export const createProduct = async (values: Record<string, any>) => {

    new ProductModel(values).save().then((product) => product.toObject())
};
