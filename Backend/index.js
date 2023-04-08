import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";


// self invoked function 
// (async()=>{})()

(async()=>{

    try{
      await mongoose.connect(config.MONGODB_URL)
      {
         console.log("DB connected successfully");
         app.on('error', (err)=>{
            console.log("ERROR: ",err);
            throw err;
         })


         const onListening = ()=>{
            console.log(`Listening on ${config.PORT}`);
          }
         app.listen(config.PORT, onListening )
      }
    }
    catch(error){
   console.log("Error",err);
   throw err
    }

})()

