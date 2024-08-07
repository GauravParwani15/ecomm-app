const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [30, 'Name should not exceed 30 characters']
    },
    email: {
        type:String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type:String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password should not be less than 6 characters'],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user',
        // enum:{
        //     values:['user','admin'],
        //     message: 'Please select a valid role'
        // }
    },
    createdAt: {
        type:String,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypting password before saving
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
});

//compareuserpassword
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Return JWT token
userSchema.methods.getJwtToken = function (){
return JWT.sign({ id: this._id}, process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRES_TIME})
}

//generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    //hash the token and set to password reset token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expiration time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; //30 minutes
    
    return resetToken;
}


module.exports = mongoose.model('User', userSchema);