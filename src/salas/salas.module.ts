import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalasService } from './salas.service';
import { SalasController } from './salas.controller';
import { Sala } from 'src/entities';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [SalasController],
  providers: [SalasService],
  imports: [
    TypeOrmModule.forFeature([
      Sala
    ]),
    UsuariosModule
  ]
})
export class SalasModule {}
