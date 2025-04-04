import mongoose from "mongoose";

const AttendeeSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
});


const Attendee = mongoose.model("Attendee", AttendeeSchema);
export default Attendee;