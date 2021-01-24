import * as request from 'supertest';
import {v4 as uuidv4} from 'uuid';
import {Test} from '@nestjs/testing';
import {AppModule} from 'src/app.module';
import {INestApplication} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';

describe('Sentences', () => {
	let app: INestApplication;
	const prismaService = {
		sentence: {
			create: jest.fn(),
			delete: jest.fn()
		}
	};

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

	it('/POST sentences', async () => {
		const payload = {uuid: uuidv4(), content: 'A sample sentence', createdAt: null};

		const spy = jest.spyOn(prismaService.sentence, 'create');
		prismaService.sentence.create.mockResolvedValue(payload);

		await request(app.getHttpServer())
			.post('/sentences')
			.send(payload)
			.expect(201, payload);

		expect(spy).toHaveBeenCalledWith({data: payload});
	});

	it('/POST multiple sentences', async () => {
		const payload = [
			{uuid: uuidv4(), content: 'A sample sentence', createdAt: null},
			{uuid: uuidv4(), content: 'Another sample sentence', createdAt: null}
		];

		const spy = jest.spyOn(prismaService.sentence, 'create');
		prismaService.sentence.create.mockImplementation(async (data: {data: Record<string, unknown>}) => Promise.resolve(data.data));

		await request(app.getHttpServer())
			.post('/sentences/many')
			.send(payload)
			.expect(201, payload);

		expect(spy).toHaveBeenCalledTimes(payload.length);
	});

	it('/POST sentences with anonymous UUID', async () => {
		const payload = {uuid: uuidv4(), content: 'A sample sentence', anonymousUUID: uuidv4()};

		const now = new Date();

		const spy = jest.spyOn(prismaService.sentence, 'create');
		prismaService.sentence.create.mockImplementation(async (data: {data: any}) => {
			if (data.data.createdAt) {
				return {...data.data, createdAt: now};
			}

			return data.data;
		});

		await request(app.getHttpServer())
			.post('/sentences')
			.send(payload)
			.expect(201, {createdAt: now.toISOString(), ...payload});

		// Check if service added createdAt property
		expect(Object.prototype.hasOwnProperty.call(spy.mock.calls[0][0].data, 'createdAt')).toEqual(true);
	});

	it('/DELETE sentences', async () => {
		const uuid = uuidv4();

		const spy = jest.spyOn(prismaService.sentence, 'delete');

		await request(app.getHttpServer())
			.delete(`/sentences/${uuid}`)
			.expect(200);

		expect(spy).toHaveBeenCalledWith({where: {uuid}});
	});

	afterEach(() => {
		prismaService.sentence.create.mockClear();
		prismaService.sentence.delete.mockClear();
	});

	afterAll(async () => {
		await app.close();
	});
});
