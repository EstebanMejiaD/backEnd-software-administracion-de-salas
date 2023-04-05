import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {JwtService} from '@nestjs/jwt'

import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { TipoDocuento } from 'src/entities';
import { LoginUsuarioDto,  CreateUsuarioDto} from './dto';

import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsuariosService {

  constructor(

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(TipoDocuento)
    private readonly tipoDocumentoRepository: Repository<TipoDocuento>,

    private readonly jwtService: JwtService,

  ) {}


  // esta es la funcion de servicio para poder crear usuarios de tipo Estudiante
  async create(createUsuarioDto: CreateUsuarioDto) {
    
     try {
      const id = createUsuarioDto.tipoDocumento


      const tipoDocumento = await this.tipoDocumentoRepository.findOne( { where: {id} })

      if (tipoDocumento) {
        const { contraseña, ...userData } = createUsuarioDto
          

        const newUsuario = this.usuarioRepository.create({
          ...userData,
          contraseña: bcrypt.hashSync( contraseña, 10)
        })

        newUsuario.tipoDocumento = tipoDocumento

        await this.usuarioRepository.save(newUsuario)

        delete newUsuario.contraseña
        return {
          ...newUsuario,
          token: this.getJwtToken({ id: newUsuario.id})
        }
        //TODO: RETORNAR EL JWT DE ACCESO
      }
     } catch (error) {
      this.handleDBErrors(error)
     }
  }
  // esta es la funcion de servicio para poder loguear usuarios de todo tipo
  async login( loginUsuarioDto: LoginUsuarioDto ) {
    
    const { contraseña, email } = loginUsuarioDto

    const usuario = await this.usuarioRepository.findOne({ 
      where: {email},
      select: {email: true, contraseña: true, id: true}
    })

    if(!usuario) 
      throw new UnauthorizedException('El email no es valido')
    


    if (!bcrypt.compareSync( contraseña, usuario.contraseña )) 
      throw new UnauthorizedException('La contraseña no es valida')
        

    return {
      ...usuario,
      token: this.getJwtToken( {id: usuario.id })
    }
    //TODO RETORNAR EL JWT
  }



  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  // funcion de servicio para generar el token de acceso
  private getJwtToken ( payload: JwtPayload ){

    const token = this.jwtService.sign( payload )
    return token
  }


  private handleDBErrors( error: any ): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }
}
