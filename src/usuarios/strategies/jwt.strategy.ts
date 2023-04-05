import {PassportStrategy} from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Usuario } from 'src/entities';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';

// Esta es la estrategia de validacion de Jwt 

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor (
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,

        configService: ConfigService
    ) {
        
       super({
        secretOrKey: configService.get('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
       })
    }

    async validate ( payload: JwtPayload ): Promise<Usuario>  {

        const { id } = payload

        const usuario = await this.usuarioRepository.findOneBy({ id })

        if (!usuario) throw new UnauthorizedException('Token no válido')

        if (!usuario.estado) throw new UnauthorizedException('El usuario no está activo, contacta con administrador para solucionar')


        
        return usuario;
    }

}
