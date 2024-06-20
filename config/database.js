const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect("mongodb://localhost:27017/ecommapp", {
        useNewURLParser:true,
        useUnifiedTopology: true

    }).then(con=>{
       console.log(`MongoDB Dataase with host: ${con.connection.host}`); 
    })
}


module.exports=connectDatabase;