import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ message: "Token error" });

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
