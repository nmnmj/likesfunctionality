import  jwt  from "jsonwebtoken";
import userModel from "../models/Usermodal.js";

var checkUserAuth = async (req, res, next)=>{
    //get token from header
    let token 
    const {authorization}= req.headers
    if(authorization && authorization.startsWith("Bearer")){
        try {
            token = authorization.split(" ")[1]

            //verify token
            const {userId}=jwt.verify(token, process.env.JWT_SECRET_KEY)
            //get user from token
            req.user = await userModel.findById(userId).select("-password")
            next()
        } catch (error) {
            res.status(401).send("unauthorized user")
        }
    }
    if(!token){
        res.status(401).send("no Token")
    }
}

export default checkUserAuth