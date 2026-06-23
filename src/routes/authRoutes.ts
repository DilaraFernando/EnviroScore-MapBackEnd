import { Router } from 'express';
import { loginUser } from '../controller/authController';

const router = Router();

// 🔐 1. POST - පරිශීලකයා ලොග් කරවා ගැනීම
router.post('/login', loginUser);

// 📊 2. GET - Dashboard එකට අවශ්‍ය දත්ත ලබාදීමේ Route එක (අලුතින් එකතු කරන්න)
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "Welcome to the Dashboard Area",
    systemStatus: "Operational",
    lastUpdated: new Date().toLocaleDateString()
  });
});

export default router;