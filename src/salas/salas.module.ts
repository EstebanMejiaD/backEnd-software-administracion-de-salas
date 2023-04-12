import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalasService } from './salas.service';
import { SalasController } from './salas.controller';
import { Sala, Usuario } from 'src/entities';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [SalasController],
  providers: [SalasService],
  imports: [
    TypeOrmModule.forFeature([
      Sala,
      Usuario
    ]),
    UsuariosModule
  ]
})
export class SalasModule {}
