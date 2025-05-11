import mongoose, { Document, Schema } from "mongoose";

interface IReport extends Document {
  targetType: "question" | "answer" | "comment";
  targetId: mongoose.Types.ObjectId;
  reason: string;
  reportedBy: mongoose.Types.ObjectId;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    targetType: {
      type: String,
      enum: ["question", "answer", "comment"],
      required: [true, "Target type is required"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
      refPath: "targetType",
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
