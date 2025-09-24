import prisma from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import CustomError from "../../utils/custom_error.js";
import crypto from "crypto"


async function hashedPassword(password: string): Promise<string> {
  let salt = await bcrypt.genSalt(10);
  if (!salt) {
    throw new CustomError("An error occured while creating the salt", 500);
  }
  let hash = await bcrypt.hash(password, salt);
  return hash;
}
 const comparePasswords = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "5d",
  });
};

const setTokenCookie = (res: Response, token: string) => {
  // Secure + sameSite='none' is mandatory for cross-domain cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,            // required if sameSite is 'none'
    sameSite: 'none',        // needed for cross-site
    // domain: '.sahulatpay.com',
  });
};
export default { hashedPassword, comparePasswords, generateToken, setTokenCookie };