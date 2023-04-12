import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sala, Usuario } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SalasService {

  constructor(
    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    
  ) {}

  // necesitas crear salas con usuario relacionado, el que la creó
  async createSala(createSalaDto: CreateSalaDto, usuario: Usuario) {
    try {
        console.log(usuario)
   
      const nuevaSala = this.salasRepository.create(createSalaDto)

      await this.salasRepository.save(nuevaSala)

      return nuevaSala;
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  // necesitas retornar unicamente las salas que esten en estado true
  // las que estan en false no estan disponibles
   async obtenerSalas() {
      return await this.salasRepository.find()
  }

  async findOne(id: string) {
    
   
      const sala = await this.salasRepository.findOneBy({id})

      if (!sala)
        throw new NotFoundException('La sala que estas buscando, no está disponible')

      if (sala.estado === false)
      throw new NotFoundException('La sala que estas buscando, no está disponible')

    return sala
  }

  update(id: number, updateSalaDto: UpdateSalaDto) {
    return `This action updates a #${id} sala`;
  }

  remove(id: number) {
    return `This action removes a #${id} sala`;
  }

  private handleDBErrors( error: any ): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }
}
