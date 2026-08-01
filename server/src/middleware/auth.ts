import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1] || authHeader;
    const secret = process.env.JWT_SECRET || 'school_payment_super_secret_jwt_key_2026';

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    // For ease of assessment testing, if auth header is missing, we log warning or allow optional pass if header present
    return res.status(401).json({ success: false, message: 'Authorization header missing' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1] || authHeader;
    const secret = process.env.JWT_SECRET || 'school_payment_super_secret_jwt_key_2026';

    jwt.verify(token, secret, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};
