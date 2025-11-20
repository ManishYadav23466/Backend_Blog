const User=require("../model/signupmodel");


const getalldata=async (req,res)=>{
    try {
        const userdata=await User.find();
        return res.status(200).json({
            success:true,
            Userdata:userdata,
            msg:"user data fetched successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"failed to fetch the data"
        })
    }
}

module.exports=getalldata