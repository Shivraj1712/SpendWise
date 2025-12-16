import mongoose from 'mongoose'

const connect = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URI)
        console.log(`MongoDB connected - ${conn.connection.host}`);
        
    } catch (error) {
        console.log('Failed to connect to MongoDB');
        process.exit(1)
    }
}

export default connect 