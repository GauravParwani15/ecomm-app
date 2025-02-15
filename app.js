const express = require('express');
const errorMiddleware = require('./middlewares/error');

const app = express();
const cookieParser = require('cookie-parser');

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend domain
    credentials: true, // Allow credentials (cookies, authorization headers, etc)
}));

app.use(express.json());

app.use(cookieParser());

//Import all routes
const products = require('./routes/products'); 
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',order);

//middleware to handle errors globally
app.use(errorMiddleware);

module.exports=app;