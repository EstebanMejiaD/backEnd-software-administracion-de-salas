import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";




    console.log("Si la consola al generar  o correr las migraciones te dice que no hay cambios en la base de datos debes correr por un momento el servidor para que la carpeta dist esté actualizada, si ya lo hiciste y todo salió bien, haz caso omiso a éste mensaje. ")

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