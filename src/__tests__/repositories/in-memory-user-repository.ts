import type { UserRepository } from '@/repositories/user-repository'
import type { User } from '@prisma/client'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
