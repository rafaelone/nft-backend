import { UserRepository } from '@/repositories/user-repository'

import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'

interface CreateUserUseCaseRequest {
  username: string
  email: string
  password: string
}

interface CreateUserUseCaseResponse {}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const findUserExistsByUsername =
      await this.userRepository.findByUsername(username)

    if (findUserExistsByUsername) {
      throw new ConflictException('Username not available.')
    }

    const findUserExistsByEmail = await this.userRepository.findByEmail(email)

    if (findUserExistsByEmail) {
      throw new ConflictException('Email not available.')
    }

    const hashPassword = await hash(password, 8)

    await this.userRepository.create({
      username,
      email,
      password: hashPassword,
    })

    return {}
  }
}
