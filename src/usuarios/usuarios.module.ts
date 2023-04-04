import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from '../entities/usuario.entity';
import { TipoDocuento } from 'src/entities';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      TipoDocuento
    ])
  ]
})
export class UsuariosModule {}
