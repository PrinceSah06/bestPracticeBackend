import { sign,verify } from "jsonwebtoken";
import { env } from "../config/env";


interface JwtPayload {
  id: string;
  role: "USER" | "ADMIN";
}

 if(!env){
  console.log('env missisg')
 }
export async function genrateAccessToken(data:JwtPayload) {

     const token =  sign(data,env.JWT_ACCESS_SECRET,{expiresIn:'15m'})

     return token
    
}
export async function genrateRefreshToken(data:JwtPayload) {
           const token =  sign(data,env.JWT_REFRESH_SECRET,{expiresIn:"7d"})

     return token
    
}export function verifyAccessToken(token: string) {
  return verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}