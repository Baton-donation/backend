import {Body, Controller, Delete, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {PrismaClientKnownRequestError} from '@prisma/client';
import {SentencesService} from './sentences.service';
import {DeleteParameters, SentenceDto} from './types';

@Controller('sentences')
export class SentencesController {
	constructor(private readonly sentencesService: SentencesService) {}

	@Post()
	async createSentence(@Body() body: SentenceDto) {
		try {
			const s = await this.sentencesService.create(body);
			return s;
		} catch (error: unknown) {
			if ((error as PrismaClientKnownRequestError).code === 'P2002') {
				throw new HttpException('UUID already exists', HttpStatus.BAD_REQUEST);
			}

			throw error;
		}
	}

	@Post('many')
	async createMultipleSentences(@Body() body: SentenceDto[]) {
		try {
			const s = await Promise.all(body.map(async sentence => this.sentencesService.create(sentence)));

			return s;
		} catch (error: unknown) {
			if ((error as PrismaClientKnownRequestError).code === 'P2002') {
				throw new HttpException('UUID already exists', HttpStatus.BAD_REQUEST);
			}

			throw error;
		}
	}

	@Delete(':uuid')
	async deleteSentence(@Param() parameters: DeleteParameters) {
		try {
			await this.sentencesService.delete(parameters.uuid);

			return {};
		} catch (error: unknown) {
			if ((error as PrismaClientKnownRequestError).code === 'P2016') {
				throw new HttpException('UUID does not exist', HttpStatus.NOT_FOUND);
			}

			throw error;
		}
	}
}
