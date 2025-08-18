import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CommandFactory } from 'nest-commander';


declare global {
  interface Date {
    addHours: (h: number) => Date;
  }
}

Date.prototype.addHours = function (h: number) {
  this.setHours(this.getHours() + h);
  return this;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: 422,
      validationError: { target: true, value: true },
      enableDebugMessages: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce((acc, err) => {
          const constraints = Object.values(err.constraints || {});
          if (constraints.length > 0) {
            acc[err.property] = constraints;
          }
          return acc;
        }, {});

        return new UnprocessableEntityException({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message : 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
  .setTitle('IrisViva API')
  .setDescription('IrisViva API Documentation')
  .setVersion('1.0')
  .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.APP_PORT ?? 3010);
}
bootstrap();
