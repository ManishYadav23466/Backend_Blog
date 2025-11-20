const mongoose=require('mongoose');
require('dotenv').config();

const dbconnect=async()=>{
    try{
        const conn=await mongoose.connect(process.env.mongo_uri);
        console.log("MongoDb Connected",conn.connection.host);
    }catch(err){
        console.log(err);
    }
}

module.exports=dbconnect;