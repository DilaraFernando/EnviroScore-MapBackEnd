"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherController_1 = require("../controller/weatherController");
const auth_1 = require("../middleware/auth"); // Using your existing auth checker middleware if needed
const router = (0, express_1.Router)();
router.get('/analyze/:districtName', auth_1.protect, weatherController_1.getDistrictWeatherAnalysis);
exports.default = router;
