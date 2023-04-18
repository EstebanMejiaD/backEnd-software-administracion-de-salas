import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


// En este archivo debes escribir tus variables de entorno respectivos para cada campo

    console.log("soy un puerto: ", process.env.DBPORT)

export const dataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: '', // aqui!
    port: 5432, // aqui!
    username: '', // aqui!
    password: '', // aqui!
    database: '', // aqui!
    // entities: ["./src/**/*.entity.ts"],
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsTableName: "migrations",
    migrations: ["./migrations/*.ts"],
    namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(dataSourceConfig)