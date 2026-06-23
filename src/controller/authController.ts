import { Request, Response } from 'express';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Please enter both username and password.' });
    return;
  }

  //  RAD Prototype Mock Authentication)
  if (username === 'dilara' && password === 'password123') {
    res.status(200).json({
      username,
      role: role || 'Regular User',
      message: 'Login successful! Redirecting to Dashboard...'
    });
    return;
  } else if (username === 'admin' && password === 'admin123') {
    res.status(200).json({
      username,
      role: 'Admin',
      message: 'Admin Login successful!'
    });
    return;
  } else {
    res.status(401).json({ message: 'Invalid username or password.' });
    return;
  }
};