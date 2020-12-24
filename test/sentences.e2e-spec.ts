import * as request from 'supertest';
import {v4 as uuidv4} from 'uuid'
import { Test } from '@nestjs/testing';
import {AppModule} from 'src/app.module'
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

describe('Sentences', () => {
  let app: INestApplication;
  let prismaService = {
    sentence: {
      create: (payload: any) => Promise.resolve(payload.data),
      delete: () => Promise.resolve()
    }
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST sentences', async () => {
    const payload = {uuid: uuidv4(), content: 'A sample sentence'};

    const spy = jest.spyOn(prismaService.sentence, 'create');

    await request(app.getHttpServer())
      .post('/sentences')
      .send(payload)
      .expect(201, payload)

    expect(spy).toHaveBeenCalledWith({data: payload});
  });

  it('/DELETE sentences', async () => {
    const uuid = uuidv4();

    const spy = jest.spyOn(prismaService.sentence, 'delete');

    await request(app.getHttpServer())
      .delete(`/sentences/${uuid}`)
      .expect(200);

    expect(spy).toHaveBeenCalledWith({where: {uuid}});
  })

  afterAll(async () => {
    await app.close();
  });
});
