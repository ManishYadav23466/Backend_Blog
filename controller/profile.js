const model=require("../model/signupmodel");

const profile=async (req,res)=>{
    try {
        const user=await model.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        return res.status(200).json({
                success:true,
                message:"Profile fetch successfully",
                user
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to fetch the profile"
        })
    }
}

module.exports=profile