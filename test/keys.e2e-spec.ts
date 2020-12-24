import * as request from 'supertest';
import {v4 as uuidv4} from 'uuid'
import { Test } from '@nestjs/testing';
import {AppModule} from 'src/app.module'
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from 'src/config/config.service';

describe('Keys', () => {
  let app: INestApplication;
  let configService = {
    env: {
      PUBLIC_KEY: 'sample-public-key'
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET public', async () => {
    await request(app.getHttpServer())
      .get('/keys/public')
      .expect(200, configService.env.PUBLIC_KEY)
  });

  afterAll(async () => {
    await app.close();
  });
});
