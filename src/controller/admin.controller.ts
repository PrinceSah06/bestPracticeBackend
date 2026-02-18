import type { Context } from "hono";
import { getUsersFromDb } from "../services/admin.services";

 const getAlluser = async (c:Context)=>{
    console.log('inside getallUser Controller ')



  try {
      const users = await getUsersFromDb()
  
   return    c.json({
          success:true,
          data:users
      })
  
  } catch (error) {
    console.log('error while getUserCOntroler')
    return c.json({
        message:"something went wronge ",
        error
    })
  }
 }


 export  {getAlluser}