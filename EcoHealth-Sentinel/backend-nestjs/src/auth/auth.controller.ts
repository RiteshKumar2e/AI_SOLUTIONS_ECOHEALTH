import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Controller('api')
export class AuthController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Post('register')
  async register(@Body() body: any) {
    const { fullName, email, organization, phone, password, role } = body;

    // Validation
    if (!email || !password || !fullName) {
      throw new BadRequestException('Missing required fields');
    }

    // Check if user already exists
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('User already exists');

    // Create new user
    const newUser = new this.userModel({
      fullName,
      email,
      organization,
      phone,
      password,
      role,
      createdAt: new Date(),
    });

    await newUser.save();

    return {
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
      },
    };
  }
}
