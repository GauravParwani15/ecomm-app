const Order = require('../models/order');
const user = require('../models/user');
const Product = require('../models/products');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');

//create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.body.user
    })

    res.status(200).json({
        success: true,
        message: 'Order created successfully',
        order
    })
})


// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    })

});


// Get logged in user orders => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({ user: req.user.id});

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    })

});


// Get all orders => /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        count:orders.length,
        data: orders
    })

});


// Update /process orders => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 403));
    }

    order.orderItems.forEach(async item=>{
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now();

    await order.save();


    res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order
    })

});

async function updateStock(id, quantity){
    const product = await Product.findByIdAndUpdate(id);
    if (!product) {
        throw new ErrorHandler('Product not found', 404);
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave:false });
}


// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        data: order
    })

});