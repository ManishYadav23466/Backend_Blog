const mongoose=require("mongoose");

const notificationSchema=new mongoose.Schema({

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"signup"
    },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"signup"
    },

    type:{
        type:String,
        enum:[
            "follow",
            "like",
            "comment",
            "reply",
            "message"
        ]
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"createpost"
    },

    read:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

module.exports=mongoose.model("notification",notificationSchema);