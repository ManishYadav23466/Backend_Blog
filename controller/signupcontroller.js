const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const User=require("../model/signupmodel")
require("dotenv").config();

// const home=async (req,res)=>{
//     try{
//         res.send("it is now working")
//     }catch(error){
//         console.log(error);
//     }
// }

const signup=async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Required all field"
            })
        }

        const existuser=await User.findOne({email});
        if(existuser) {
            return res.status(500).json({
                success:false,
                message:"User already exist"
            })
        }

        const hashpass=await bcrypt.hash(password,10);

        const user=await User.create({name, email:email.toLowerCase(), password:hashpass});
        return res.status(200).json({
            success:true,
            message:"user register successful"
        })

        

    }catch(err){
        console.log(err);
    }
}


const signin=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Required all field"
            })
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }else{
            const authpass=await bcrypt.compare(password,user.password);
            if(!authpass){
                return res.status(400).json({
                    success:false,
                    message:"Wrong password"
                })
            }

        }

        const token=jwt.sign({id:user._id},process.env.secret_key,{
            expiresIn:"1d"
        });

        res.cookie("token",token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success:true,
            message:"Login successful",
            token,
            user
        })


    } catch (error) {
        console.log(error)
    }
}


module.exports={
    signup,
    signin
};