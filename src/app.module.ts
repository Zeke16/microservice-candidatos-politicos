import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidatoPoliticoModule } from './candidato-politico/candidato-politico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    CandidatoPoliticoModule,
  ],
})
export class AppModule {}
