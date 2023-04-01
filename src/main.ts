import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1/sads')

 

  await app.listen(+process.env.PORT_SERVER);
  console.log('Server running on port: '+process.env.PORT_SERVER)
}
bootstrap();
