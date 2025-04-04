import mongoose from "mongoose"; 

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    placementType: {
      type: String,
      required: true,
      enum: ["Internship", "Full-time", "Contract"],
    },
    totalRounds: {
      type: Number,
      required: true,
      min: 1,
    },
    rounds: [
      {
        roundName: { type: String, required: true, trim: true },
        questions: [{ type: String, required: true }],
      },
    ],
    additionalDetails: {
      type: String,
      default: "",
      trim: true,
    },
    tips: {
      type: String,
      default: "",
      trim: true,
    },
    month: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000, // Optional: Ensures reasonable years
    },
    preparationTime: {
      type: String,
      default: "",
      trim: true,
    },
    skillsUsed: {
      type: String,
      default: "",
      trim: true,
    },
    privacyAgreement: {
      type: Boolean,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flagedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
