import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { AuthService } from '../../../lib/auth';

// Admin login schema
const adminLoginSchema = z.object({
  adminId: z.string().min(1, 'Admin ID is required'),
  password: z.string().min(1, 'Password is required')
});

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { adminId, password } = adminLoginSchema.parse(req.body);

    // Development mode - allow dev admin
    if (process.env.NODE_ENV === 'development' && adminId === 'dev-admin' && password === 'admin123') {
      const mockAdminUser = {
        id: 'dev-admin-id',
        username: 'DevAdmin',
        email: 'dev@admin.test',
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const token = AuthService.generateToken({
        userId: mockAdminUser.id,
        email: mockAdminUser.email,
        role: mockAdminUser.role
      });

      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: mockAdminUser
      });
    }

    // Check if admin exists in database
    const admin = await prisma.user.findFirst({
      where: {
        OR: [
          { username: adminId },
          { email: adminId }
        ],
        role: 'ADMIN',
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        isVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials or access denied'
      });
    }

    // Verify password if it exists
    if (admin.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid admin credentials'
        });
      }
    } else {
      // No password set - this might be an OAuth-only account
      return res.status(401).json({
        success: false,
        error: 'Password login not available for this account. Use OAuth instead.'
      });
    }

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Remove password hash from response
    const { passwordHash, ...adminUser } = admin;

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: adminUser
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during admin login'
    });
  }
};
