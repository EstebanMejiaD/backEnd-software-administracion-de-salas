import { Module } from '@nestjs/common';
import { TipoReservaService } from './tipo-reserva.service';
import { TipoReservaController } from './tipo-reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoReserva } from 'src/entities';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [TipoReservaController],
  providers: [TipoReservaService],
  imports: [TypeOrmModule.forFeature([TipoReserva]), UsuariosModule],
  exports: [TipoReservaService, TypeOrmModule]
})
export class TipoReservaModule {}
