import { Router } from 'express';
import { getDistrictWeatherAnalysis } from '../controller/weatherController';
import { protect } from '../middleware/auth'; // Using your existing auth checker middleware if needed

const router = Router();

router.get('/analyze/:districtName', protect, getDistrictWeatherAnalysis);

export default router;