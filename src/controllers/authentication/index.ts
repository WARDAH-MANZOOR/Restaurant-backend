import { Request, Response, NextFunction } from 'express';
import  customError from '../../utils/custom_error';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, email, password, name, address, phone, cuisineType, ownerName, ownerPhone } = req.body;

    if (!role) {
      throw new import  customError from '../../utils/custom_error';
(400, 'Role is required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    switch (role) {
      case 'customer':
        if (!name || !email || !password || !address || !phone) {
          throw new ApiError(400, 'Name, email, password, address, and phone are required for customer registration');
        }
        user = await prisma.customerProfile.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'CUSTOMER' },
            },
            name: name,
            address: address,
            phone: phone,
          },
        });
        break;
      case 'restaurant':
        if (!email || !password || !name || !cuisineType || !ownerName || !ownerPhone) {
          throw new ApiError(400, 'Email, password, name, cuisineType, ownerName, and ownerPhone are required for restaurant registration');
        }
        user = await prisma.restaurantProfile.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'RESTAURANT' },
            },
            name: name,
            cuisineType: cuisineType,
            ownerName: ownerName,
            ownerPhone: ownerPhone,
          },
        });
        break;
      case 'home_based_restaurant':
        if (!email || !password || !name || !cuisineType || !ownerName || !ownerPhone) {
          throw new ApiError(400, 'Email, password, name, cuisineType, ownerName, and ownerPhone are required for home based restaurant registration');
        }
        user = await prisma.homeBasedRestaurant.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'HOME_BASED_RESTAURANT' },
            },
            name: name,
            cuisineType: cuisineType,
            ownerName: ownerName,
            ownerPhone: ownerPhone,
          },
        });
        break;
      case 'admin':
        if (!email || !password) {
          throw new ApiError(400, 'Email and password are required for admin registration');
        }
        user = await prisma.adminProfile.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'ADMIN' },
            },
          },
        });
        break;
      default:
        throw new ApiError(400, 'Invalid role specified');
    }

    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'Logged in successfully', user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).send({ message: "Logged out Successfully" });
};

export default {
  login,
  logout,
  register,
}