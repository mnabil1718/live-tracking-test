/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/Interfaces/http/app.module';
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';
import { UsersTableTestHelper } from 'test/helpers/UsersTableTestHelper';
import { setupApp } from 'src/Infrastructures/http/setup-app';

describe('/users endpoint (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let usersTableHelper: ReturnType<typeof UsersTableTestHelper>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    usersTableHelper = UsersTableTestHelper(prisma);
  });

  afterEach(async () => {
    await usersTableHelper.cleanTable();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  describe('POST /users', () => {
    it('should respond 201 and persist user', async () => {
      const payload = {
        username: 'dicoding',
        password: 'secretpassword',
        fullname: 'Dicoding Indonesia',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should respond 400 when request payload not contain needed property', async () => {
      const payload = {
        fullname: 'Dicoding Indonesia',
        password: 'secretpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should respond 400 when request payload not meet data type specification', async () => {
      const payload = {
        username: 'dicoding',
        password: 'secretpassword',
        fullname: ['Dicoding Indonesia'],
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toEqual(['fullname must be a string']);
    });

    it('should respond 400 when username more than 50 characters', async () => {
      const payload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secretpassword',
        fullname: 'Dicoding Indonesia',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      );
    });

    it('should respond 400 when username contain restricted character', async () => {
      const payload = {
        username: 'dicoding indonesia',
        password: 'secretpassword',
        fullname: 'Dicoding Indonesia',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      );
    });

    it('should respond 400 when username unavailable', async () => {
      await usersTableHelper.addUser({ username: 'dicoding' });

      const payload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('username tidak tersedia');
    });
  });
});
