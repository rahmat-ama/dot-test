import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResopnseInterceptor } from './common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add api to global route
  app.setGlobalPrefix('api');

  // for Dto use
  app.useGlobalPipes(new ValidationPipe());

  // make reflector instance
  const reflector = app.get(Reflector);

  // use reflector on global interceptor
  app.useGlobalInterceptors(new TransformResopnseInterceptor(reflector));

  // error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // config documentation / Swagger
  const config = new DocumentBuilder()
    .setTitle('App API')
    .setDescription('API Documentation for Backend App')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Input JWT Token',
        in: 'header',
      },
      'token',
    )
    .build();

  // create documentation
  const docFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, docFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
