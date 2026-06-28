import { Router } from "express";
import { saveScore, getAllScores, getScoreByDistrict, deleteScore } from "../controller/calculateController";
import { protect } from "../middleware/auth";

const router = Router();

// Public — map page reads these without auth
router.get("/all", getAllScores);
router.get("/:districtId", getScoreByDistrict);

// Protected — must be logged in to save/delete
router.post("/save", protect, saveScore);
router.delete("/:districtId", protect, deleteScore);

export default router;