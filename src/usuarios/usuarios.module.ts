import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from '../entities/usuario.entity';
import { TipoDocuento } from 'src/entities';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, TipoDocuento]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('jwt ', configService.get('JWT_SECRET'))
        // console.log('jwt PROCESS ',process.env.JWT_SECRET)
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '3d'
    //   }
    // })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class UsuariosModule {}
