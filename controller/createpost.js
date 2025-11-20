const createPostModel = require("../model/createpostmodel");

const createPostController = async (req,res)=>{
    const {heading,description}=req.body;

    if(!heading || !description){
        return res.status(400).json({
            success:false,
            message:"Required all field"
        })
    }
    const userid=req.user.id;
    console.log(userid,"user id");
    const newpost=await createPostModel.create({heading,description,user:userid});
    return res.status(200).json({
        success:true,
        message:"post created successfully",
        newpost
    })

}

const getPostController = async (req,res)=>{
    try {
    const allpost = await createPostModel.find().populate("user","-password");
    return res.status(200).json({
        success:true,
        message:"all post fetched successfully",
        allpost
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to fetch all post",
            error
        })
    }
}

// const getuserpostController = async (req, res) => {
//   try {
//     const userId = req.user.id; // note: same name as used in find()
//     const posts = await createPostModel.find({ user: userId }).sort({ createdAt: -1 }); // newest first
//     res.json({ success: true, posts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getuserpostController = async (req, res) => {
  try {
    const userId = req.params.userId; // frontend se :userId
    const posts = await createPostModel.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const likePostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await createPostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      // already liked → unlike karo
      post.likes.pull(userId);
      await post.save();
      return res.json({ success: true, message: "Post unliked", likes: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ success: true, message: "Post liked", likes: post.likes.length });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Add Comment
const commentPostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { text } = req.body;

    const post = await createPostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.json({ success: true, message: "Comment added", comments: post.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getcommentpostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postcomment = await createPostModel.findById(postId);
    return res.status(200).json({
      success: true,
      message: "comments fetched successfully",
      postcomment: postcomment.comments
    })
  }catch(error){
    return res.status(400).json({
      success: false,
      message: "failed to fetch comments",
      error
    })
  }
}

// ✅ Share Post
const sharePostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await createPostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.shares.includes(userId)) {
      post.shares.push(userId);
      await post.save();
    }

    res.json({ success: true, message: "Post shared", shares: post.shares.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePostController = async (req,res)=>{
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    console.log(userId," deleting user id");

    const post = await createPostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await createPostModel.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports={
    createPostController,
    getPostController,
    getuserpostController,
    likePostController,
    commentPostController,
    sharePostController,
    getcommentpostController,
    deletePostController
}