import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { DeleteParams, SentenceDto } from './types';

@Controller('sentences')
export class SentencesController {
  constructor(private sentencesService: SentencesService) {}

  @Post()
  async createSentence(@Body() body: SentenceDto) {
    try {
      const s = await this.sentencesService.create(body);
      return s;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('UUID already exists', HttpStatus.BAD_REQUEST)
      }

      throw error;
    }
  }

  @Delete(':uuid')
  async deleteSentence(@Param() params: DeleteParams) {
    try {
      await this.sentencesService.delete(params.uuid);

      return {};
    } catch (error) {
      if (error.code === 'P2016') {
        throw new HttpException('UUID does not exist', HttpStatus.NOT_FOUND);
      }
      
      throw error;
    }
  }
}
