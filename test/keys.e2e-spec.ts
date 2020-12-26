import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from 'src/app.module';
import {INestApplication} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {ConfigService} from 'src/config/config.service';

describe('Keys', () => {
	let app: INestApplication;
	const configService = {
		env: {
			PUBLIC_KEY: 'sample-public-key'
		}
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		})
			.overrideProvider(ConfigService)
			.useValue(configService)
			.overrideProvider(PrismaService)
			.useValue({})
			.compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it('/GET public', async () => {
		await request(app.getHttpServer())
			.get('/keys/public')
			.expect(200, configService.env.PUBLIC_KEY);
	});

	afterAll(async () => {
		await app.close();
	});
});
