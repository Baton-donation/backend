import * as request from 'supertest';
import {v4 as uuidv4} from 'uuid';
import {Test} from '@nestjs/testing';
import {AppModule} from 'src/app.module';
import {INestApplication} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';

describe('User Details', () => {
	let app: INestApplication;
	const prismaService = {
		userDetails: {
			create: async (payload: any) => Promise.resolve(payload.data),
			delete: async () => Promise.resolve(),
			findMany: jest.fn()
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

	it('/POST user details', async () => {
		const payload = {
			uuid: uuidv4(),
			encryptedData: ''
		};

		const spy = jest.spyOn(prismaService.userDetails, 'create');

		await request(app.getHttpServer())
			.post('/user-details')
			.send(payload)
			.expect(201, payload);

		expect(spy).toHaveBeenCalledWith({data: payload});
	});

	it('/GET user details', async () => {
		const models = [{
			uuid: uuidv4(),
			encryptedData: ''
		}];

		prismaService.userDetails.findMany.mockResolvedValue(models);

		await request(app.getHttpServer())
			.get('/user-details')
			.expect(200, models);
	});

	it('/DELETE user details', async () => {
		const uuid = uuidv4();

		const spy = jest.spyOn(prismaService.userDetails, 'delete');

		await request(app.getHttpServer())
			.delete(`/user-details/${uuid}`)
			.expect(200);

		expect(spy).toHaveBeenCalledWith({where: {uuid}});
	});

	afterAll(async () => {
		await app.close();
	});
});
