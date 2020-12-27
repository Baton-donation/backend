import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {Sentence} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
import * as delay from 'delay';
import {PrismaService} from 'src/prisma/prisma.service';
import {AppModule} from 'src/app.module';
import {decompressNDJSON} from './helpers/gzip';

const generateSampleSentences = (count: number): Sentence[] => Array.from(new Array(count).keys()).map(n => ({
	uuid: uuidv4(),
	createdAt: new Date(),
	content: `This is the ${n} sentence.`
}));

describe('Downloads', () => {
	let app: INestApplication;

	const prismaService = {
		sentence: {
			count: jest.fn(),
			findMany: jest.fn()
		}
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule
			]
		})
			.overrideProvider(PrismaService)
			.useValue(prismaService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it('create download and fetch', async () => {
		// Create download
		const sentences = generateSampleSentences(20);

		prismaService.sentence.count.mockReturnValue(Promise.resolve(sentences.length));

		prismaService.sentence.findMany.mockReturnValueOnce(Promise.resolve(sentences.slice(0, sentences.length / 2)));
		prismaService.sentence.findMany.mockReturnValueOnce(Promise.resolve(sentences.slice(sentences.length / 2)));

		const {body: {id}} = await request(app.getHttpServer())
			.post('/downloads');

		// Wait for download to be processed
		await delay(15000);

		const baseFindManyOptions = {
			orderBy: {
				createdAt: 'desc'
			},
			take: 10
		};

		expect(prismaService.sentence.findMany).toHaveBeenNthCalledWith(1, {...baseFindManyOptions, skip: 0});
		expect(prismaService.sentence.findMany).toHaveBeenNthCalledWith(2, {...baseFindManyOptions, skip: 10});

		// Fetch finished download
		const inFlightRequest = request(app.getHttpServer())
			.get(`/downloads/${id as string}`);

		const data = await decompressNDJSON<Sentence>(inFlightRequest);

		// Stringify dates and check received data
		expect(data).toEqual(JSON.parse(JSON.stringify(sentences)));
	});

	afterAll(async () => {
		await app.close();
	});
});
