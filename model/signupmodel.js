const mongoose=require('mongoose');

const signupSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
    },
    profielpicture:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"   
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "signup" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "signup" }],
},{timestamps:true})

const SignupModel=mongoose.model("signup",signupSchema);

module.exports=SignupModel;