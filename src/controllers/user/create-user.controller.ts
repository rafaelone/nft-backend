import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { CreateUserUseCase } from '@/usecases/user/create-user.usecase'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(6, { message: 'Please, provide a valid username' }),
  email: z.string().email(),
  password: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserSchema>

@Controller('/user')
export class CreateUserController {
  constructor(private createUserCases: CreateUserUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createUserSchema))
    body: CreateUserBodySchema,
  ) {
    const { username, email, password } = body

    await this.createUserCases.execute({
      username,
      email,
      password,
    })
  }
}
