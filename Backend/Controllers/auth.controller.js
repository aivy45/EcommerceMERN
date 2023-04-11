import User from '../Models/user.schema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utilis/custormError.js'
import mailHelper from '../utilis/mailHelper.js'



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



/************
* @LOGIN
* @route http://localhost:400/api/auth/LOGIN
* @description User signIN controller for Login
* @parameters email, password
* @return User Object
 ***********/

export const login = asyncHandler(async (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new CustomError("Please fill all fields", 400); 
    }

  const user=  User.findOne({email}).select("+password")

  if(!user){
    throw new CustomError('Invalid credentials', 400)
  }

  const isPasswordMatched = await user.comparePassword(password);

  if(isPasswordMatched)
  {
     const token = user.getJwtToken();
     user.password = undefined;
     res.cookie("token", token, cookieOptions);
    //  name of the cookie is token (phla vala) value is token
     return res.status(200).json({
        success: true, 
        token, 
        user
     })

  }
  throw new CustomError('Invalid Credentials -pass', 400)

})


/************
* @LOGOUT
* @route http://localhost:400/api/auth/LOGOUT
* @description User Logout by clearing user cookies 
* @parameters 
* @return success message
 ***********/

export const logout = asyncHandler(async(_req,res)=>{
    // _req means not using it 
    // res.clearCookie();  also a method
    res.cookie("token", null, {
        expires: new Date(Date.now()), 
        httpOnly: true
    })

    res.status(200).json({
        success: true, 
        message: "Loggged OUt"
    })
})


/************
* @FORGOT_PASSWORD
* @route http://localhost:400/api/auth/password/forgot
* @description User will submit email we will generate a token
* @parameters email
* @return success message- email send
 ***********/

export const forgotPassword = asyncHandler(async (req,res)=>{
    const {email} = req.body
    // check email for null or ""
   const user= await User.findOne({email})

   if(!user){
    throw new CustomError("User not found", 404)
   }

 const resetToken = user.generateForgetPasswordToken()
  
//  user.save(); // it will create a problem because this demands all the fields that are in data base 
  await user.save({validateBeforeSave: false})
  
  const resetUrl = 
`{req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`
//req.protocol will give either http or https

  const text= `Your password reset url is
  \n\n ${resetUrl}\n\n`
   try{
     await mailHelper({
         email: user.email, 
         subject:"Password reset email for website",
         text:text,
     })
     res.status(200).json({
        success:true, 
        message: `Email send to ${user.email}`
     })
   }
   catch (error){

    // roll back - clear fields and save 
    user.forgotPasswordToken=undefined
    user.forgotPasswordExpiry=undefined
    await user.save({validateBeforeSave:false})

     throw new CustomError(err.message || 'Email sent failure', 500)  
   }

})


