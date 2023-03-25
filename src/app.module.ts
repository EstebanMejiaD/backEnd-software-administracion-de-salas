import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {} from 'typeorm'
import { dataSourceConfig } from './config/data.source';
import {ConfigModule} from '@nestjs/config'
import { EnvConfiguration } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration]
    })
    ,

    TypeOrmModule.forRoot({
      ...dataSourceConfig
    })

    

  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log(EnvConfiguration().portdb)
  }
}
