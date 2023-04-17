import {DataSourceOptions, DataSource} from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import {EnvConfiguration} from '../config/env.config'
import * as entities from '../entities'

console.log(process.env.PORT_DB)


export const dataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    database: EnvConfiguration().namedb,
    port: EnvConfiguration().portdb,
    // solucionar el problema de las variables de entorno: no deja poner el username_db ni password_db
    username: 'postgres',
    password: 'ADMIN12345',
    host: EnvConfiguration().hostdb, 
    // entities: [__dirname + '/../../../src/entities/*.entity{.ts, .js}'],
    entities: Object.values(entities),
    migrations: [__dirname + '/../../migrations/*{.ts, .js}'],
    synchronize: true,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(dataSourceConfig)