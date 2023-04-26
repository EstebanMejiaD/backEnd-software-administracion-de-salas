import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TipoDocuentoModule } from 'src/tipo_docuento/tipo_docuento.module';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TipoDocuentoModule,
    ConfigModule,
    UsuariosModule
  ]
})
export class SeedModule {}
