import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva, Sala, TipoReserva } from 'src/entities';
import { TipoReservaModule } from 'src/tipo-reserva/tipo-reserva.module';
import { SalasModule } from 'src/salas/salas.module';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService],
  imports: [TypeOrmModule.forFeature([
    Reserva,
    TipoReserva,
    Sala
  ]) ,UsuariosModule, TipoReservaModule, SalasModule]
})
export class ReservasModule {}
