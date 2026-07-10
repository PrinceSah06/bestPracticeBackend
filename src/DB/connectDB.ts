import mongooss from "mongoose"
import dotenv from "dotenv";
dotenv.config();
import {env} from "../config/env"


export default async  function connectDB(){
if(!env){ return 'env misisng'}
    try {
         const check =   await mongooss.connect(env.MONGO_URI)
 if (check){
  console.log("✅ MongoDB connected successfully");
 }
    } catch (error) {
        console.log('something went wronge while connecting db');
        console.log(error)
}

}