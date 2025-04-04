import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  logo: { type: String },
 
});

const Company = mongoose.model("Company", CompanySchema);
export default Company;