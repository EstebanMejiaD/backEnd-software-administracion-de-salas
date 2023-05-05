import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTipoReservaDto } from './dto/create-tipo-reserva.dto';
import { UpdateTipoReservaDto } from './dto/update-tipo-reserva.dto';
import { TipoReserva, Usuario } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoReservaService {


  constructor(

    @InjectRepository(TipoReserva)
    private readonly tipoReservaRepository: Repository<TipoReserva>
  ) {}

  async create(createTipoReservaDto: CreateTipoReservaDto, user: Usuario) {
    try{

      const { usuario, ...resData} = createTipoReservaDto

      const nuevoTipoReserva: TipoReserva = this.tipoReservaRepository.create({
      ...resData,
      usuario: user
    })

      await this.tipoReservaRepository.save(nuevoTipoReserva)

      return {nuevoTipoReserva}

    }catch(error){

      this.handleDBErrors(error);

    }
  }

   async findOneNombre(nombre: string) {

    try{

      const tipoReserva = await this.tipoReservaRepository.findOneBy({nombre})

     

      return tipoReserva.id;

    }catch(error){

      this.handleDBErrors(error);
    
    }

  }

  findAll() {
    return `This action returns all tipoReserva`;
  }

  async findOne(id: string ) {
    try {
      
      const tipoReserva = await this.tipoReservaRepository.findOneBy({id})

      if (!tipoReserva){

        return new NotFoundException('La sala que estas buscando, no existe')

    }

      if (tipoReserva.estado === false){

      return new NotFoundException('La sala que estas buscando, no está disponible')

    }

    return tipoReserva

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  update(id: number, updateTipoReservaDto: UpdateTipoReservaDto) {
    return `This action updates a #${id} tipoReserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoReserva`;
  }


  private handleDBErrors( error: any): never {

    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    
    console.log(error);
  
    throw new InternalServerErrorException('Please check server')
  
  }
}
