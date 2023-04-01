import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {


  constructor(

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {}


  async create(createUsuarioDto: CreateUsuarioDto) {
    

    try {
        const nuevoUsuario = this.usuarioRepository.create(createUsuarioDto)

        await this.usuarioRepository.save(nuevoUsuario)

          return nuevoUsuario
    } catch (error) {
      console.log(error)
    }

  }

  findAll() {
    return `This action returns all usuarios`;
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
