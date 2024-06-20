const app = require('./app');
// const port = process.env.port || 3000;
const dotenv = require('dotenv');
const connectDatabase=require('./config/database');

dotenv.config({path: './config/.env'});
const port = process.env.port;

//connecting to datbase
connectDatabase();

app.listen(port, () =>{
    console.log(`Listening on PORT: ${port} in ${process.env.NODE_ENV} mode`);
});