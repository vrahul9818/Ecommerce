const express = require("express");
const router =  express.Router();

const {registerUser, userlogin,userLogout,forgotPassword,getUserDetails, updatePassword, updateProfile, getAllUser,getSingleUser} = require("../controllers/userController")

const { isAuthenticatedUser ,authorizeRoles} = require("../middleware/auth");


router.route('/register').post(registerUser);
router.route("/login").post(userlogin);
router.route("/logout").post(userLogout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/logout").get(userLogout);
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)

router.route("admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser)

router.route("admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)

module.exports = router;