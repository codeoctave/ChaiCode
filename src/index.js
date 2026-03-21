// require('dotenv').config({path: './env'})
import dns from "dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running at the port ${process.env.PORT}`); 
  })
})
.catch((err)=>{
  console.log("MongoDB connection failed ", err);
})

/*
import express from "express"

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
    app.on("errror", (error)=>{
        console.log("ERRR: ", error);
        throw error
    })

    app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on PORT ${process.env.PORT}`);
    })

  } catch (error) {
    console.error("ERROR: ", error);
    throw err;
  }
})();
*/