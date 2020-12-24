import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SentencesController } from './sentences/sentences.controller';
import { SentencesService } from './sentences/sentences.service';
import { ConfigService } from './config/config.service';
import { KeysController } from './keys/keys.controller';

@Module({
  imports: [],
  controllers: [SentencesController, KeysController],
  providers: [SentencesService, PrismaService, ConfigService],
})
export class AppModule {}
