import {DataSourceOptions, DataSource} from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import {EnvConfiguration} from '../config/env.config'



export const dataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: EnvConfiguration().hostdb, 
    port: EnvConfiguration().portdb,
    // solucionar el problema de las variables de entorno: no deja poner el username_db ni password_db
    username: 'postgres',
    password: 'ADMIN12345',
    database: EnvConfiguration().namedb,
    entities: [__dirname + '/../**/**/*.entity{.ts, .js}'],
    migrations: [__dirname + '/../../migrations/*{.ts, .js}'],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(dataSourceConfig)