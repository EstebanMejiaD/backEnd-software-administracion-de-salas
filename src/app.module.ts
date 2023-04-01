import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {} from 'typeorm'
import { dataSourceConfig } from './config/data.source';
import {ConfigModule} from '@nestjs/config'
import { EnvConfiguration } from './config/env.config';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dataSourceConfig
    }),
    UsuariosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log(EnvConfiguration().portdb)
    console.log(dataSourceConfig)
  }
}
