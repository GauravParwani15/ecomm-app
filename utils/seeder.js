const Product = require('../models/products');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//setting .env file
dotenv.config({ path: '../config/config.env' });


connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Products collection deleted');
        await Product.insertMany(products);
        console.log('Products are added successfully');
        process.exit();

    } catch (error) {
        console.error('Error deleting products:', error.message);
        process.exit();
    }
}

seedProducts();