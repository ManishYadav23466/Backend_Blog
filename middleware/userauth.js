const jwt=require("jsonwebtoken");

const verfytoken=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Access denied, no token provided"
            })
        }

        const decoded=jwt.verify(token,process.env.secret_key);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or token espired"
        })
    }
}

module.exports=verfytoken;
