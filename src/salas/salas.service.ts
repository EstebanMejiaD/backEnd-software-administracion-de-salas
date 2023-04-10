import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sala } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SalasService {

  constructor(

    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>
  ) {}

  async createSala(createSalaDto: CreateSalaDto) {
    try {

      const nuevaSala = this.salasRepository.create(createSalaDto)

      await this.salasRepository.save(nuevaSala)

      return nuevaSala;
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

 async  obtenerSalas() {
    return await this.salasRepository.find();
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
