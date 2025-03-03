import { isNil } from 'lodash';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Velectro API')
    .setDescription('API for the Velectro team manager application')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token in the format: Bearer <token>',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (!isNil(document?.components?.schemas)) {
    document.components.schemas = Object.keys(document?.components?.schemas)
      .sort()
      .reduce((sortedSchemas, key) => {
        if (!isNil(document?.components?.schemas)) {
          sortedSchemas[key] = document.components.schemas[key];
        }

        return sortedSchemas;
      }, {});
  }

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
