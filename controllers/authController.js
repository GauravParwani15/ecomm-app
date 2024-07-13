const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');

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

