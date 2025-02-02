import { Test } from '@nestjs/testing'
import { PrismaService } from '@/database/prisma.service'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import request from 'supertest'
import { hash } from 'bcryptjs'

describe('Authenticate user (E2E)', () => {
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

  test('[POST] /authenticate', async () => {
    await prisma.user.create({
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  test('[POST] /authenticate cannot authenticate with wrong email', async () => {
    await prisma.user.create({
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send({
        email: 'johndoeeeee@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(401)
  })

  test('[POST] /authenticate cannot authenticate with wrong password', async () => {
    await prisma.user.create({
      data: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456789',
      })

    expect(response.statusCode).toBe(401)
  })
})
