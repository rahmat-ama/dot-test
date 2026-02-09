import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import request from 'supertest';

describe('Posts Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let userId: number | null;
  let categoryId: number;
  let createdPostId: number;

  // dummy data for test
  const userDto = {
    email: 'posttest@gmail.com',
    password: 'testpassword',
    name: 'Post Test User',
  };

  const categoryDto = {
    name: 'Technology',
    description: 'All about technology and innovation',
  };

  const createPostDto = {
    title: 'Introduction to NestJS',
    authorId: 0, // will be set after user creation
    categoryId: 0, // will be set after category creation
    content:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
  };

  const updatePostDto = {
    title: 'Advanced NestJS Guide',
    content:
      'Updated content about advanced NestJS patterns and best practices.',
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
    await prisma.post.deleteMany(); // delete relations
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // create user and get jwt token
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userDto);

    jwtToken = signupResponse.body.token as string;

    // get user id
    const user = await prisma.user.findUnique({
      where: { email: userDto.email },
    });
    userId = user.id;

    // create category
    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(categoryDto);

    categoryId = categoryResponse.body.id as number;

    // set id in dto with new id
    createPostDto.authorId = userId;
    createPostDto.categoryId = categoryId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /posts', () => {
    it('should throw 401 if no JWT token provided', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(401);
    });

    it('should create a post successfully with valid JWT token', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createPostDto)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createPostDto.title);
          expect(res.body.content).toBe(createPostDto.content);
          expect(res.body).toHaveProperty('author');
          expect(res.body.author.id).toBe(userId);
          expect(res.body.author).toHaveProperty('name');
          expect(res.body).toHaveProperty('category');
          expect(res.body.category.id).toBe(categoryId);
          expect(res.body.category).toHaveProperty('name');
          expect(res.body).toHaveProperty('createdAt');

          // save the created post id for further tests
          createdPostId = res.body.id as number;
        });
    });

    it('should throw 400 if validation fails (empty title)', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ ...createPostDto, title: '' })
        .expect(400);
    });

    it('should throw 400 if validation fails (empty content)', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ ...createPostDto, content: '' })
        .expect(400);
    });

    it('should throw 400 if validation fails (missing authorId)', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: createPostDto.title,
          categoryId: createPostDto.categoryId,
          content: createPostDto.content,
        })
        .expect(400);
    });

    it('should throw 400 if validation fails (missing categoryId)', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: createPostDto.title,
          authorId: createPostDto.authorId,
          content: createPostDto.content,
        })
        .expect(400);
    });

    it('should throw error if authorId does not exist', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          ...createPostDto,
          authorId: 999999,
        })
        .expect(400);
    });

    it('should throw error if categoryId does not exist', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          ...createPostDto,
          categoryId: 999999,
        })
        .expect(400);
    });
  });

  describe('GET /posts', () => {
    it('should throw 401 if no JWT token provided', () => {
      return request(app.getHttpServer()).get('/posts').expect(401);
    });

    it('should return all posts with valid JWT token', () => {
      return request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('title');
          expect(res.body[0]).toHaveProperty('content');
          expect(res.body[0]).toHaveProperty('author');
          expect(res.body[0]).toHaveProperty('category');
        });
    });
  });

  describe('GET /posts/:id', () => {
    it('should throw 401 if no JWT token provided', () => {
      return request(app.getHttpServer())
        .get(`/posts/${createdPostId}`)
        .expect(401);
    });

    it('should return a post by id with valid JWT token', () => {
      return request(app.getHttpServer())
        .get(`/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdPostId);
          expect(res.body.title).toBe(createPostDto.title);
          expect(res.body.content).toBe(createPostDto.content);
          expect(res.body.author.id).toBe(userId);
          expect(res.body.category.id).toBe(categoryId);
        });
    });

    it('should throw 404 if post not found', () => {
      return request(app.getHttpServer())
        .get('/posts/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .get('/posts/invalid-id')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    });
  });

  describe('PUT /posts/:id', () => {
    it('should throw 401 if no JWT token provided', () => {
      return request(app.getHttpServer())
        .put(`/posts/${createdPostId}`)
        .send(updatePostDto)
        .expect(401);
    });

    it('should update a post successfully with valid JWT token', () => {
      return request(app.getHttpServer())
        .put(`/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatePostDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdPostId);
          expect(res.body.title).toBe(updatePostDto.title);
          expect(res.body.content).toBe(updatePostDto.content);
        });
    });

    it('should update post with partial data (only title)', () => {
      return request(app.getHttpServer())
        .put(`/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Partial Update Title' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Partial Update Title');
        });
    });

    it('should throw 404 if post not found', () => {
      return request(app.getHttpServer())
        .put('/posts/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatePostDto)
        .expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .put('/posts/invalid-id')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatePostDto)
        .expect(400);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should throw 401 if no JWT token provided', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${createdPostId}`)
        .expect(401);
    });

    it('should throw 404 if post not found', () => {
      return request(app.getHttpServer())
        .delete('/posts/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should throw 400 if id is not a number', () => {
      return request(app.getHttpServer())
        .delete('/posts/invalid-id')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    });

    it('should delete a post successfully with valid JWT token', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Post deleted successfully');
        });
    });

    it('should verify post is deleted', () => {
      return request(app.getHttpServer())
        .get(`/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});
