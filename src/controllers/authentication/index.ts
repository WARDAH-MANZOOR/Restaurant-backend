import { Request, Response, NextFunction } from 'express';
import  customError from '../../utils/custom_error.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticationService } from '../../services/index.js';
import ApiResponse from '../../utils/ApiResponse.js';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, email, password, name, address, phone, cuisineType, ownerName, ownerPhone } = req.body;

    if (!role) {
      throw new customError ( 'Role is required',400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new customError( 'User with this email already exists',409);
    }
    const hashedPassword = await authenticationService.hashedPassword(password);

    // const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    switch (role) {
      case 'customer':
        if (!name || !email || !password || !address || !phone) {
          throw new customError( 'Name, email, password, address, and phone are required for customer registration',400);
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
          throw new customError('Email, password, name, cuisineType, ownerName, and ownerPhone are required for restaurant registration',400);
        }
        user = await prisma.restaurantProfile.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'RESTAURANT' },
            },
            name: name,
            cuisineType: [cuisineType],
            ownerName: ownerName,
            ownerPhone: ownerPhone,
          },
        });
        break;
      case 'home_based_restaurant':
        if (!email || !password || !name || !cuisineType || !ownerName || !ownerPhone) {
          throw new customError( 'Email, password, name, cuisineType, ownerName, and ownerPhone are required for home based restaurant registration',400);
        }
        user = await prisma.homeBasedRestaurant.create({
          data: {
            user: {
              create: { email, password: hashedPassword, role: 'HOME_BASED_RESTAURANT' },
            },
            name: name,
            cuisineType: [cuisineType],
            ownerName: ownerName,
            ownerPhone: ownerPhone,
          },
        });
        break;
      case 'admin':
        if (!email || !password) {
          throw new customError( 'Email and password are required for admin registration',400);
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
        throw new customError( 'Invalid role specified', 400);
    }
  

    // Step 7: Send Response
    res.status(201).json(
      ApiResponse.success({
        message: `${role} registered successfully`,
        user: user
      })
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new customError( 'Email and password are required',400);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new customError( 'Invalid credentials',401);
    }
    // Compare passwords
    const isPasswordValid = await authenticationService.comparePasswords(
      password,
      user?.password as string
    );
    if (!isPasswordValid) {
      const error = new customError("Invalid email or password", 401);
      res.status(401).json(ApiResponse.error(error.message));
      return;
    }
   
    // Generate JWT token
    const token = authenticationService.generateToken({
      email: user.email,
      role: user.role,
      uid: user?.uid,
      userId: user?.user_id,
    });

    // Set token in cookies
    authenticationService.setTokenCookie(res, token);

    // const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' });

    res.status(201).json(
      ApiResponse.success({ 
        message: 'Logged in successfully',
        user,
        token
      })
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response) => {
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