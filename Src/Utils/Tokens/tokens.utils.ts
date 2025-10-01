import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: string | Buffer | object,
  secret: string,
  options?: SignOptions
): string => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (
  token: string,
  secret: string
): string | JwtPayload => {
  return jwt.verify(token, secret);
};
