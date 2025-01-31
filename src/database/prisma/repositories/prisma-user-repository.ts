import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'src/database/prisma.service'
import { UserRepository } from 'src/repositories/user-repository'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserUncheckedCreateInput): Promise<void> {
    await this.prisma.user.create({ data: user })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      return null
    }

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } })

    if (!user) {
      return null
    }

    return user
  }
}
