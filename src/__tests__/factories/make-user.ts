import { faker } from '@faker-js/faker'
import type { User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function makeUser(override: Partial<User> = {}) {
  const user = {
    id: randomUUID(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: '123456',
    createdAt: new Date(),
    updatedAt: null,
    ...override,
  }

  return user
}
