"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
        type: String,
        // Only required if the account is NOT using Google Authentication
        required: function () { return !this.googleId; }
    },
    role: { type: String, enum: ['viewer', 'analyst', 'admin'], default: 'viewer' },
    googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
