import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/decorators/is-public.decorator';
import { UserDto } from 'src/dtos/exposers/user.dto';
import { SignupDto } from 'src/dtos/signup.dto';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RefreshTokenAuthGuard } from 'src/guards/refresh-token-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserModel } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { MailService } from 'src/services/mail.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userModel: UserModel,
  ) {}

  @Public()
  @Post('/verify-email')
  async verifyEmail(@Body() body: { email: string }) {
    const exists = await this.authService.verifyEmail(body.email)

    return {
      exists,
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Req() req) {
    const tokens = await this.authService.getTokens(req.user);
    await this.authService.updateRefreshToken(req.user, tokens.refreshToken);
    return tokens;
  }

  @Public()
  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    const user = await this.authService.signup(body)

    if (!user) {
      throw new BadRequestException('Erro ao cadastrar usuário')
    }

    const tokens = await this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async profile(@Req() req) {
    const jwt: User = plainToInstance(User, req.user);
    const user = await this.userModel.model().findOne({ where: { id: jwt.id } });
    return {
      ...user,
      iat: req.user.iat,
      exp: req.user.exp,
      accessToken: req.headers.authorization.replace('Bearer ', ''),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async update(@Req() req, @Body() body: Partial<User>) {
    const user: User = plainToInstance(User, req.user);

    if (body.password) {
      const update = await this.authService.changePassword(user, body.password);
    } else {
      const update = await this.authService.update(user, body);
    }

    return {
      message: 'Account updated successfully!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    return this.authService.update(req.user, { refresh_token: null });
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('/refresh')
  async refresh(@Req() req) {
    const user: User = plainToInstance(User, req.user);

    return this.authService.refreshTokens(user, user.refresh_token);
  }
}
