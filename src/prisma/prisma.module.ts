import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // make prisma modul global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
