import { Module } from '@nestjs/common';
import { TipoSalasService } from './tipo-salas.service';
import { TipoSalasController } from './tipo-salas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSala } from 'src/entities';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [TipoSalasController],
  providers: [TipoSalasService],
  imports: [TypeOrmModule.forFeature([TipoSala]),
        UsuariosModule
    ]

})
export class TipoSalasModule {}
