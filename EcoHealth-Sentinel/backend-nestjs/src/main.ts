import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create NestJS app with CORS enabled
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws error if unknown field is sent
      transform: true, // auto-transform DTOs to class instances
    }),
  );

  // Get config and dynamic port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  // Start server
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
