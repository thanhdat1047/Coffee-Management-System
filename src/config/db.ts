import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery',false);
        const cnn  = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${cnn.connection.host}`);
    } catch (error) {
        console.error(error);
        
    }
}
export default connectDB;