import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from 'configs/swagger.config';
import { globalConfig } from 'configs/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  globalConfig(app);
  swaggerConfig(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
