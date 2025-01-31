import type { Prisma, User } from '@prisma/client'

export abstract class UserRepository {
  abstract create(user: Prisma.UserUncheckedCreateInput): Promise<void>
  abstract findByUsername(username: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
}
