import mongoose ,{Document, Model, Query} from "mongoose";
import mongooseDelete, {SoftDeleteModel} from "mongoose-delete";

interface IUser extends Document {
    username: string;
    email: string;
    address?: string;
    authentication: {
        password: string;
        salt?: string;
        sessionToken?: string;
    };
}
const UserSchema = new  mongoose.Schema({
    username : {type: String , required: true, unique:true},
    email: {type: String , required: true, unique:true},
    address: {type: String , required: false},
    authentication :{
        password: {type: String , required: true, select:false},
        salt: {type: String ,  select:false},
        sessionToken: {type: String, select:false}
    }
},{
    timestamps: true,
});


UserSchema.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all'
})

export const UserModel = mongoose.model<IUser>("User", UserSchema) as SoftDeleteModel<IUser>;
//GET
export const getUsers = async (page: number, limit: number, sortBy: string, sort: string, search: string) => {
    try {
        console.log(`Searching for: ${search}`);
        
        const sortOrder = sort === 'asc' ? 1 : -1;
        const sanitizedPage = Math.max(1, page); 
        const sanitizedLimit = Math.max(1, limit);
        const searchQuery = search ? { username: { $regex: search, $options: "i" } } : {};

        const users = await UserModel.find(searchQuery)
        .sort({ [sortBy]: sortOrder })
        .skip((sanitizedPage - 1) * sanitizedLimit)
        .limit(sanitizedLimit);

        const total = await UserModel.countDocuments(searchQuery);

        const response = {
            error: false,
            total,
            page: sanitizedPage,
            limit: sanitizedLimit,
            search,
            sortBy,
            sortOrder: sort,
            users,
            message:'Successfully'
        };

        return response;
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: "Error fetching users"
        };
    }
};
export const getUserByEmail = (email: String) => UserModel.findOne({email});
export const getUserByUsername = (username: String) => UserModel.findOne({username});
export const getUserBySessionToken = (sessionToken : String) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUsersDeleted = () => UserModel.findWithDeleted({deleted:true});
export const getUserById = (id: String) => UserModel.findById(id);
//CREATE
export const createUser  = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
//DELETE
export const softDeleteUserById = (id: String) => UserModel.delete({_id: id})
export const deleteUserById = (id: String) => UserModel.findOneAndDelete({_id: id});
//UPDATE
export const updateUserById = (id: String, values: Record<string, any>) => UserModel.findByIdAndUpdate( id, values);
//RESTORE
export const restoreUserById = async (id: String) =>{ 
    await UserModel.restore({_id: id})
    return UserModel.findById(id);
};
