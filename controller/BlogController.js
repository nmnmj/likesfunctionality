import blogModel from "../models/Blogmodal.js"
import LikeModal from "../models/Likemodal.js";

class BlogController {
    static newBlog = async (req, res) => {
        const { bloghead, blog } = req.body;
        const { _id: loggedInUserId } = req.user;
        if (bloghead || blog) {
            try {
                const existingBlog = await blogModel.findOne({ blog });
                if (existingBlog) {
                    return res.status(200).json({ success: false, message: "This blog description is already in use" });
                }
                // Create and save a new blog
                const doc = new blogModel({
                    bloghead,
                    blog,
                });
                const newBlog = await doc.save();
                // Fetch all blogs with their total likes
                const blogsWithLikes = await blogModel.aggregate([
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "blogid",
                            as: "likes",
                        },
                    },
                    {
                        $addFields: {
                            totalLikes: { $size: "$likes" },
                        },
                    },
                ]);
                for (const blog of blogsWithLikes) {
                    blog.isLiked = await LikeModal.exists({
                        userid: loggedInUserId,
                        blogid: blog._id,
                    });
                }
                res.status(201).json({
                    success: true,
                    data: blogsWithLikes,
                    message: "Blog Posted",
                });
            } catch (error) {
                res.status(400).json({ success: false, message: "Error creating a new blog" });
            }
        } else {
            res.status(400).json({ success: false, message: "Invalid blog data" });
        }
    };

    static allBlogs = async (req, res)=>{
        try {
            // Get all blogs with their total likes
            const blogsWithLikes = await blogModel.aggregate([
                {
                    $lookup: {
                        from: "likes",
                        localField: "_id",
                        foreignField: "blogid",
                        as: "likes",
                    },
                },
                {
                    $addFields: {
                        totalLikes: { $size: "$likes" },
                    },
                },
            ]);
            res.status(201).json({success: true, data: blogsWithLikes, message: "Blogs Fetched"})
            
        } catch (error) {
            res.status(400).json({success: false ,message:"Error"})                
        }
    }

    static updateBlog = async (req, res) => {
        const { blogid, bloghead, blog } = req.body;
        const { _id: loggedInUserId } = req.user;

        try {
            // Check if the blog exists
            const existingBlog = await blogModel.findById(blogid);
            if (!existingBlog) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }

            // Update the blog
            existingBlog.bloghead = bloghead;
            existingBlog.blog = blog;
            const updatedBlog = await existingBlog.save();

            // Fetch the updated blog with total likes
            const blogsWithLikes = await blogModel.aggregate([
                {
                    $lookup: {
                        from: "likes",
                        localField: "_id",
                        foreignField: "blogid",
                        as: "likes",
                    },
                },
                {
                    $addFields: {
                        totalLikes: { $size: "$likes" },
                    },
                },
            ]);

            for (const blog of blogsWithLikes) {
                blog.isLiked = await LikeModal.exists({
                    userid: loggedInUserId,
                    blogid: blog._id,
                });
            }

            res.status(200).json({
                success: true,
                data: blogsWithLikes,
                message: "Blog updated successfully",
            });
        } catch (error) {
            res.status(400).json({ success: false, message: "Error updating blog" });
        }
    };

    static deleteBlog = async (req, res) => {
        const { blogid } = req.body;

        try {
            // Check if the blog exists
            const existingBlog = await blogModel.findById(blogid);
            if (!existingBlog) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }

            // Delete the blog
            await existingBlog.deleteOne();

            res.status(200).json({ success: true, message: "Blog deleted successfully" });
        } catch (error) {
            res.status(400).json({ success: false, message: "Error deleting blog" });
        }
    };
}

export default BlogController