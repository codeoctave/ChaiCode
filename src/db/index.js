import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected succesfully. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed ", error);
    process.exit(1);
  }
};

export default connectDB;


/* //////////////////////////////////////Note///////////////////////////////////////////

Yeh ek Database Connection Script hai jo Node.js aur MongoDB ko aapas mein jodne ka kaam karta hai.

Aasaan shabdon mein, yeh code aapki application ko yeh batata hai ki usse data save karne ke liye kaunse "digital locker" (database) ke paas jaana hai.

Yeh kyun likha gaya hai? (Purpose)

Mongoose ka use: mongoose ek library hai jo Node.js aur MongoDB ke beech ek bridge ka kaam karti hai, jisse database se baat karna aasaan ho jaata hai.

Environment Variables: ${process.env.MONGODB_URI} ka use karke aap apne database ka secret password aur link (URL) safe rakhte hain.

Connection Success: Jab database connect ho jaata hai, toh console.log se aapko pata chal jaata hai ki sab sahi chal raha hai.

Error Handling: Agar internet band hai ya password galat hai, toh catch (error) wala hissa application ko crash hone se bachata hai aur error message dikhata hai.

Process Exit: process.exit(1) ka matlab hai ki agar database hi connect nahi hua, toh app ko aage chalane ka koi fayda nahi, isliye wahi rok do.

Code mein kya ho raha hai?

async/await: Database se connect hone mein thoda time lagta hai, isliye program ko "wait" karne ke liye bola gaya hai.

DB_NAME: Yeh aapke database ka specific naam hai (jaise "YouTubeClone" ya "MyStore").

connectionInstance.connection.host: Yeh batata hai ki aapka database kahan host hai (jaise local machine par ya cloud/Atlas par).

 */