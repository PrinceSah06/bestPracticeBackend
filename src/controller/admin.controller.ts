import type { Context } from "hono";
import { getUsersFromDb ,deleteUser, updateFieldsService, updateRole, restoreAccount, userStats, } from "../services/admin.services";
import { AppError } from "../utils/AppError";



 const getAlluser = async (c:Context)=>{



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

const deleteController = async (c: Context) => {

  const id = c.req.param("id")


  if (!id) {
    throw new AppError("id is missing", 400)
  }

  const ur = await deleteUser(id)
  

  return c.json({
    message: "successfully received ID",
    id,    
    ur
  })
}

const updateControler = async(c:Context)=>{
    const fields = await c.req.json()
    const id = c.req.param("id")


const allwoedFields = ["name","isActive","isDelete","isVerified"]

let update:any = {}
Object.keys(fields).forEach(e=>{
    if(allwoedFields.includes(e)){
        update[e]=fields[e]
    }
})


const res = await updateFieldsService(id,update)

    return c.json({res,
        message :"working"
    },200)
}

const changeRoleController =async(c:Context)=>{
    const {id} = c.req.param();
    const {role} = await c.req.json()

    if(!role || !id){
        throw new AppError('User role or id is missing',400)
    }

    const res = await updateRole(id,role)
   
   
   
   return c.json({
        message:'Role updated',
        preRole:role,
        res
    })
}

const restoreAccountController = async(c:Context)=>{
    
    const {id}= c.req.param();

    if(!id){
        throw new AppError(
            'id missing'
 ,401       )
    }

    const res = await restoreAccount(id)


    if(!res){
        throw new AppError("something went wronge while restoring",401       )
    }
    return c.json({
        message :'accout restore successfully',
        res
    })
}

const userStatsController = async (c:Context)=>{
  const data =  await userStats()
    return c.json({
        message :'all stats',
data
    },200)
}

 export  {getAlluser,deleteController,updateControler,changeRoleController,restoreAccountController, userStatsController}