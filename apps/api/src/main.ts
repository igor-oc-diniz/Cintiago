import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { default as cookieParser } from 'cookie-parser';
import { parseCorsOrigins } from './common/cors-origins.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: parseCorsOrigins(process.env.CORS_ORIGINS),
    credentials: true, // required because of the httpOnly cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
