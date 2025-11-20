const mongoose=require('mongoose');

const createPostSchema = new mongoose.Schema({
    heading: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"signup",
        required:true
    },
    likes:[{ type: mongoose.Schema.Types.ObjectId, ref: "signup" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "signup" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "signup" }],
    
},{ timestamps:true })

const createPostModel=mongoose.model("createpost",createPostSchema);

module.exports=createPostModel