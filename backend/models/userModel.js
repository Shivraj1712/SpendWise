import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        unique : true ,
        lowercase : true,
        trim : true 
    },password :{
        type : String ,
        required : true ,
        minLength : 8
    }
},{
    timestamps : true 
})

userSchema.methods.matchPassword = (enteredPassword) =>{
    return bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User',userSchema)
export default User 