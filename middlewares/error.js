const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || 'Server Error';

    //handling mongoose duplicate key errors
    console.log(err)


    //handling wrong JWT errors
    if(err.name=="JsonWebTokenError"){
        const message = 'JSON Web Token is Invalid. Try Again'
        err = new ErrorHandler(message,400);
    }

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        if(err.code === 11000) {
            err.message = `Duplicate ${Object.keys(err.keyValue)} entered` 
            // err = new ErrorHandler(message, 400)
        }

       res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err,
        stack: err.stack
       })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}
        if(error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} entered` 
            error= new ErrorHandler(message,400)
        }
        error.message = err.message;
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })

    }

   
}