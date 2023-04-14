import { BadRequestException, Injectable,  InternalServerErrorException ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTipoSalaDto } from './dto/create-tipo-sala.dto';
import { UpdateTipoSalaDto } from './dto/update-tipo-sala.dto';
import { TipoSala, Usuario } from 'src/entities';






@Injectable()
export class TipoSalasService {


  constructor(

    @InjectRepository(TipoSala)
    private readonly tipoSalaRepository: Repository<TipoSala>
  ) {}

// Está lista la creacion de  tipo de sala con usuario relaiconado
  async  create(createTipoSalaDto: CreateTipoSalaDto, user: Usuario) {

    try{

      const { usuario, ...resData} = createTipoSalaDto

      const nuevoTipoSala: TipoSala = this.tipoSalaRepository.create({
      ...resData,
      usuario: user
    })

      await this.tipoSalaRepository.save(nuevoTipoSala)

      return {nuevoTipoSala}

    }catch(error){

      this.handleDBErrors(error);

    }
    
  }

  async findAll() {
    return await this.tipoSalaRepository.find();
  }

  async findOne(id){

    try{

    const tiposala:TipoSala = await this.tipoSalaRepository.findOneBy({id})

    if (!tiposala){
    throw new NotFoundException('El tipo de sala que estas buscando, no está disponible')
    }

    if (tiposala.estado === false){
    throw new NotFoundException('El tipo de sala que estas buscando, no está disponible')
    }

    return tiposala;

    }catch(error){

      this.handleDBErrors(error);

    }
  }

  async update(id: string, updateTipoSalaDto: UpdateTipoSalaDto) {
    
    try{

      const tiposala: TipoSala = await this.tipoSalaRepository.preload({
        id, ...updateTipoSalaDto})

        if (!tiposala){
        throw new NotFoundException('El tipo de sala no existe, no se puede actualizar')
        }
    
        if (tiposala.estado === false){
        throw new NotFoundException('El tipo de sala no existe, no se puede actualizar')
        }

        await this.tipoSalaRepository.save(tiposala)
        return tiposala;

      }catch(error){

        this.handleDBErrors(error);

      }
  
    }

 // remove(id: number) {
 //   return `This action removes a #${id} tipoSala`;
 //}

 //remove se volveria una funcion

  async actualizarEstado(id: string){

    try{

    const tiposala: TipoSala = await this.tipoSalaRepository.findOneBy({id});
    
    if (!tiposala){
    throw new NotFoundException('El tipo de sala no existe');
    }
    
    if(tiposala.estado === false) {
      throw new NotFoundException('El tipo de sala no existe');
    }

    tiposala.estado = true

    await this.tipoSalaRepository.save(tiposala)

  }catch(error){

  this.handleDBErrors(error);    

  }


  }


  private handleDBErrors( error: any): never {

    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    
    console.log(error);
  
    throw new InternalServerErrorException('Please check server logs')
  
  }
  
}

