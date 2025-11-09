import mongoose from "mongoose";

export const SIZE_OPTIONS = ["Small", "Medium", "Large"];
export const POSITION_OPTIONS = ["Top", "Bottom"];
export const URGENCY_OPTIONS = ["None", "Color pulse", "Banner flash", "Blink"];

const TimerSchema = new mongoose.Schema({
  storeUrl: {
    type: String,
    ref: "Store",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
    default: "#000000",
  },
  size: {
    type: String,
    enum: SIZE_OPTIONS,
    default: "Medium",
  },
  position: {
    type: String,
    enum: POSITION_OPTIONS,
    default: "Top",
  },
  urgency: {
    type: String,
    enum: URGENCY_OPTIONS,
    default: "None",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// one timer per store
TimerSchema.index({ storeId: 1 }, { unique: true });

export default mongoose.model("Timer", TimerSchema);
