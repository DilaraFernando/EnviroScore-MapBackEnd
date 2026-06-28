import { Request, Response } from "express";
import DistrictScore from "../model/districtScore";

// POST /api/calculate/save
export const saveScore = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    if (!districtId || score === undefined) {
      return res.status(400).json({ message: "districtId and score are required." });
    }

    // Upsert: update if district already exists for this user, else create
    const userId = (req as any).user?.id;

    const existing = await DistrictScore.findOne({ districtId, createdBy: userId });

    if (existing) {
      existing.score = score;
      existing.zone = zone;
      existing.moisture = moisture;
      existing.inputs = inputs;
      existing.updatedAt = new Date();
      await existing.save();
      return res.status(200).json({ message: "Score updated.", data: existing });
    }

    const newScore = new DistrictScore({
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error saving score." });
  }
};

// GET /api/calculate/all
export const getAllScores = async (req: Request, res: Response) => {
  try {
    const scores = await DistrictScore.find({}).sort({ score: 1 });
    return res.status(200).json(scores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching scores." });
  }
};

// GET /api/calculate/:districtId
export const getScoreByDistrict = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params;
    const score = await DistrictScore.findOne({ districtId }).sort({ createdAt: -1 });
    if (!score) return res.status(404).json({ message: "No score found for this district." });
    return res.status(200).json(score);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/calculate/:districtId
export const deleteScore = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params;
    const userId = (req as any).user?.id;
    await DistrictScore.deleteOne({ districtId, createdBy: userId });
    return res.status(200).json({ message: "Score deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};