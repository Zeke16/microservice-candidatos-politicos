import { Module } from '@nestjs/common';
import { CandidatoPoliticoService } from './candidato-politico.service';
import { CandidatoPoliticoController } from './candidato-politico.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.prod',
    }),
  ],
  providers: [CandidatoPoliticoService, PrismaService],
  controllers: [CandidatoPoliticoController],
})
export class CandidatoPoliticoModule {}
