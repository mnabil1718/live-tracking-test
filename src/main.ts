import { NestFactory } from '@nestjs/core';
import { AppModule } from './Interfaces/http/app.module';
import { setupApp } from './Infrastructures/http/setup-app';

async function bootstrap(): Promise<void> {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.listen(port);
  console.log(`server listening on localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
