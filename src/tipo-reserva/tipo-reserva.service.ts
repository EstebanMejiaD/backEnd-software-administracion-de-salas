import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTipoReservaDto } from './dto/create-tipo-reserva.dto';
import { UpdateTipoReservaDto } from './dto/update-tipo-reserva.dto';
import { TipoReserva, Usuario } from 'src/entities';
import { PaginationTiporeservaDto } from './dto/pagination-tipo-reserva.dto';

@Injectable()
export class TipoReservaService {
  constructor(
    @InjectRepository(TipoReserva)
    private readonly tipoReservaRepository: Repository<TipoReserva>,
  ) {}

  async create(createTipoReservaDto: CreateTipoReservaDto, user: Usuario) {
    try {
      const { usuario, ...resData } = createTipoReservaDto;

      const nuevoTipoReserva: TipoReserva = this.tipoReservaRepository.create({
        ...resData,
        usuario: user,
      });

      await this.tipoReservaRepository.save(nuevoTipoReserva);

      return { 
        status: 201, 
        msg: 'Tipo de reserva creada', 
        nuevoTipoReserva 
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneNombre(nombre: string) {
    try {
      const tipoReserva = await this.tipoReservaRepository.findOneBy({
        nombre,
      });

      return tipoReserva.id;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll({limit, offset}: PaginationTiporeservaDto){

    try {

      const tipoReserva = await this.tipoReservaRepository.find({
        where:{estado: true},
        skip: offset,
        take: limit,
      })

      if(!tipoReserva){

        return new NotFoundException({
          status: 404,
          msg: 'No hay tipos de reservas creadas en estos momentos',
        });

      }

      return {
        status: 200,
        msg: 'Tipo de reservas obtenidas',
        tipoReserva,
      };
      
    } catch (error) {
      
      this.handleDBErrors(error);

    }
    
  }

  async findOne(id: string) {
    try {
      const tipoReserva = await this.tipoReservaRepository.findOneBy({ id });

      if (!tipoReserva) {
        return new NotFoundException({
          status: 404,
          msg: 'El tipo de reserva que está buscando, no existe'
        });
      }

      if (tipoReserva.estado === false) {
        return new NotFoundException({
          status: 404,
          msg: 'El tipo de reserva que está buscando, no existe'
        });
      }

      return {
        status: 200,
        msg: 'Tipo de reserva obtenida',
        tipoReserva
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async update(id: string, updateTipoReservaDto: UpdateTipoReservaDto) {
    try {

      const TipoReserva = await this.tipoReservaRepository.preload({
        id,
        ...updateTipoReservaDto
      })
      
      if(!TipoReserva){

        return new NotFoundException({
        status: 404,
        msg: 'El tipo de reserva que quieres actualizar, no existe',
        });       

      }

      if(TipoReserva.estado === false){

        return new NotFoundException({
          status: 404,
          msg: 'La sala que quieres actualizar, no existe',
        });

      }

      await this.tipoReservaRepository.save(TipoReserva)

      return {
        status: 200,
        msg: 'Tipo de reserva actualizada',
      }
      
    } catch (error) {

      this.handleDBErrors(error);
      
    }
  }

  async actualizarEstado(id: string) {
    
    try {
      const TipoReserva = await this.tipoReservaRepository.findOneBy({id})

      if(!TipoReserva){

        return new NotFoundException({
          status: 404,
          msg: 'El tipo de reserva que quieres eliminar, no existe',
        });

      }

      if(TipoReserva.estado === false){
        return new NotFoundException({
          status: 404,
          msg: 'El tipo de reserva que quieres eliminar, no existe',
        });
      }

      TipoReserva.estado = false;

      await this.tipoReservaRepository.save(TipoReserva);

      return {
        status: 200,
        msg: 'Tipo de reserva eliminada',
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException({ status: 400, error: error.detail });
    }

    if (error.code === '22P02') {
      throw new BadRequestException({ status: 400, error: 'El id del parametro no es un uuid'});
    }
    console.log(error);

    throw new InternalServerErrorException({
      status: 500,
      msg: 'Please check server logs',
    });
  }
}
