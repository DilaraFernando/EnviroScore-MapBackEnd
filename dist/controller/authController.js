"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = require("../model/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'note_vault_fallback_secure_key_2026', {
        expiresIn: '7d',
    });
};
const register = async (req, res) => {
    try {
        // 1. Accept 'username' from the frontend payload if that's what it sends
        const { username, name, email, password } = req.body;
        // Fallback: use username if name isn't provided
        const finalName = name || username;
        if (!finalName) {
            res.status(400).json({ message: 'Username/Name is required.' });
            return;
        }
        const userExists = await User_1.User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            res.status(400).json({ message: 'User identity already exists.' });
            return;
        }
        let assignedRole = req.body.role || 'student';
        if (email.toLowerCase() === 'admin@enviroscoremap.com') {
            assignedRole = 'admin';
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // 2. Pass finalName to your database creation function
        const user = await User_1.User.create({
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
    }
    catch (error) {
        // This will print the exact validation error in your terminal to verify!
        console.error("Registration Error Context:", error);
        res.status(500).json({ message: 'Internal validation process failed.', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (user && user.password && (await bcryptjs_1.default.compare(password, user.password))) {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Authentication runtime error.', error: error.message });
    }
};
exports.login = login;
