import { Request, Response } from 'express';
import { User, UserRole } from '../model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: UserRole) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'note_vault_fallback_secure_key_2026', {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Accept 'username' from the frontend payload if that's what it sends
    const { username, name, email, password } = req.body;
    
    // Fallback: use username if name isn't provided
    const finalName = name || username; 

    if (!finalName) {
       res.status(400).json({ message: 'Username/Name is required.' });
       return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400).json({ message: 'User identity already exists.' });
      return;
    }

    let assignedRole: UserRole = req.body.role || 'student';
    
    if (email.toLowerCase() === 'admin@enviroscoremap.com') {
      assignedRole = 'admin';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Pass finalName to your database creation function
    const user = await User.create({
      name: finalName, 
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    // This will print the exact validation error in your terminal to verify!
    console.error("Registration Error Context:", error); 
    res.status(500).json({ message: 'Internal validation process failed.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
  
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id.toString(), user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
            },
      });
      return;
    }

    res.status(401).json({ message: 'Invalid server authentication credentials.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Authentication runtime error.', error: error.message });
  }
  
};