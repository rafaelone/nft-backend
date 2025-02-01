import { Module } from '@nestjs/common'

import { ControllerModule } from './controllers/controller.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    ControllerModule,
  ],
})
export class AppModule {}
