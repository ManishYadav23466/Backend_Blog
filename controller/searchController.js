const SignupModel = require("../model/signupmodel");
const CreatePost = require("../model/createpostmodel");

const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({
        users: [],
        posts: [],
      });
    }

    const users = await SignupModel.find({
      name: {
        $regex: q,
        $options: "i",
      },
    }).select("name profielpicture");

    const posts = await CreatePost.find({
      heading: {
        $regex: q,
        $options: "i",
      },
    })
      .populate("user", "name profielpicture")
      .limit(10);

    res.json({
      success: true,
      users,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  search,
};