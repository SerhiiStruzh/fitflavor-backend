import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwtAuthGuard.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService,
              private readonly configService: ConfigService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req, 
    @Res() res: Response
  ) {
    const {accessToken, refreshToken} = await this.authService.handleAuth(res, req.user.id);
    res.redirect(`${this.configService.get('frontend.base_url')}/auth/google?token=${accessToken}`);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request, 
    @Res() res: Response
  ) {
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

  @Post('logout')
  async logout(
    @Req() req: Request, 
    @Res() res: Response
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No refresh token found' });
    }
    try {
      await this.authService.invalidateRefreshToken(refreshToken);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return res.status(HttpStatus.OK).json({ message: 'Successfully logged out' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error during logout' });
    }
  }

}
