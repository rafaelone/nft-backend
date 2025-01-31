import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UserRepository } from 'src/repositories/user-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, UserRepository],
})
export class DataBaseModule {}
