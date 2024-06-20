// Import models

const Product = require('../models/products');

// Create new product => /api/v1/products/new
exports.newProduct = async (req, res, next) => {
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
}

// Use routes

//get all products => /api/v1/products/
exports.getProducts = async (req,res,next) => {

    const products = await Product.find();

    res.status(200).json({
        success:true,
        count: products.length,
        data: products
    })
}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(403).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.status(200).json({
        success: true,
        data: product
    })
}

exports.updateProduct = async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(403).json({
            success: false,
            message: 'Product not found'
        });
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

}

        // {
        //  The findByIdAndUpdate method takes three parameters: the product ID, the new data, and an options object.
        // In the options object, new: true is used to return the updated document instead of the original one.
        // runValidators: true ensures that the updated data passes the validation rules defined in the Product model schema.
        // useFindAndModify: false is used to prevent deprecation warnings when using findByIdAndUpdate.
        // }

    // Delete product => /api/v1/admin/product/:id

    exports.deleteProduct = async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
    
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
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
    }