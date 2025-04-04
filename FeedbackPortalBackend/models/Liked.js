import mongoose from "mongoose";

const LikedSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true },
}, { timestamps: true });

const Liked = mongoose.model("Liked", LikedSchema);
export default Liked;