import mongoose from "mongoose"

const connectDB = async () => {
    
    if (!process.env.MONGO_URL) { 
        console.log("MONGO_URL environment variable is not set")
        process.exit(1)
    }

    try { 
        const con = await mongoose.connect(process.env.MONGO_URL as string)
        // console.log(`Connected: ${con.connection.host} : ${con.connection.name}`);

        mongoose.connection.on('disconnect', () => {
            console.error('MongoDB Connection Lost');
            process.exit(1)
            
        })
        
    } catch (error: any | unknown) {
        console.error(error.message);
        process.exit(1)
        
    }
}

export default connectDB