import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherAnalysis extends Document {
  district: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  aiAnalysis: string;
  createdAt: Date;
}

const WeatherAnalysisSchema: Schema = new Schema({
  district: { type: String, required: true, lowercase: true, index: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  condition: { type: String, required: true },
  aiAnalysis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWeatherAnalysis>('WeatherAnalysis', WeatherAnalysisSchema);