import { threadCpuUsage } from "node:process";
import user from "../models/user.model";
import { AppError } from "../utils/AppError";
import { group } from "node:console";

interface updateType{
    name?:string,
    isActive?:boolean,
    isDelete?:boolean
}
const getUsersFromDb = async () => {
  console.log("inside GetusersformDb");
try {
  
    const users = await user.find({
    isDeleted: false,
    // role: "USER"
  })
  .select("-password -refreshToken")
  .lean();
  

  
  if (!users || users.length === 0) {
    throw new AppError("User is not available", 404);
  }

  return users;
} catch (error) {
  console.log(error)
  
}

};

const deleteUser = async(_id:any)=>{

 

  let update = await user.findByIdAndUpdate(_id,{$set:{isDeleted:true}},{new:true})

 
  if(!update){
    throw new AppError('user is not avilabel',401)
  }
 return  update
}
 

const updateFieldsService = async(id:string,obj:updateType)=>{
  console.log('updateFieldsServic',obj)

  const res = await user.findByIdAndUpdate({_id:id},
    {
    $set:{
    ...obj
  }
}
,{returnDocument:"after"})

console.log('res',res)

if(!res){
  throw new AppError('res is missign',401)
}
 return res
}

const updateRole= async(id:string,role:string)=>{

  const updatedUser = await user.findByIdAndUpdate({_id:id},{role},{returnDocument:"after"})

  return updatedUser
}

const restoreAccount = async(id:string)=>{

  if(!id){
    throw new AppError(
      'Id is missing  ',401
    )
  }

   const  res = await user.findOneAndUpdate({_id:id},{isDeleted:false},{returnDocument:"after"})
  

   return res


}

const userStats = async()=>{

  const data = await user.aggregate([
{    $group:{
    _id:null,
      total :{$sum:1},
      Active:{
        $sum:{$cond:['$isActive',1,0]}
      },
      delete:{
        $sum : {$cond:['$isDeleted',1,0]}
      },
      verify:{
        $sum :{$cond:["$isVerified",1,0]}
      }
      ,
    }}
  ])


  return data
}
export {getUsersFromDb,deleteUser,updateFieldsService,updateRole,restoreAccount,userStats}