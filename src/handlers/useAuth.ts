import { UnauthorizedException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { User } from 'src/entities/user.entity'
import { UserModel } from 'src/models/user.model'

export default async function useAuth(req: any, model: UserModel): Promise<User | null> {
  const bearer = req.headers.authorization ?? ''

  if (!bearer) {
    throw new UnauthorizedException('No token provided')
    return null
  }

  const token = plainToInstance(User, req.user)

  if (!token) {
    throw new UnauthorizedException('Unauthorized')
    return null
  }

  const user = await model.model().findOne({ where: { id: token.id } })

  if (!user) {
    throw new UnauthorizedException('Unauthorized')
    return null
  }

  return user
}


export function isRole (user: User, role: User['role']): boolean {
  return user.role === role
}