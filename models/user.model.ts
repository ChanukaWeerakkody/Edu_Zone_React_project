import mongoose ,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern:RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string
    }
    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    comparePassword(password:string):Promise<boolean>;
}

const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"]
    },
    email:{
        type:String,
        required:[true,"Please add an email"],
        unique:true,
        validate:[emailRegexPattern,"Please add a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please add a password"]
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[{
        courseId:String,
    }],
    },{
        timestamps:true
    }
);

//Hashing password
userSchema.pre<IUser>("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//Compare password
userSchema.methods.comparePassword = async function(enteredPassword:string):Promise<boolean>{
    return await bcrypt.compare(enteredPassword,this.password);
};

const userModel:Model<IUser> = mongoose.model("User",userSchema);
export default userModel;






