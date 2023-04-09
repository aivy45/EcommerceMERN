import mongoose from "mongoose";
import AuthRoles from "../utilis/authRoles";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import crypto from "crypto"  // default lib use to generate a string
import config from "../config/index";

const userSchema = mongoose.Schema(
    {
        name:{
            type: String, 
            required: [true, "Name is required"],
            maxLength: [50, "Name must be atmost 50 char"], 
            trim: true,
        }, 
        email:{
            type: String,
            required: [true, "Email is required"], 
            unique: true
        },
        password:{
            type: String,
            required: [true, "Password is required"], 
            minLength: [8, "Password must be atleast 8 characteres"],
            select: false,   // by default pass is not go to database only bcrpt part goes

        }, 
        role:{
            type: String, 
            enum:Object.values(AuthRoles),  // gives array
            default: AuthRoles.USER
        }, 
        
        forgotPasswordToken: String, 
        forgotPasswordExpiry: Date,


    }, 

    {
        timestamps: true, // tell us time start and time end
    }
);


//***** */ challenge-1 encrypt password ******
// Here we are encrypt the password before saving it
// That's why we are using the pre hook (which is a middleware)
// Pre hook do the function before we save the event in db
userSchema.pre('save', async function(next){  // not arrow function
    
    if(!this.isModified("password")) return next(); 
   this.password = await bcrypt.hash(this.password, 10)
   next(); 
})

// add more features directly to schema
userSchema.methods ={
    //compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password); 
    }, 

    // generate jwt token
    getJwtToken: function(){
        return JWT.sign(
            {
                _id: this._id, 
                role: this.role, 
            }, 
            config.JWT_SECRET, 
            {
                expiresIn: config.JWT_EXPIRY,
            }
        )
    },

    // generate forget password token with help of crypto
    generateForgetPasswordToken: function(){
        const forgotToken = crypto.randomBytes(20).toString('hex');
         // step1 save to db
     this.forgotPasswordToken=crypto
     .createHash("sha256")
     .update(forgotToken)
     .digest("hex")

     this.forgotPasswordExpiry = Date.now() + 20*60*1000
    // step2 returnvalues to user
    return forgotToken;
    }
   
}

 
export default mongoose.model("User", userSchema); 