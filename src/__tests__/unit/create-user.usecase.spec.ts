import { CreateUserUseCase } from '@/usecases/user/create-user.usecase'
import { ConflictException } from '@nestjs/common'
import { makeUser } from '@/__tests__/factories/make-user'
import { InMemoryUserRepository } from '@/__tests__/repositories/in-memory-user-repository'

let inMemoryUserRepository: InMemoryUserRepository
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateUserUseCase(inMemoryUserRepository)
  })

  it('should be able to create a new user', async () => {
    await sut.execute({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUserRepository.users).toEqual([
      expect.objectContaining({
        username: 'johndoe',
        email: 'johndoe@example.com',
      }),
    ])
  })

  it('should not be able to create a new user with same email', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
    })

    await inMemoryUserRepository.create(user)

    await expect(() =>
      sut.execute({
        username: 'doejoe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException)
  })

  it('should not be able to create a new user with same username', async () => {
    const user = makeUser({
      username: 'johndoe',
    })

    await inMemoryUserRepository.create(user)

    await expect(() =>
      sut.execute({
        username: 'johndoe',
        email: 'doejohn@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ConflictException)
  })
})
