import mongoose from "mongoose";

const { Schema } = mongoose;

const PhotographerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: { type: String},

  // Fields for Photographers only
  company: { type: String },
  portfolio: {
    type: String,
    validate: {
      validator: (value) => {
        // Custom validation for URL format
        return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
      },
      message: "Invalid URL format",
    },
  },

  location: {
    type: Array,
  },

  bio: { type: String, maxlength: 50 },
  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

export default mongoose.model("Photographer", PhotographerSchema);
