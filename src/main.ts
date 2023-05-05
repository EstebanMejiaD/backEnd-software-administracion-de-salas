import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors'


async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.use(cors())
  const configService = app.get(ConfigService)

  
  app.setGlobalPrefix('api/v1/sads')
  
  
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //Esta parte del codigo habilita la conversion implicita de tipos de datos
      transformOptions: {
      enableImplicitConversion: true
      }
    })
    )
    
    await app.listen(+configService.get('PORT_SERVER'));
    console.log("Server corriendo en el puerto: "+configService.get('PORT_SERVER'))
    
}
bootstrap();
