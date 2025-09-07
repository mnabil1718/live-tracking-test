import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from 'src/Infrastructures/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
})
export class AppModule {}
