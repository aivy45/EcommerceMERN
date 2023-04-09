import User from '../Models/user.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utilis/custormError.js'



export const cookieOptions={
    expires: new Date(Date.now()+3 *24*60*60*1000), 
    httpOnly: true, 
    // could be in a seprate file in utilis
}





/************
* @SIGNUP
* @route http://localhost:400/api/auth/signup
* @description User signup controller for creating a new user
* @parameters name, email, password
* @return User Object
 ***********/

export const signUp = asyncHandler(async (req,res)=>{
    const {name, email, password}=req.body;


    if(!name || !email || !password){
        throw new CustomError("Please fill all fields", 400); 
    }

    // check if user exists 
   const existingUser = await User.findOne({email});
   if(existingUser)
   {
    throw new CustomError("User already exists", 400); 
 }

 const user = await User.create({
    name,
    email, 
    password  // password is always bcrypt
 });

  const token = user.getJwtToken();
//  const token = User.getJwtToken; It is wrong as getJwtToken method is attached to userSchema not in User (see userSchema in models)
console.log(user); 
user.password = undefined ;

res.cookie("token", token, cookieOptions );
res.status(200).json({
    success: true,
    token, 
    user
})

})
