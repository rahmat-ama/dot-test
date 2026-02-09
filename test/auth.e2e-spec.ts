import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import request from 'supertest';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // dummy data for test
  const dto = {
    email: 'test@gmail.com',
    password: 'testpassword',
    name: 'Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // used for Dto validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    // clean up database first
    prisma = app.get(PrismaService);
    await prisma.post.deleteMany(); // relation delete
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST api/auth/signup', () => {
    it('should signup successfully and return token', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('token');
          expect(typeof res.body.token).toBe('string');
        });
    });

    it('should throw 409 if email already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toEqual(
            'User with this email already exist',
          );
        });
    });

    it('should throw 400 if validation fails (empty email)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...dto, email: '' })
        .expect(400);
    });
  });

  describe('POST /auth/signin', () => {
    it('should signin successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: dto.email,
          password: dto.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should throw 403 if password incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: dto.email,
          password: 'wrongpassword',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toEqual('Incorrect credentials');
        });
    });

    it('should throw 403 if user does not exist', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'ghost@gmail.com',
          password: 'password',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toEqual('User does not exist');
        });
    });
  });
});
