const express = require('express');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(express.json());
//Import all routes
const products = require('./routes/products'); 

app.use('/api/v1',products);
app.use('/api/v2',products);

//middleware to handle errors globally
app.use(errorMiddleware);

module.exports=app;