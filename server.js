const app = require('./app');
// const port = process.env.port || 3000;
const dotenv = require('dotenv');

dotenv.config({path: './config./config.env'});

app.listen(port, () =>{
    console.log(`Listening on PORT: ${port} in ${process.env.NODE_ENV} mode');
});