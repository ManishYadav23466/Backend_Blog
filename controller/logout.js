const logout=async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"Lax"
        });
        return res.status(200).json({
            message: "user logout successfully",
            status:true
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={logout};