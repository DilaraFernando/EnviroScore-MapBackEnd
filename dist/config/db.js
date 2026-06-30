"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            family: 4,
        });
        console.log('🌱 MongoDB Connected Successfully');
    }
    catch (error) {
        console.error('⚠️ MongoDB Connection Error:', error.message);
        console.log('🚀 Running Backend in Offline RAD Mode...');
    }
};
exports.default = connectDB;
