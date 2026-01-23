import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/jwt.js';


export interface AuthRequest extends Request {
user?: any;
}


export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });


const token = authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Token missing' });


try {
const payload = jwt.verify(token, JWT_SECRET);
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}


export function authorizeRoles(...roles: string[]) {
return (req: AuthRequest, res: Response, next: NextFunction) => {
if (!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({ message: 'Forbidden: Insufficient role' });
}
next();
};
}
// 🔐 Auth guard
export const requireAuth = authenticateJWT;

// 👮 Admin-only guard
export const requireAdmin = authorizeRoles("ADMIN");
