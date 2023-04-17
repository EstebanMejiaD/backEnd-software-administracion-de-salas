import { Injectable } from '@nestjs/common';
import { CreateTipoSalaDto } from './dto/create-tipo-sala.dto';
import { UpdateTipoSalaDto } from './dto/update-tipo-sala.dto';
import { TipoSala, Usuario } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoSalasService {


  constructor(

    @InjectRepository(TipoSala)
    private readonly tipoSalaRepository: Repository<TipoSala>
  ) {}

// Está lista la creacion de  tipo de sala con usuario relaiconado
  async  create(createTipoSalaDto: CreateTipoSalaDto, user: Usuario) {

    const { usuario, ...resData} = createTipoSalaDto

    const nuevoTipoSala = this.tipoSalaRepository.create({
      ...resData,
      usuario: user
    })

      await this.tipoSalaRepository.save(nuevoTipoSala)

      return {nuevoTipoSala}
    
  }

  findAll() {
    return `This action returns all tipoSalas`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tipoSala`;
  }

  update(id: string, updateTipoSalaDto: UpdateTipoSalaDto) {
    return `This action updates a #${id} tipoSala`;
  }

  remove(id: string) {
    return `This action removes a #${id} tipoSala`;
  }
}
