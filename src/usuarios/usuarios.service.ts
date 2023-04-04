import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { TipoDocuento } from 'src/entities';

@Injectable()
export class UsuariosService {



  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(TipoDocuento)
    private readonly tipoDocumentoRepository: Repository<TipoDocuento>
  ) {}


  async create(createUsuarioDto: CreateUsuarioDto) {
    
      const id = createUsuarioDto.tipoDocumento


      const tipoDocumento = await this.tipoDocumentoRepository.findOne( { where: {id} })

      if (tipoDocumento) {
          
        const newUsuario = this.usuarioRepository.create(createUsuarioDto)

        newUsuario.tipoDocumento = tipoDocumento

        await this.usuarioRepository.save(newUsuario)
        return newUsuario
      }
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
}
