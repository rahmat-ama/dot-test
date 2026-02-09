import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import request from 'supertest';

describe('Categories Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdCategoryId: number;

  // dummy data for test
  const createCategoryDto = {
    name: 'Technology',
    description: 'All about technology and innovation',
  };

  const updateCategoryDto = {
    name: 'Tech & Innovation',
    description: 'Updated description about technology',
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
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST api/categories', () => {
    it('should create a category successfully', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send(createCategoryDto)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.description).toBe(createCategoryDto.description);
          expect(res.body).toHaveProperty('createdAt');

          // save the created category id for further tests
          createdCategoryId = res.body.id as number;
        });
    });

    it('should throw 400 if validation fails (empty name)', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({ ...createCategoryDto, name: '' })
        .expect(400);
    });

    it('should throw 400 if validation fails (empty description)', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({ ...createCategoryDto, description: '' })
        .expect(400);
    });

    it('should throw 400 if validation fails (missing fields)', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({})
        .expect(400);
    });
  });

  describe('GET api/categories', () => {
    it('should return all categories', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('description');
        });
    });
  });

  describe('GET api/categories/:id', () => {
    it('should return a category by id', () => {
      return request(app.getHttpServer())
        .get(`/categories/${createdCategoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdCategoryId);
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.description).toBe(createCategoryDto.description);
        });
    });

    it('should throw 404 if category not found', () => {
      return request(app.getHttpServer()).get('/categories/999999').expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .get('/categories/invalid-id')
        .expect(400);
    });
  });

  describe('PUT api/categories/:id', () => {
    it('should update a category successfully', () => {
      return request(app.getHttpServer())
        .put(`/categories/${createdCategoryId}`)
        .send(updateCategoryDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdCategoryId);
          expect(res.body.name).toBe(updateCategoryDto.name);
          expect(res.body.description).toBe(updateCategoryDto.description);
        });
    });

    it('should update category with partial data (only name)', () => {
      return request(app.getHttpServer())
        .put(`/categories/${createdCategoryId}`)
        .send({ name: 'Partial Update' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Partial Update');
        });
    });

    it('should throw 404 if category not found', () => {
      return request(app.getHttpServer())
        .put('/categories/999999')
        .send(updateCategoryDto)
        .expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .put('/categories/invalid-id')
        .send(updateCategoryDto)
        .expect(400);
    });
  });

  describe('DELETE api/categories/:id', () => {
    it('should throw 404 if category not found', () => {
      return request(app.getHttpServer())
        .delete('/categories/999999')
        .expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .delete('/categories/invalid-id')
        .expect(400);
    });

    it('should delete a category successfully', () => {
      return request(app.getHttpServer())
        .delete(`/categories/${createdCategoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Category deleted successfully');
        });
    });

    it('should verify category is deleted', () => {
      return request(app.getHttpServer())
        .get(`/categories/${createdCategoryId}`)
        .expect(404);
    });
  });
});
