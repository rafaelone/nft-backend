import { Module } from '@nestjs/common'

import { ControllerModule } from './controllers/controller.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ControllerModule,
  ],
})
export class AppModule {}
