import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Badge Platform API')
    .setDescription(
      `
      API documentation for the Badge Platform.
      This platform allows organizations to issue and manage digital badges/certificates
      that conform to the Open Badges standard.
    `,
    )
    .setVersion('1.0')
    .addTag('Badges', 'Badge management endpoints')
    .addTag('Organizations', 'Organization management endpoints')
    .addBearerAuth()
    .setContact(
      'API Support',
      'https://your-support-url.com',
      'support@your-domain.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Badge Platform API Documentation',
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
