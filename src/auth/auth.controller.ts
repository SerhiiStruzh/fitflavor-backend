import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

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
    const {accessToken, refreshToken} = await this.authService.handleAuth(res, req.user.id);
    return res.json({ user: req.user, accessToken });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Refresh token not found' });
    }

    try {
      const payload = await this.authService.verifyRefreshToken(oldRefreshToken);
      const {accessToken, refreshToken} = await this.authService.handleRefresh(res, payload.userId, oldRefreshToken);
      return res.json({ accessToken: accessToken });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid refresh token' });
    }
  }
}
