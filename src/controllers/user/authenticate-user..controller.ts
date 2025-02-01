import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { AuthenticateUserUsecase } from '@/usecases/user/authenticate-user.usecase'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { z } from 'zod'

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Controller('/authenticate')
export class AuthenticateUserController {
  constructor(
    private authenticateUserUsecases: AuthenticateUserUsecase,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { email, password } = body

    const user = await this.authenticateUserUsecases.execute({
      email,
      password,
    })

    const accessToken = this.jwt.sign({
      sub: user.id,
    })

    return {
      access_token: accessToken,
    }
  }
}
