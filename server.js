const app = require('./app');
// const port = process.env.port || 3000;
const dotenv = require('dotenv');
const connectDatabase=require('./config/database');

dotenv.config({path: './config/config.env'});
const port = process.env.port;

//connecting to datbase
connectDatabase();

app.listen(port, () =>{
    console.log(`Listening on PORT: ${port} in ${process.env.NODE_ENV} mode`);
});

//Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise rejection');
    server.close(() => {
        process.exit(1);
    });
})