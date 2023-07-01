const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandlers")
const catchAsyncError = require("../middleware/catchAsyncError")
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendemail");


exports.registerUser = catchAsyncError (async (req,res,next)=>{
    const {name,email,password,role} = req.body
    console.log(role)
    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar :{
            public_id:"this is sample",
            url:"sample url"
        }
    })
   const Token =  user.getJWTToken();
    res.status(201).json({
        sucess:true,
        Token
    })
})

exports.userlogin =catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        next(new ErrorHandler("please enter email or password",404));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      sendToken(user,200,res)
}) 

exports.userLogout = catchAsyncError((req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      message: "Successfully logged out"
    });
  });

  
  exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  });



  exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
  //get user details

  exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  });

//update user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  console.log(req.body.oldPassword)
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid old password", 401));
      }
      user.password = req.body.newPassword;
      await user.save();
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,
    {new :true,
      runValidator:true,
      useFindAndModify:false
  })

  res.status(200).json({
    sucess:true
  })

  })

  //get all user --- admin

  exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
      sucess: true,
      users
    })
  })
  ///single user by admin
  exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
      return next(new ErrorHandler("user does not exist" , 400))
    }
    res.status(200).json({
      sucess: true,
      users
    })
  })