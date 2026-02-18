import user from "../models/user.model";
import { AppError } from "../utils/AppError";


const getUsersFromDb = async () => {
  console.log("inside GetusersformDb");

  const users = await user.find({
  isDeleted: false,
  role: "USER"
})
.select("-password -refreshToken")
.lean();


  if (!users || users.length === 0) {
    throw new AppError("User is not available", 404);
  }

  return users;
};


export {getUsersFromDb}