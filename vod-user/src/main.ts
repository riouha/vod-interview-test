import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './lib/filters/http-exception.filter';
import { ValidationExceptionFactory, ValidationExceptionFilter } from './lib/filters/validation.filter';
import { SuccessResponseInterceptor } from './lib/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new ValidationExceptionFilter(), new CustomExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  //#region swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentaion')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  //#endregion

  const port = app.get<ConfigService>(ConfigService).get('app.port');
  // eslint-disable-next-line no-console
  await app.listen(port, () => console.log(`Listening on port ${port} ..............................`));
}
bootstrap();
