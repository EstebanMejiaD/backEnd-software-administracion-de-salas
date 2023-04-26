import { Module } from '@nestjs/common';
import { TipoDocuentoService } from './tipo_docuento.service';
import { TipoDocuentoController } from './tipo_docuento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocuento } from 'src/entities';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [TipoDocuentoController],
  providers: [TipoDocuentoService],
  imports: [TypeOrmModule.forFeature([
    TipoDocuento
  ]), UsuariosModule],
  exports: [
    TipoDocuentoService,
    TypeOrmModule,
  ]
})
export class TipoDocuentoModule {}
