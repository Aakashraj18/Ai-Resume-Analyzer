import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: "Server configuration error." });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
