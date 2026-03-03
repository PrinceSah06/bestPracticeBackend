import type { Context } from "hono";
import { logoutformRadis } from "../services/auth.services";
import redis from "../config/radis.config";


 const logOutController = async(c:Context)=>{

    const token = await c.get('user');



     const storeToken  = await redis.get(`refresh:${token.id}`);


  if(storeToken !== token.accessToken){
    return c.json({message:'wronge token'},401)  
}
    const res =await logoutformRadis(token.id)

    return c.json({token,res,message:'logOut succesfully'},200)
 }


 export  {logOutController}