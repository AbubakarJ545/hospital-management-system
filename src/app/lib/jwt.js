import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
export function signJWT(payload) {
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function verifyJWT(token) {
  try {
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  // Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  // Cookie fallback
  const cookie = req.headers.get("cookie") || req.headers.get("Cookie");
  if (cookie) {
    const match = cookie.split("; ").find((c) => c.startsWith("token="));
    if (match) return decodeURIComponent(match.split("=")[1]);
  }
  return null;
}

export function requireAuth(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyJWT(token);
}
