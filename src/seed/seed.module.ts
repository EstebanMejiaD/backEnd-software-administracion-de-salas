import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TipoDocuentoModule } from 'src/tipo_docuento/tipo_docuento.module';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { TipoSalasModule } from 'src/tipo-salas/tipo-salas.module';
import { TipoReservaModule } from 'src/tipo-reserva/tipo-reserva.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TipoDocuentoModule,
    ConfigModule,
    UsuariosModule,
    TipoSalasModule,
    TipoReservaModule,
  ]
})
export class SeedModule {}
