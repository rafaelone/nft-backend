import { Module } from '@nestjs/common'
import { DataBaseModule } from 'src/database/database.module'
import { CreateUserController } from './user/create-user.controller'
import { CreateUserUseCase } from '@/usecases/user/create-user.usecase'

@Module({
  imports: [DataBaseModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class ControllerModule {}
