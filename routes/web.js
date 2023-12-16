import express from 'express'
import userController from '../controller/UserController.js'
import checkUserAuth from '../middleware/authmiddleware.js'
import BlogController from '../controller/BlogController.js'
import LikeController from '../controller/LikeController.js'

const router = express.Router()

//public routes
router.get("/", (req, res)=>res.status(200).json({success:true}))
router.post("/register", userController.userRegisteration)
router.post("/login", userController.userLogin)

// protected user routes
router.get("/all-blogs", checkUserAuth, BlogController.allBlogs)
router.post("/create-blog", checkUserAuth, BlogController.newBlog)
router.post("/delete-blog", checkUserAuth, BlogController.deleteBlog)
router.post("/update-blog", checkUserAuth, BlogController.updateBlog)
router.post("/update-like", checkUserAuth, LikeController.updateLikeForUser)


export default router