import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma'; // Using your updated prisma path

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, gamertag } = req.body;

        if (!email || !password || !gamertag) {
            res.status(400).json({ error: 'Email, password, and gamertag are required' });
            return;
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (existingEmail) {
            res.status(409).json({ error: 'Email is already registered' });
            return;
        }

        const existingGamertag = await prisma.profile.findUnique({
            where: { gamertag }
        });
        if (existingGamertag) {
            res.status(409).json({ error: 'Gamertag is already taken' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                profile: {
                    create: {
                        gamertag: gamertag
                    }
                }
            },
            select: {
                id: true,
                email: true,
                profile: {
                    select: {
                        gamertag: true
                    }
                }
            }
        });

        res.status(201).json(newUser);

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Find the user AND select their related profile gamertag
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                profile: {
                    select: {
                        gamertag: true
                    }
                }
            }
        });

        // Vague error for security (prevents account enumeration)
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Flattens the response structure to keep it clean for the frontend
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                gamertag: user.profile?.gamertag || '' // Safe fallback check
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};