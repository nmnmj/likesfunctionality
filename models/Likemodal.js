import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    blogid: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
});

const LikeModal = mongoose.model("like", likeSchema);

export default LikeModal;
