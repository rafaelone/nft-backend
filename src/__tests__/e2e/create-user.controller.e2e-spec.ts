import { Test } from '@nestjs/testing'
import { PrismaService } from '@/database/prisma.service'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import request from 'supertest'

describe('Create account(E2E', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /user', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        username: 'johndoe',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('[POST] /user cannot create a user  if email already use', async () => {
    await prisma.user.create({
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const response = await request(app.getHttpServer()).post('/user').send({
      username: 'doejohn',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(409)

    const userOnDatabase = await prisma.user.findMany({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toHaveLength(1)
  })

  test('[POST] /user cannot create a user  if username already use', async () => {
    await prisma.user.create({
      data: {
        username: 'johndoe',
        email: 'doejohn@example.com',
        password: '123456',
      },
    })

    const response = await request(app.getHttpServer()).post('/user').send({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(409)

    const userOnDatabase = await prisma.user.findMany({
      where: {
        username: 'johndoe',
      },
    })

    expect(userOnDatabase).toHaveLength(1)
  })

  test('[POST] /user cannot create a user with empty email', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      username: 'johndoe',
      email: '',
      password: '123456',
    })

    expect(response.statusCode).toBe(400)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        username: 'johndoe',
      },
    })

    expect(userOnDatabase).toBeFalsy()
  })

  test('[POST] /user cannot create a user with empty username', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      username: '',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(400)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toBeFalsy()
  })
})
