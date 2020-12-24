import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SentencesController } from './sentences/sentences.controller';
import { SentencesService } from './sentences/sentences.service';

@Module({
  imports: [],
  controllers: [SentencesController],
  providers: [SentencesService, PrismaService],
})
export class AppModule {}
