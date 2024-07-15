const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors ( async(req,res,next)=> {

    const {name, email, password} = req.body;
    const user = await User.create({
        name, 
        email, 
        password,
        avatar:{
            public_id: 'download_1_tvczn0.jpg',
            url: 'https://res.cloudinary.com/dennj3x6d/image/upload/v1720785768/download_1_tvczn0.jpg'
        }
    }); 

    sendToken(user, 200, res);
} )



//Login user
exports.loginUser = catchAsyncErrors(async(req,res,next) => {

    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    //Finding user in the database
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401));
    }
    
    //sending it to jwt token in utils
    sendToken(user, 200, res);

})

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler('No user found with that email', 404));
    }
    
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false})

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email,
    then ignore it.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'ecomapp Password Reset Token',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500));
    }
})

//Get currently logged in user details => api/v1/me
 exports.getUserProfile = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
})

//update /change passsword => /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    
    //check if old password is correct
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 401));
    }
    
    //update password
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res);
})

// Update User Profile => /api/v1/me/update

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    //update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, // this is set to true so that the user is returned after the update
        runValidators: true, // this is needed to run userSchema validation again
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user
    });

})

//Logout User => /api/v1/logout
exports.logout = catchAsyncErrors( async(req,res,next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true
    });


    res.status(200).json({
        success: true, 
        message: 'User logged out'});
})

// Reset PAssword => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req,res,next) => {

    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('Invalid token or expired token', 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    //setup new passsword
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
})

//Admin Routes

// Get all users => /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async(req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        // count: users.length,
        users
    });
})

//Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.params.id);
    console.log(user);
    if(!user){
        return next(new ErrorHandler(`User not found iwht id: ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        user
    });
});


// Update User Profile => /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role // admin can update user's role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true, // this is set to true so that the user is returned after the update
        runValidators: true, // this is needed to run userSchema validation again
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user
    });

})

//Delete User => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.params.id);
    console.log(user);
    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    // Remove avatar from cloudinary - TODO
    await user.deleteOne();
    
    res.status(200).json({
        success: true,
    });
});