import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    originalContent: String,
    updatedContent: String,
    originalUrl: String,
    references: [String],
    isUpdated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
