//create and send token and save in cookie.

const sendToken = (user,statusCode, res) => {
    //crate jwt token
    const token = user.getJwtToken();

    //options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        //By setting httpOnly to true, the cookie will not be accessible through JavaScript's Document.cookie property.
        httpOnly: true
    }

    res.status(statusCode).cookie('token',token, options).json({
        success: true,
        token,
        // message: 'User logged in successfully',
        user
    });
}

module.exports = sendToken;