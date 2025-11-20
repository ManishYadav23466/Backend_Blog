const userModel = require("../model/signupmodel");

const followUserController = async (req, res) => {
  try {
    const userId = req.user.id;          // current logged-in user
    const targetId = req.params.id;      // whom to follow

    if (userId === targetId)
      return res.status(400).json({ success: false, message: "You can't follow yourself" });

    const user = await userModel.findById(userId);
    const targetUser = await userModel.findById(targetId);

    if (!user || !targetUser)
      return res.status(404).json({ success: false, message: "User not found" });

    if (targetUser.followers.includes(userId))
      return res.status(400).json({ success: false, message: "Already following" });

    targetUser.followers.push(userId);
    user.following.push(targetId);

    await user.save();
    await targetUser.save();

    res.json({ success: true, message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const unfollowUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    const user = await userModel.findById(userId);
    const targetUser = await userModel.findById(targetId);

    if (!user || !targetUser)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!targetUser.followers.includes(userId))
      return res.status(400).json({ success: false, message: "You are not following this user" });

    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);
    user.following = user.following.filter(id => id.toString() !== targetId);

    await user.save();
    await targetUser.save();

    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFollowersController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate("followers", "name email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, followers: user.followers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFollowingController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate("following", "name email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, following: user.following });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
};
