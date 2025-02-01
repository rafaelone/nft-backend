import { faker } from '@faker-js/faker'
import { Prisma, type User } from '@prisma/client'

import { randomUUID } from 'node:crypto'

export function makeUser(override: Partial<User> = {}) {
  const user = {
    id: randomUUID(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    createdAt: new Date(),
    password: '123456',
    updatedAt: null,
    coin: new Prisma.Decimal(1000),
    ...override,
  }

  return user
}
