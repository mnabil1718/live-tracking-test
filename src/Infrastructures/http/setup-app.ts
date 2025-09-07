import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CatchEverythingFilter } from './exception.filter';

export function setupApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
}
