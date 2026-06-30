import mongoose, { Schema, Document } from "mongoose";

export interface IDistrictScore extends Document {
  district: string;
  districtId: string;
  province: string;
  lat: number;
  lng: number;
  score: number;
  zone: "Green" | "Yellow" | "Red";
  moisture: number;
  temp: string;
  humidity: number;
  problemNote: string;
  inputs: {
    canopy: number;
    rainfall: number;
    industrial: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}

const DistrictScoreSchema = new Schema<IDistrictScore>(
  {
    district: { type: String, required: true },
    districtId: { type: String, required: true, index: true },
    province: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    zone: { type: String, enum: ["Green", "Yellow", "Red"], required: true },
    moisture: { type: Number },
    temp: { type: String },
    humidity: { type: Number },
    problemNote: { type: String },
    inputs: {
      canopy: { type: Number },
      rainfall: { type: Number },
      industrial: { type: String, enum: ["low", "medium", "high"] },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model<IDistrictScore>("DistrictScore", DistrictScoreSchema);