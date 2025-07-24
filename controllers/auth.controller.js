import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, password } = req.body;

        // Check for existing user by username (for test compatibility)
        const existingUser = await User.findOne({ username }).select('+password');

        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({
                error: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            username,
            password: hashedPassword
        }], { session, ordered: true });

        await session.commitTransaction();
        session.endSession();

        // Return format expected by test script
        res.status(201).json({
            message: 'User registered successfully',
            user_id: newUsers[0]._id
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Return format expected by test script
        res.status(200).json({
            access_token: token
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User signed out successfully'
    })
}