import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";




    console.log("soy un puerto: ", process.env.DBPORT)

export const dataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'ADMIN12345',
    database: 'sads_db',
    // entities: ["./src/**/*.entity.ts"],
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsTableName: "migrations",
    migrations: ["./migrations/*.ts"],
    namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(dataSourceConfig)