const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewURLParser:true,
        useUnifiedTopology: true

    }).then(con=>{
       console.log(`MongoDB Dataase with host: ${con.connection.host}`); 
    })
}


module.exports=connectDatabase;