"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculateController_1 = require("../controller/calculateController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public — map page reads these without auth
router.get("/all", calculateController_1.getAllScores);
router.get("/:districtId", calculateController_1.getScoreByDistrict);
// Protected — must be logged in to save/delete
router.post("/save", auth_1.protect, calculateController_1.saveScore);
router.delete("/:districtId", auth_1.protect, calculateController_1.deleteScore);
exports.default = router;
