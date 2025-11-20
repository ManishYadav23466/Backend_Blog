const express=require("express");
const {home,signup, signin} = require("../controller/signupcontroller");
const getalldata = require("../controller/getdata");
const verfytoken = require("../middleware/userauth");
const profile = require("../controller/profile");
const {createPostController,getPostController,getuserpostController,likePostController,commentPostController,
    sharePostController,getcommentpostController,deletePostController} = require("../controller/createpost");

const { followUserController, unfollowUserController, getFollowersController, getFollowingController } = require("../controller/follwers");
const { logout } = require("../controller/logout");

const router=express.Router();

// router.get("/",home);
router.post("/signup",signup)
router.post("/signin",signin)
router.get("/getalldata",getalldata)
router.get("/profile",verfytoken, profile)

router.post("/createpost",verfytoken,createPostController)
router.get("/getpost",verfytoken,getPostController)
router.get("/getuserposts/:userId",verfytoken,getuserpostController)

router.post("/posts/:postId/like", verfytoken, likePostController);
router.post("/posts/:postId/comment", verfytoken, commentPostController);
router.post("/posts/:postId/share", verfytoken, sharePostController);
router.get("/posts/:postId/comments", verfytoken, getcommentpostController);
router.delete("/posts/:postId", verfytoken, deletePostController);

router.post("/:id/follow", verfytoken, followUserController);
router.post("/:id/unfollow", verfytoken, unfollowUserController);
router.get("/:id/followers", getFollowersController);
router.get("/:id/following", getFollowingController);

router.post("/logout",verfytoken,logout);

module.exports=router;