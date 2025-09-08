import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options: SwaggerDocumentOptions = {};
  const config = new DocumentBuilder()
    .setTitle('Live Tracking API')
    .setDescription('Live tracking & geo-fencing API with nestJS & SocketIO')
    .setVersion('1.0')
    .addTag('live-tracking')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);
}
