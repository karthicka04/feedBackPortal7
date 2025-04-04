import mongoose from "mongoose";

const FlagedSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true },
}, { timestamps: true });

const Flaged = mongoose.model("Flaged", FlagedSchema);
export default Flaged;