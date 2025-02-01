import { AuthenticateUserUsecase } from '@/usecases/user/authenticate-user.usecase'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'
import { makeUser } from '../factories/make-user'
import { hash } from 'bcryptjs'
import { UnauthorizedException } from '@nestjs/common'

let inMemoryUserRepository: InMemoryUserRepository
let sut: AuthenticateUserUsecase

describe('Authenticate User UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new AuthenticateUserUsecase(inMemoryUserRepository)
  })

  it('should be able to authenticate user with credentials', async () => {
    const hashPassword = await hash('123456', 8)

    const user = makeUser({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: hashPassword,
    })

    inMemoryUserRepository.create(user)

    const response = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.id).toBeTruthy()
  })

  it('should not be able to authenticate with wrong email', async () => {
    const hashPassword = await hash('123456', 8)

    const user = makeUser({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: hashPassword,
    })

    inMemoryUserRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'doejoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hash('123456', 8)

    const user = makeUser({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: hashPassword,
    })

    inMemoryUserRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('should not be able to authenticate with wrong email and wrong password', async () => {
    const hashPassword = await hash('123456', 8)

    const user = makeUser({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: hashPassword,
    })

    inMemoryUserRepository.create(user)

    await expect(() =>
      sut.execute({
        email: '',
        password: '',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })
})
