import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SentenceDto } from './types';

@Injectable()
export class SentencesService {
  constructor(private prisma: PrismaService) {}
  
  async create(sentence: SentenceDto): Promise<SentenceDto> {
    return this.prisma.sentence.create({data: sentence});
  }

  async delete(uuid: string) {
    await this.prisma.sentence.delete({where: {uuid}});
  }
}
