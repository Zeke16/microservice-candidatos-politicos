import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PartidoPoliticoModule } from './partido-politico/partido-politico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    PartidoPoliticoModule,
  ],
})
export class AppModule {}
