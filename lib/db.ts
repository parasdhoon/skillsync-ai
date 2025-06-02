import mongoose from 'mongoose';

export const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "skillsync",
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB");
    }
}