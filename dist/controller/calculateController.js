"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScore = exports.getScoreByDistrict = exports.getAllScores = exports.saveScore = void 0;
const districtScore_1 = __importDefault(require("../model/districtScore"));
// POST /api/calculate/save
const saveScore = async (req, res) => {
    try {
        const { district, districtId, province, lat, lng, score, zone, moisture, temp, humidity, problemNote, inputs, } = req.body;
        if (!districtId || score === undefined) {
            return res.status(400).json({ message: "districtId and score are required." });
        }
        // Upsert: update if district already exists for this user, else create
        const userId = req.user?.id;
        const existing = await districtScore_1.default.findOne({ districtId, createdBy: userId });
        if (existing) {
            existing.score = score;
            existing.zone = zone;
            existing.moisture = moisture;
            existing.inputs = inputs;
            existing.updatedAt = new Date();
            await existing.save();
            return res.status(200).json({ message: "Score updated.", data: existing });
        }
        const newScore = new districtScore_1.default({
            district,
            districtId,
            province,
            lat,
            lng,
            score,
            zone,
            moisture,
            temp,
            humidity,
            problemNote,
            inputs,
            createdBy: userId,
        });
        await newScore.save();
        return res.status(201).json({ message: "Score saved.", data: newScore });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error saving score." });
    }
};
exports.saveScore = saveScore;
// GET /api/calculate/all
const getAllScores = async (req, res) => {
    try {
        const scores = await districtScore_1.default.find({}).sort({ score: 1 });
        return res.status(200).json(scores);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching scores." });
    }
};
exports.getAllScores = getAllScores;
// GET /api/calculate/:districtId
const getScoreByDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;
        const score = await districtScore_1.default.findOne({ districtId }).sort({ createdAt: -1 });
        if (!score)
            return res.status(404).json({ message: "No score found for this district." });
        return res.status(200).json(score);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
};
exports.getScoreByDistrict = getScoreByDistrict;
// DELETE /api/calculate/:districtId
const deleteScore = async (req, res) => {
    try {
        const { districtId } = req.params;
        const userId = req.user?.id;
        await districtScore_1.default.deleteOne({ districtId, createdBy: userId });
        return res.status(200).json({ message: "Score deleted." });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
};
exports.deleteScore = deleteScore;
