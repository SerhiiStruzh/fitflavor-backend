import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const userId = req.user.id;
    const accessToken = await this.authService.generateAccessToken(userId);
    const refreshToken = await this.authService.generateRefreshToken(userId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.json({ user, accessToken });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Refresh token not found' });
    }

    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);
      const newAccessToken = await this.authService.generateAccessToken(payload.userId);
      const newRefreshToken = await this.authService.generateRefreshToken(payload.userId);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid refresh token' });
    }
  }
}
