import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from 'src/app.module';
import {INestApplication} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';

const AUTH_TOKEN = 'sample-token';

process.env.AUTH_TOKEN = AUTH_TOKEN;

const prismaService = {
	unlockCode: {
		create: jest.fn(),
		findFirst: jest.fn()
	}
};

describe('Unlock codes', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		})
			.overrideProvider(PrismaService)
			.useValue(prismaService)
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it('/POST', async () => {
		await request(app.getHttpServer())
			.post('/codes')
			.set('authorization', `Bearer ${AUTH_TOKEN}`)
			.expect(201);

		expect(prismaService.unlockCode.create.mock.calls[0][0]).toEqual({
			data: {
				code: expect.any(String)
			}
		});
	});

	it('/GET (unauthorized)', async () => {
		const code = '000000';

		prismaService.unlockCode.findFirst.mockResolvedValue(null);

		await request(app.getHttpServer())
			.get(`/codes/validate/${code}`)
			.expect(401);
	});

	it('/GET (authorized)', async () => {
		const code = '000000';

		prismaService.unlockCode.findFirst.mockResolvedValue({code, createdAt: new Date()});

		await request(app.getHttpServer())
			.get(`/codes/validate/${code}`)
			.expect(200, {});
	});

	afterEach(() => {
		// Reset mocks
		prismaService.unlockCode.create.mockReset();
		prismaService.unlockCode.findFirst.mockReset();
	});

	afterAll(async () => {
		await app.close();
	});
});
