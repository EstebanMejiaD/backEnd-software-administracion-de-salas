import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { UsuariosModule } from './usuarios/usuarios.module';
import { TipoDocuentoModule } from './tipo_docuento/tipo_docuento.module';
import { SalasModule } from './salas/salas.module';
import { TipoSalasModule } from './tipo-salas/tipo-salas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST_DB'),
        port: +configService.get('PORT_DB'),
        username: configService.get('USERNAME_DB'),
        password: configService.get('PASSWORD_DB'),
        database: configService.get('NAME_DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrationsRun: true,
        migrationsTableName: 'migrations',
        migrations: ['/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/migrations',
        },
        logging: false,
        namingStrategy: new SnakeNamingStrategy(),
        keepConnectionAlive: true,
        autoLoadEntities: true,
        export: true
      }),
      
    }),
    UsuariosModule,
    TipoDocuentoModule,
    SalasModule,
    TipoSalasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
