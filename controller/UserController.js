import userModel from "../models/Usermodal.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class userController{
    static userRegisteration = async (req, res)=>{
        const {email, password}= req.body
        const user = await userModel.find({email})
       
            if(user.length === 0){
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new userModel({
                        email,password:hashPassword
                    })
                    const r = await doc.save();
                    const user = await userModel.findOne({email:email})
                    //generate jwt token
                    const token=jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:'5d'})
                    user.password = "";
                    
                    res.status(201).json({success: true ,user,token, message: "Registered Successfully"})
                    
                } catch (error) {
                    res.status(400).json({success: false ,message:"User already exists"})
                }
            } else {
                res.status(401).json({success: false ,message:"Password didn't match"})
            }

            
    }
        // save in localstorage and send everytime you need to access protected routes
        // const token = localStorage.getItem('token');
        // const headers = {
        // Authorization: `Bearer ${token}`,
        // };
        // await axios.get("/route", {headers})

        // logout
        // localStorage.removeItem('token');

    static userLogin=async (req, res)=>{
        try {
            const {email, password}=req.body
            const result = await userModel.findOne({email})
            const isMatch = await bcrypt.compare(password, result.password) 

            if(isMatch){
                result.password = "";
                const token=jwt.sign({userId:result._id}, process.env.JWT_SECRET_KEY, {expiresIn:'5d'})
                res.status(200).json({result, token, success: true, message:"Logged in Successfully"})
            }else{
                res.status(401).json({success: false ,message:"Password didn't match"})
            }
        } catch (error) {
            res.status(401).json({success: false ,message:"User not exists"})
        }
    }
    
}

export default userController