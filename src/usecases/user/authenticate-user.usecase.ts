import { UserRepository } from '@/repositories/user-repository'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcryptjs'

interface AuthenticateUserUsecaseRequest {
  email: string
  password: string
}

@Injectable()
export class AuthenticateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateUserUsecaseRequest) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    return user
  }
}
