import blogModel from "../models/Blogmodal.js";
import LikeModal from "../models/Likemodal.js";

async function fetchBlogsWithLikes(userid) {
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
            userid,
            blogid: blog._id,
        });
    }

    return blogsWithLikes;
}

class LikeController {
    static updateLikeForUser = async (req, res) => {
        try {
            const { userid, blogid } = req.body;
            // Check if userid and blogid are present in the request body
            if (!userid || !blogid) {
                return res.status(400).json({ success: false, message: 'Both userid and blogid are required.' });
            }
            // Check if a like already exists for the given userid and blogid
            const existingLike = await LikeModal.findOne({ userid, blogid });

            if (existingLike) {
                // If like exists, remove it (dislike)
                await LikeModal.findOneAndDelete({ userid, blogid });
                const blogsWithLikes = await fetchBlogsWithLikes(userid);

                return res.status(200).json({ success: true, data: blogsWithLikes, message: 'Blog disliked successfully.' });
            } else {
                // If like doesn't exist, create a new like
                const newLike = new LikeModal({ userid, blogid });
                await newLike.save();

                const blogsWithLikes = await fetchBlogsWithLikes(userid);

                return res.status(200).json({ success: true, data: blogsWithLikes, message: 'Blog liked successfully.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    }
}

export default LikeController;
