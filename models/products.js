const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength:[100, 'Please enter a maximum of 100 characters for product name']
    },
    price:{
        type: Number,
        required: [true, 'Please enter product Number'],
        maxLength:[5, 'Please enter a maximum of 5 characters for product name'],
        default: 0.00
    },
    description:{
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings:{
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    images:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        ref: 'Category',
        required: [true, 'Please select a category'],
        enum:{
            values:['Electronics','Clothing','Books','Home & Garden','Sports & Outdoors','Cameras','shoes','Food','toys','health & beauty'],
            message: 'Please select a valid category'
        }
    },
    seller:{
        type: String,
        required:true,   
    },
    stock:{
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength:[5, 'Please enter a maximum of 5 characters for product stock'],
        min: 0
    },
    numOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[
        {
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product',productSchema);