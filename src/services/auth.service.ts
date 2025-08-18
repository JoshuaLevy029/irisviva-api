import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HashService } from './hash.service'
import { User } from 'src/entities/user.entity'
import { UserModel } from 'src/models/user.model'
import { SignupDto } from 'src/dtos/signup.dto'

const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly userModel: UserModel,
  ) {}

  async verifyEmail(email: string) {
    const users = await this.userModel.model().count({ where: { email: email.toLowerCase() } })

    return users > 0
  }

  async signin(email: string, password: string) {
    const user = await this.userModel.model().findOne({ where: { email: email.toLowerCase(), deleted_at: null } })

    if (!user) {
      throw new NotFoundException('Conta não encontrada')
    }

    const passwordMatch = await this.hashService.compare(
      password,
      user.password,
    )

    if (!passwordMatch) {
      throw new BadRequestException('E-mail ou senha incorretos')
    }

    if (!user.status) {
      throw new PreconditionFailedException(
        'Conta desabilitada. Por favor, contate o suporte.',
      )
    }

    /* if (!user.email_verified_at) {
      throw new PreconditionFailedException({
        message: 'E-mail not verified. Please verify your e-mail.',
        verified: false,
        askVerification: true,
      })
    } */

    return user
  }

  async signup(data: SignupDto) {
    let errors: { [key: string]: string } = {}

    const exists = await this.verifyEmail(data.email)

    if (exists) {
      errors.email = 'E-mail já cadastrado'

      throw new UnprocessableEntityException(errors, 'Erro ao cadastrar usuário')
    }

    try {
      const password = await this.hashService.hash(data.password)

      const user = this.userModel.model().create({
        ...data,
        email: data.email.toLowerCase(),
        password: password,
      })

      await this.userModel.model().save(user)

      return user
    } catch (error) {
      console.log(error)

      throw new BadRequestException('Erro ao cadastrar usuário', {
        cause: error,
      })
    }
  }

  async attempt(user: User) {
    const payload = { email: user.email, name: user.name, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async update(user: User, data: Partial<User>) {
    await this.userModel.model().update({ id: user.id }, data)
  }

  async verifyPassword(user: User, password: string) {
    return await this.hashService.compare(password, user.password)
  }

  async changePassword(user: User, password: string) {
    try {
      const newPassword = await this.hashService.hash(password)

      await this.userModel.model().update({ id: user.id }, { password: newPassword })
    } catch (error) {
      console.log(error)

      throw new BadRequestException('Unable to change password', {
        cause: error,
      })
    }
  }

  async getTokens(user: User) {
    const payload = { email: user.email, id: user.id, sub: user.id }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      this.jwtService.signAsync(payload, { expiresIn: '15d' }),
    ])

    return { accessToken, refreshToken }
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    const hashed = await this.hashService.hash(refreshToken)
    await this.userModel.model().update({ id: user.id }, { refresh_token: hashed })
  }

  async refreshTokens(user: User, refreshToken: string) {
    const valid = await this.hashService.compare(
      refreshToken,
      user.refresh_token,
    )

    if (!valid) {
      throw new ForbiddenException('Invalid token')
    }

    const tokens = await this.getTokens(user)
    await this.updateRefreshToken(user, tokens.refreshToken)

    return tokens
  }
}
