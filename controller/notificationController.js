const Message=require("../model/messageModel");

const getConversation=async(req,res)=>{

const me=req.user.id;

const other=req.params.id;

const messages=await Message.find({

$or:[

{

sender:me,
receiver:other

},

{

sender:other,
receiver:me

}

]

}).sort({

createdAt:1

});

res.json(messages);

}