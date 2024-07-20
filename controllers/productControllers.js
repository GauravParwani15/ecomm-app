// Import models
const Product = require('../models/products');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');


// Create new product => /api/v1/products/new
exports.newProduct = catchAsyncErrors( async (req, res, next) => {
    
    req.body.user= req.user.id;

    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}  )

// Use routes

//get all products => /api/v1/products/
exports.getProducts = catchAsyncErrors(async (req,res,next) => {

    const resultsPerPage = 4;
    
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
                                .search()
                                .filter()
                                .pagination(resultsPerPage);

    // this is used to count all the products in the database to pass it to the frontend via the Api features
    const productCount = await Product.countDocuments();

    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        count: products.length,
        productCount,
        data: products
    })
} )

exports.getSingleProduct = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        data: product
    })
} )

exports.updateProduct = catchAsyncErrors( async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 403));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product
    })

} )

        // {
        //  The findByIdAndUpdate method takes three parameters: the product ID, the new data, and an options object.
        // In the options object, new: true is used to return the updated document instead of the original one.
        // runValidators: true ensures that the updated data passes the validation rules defined in the Product model schema.
        // useFindAndModify: false is used to prevent deprecation warnings when using findByIdAndUpdate.
        // }

    // Delete product => /api/v1/admin/product/:id

    exports.deleteProduct = catchAsyncErrors( async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
    
            if (!product) {
                return next(new ErrorHandler('Product not found', 403));
            }
    
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    } )


    //get all reviews of a product = > /api/v1/product/reviews/:id
    exports.getProductReviews = catchAsyncErrors( async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        
        if(!product) {
            return next(new ErrorHandler('Product not found', 404));
        }
        const reviews = product.reviews;

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    
    })

    // create new review => /api/v1/review
    exports.createProductReview = catchAsyncErrors( async (req, res, next) => {

        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        const product = await Product.findById(productId);
        
        if(!product) {
            return next(new ErrorHandler('Product not found', 404));
        }
        const isReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        )

        if(isReviewed) {
            product.reviews.forEach( review=>{
                if(review._id.toString() === isReviewed._id.toString()){
                    review.rating = Number(rating);
                    review.comment = comment;
                }
            })
        }
        else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
            await product.save();
        }

        product.ratings = product.reviews.reduce((acc, item) => item.rating+acc, 0)/product.reviews.length

        await product.save({validateBeforeSave: false});

        res.status(200).json({
            success: true,
            message: 'Review created successfully',
            data: product
        })
    })