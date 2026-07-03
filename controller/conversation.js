const Conversation=require("../model/conversationmodel");

const getConversations=async(req,res)=>{

try{

const conversations=await Conversation.find({

members:req.user.id

}).populate(
"members",
"name profielpicture"
);

const result=conversations.map(conv=>{

const otherUser=conv.members.find(

m=>m._id.toString()!==req.user.id

);

return{

_id:otherUser._id,
name:otherUser.name,
profielpicture:otherUser.profielpicture,
conversationId:conv._id

};

});

res.json(result);

}
catch(err){

res.status(500).json({

message:err.message

});

}

}

module.exports={
getConversations
};