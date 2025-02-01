import { Module } from '@nestjs/common'
import { DataBaseModule } from 'src/database/database.module'
import { CreateUserController } from './user/create-user.controller'
import { CreateUserUseCase } from '@/usecases/user/create-user.usecase'
import { AuthenticateUserController } from './user/authenticate-user..controller'
import { AuthenticateUserUsecase } from '@/usecases/user/authenticate-user.usecase'

@Module({
  imports: [DataBaseModule],
  controllers: [CreateUserController, AuthenticateUserController],
  providers: [CreateUserUseCase, AuthenticateUserUsecase],
})
export class ControllerModule {}
