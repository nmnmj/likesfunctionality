import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    bloghead: { type: String, required: true, trim: true },
    blog: { type: String, required: true, trim: true },
},
{
    timestamps: true, 
}
);

const blogModel = mongoose.model("blog", blogSchema);

export default blogModel;
