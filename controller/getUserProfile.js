const SignupModel = require("../model/signupmodel");

const getUserProfile = async (req, res) => {
  try {
    const user = await SignupModel.findById(req.params.id)
      .select("-password")
      .populate("followers", "name profielpicture")
      .populate("following", "name profielpicture");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = getUserProfile;