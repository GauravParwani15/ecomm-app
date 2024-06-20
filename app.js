const express = require('express');

const app = express();

app.use(express.json());
//Import all routes
const products = require('./routes/products'); 

app.use('/api/v1',products);
app.use('/api/v2',products);

module.exports=app;