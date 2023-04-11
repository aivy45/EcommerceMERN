import User from "../Models/user.schema"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utilis/custormError"
import config from "../config/index.js"



export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;
    if (req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    ){
        token = req.cookies.token || req.header.authorization.split("")[1]
    }

    
    if(!token)
    {
        throw new CustomError('Not authorized to access this route', 401)
    }

    try{
    const decodedJwtPayload= JWT.verify(token, config.JWT_SECRET)
    
    // grab _id, find user based on id, set this in req.user
   req.user = await User.findById(decodedJwtPayload._id, "name email role" ) // if name email role not give then give everything
   next();

}
    catch(error){
 throw new CustomError("Not authorized to access this route", 401); 
    }

})



