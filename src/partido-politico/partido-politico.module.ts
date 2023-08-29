import { Module } from '@nestjs/common';
import { PartidoPoliticoController } from './partido-politico.controller';
import { PartidoPoliticoService } from './partido-politico.service';
import { PrismaService } from 'src/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.prod',
    }),
  ],
  controllers: [PartidoPoliticoController],
  providers: [PartidoPoliticoService, PrismaService],
})
export class PartidoPoliticoModule {}
