import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {} from 'typeorm'
import { dataSourceConfig } from './config/data.source';
import {ConfigModule} from '@nestjs/config'
import { EnvConfiguration } from './config/env.config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TipoDocuentoModule } from './tipo_docuento/tipo_docuento.module';
import { SalasModule } from './salas/salas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dataSourceConfig
    }),
    UsuariosModule,
    TipoDocuentoModule,
    SalasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
