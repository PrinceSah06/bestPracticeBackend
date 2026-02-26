import mongoose,{Document} from "mongoose";
import bcrypt from 'bcrypt'

interface IUser  extends Document{
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  isActive: boolean;
  refreshToken?:{token:string,
  createdAt?:Date}[];
  isDeleted:boolean
  deletedAt?: Date,
lastLogin?: Date
  comparePassword(candidatePassword: string): Promise<boolean>;

}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    required: true,
    type: String,
    trim:true
  },
  email: {
    required: true,
    type: String,
    unique:true,
    lowercase:true,
    index:true,
  },
  password: {
    required: true,
    type: String,
    minLength:5,
      select: false

  },
  role: {
    required: true,
    type: String,
    enum: ["USER", "ADMIN"],
    default:"USER"
  },
  isActive: {
   default: true,
    type: Boolean,
  },
  isVerified: {
   default: false,
    type: Boolean,
  },

refreshToken: {
  type: [
    {
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  default: []
},

isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: Date,
lastLogin: Date


},  {timestamps: true},);

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre("save",async function () {
try {
      if(!this.isModified("password")) {
           return}
       const salt =10;
  
       this.password = await bcrypt.hash(this.password,salt)
       
} catch (error) {
   return (error as Error)
}
    
})

userSchema.methods.comparePassword = async function (candidatePassword:string) {
    return bcrypt.compare(candidatePassword,this.password)
    
}
const user = mongoose.model("User",userSchema)

export default  user