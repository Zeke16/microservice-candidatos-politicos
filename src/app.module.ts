import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
    CandidatoPoliticoModule,
  ],
})
export class AppModule {}
