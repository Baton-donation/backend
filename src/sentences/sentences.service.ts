import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {SentenceDto} from './types';

@Injectable()
export class SentencesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(sentence: SentenceDto): Promise<SentenceDto> {
		const includeDate = typeof sentence.anonymousUUID === 'string';

		return this.prisma.sentence.create({
			data: {
				createdAt: includeDate ? new Date() : null,
				...sentence
			}
		});
	}

	async delete(uuid: string) {
		await this.prisma.sentence.delete({where: {uuid}});
	}
}
